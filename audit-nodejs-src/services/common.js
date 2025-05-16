const express = require('express');
const XLSX = require('xlsx');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const configs = require('./config.js');
const { dataOperators, createWhereClause, formatExcel } = require('./utils.js');

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

  const commonRouter = express.Router();

  // 插入数据接口
  commonRouter.post('/:moduleName/:funcName/upload-data', async (req, res) => {
    const moduleName = req.params.moduleName;
    const isFirst = req.query.isFirst;
    var moduleConfig = configs[moduleName];
    if (!moduleConfig) {
      res.status(500).send(`模块${moduleName}未配置`);
      return;
    }
    const funcName = req.params.funcName;
    var funcConfig = moduleConfig[funcName];
    if (!funcConfig) {
      res.status(500).send(`功能${funcName}未配置`);
      return;
    }

    const tableName = funcConfig.table;
    const db = await connectDb();
    if (!db) {
      res.status(500).send({ message: '无法连接到数据库' });
    }
    try {
      const { jsonData } = req.body;
      await db.run(`BEGIN`);

      if (isFirst) {
        // 删除表数据
        await db.run(`DELETE FROM ${tableName}`);
      }

      const columns = funcConfig.insertConfig
      const columnNames = funcConfig.insertConfig.map(col => col.dbField).join(',')
      const valueRep = funcConfig.insertConfig.map(col => "?").join(',')

      // 插入表数据
      const insertQuery = `
        INSERT INTO ${tableName} (
          ${columnNames}
        ) VALUES (${valueRep})
      `;
      const stmt = await db.prepare(insertQuery);
      for (var i = 0; i < jsonData.length; i++) {
        let row = jsonData[i];
        const params = columns.map(column => {
          if (dataOperators[column.convertMethod]) {
            return dataOperators[column.convertMethod](row[column.excelCellName], column.reg, column.place);
          }
          return row[column.excelCellName];
        });
        await stmt.run(...params);
      }
      await stmt.finalize();
      await db.run(`COMMIT`);
      await db.close()
      res.json({ message: `${tableName}数据保存成功` });
    } catch (error) {
      console.error(error);
      await db.run(`ROLLBACK`);
      await db.close()
      res.status(500).send({ message: `保存${tableName}数据时报错: ${error.message}` });
    }
  })

  // 查询数据库表数据分页接口
  commonRouter.get('/:moduleName/fetchData', async (req, res) => {
    // res.status(500).send({ message: `功能未配置` });
    // return;
    const { pageSize, currentPage, funcName } = req.query
    const moduleName = req.params.moduleName;
    var moduleConfig = configs[moduleName];
    if (!moduleConfig) {
      res.status(500).send({ message: `模块${moduleName}未配置` });
      return;
    }
    let queryConfig = moduleConfig.queryConfig;
    if (funcName) {
      const funcConfig = moduleConfig[funcName];
      if (!funcConfig) {
        res.status(500).send({ message: `功能${funcName}未配置` });
        return;
      }
      queryConfig = funcConfig.queryConfig;
    }
    const tableName = queryConfig.table;
    try {
      let query = "";
      let whereClauses = createWhereClause(queryConfig, req.query);
      if (whereClauses) {
        whereClauses = `WHERE ${whereClauses}`
      }
      if (queryConfig.needCountInRow) {
        if (queryConfig.subQuery) {
          query = `${queryConfig.subQuery}, `;
        } else {
          query = `WITH `
        }
        query += ` TEMP_ROW_COUNT AS (
          SELECT COUNT(*) AS row_count
          FROM ${tableName} ${whereClauses}
        )`;
        query += ` SELECT *,(SELECT row_count FROM TEMP_ROW_COUNT) as totalCount FROM ${tableName} ${whereClauses}`
      } else {
        if (queryConfig.subQuery) {
          query = `${queryConfig.subQuery} `;
        }
        query += ` SELECT * FROM ${tableName} ${whereClauses}`;
      }
      if (queryConfig.orderBy) {
        query += ` ORDER BY ${queryConfig.orderBy}`; 
      }
      if (queryConfig.paging) {
        query += ` limit ${pageSize} offset ${(currentPage - 1) * pageSize} `;
      }
      const db = await connectDb();
      const results = await db.all(query);
      await db.close()
      res.json(results);
    } catch (error) {
      console.error(`查询数据时出错: ${error}`);
      res.status(500).send({ message: `查询数据时出错: ${error.message}` });
    }
  })

  // 查询数据库表总行数接口
  commonRouter.get('/:moduleName/fetchDataCount', async (req, res) => {
    const { funcName } = req.query
    const moduleName = req.params.moduleName;
    var moduleConfig = configs[moduleName];
    if (!moduleConfig) {
      res.status(500).send({ message: `模块${moduleName}未配置` });
      return;
    }
    let queryConfig = moduleConfig.queryConfig;
    if (funcName) {
      const funcConfig = moduleConfig[funcName];
      if (!funcConfig) {
        res.status(500).send({ message: `功能${funcName}未配置` });
        return;
      }
      queryConfig = funcConfig.queryConfig;
    }
    const tableName = queryConfig.table;
    try {
      let whereClauses = createWhereClause(queryConfig, req.query);
      if (whereClauses) {
        whereClauses = `WHERE ${whereClauses}`
      }
      const db = await connectDb();
      const result = await db.get(`SELECT COUNT(*) as count FROM ${tableName} ${whereClauses}`);
      await db.close()
      res.json({ count: result.count });
    } catch (error) {
      console.error(`查询数据行数时出错: ${error.message}`);
      res.status(500).send({ message: `查询数据行数时出错: ${error.message}` });
    }
  });

  // 定义下载查询结果的接口
  commonRouter.get('/:moduleName/download-result', async (req, res) => {
    const { funcName } = req.query
    const moduleName = req.params.moduleName;
    var moduleConfig = configs[moduleName];
    if (!moduleConfig) {
      res.status(500).send({ message: `模块${moduleName}未配置` });
      return;
    }
    let queryConfig = moduleConfig.queryConfig;
    let excelDownloadConfig = moduleConfig.excelDownloadConfig;
    if (funcName) {
      const funcConfig = moduleConfig[funcName];
      if (!funcConfig) {
        res.status(500).send({ message: `功能${funcName}未配置` });
        return;
      }
      queryConfig = funcConfig.queryConfig;
      excelDownloadConfig = funcConfig.excelDownloadConfig;
    }
    const tableName = queryConfig.table;
    try {
      let query = "";
      let whereClauses = createWhereClause(queryConfig, req.query);
      if (whereClauses) {
        whereClauses = `WHERE ${whereClauses}`
      }
      if (queryConfig.subQuery) {
        query = `${queryConfig.subQuery} `;
      }
      let selectColumns = [];
      if (!excelDownloadConfig || excelDownloadConfig.length === 0) {
        selectColumns.push("*");
      } else {
        for (var i=0;i<excelDownloadConfig.length;i++) {
          if (excelDownloadConfig[i].prop) {
            selectColumns.push(`${excelDownloadConfig[i].prop} AS '${excelDownloadConfig[i].title}'`);
          } else {
            selectColumns.push(`${excelDownloadConfig[i].title} AS '${excelDownloadConfig[i].title}'`);
          }
        }
      }
      query += `SELECT ${selectColumns.join(",")} FROM ${tableName} ${whereClauses}`;
      if (queryConfig.orderBy) {
        query += ` ORDER BY ${queryConfig.orderBy}`; 
      }
      const db = await connectDb();
      const results = await db.all(query);

      // 使用 XLSX 库将结果转换为 XLSX 文件
      let ws = XLSX.utils.json_to_sheet(results);
      ws = formatExcel(ws, excelDownloadConfig);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '查询结果');

      // 以流的方式返回 XLSX 文件
      res.setHeader('Content-Disposition', 'attachment; filename=%E5%AE%89%E5%85%A8%E7%94%9F%E4%BA%A7%E7%BB%8F%E8%B4%B9%E8%AE%A1%E6%8F%90%E5%AE%A1%E8%AE%A1%E7%BB%93%E6%9E%9C.xlsx');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      res.send(buffer);
    } catch (error) {
      console.error(`导出查询数据时出错: ${error}`);
      res.status(500).send({ message: `导出查询数据时出错: ${error.message}` });
    }
  });

  // 定义删除数据的接口
  commonRouter.get('/:moduleName/delete-data', async (req, res) => {
    const { funcName } = req.query
    const moduleName = req.params.moduleName;
    var moduleConfig = configs[moduleName];
    if (!moduleConfig) {
      res.status(500).send({ message: `模块${moduleName}未配置` });
      return;
    }
    let tableNames = moduleConfig.deleteScope;
    if (funcName) {
      const funcConfig = moduleConfig[funcName];
      if (!funcConfig) {
        res.status(500).send({ message: `功能${funcName}未配置` });
        return;
      }
      tableNames = funcConfig.deleteScope;
    }
    try {
      const db = await connectDb();
      for (var i = 0; i < tableNames.length; i++) {
        await db.run(`DELETE FROM ${tableNames[i]}`);
      }
      await db.close()
      res.status(200).json({ message: `表数据已成功删除` });
    } catch (error) {
      console.error(`删除${tableName}表数据时出错: ${error.message}`);
      res.status(500).send({ message: `删除${tableName}表数据时出错: ${error.message}` });
    }
  });

  // 定义模板文件下载接口
  commonRouter.get('/:moduleName/template-download', (req, res) => {
    const { funcName } = req.query
    const moduleName = req.params.moduleName;
    var moduleConfig = configs[moduleName];
    if (!moduleConfig) {
      res.status(500).send({ message: `模块${moduleName}未配置` });
      return;
    }
    let templateFileName = moduleConfig.templateFileName;
    if (funcName) {
      const funcConfig = moduleConfig[funcName];
      if (!funcConfig) {
        res.status(500).send({ message: `功能${funcName}未配置` });
        return;
      }
      templateFileName = funcConfig.templateFileName;
    }
    const filePath = path.join(__dirname, "/templates/", templateFileName);
    res.download(filePath, templateFileName, (err) => {
      if (err) {
        console.error(`模板文件下载出错: ${err.message}`);
        res.status(500).send({ message: `模板文件下载出错: ${err.message}` });
      }
    });
  });

  module.exports = commonRouter;
})();