const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const initialTables = async function () {
  const db = await open({
    filename: 'auditModels.db',
    driver: sqlite3.Database
  })
  console.log('Database auditModels initialized.');

  const tables = [
    {
      name: '折算汇率',
      createSql: `
            CREATE TABLE IF NOT EXISTS 折算汇率 (
              币种 TEXT,
              币种名称 TEXT,
              汇率 REAL
            )
          `
    },
    {
      name: '全量业主清单',
      createSql: `
            CREATE TABLE IF NOT EXISTS 全量业主清单 (
              业主单位名称 TEXT
            )
          `
    },
    {
      name: '全量供应商清单',
      createSql: `
            CREATE TABLE IF NOT EXISTS 全量供应商清单 (
              供应商名称 TEXT
            )
          `
    },
    {
      name: '业务板块计提比例',
      createSql: `
            CREATE TABLE IF NOT EXISTS 业务板块计提比例 (
              业务板块 TEXT,
              应计提比例 REAL
            )
          `
    },
    {
      name: '多维度科目余额表_安全生产经费',
      createSql: `
            CREATE TABLE IF NOT EXISTS 多维度科目余额表_安全生产经费 (
              总账科目 TEXT,
              WBS元素 TEXT,
              WBS元素描述 TEXT,
              本币 TEXT,
              期初金额 REAL,
              本期贷方金额 REAL
            )
          `
    },
    {
      name: '管理口径建造合同_项目累计收入',
      createSql: `
            CREATE TABLE IF NOT EXISTS 管理口径建造合同_项目累计收入 (
              项目编码 TEXT,
              项目名称 TEXT,
              项目类别 TEXT,
              业务板块 TEXT,
              截止期末累计确认的合同收入 REAL
            )
          `
    },
    {
      name: '企业破产信息查询参数表',
      createSql: `
            CREATE TABLE IF NOT EXISTS 企业破产信息查询参数表 (
              关键词字段名 TEXT
            )
          `
    },
    {
      name: '企业破产信息查询结果表',
      createSql: `
            CREATE TABLE IF NOT EXISTS 企业破产信息查询结果表 (
              keyword TEXT,
              title TEXT,
              date TEXT,
              link TEXT
            )
          `
    },
    {
      name: '合同统计查询_收入合同明细',
      createSql: `
            CREATE TABLE IF NOT EXISTS 合同统计查询_收入合同明细 (
              合同编号 TEXT,
              原合同编号 TEXT,
              收入支出 TEXT,
              合同类型 TEXT,
              合同名称 TEXT,
              计价币种 TEXT,
              合同分录编号 TEXT,
              合同分录金额 REAL,
              本位币合同金额 REAL,
              计价币种合计金额 REAL,
              合同履行地 TEXT,
              地区 TEXT,
              项目名称 TEXT,
              合同状态 TEXT,
              合同税率 TEXT,
              税率 REAL
            )
          `
    },
    {
      name: '管理口径建造合同_项目预计总收入',
      createSql: `
            CREATE TABLE IF NOT EXISTS 管理口径建造合同_项目预计总收入 (
              项目编号 TEXT,
              项目名称 TEXT,
              期末预计总收入 REAL
            )
          `
    },
    {
      name: '长账龄工程债权_核查时点',
      createSql: `
            CREATE TABLE IF NOT EXISTS 长账龄工程债权_核查时点 (
              科目类型 TEXT,
              项目 TEXT,
              项目名称 TEXT,
              客商 TEXT,
              客商名称 TEXT,
              余额减原值 REAL,
              减值金额 REAL,
              账期金额负3年以上 REAL,
              逾期金额负1至2年 REAL,
              逾期金额负2至3年 REAL,
              逾期金额负3年以上 REAL
            )
          `
    },
    {
      name: '长账龄工程债权_审截时点',
      createSql: `
            CREATE TABLE IF NOT EXISTS 长账龄工程债权_审截时点 (
              科目类型 TEXT,
              项目 TEXT,
              项目名称 TEXT,
              客商 TEXT,
              客商名称 TEXT,
              余额减原值 REAL,
              减值金额 REAL,
              账期金额负3年以上 REAL,
              逾期金额负1至2年 REAL,
              逾期金额负2至3年 REAL,
              逾期金额负3年以上 REAL
            )
          `
    },
    {
      name: '大额资金支出明细',
      createSql: `
            CREATE TABLE IF NOT EXISTS 大额资金支出明细 (
              单位编号 TEXT,
              单位名称 TEXT,
              项目编号 TEXT,
              项目名称 TEXT,
              交易日期 TEXT,
              账号 TEXT,
              户名 TEXT,
              开户机构 TEXT,
              交易方向 TEXT,
              交易币种 TEXT,
              交易金额 REAL,
              折算币种 TEXT,
              折算交易金额 REAL,
              对方账号 TEXT,
              对方户名 TEXT,
              对方开户机构 TEXT
            )
          `
    },
    {
      name: '多维度科目余额表_质保金及合同结算',
      createSql: `
            CREATE TABLE IF NOT EXISTS 多维度科目余额表_质保金及合同结算 (
              总账 TEXT,
              WBS元素 TEXT,
              WBS元素描述 TEXT,
              客户 TEXT,
              客户名称 TEXT,
              合同 TEXT,
              合同文本描述 TEXT,
              本币 TEXT,
              本期贷方金额 REAL,
              期末余额 REAL
            )
          `
    }
  ];
  for (var i = 0; i < tables.length; i++) {
    const results = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${tables[i].name}'`)
    if (results && results.name === tables[i].name) {
    } else {
      await db.run(tables[i].createSql)
      console.log(`Table ${tables[i].name} Created`)
    }
  }

  await db.run('VACUUM')
  console.log(`Database vacuumed.`)
}

module.exports = {
  initialTables: initialTables
};