const express = require('express');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const randomUseragent = require('random-useragent');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const BASE_URL = "https://pccz.court.gov.cn";
const SEARCH_URL = `${BASE_URL}/pcajxxw/searchKey/gjsslb`;
const REFERER_URL = `${BASE_URL}/pcajxxw/searchKey/qzss?ssfs=1`;

(async () => {
    async function connectDb() {
        try {
            return await open({
                filename: 'auditModels.db',
                driver: sqlite3.Database
            });
        } catch (error) {
            console.error('无法连接到数据库:', error);
            return null;
        }
    }

    const pcajxxSpyder = express.Router();

    async function limitConcurrency(promises, limit) {
        const results = [];
        const executing = [];

        for (const promise of promises) {
            const p = promise().then((result) => {
                results.push(result);
                executing.splice(executing.indexOf(p), 1);
                return result;
            });

            executing.push(p);

            if (executing.length >= limit) {
                await Promise.race(executing);
            }
        }

        return Promise.all(executing).then(() => results);
    }

    pcajxxSpyder.get('/serch-keywords', async (req, res) => {
        // 设置响应头以支持 SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        let browserPath = req.query.browserPath;
        browserPath = browserPath.replace(/\\/g, '/');
        if (!browserPath) {
            res.write(`data: ${JSON.stringify({ error: '未提供浏览器文件路径' })}\n\n`);
            res.end();
            return;
        }

        const db = await connectDb();
        if (!db) {
            res.status(500).send({ message: '无法连接到数据库' });
        }

        try {
            // 从数据库中查询企业破产信息查询参数表获取关键词
            const keywords = await db.all(`SELECT 关键词字段名 FROM 企业破产信息查询参数表`);
            const keywordList = keywords.map(item => item.关键词字段名);

            const results = [];
            if (keywordList.length === 0) {
                res.write(`data: ${JSON.stringify({ error: '上传的公司列表为空' })}\n\n`);
                res.end();
                return;
            }
            if (keywordList.length > 0) {
                await db.run(`DELETE FROM 企业破产信息查询结果表`);
            }
            // 创建一个数组来存储所有的 promise
            const promises = keywordList.map(keyword => async () => {
                const keywordResults = await processKeyword(keyword, browserPath);
                results.push(...keywordResults);

                // 将查询结果保存到企业破产信息查询结果表
                for (const [, title, date, link] of keywordResults) {
                    await db.run(
                        `INSERT INTO 企业破产信息查询结果表 (keyword, title, date, link) VALUES (?, ?, ?, ?)`,
                        [keyword, title, date, link]
                    );
                }
                // 发送当前正在处理的关键词信息给前端
                res.write(`data: ${JSON.stringify({ processingKeyword: keyword })}\n\n`);
            });

            // 使用 concurrency limiter 来限制并发数为 10
            await limitConcurrency(promises, 10);

            res.write(`data: ${JSON.stringify({ finalResult: "数据抓取成功" })}\n\n`);

            // 结束响应
            res.end();
        } catch (error) {
            console.error(error);
            // 发送错误信息给前端
            res.write(`data: ${JSON.stringify({ error: '处理请求时出错' })}\n\n`);
            res.end();
        } finally {
            await db.close();
        }
    });

    async function processKeyword(keyword, executablePath) {
        const browser = await puppeteer.launch({ executablePath, headless: true });
        const page = await browser.newPage();
        await page.setUserAgent(randomUseragent.getRandom());
        await page.goto(REFERER_URL, { waitUntil: 'networkidle2' });

        const postData = JSON.stringify({ search: keyword });
        const response = await page.evaluate(async (url, data) => {
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'text/html, */*; q=0.01',
                    'Content-Type': 'application/json',
                    'Origin': 'https://pccz.court.gov.cn',
                    'Referer': 'https://pccz.court.gov.cn/pcajxxw/index/xxwsy',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: data
            });
            return res.text();
        }, SEARCH_URL, postData);

        const $ = cheerio.load(response);
        const totalText = $('#gjsslb').text();
        const totalMatch = totalText.match(/共搜索出(\d+)条记录/);
        const totalRecords = totalMatch ? parseInt(totalMatch[1], 10) : 0;
        const items = $('#gjsslb a.fd-search-title');
        const perPage = items.length;
        const totalPages = Math.ceil(totalRecords / perPage);

        const allResults = [];
        // 处理第1页数据
        const results = resultDataConstructor(keyword, response);
        allResults.push(...results);

        // 处理第2页开始的数据
        if (totalPages > 1) {
            for (let page = 2; page <= totalPages; page++) {
                const pageData = await processPage(keyword, page, executablePath);
                allResults.push(...pageData);
            }
        }

        await browser.close();
        return allResults;
    }

    async function processPage(keyword, page, executablePath) {
        const browser = await puppeteer.launch({ executablePath, headless: true });
        const pageInstance = await browser.newPage();
        await pageInstance.setUserAgent(randomUseragent.getRandom());
        await pageInstance.goto(REFERER_URL, { waitUntil: 'networkidle2' });

        const postData = JSON.stringify({ search: keyword, pageNum: page });
        const response = await pageInstance.evaluate(async (url, data) => {
            let res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'text/html, */*; q=0.01',
                    'Content-Type': 'application/json',
                    'Origin': 'https://pccz.court.gov.cn',
                    'Referer': 'https://pccz.court.gov.cn/pcajxxw/searchKey/qzss?ssfs=1',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: data
            });
            return res.text();
        }, SEARCH_URL, postData);

        const results = resultDataConstructor(keyword, response);

        await browser.close();
        return results;
    }

    const resultDataConstructor = (keyword, response) => {
        const $ = cheerio.load(response);
        const items = $('#gjsslb a.fd-search-title');
        const results = [];

        items.each((index, element) => {
            const title = $(element).text().trim();
            const onclick = $(element).attr('onclick');
            const urlType = onclick.match(/ckxq\('([^']+)'/)[1];
            const cbh = onclick.match(/ckxq\('[^']+','([^']+)'/)[1];
            let url = "";

            if ((urlType == "案件公告" || urlType == "其他公告" || urlType == "拍卖公告"
                || urlType == "招募投资人公告" || urlType == "债权人会议公告" || urlType == "招募管理人公告" || urlType == "重整计划草案" || urlType == "wsgg")) {
                url = "/pcgg/ggxq?id=" + cbh;
            } else if (urlType == "裁判文书") {
                url = "/pcws/wsxq?id=" + cbh;
            } else if (urlType == "新闻动态") {
                url = "/pcnews/newsxq?id=" + cbh;
            } else if (urlType == "便民指南") {
                url = "/pcxwBmzn/bmznxq?cbh=" + cbh;
            } else if (urlType == "预重整公告") {
                url = "/yczgg/ggxq?yczgg=" + cbh;
            } else if (urlType == "重整典型案例") {
                url = "/pcdxal/dxalxq?id=" + cbh;
            } else if (urlType == "法律法规") {
                url = "/pcFlfg/flfgxq?id=" + cbh;
            } else if (urlType == "实务文章") {
                url = "/pcswwz/swwzxq?id=" + cbh;
            } else if (urlType == "债务人信息") {
                url = "/pczwr/zwrdh?id=" + cbh;
            } else if (urlType == "公开案件") {
                url = "/gkaj/gkajxq?id=" + cbh;
            }
            url = BASE_URL + url;
            const date = $(element).parent().parent().find('span.fd-search-date').text().replace(/\s+/g, ' ').trim();
            results.push([keyword, title, date, url]);
        });
        return results;
    };

    module.exports = pcajxxSpyder;
})();