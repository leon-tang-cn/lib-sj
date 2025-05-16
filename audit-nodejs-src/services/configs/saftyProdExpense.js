// 模块配置
const saftyProdExpense = {
  // 多维度科目余额表_安全生产经费表数据保存配置
  saftyProdExpense: {
    // 数据保存的表名
    table: "多维度科目余额表_安全生产经费",
    // 从上传Excel文件读取列与数据库字段的映射配置
    insertConfig: [
      { dbField: "总账科目", excelCellName: "总账科目" },
      { dbField: "WBS元素", excelCellName: "WBS元素" },
      { dbField: "WBS元素描述", excelCellName: "WBS元素描述" },
      { dbField: "本币", excelCellName: "本币" },
      { dbField: "期初金额", excelCellName: "期初金额" },
      { dbField: "本期贷方金额", excelCellName: "本期贷方金额" }
    ]
  },
  // 管理口径建造合同_项目累计收入表数据保存配置
  pjAccuIncome: {
    // 数据保存的表名
    table: "管理口径建造合同_项目累计收入",
    // 从上传Excel文件读取列与数据库字段的映射配置
    insertConfig: [
      { dbField: "项目编码", excelCellName: "项目编码" },
      { dbField: "项目名称", excelCellName: "项目名称" },
      { dbField: "项目类别", excelCellName: "项目类别" },
      { dbField: "业务板块", excelCellName: "业务板块" },
      { dbField: "截止期末累计确认的合同收入", excelCellName: "截止期末累计确认的合同收入" }
    ]
  },
  // 模块查询配置
  queryConfig: {
    // 构造查询结果SQL语句的目标表，结合subQuery一起使用，例如：${subQuery}, select * from ${table}
    table: "TEMP3",
    // 查询条件，用于构造查询SQL语句的WHERE子句
    params: [],
    // 子查询语句，结合table配置一起使用
    subQuery: `
    WITH TEMP1 AS (
      SELECT
        TB1.WBS元素 AS 项目编号,
        TB1.WBS元素描述 AS 项目名称_核算系统,
        SUM(TB1.本期贷方金额 * TB2.汇率) AS 累计已计提金额
      FROM
        多维度科目余额表_安全生产经费 TB1
        LEFT JOIN 折算汇率 TB2 ON (
          TB1.本币 = TB2.币种
        )
      WHERE
        TB1.总账科目 = '4301010100'
      GROUP BY
        1, 2
    ),
    TEMP2 AS (
      SELECT
        TB1.项目编码 AS 项目编号,
        TB1.项目名称 AS 项目名称_建造合同,
        TB1.项目类别,
        TB1.业务板块,
        TB2.应计提比例,
        TB1.截止期末累计确认的合同收入 AS 累计确认收入,
        TB1.截止期末累计确认的合同收入 * TB2.应计提比例 AS 累计应计提金额
      FROM
        管理口径建造合同_项目累计收入 TB1
        JOIN 业务板块计提比例 TB2 ON (
          TB1.业务板块 = TB2.业务板块
        )
    ),
    TEMP3 AS (
      SELECT
        TB1.项目编号,
        TB1.项目名称_建造合同,
        TB2.项目名称_核算系统,
        TB1.项目类别,
        TB1.业务板块,
        TB1.应计提比例,
        TB1.累计确认收入,
        TB1.累计应计提金额,
        TB2.累计已计提金额,
        TB1.累计应计提金额 - COALESCE(TB2.累计已计提金额, 0) AS 累计应提未提金额,
        CASE
          WHEN TB2.累计已计提金额 IS NULL THEN '未计提安全生产经费'
          ELSE '未足额计提安全生产经费'
        END AS 校验结果
      FROM
        TEMP2 TB1
        LEFT JOIN TEMP1 TB2 ON (
          TB1.项目编号 = TB2.项目编号
        )
      WHERE
        TB1.累计应计提金额 > COALESCE(TB2.累计已计提金额, 0)
    )`,
    // 是否在查询结果中每行显示查询结果总记录行数，用于分页
    needCountInRow: true,
    // 是否分页查询，为true时将在查询语句中拼接分页SQL语句
    paging: true
  },
  // 导出Excel文件配置
  excelDownloadConfig: [
    {
      title: "项目编号",
      width: 12
    },
    {
      title: "项目名称_建造合同",
      width: 30
    },
    {
      title: "项目名称_核算系统",
      width: 30
    },
    {
      title: "项目类别",
      width: 15,
      align: "center"
    },
    {
      title: "业务板块",
      width: 20
    },
    {
      title: "应计提比例",
      width: 10,
      align: "right"
    },
    {
      title: "累计确认收入",
      width: 20,
      align: "right"
    },
    {
      title: "累计应计提金额",
      width: 20,
      align: "right"
    },
    {
      title: "累计已计提金额",
      width: 20,
      align: "right"
    },
    {
      title: "累计应提未提金额",
      width: 20,
      align: "right"
    },
    {
      title: "校验结果",
      width: 30
    }
  ],
  // 前端页面发起清空请求时，后端需要删除的数据表列表
  deleteScope: [
    "多维度科目余额表_安全生产经费",
    "管理口径建造合同_项目累计收入"
  ],
  // 前端页面发起下载导入模版请求时，需要查找本地文件的文件名
  templateFileName: "审计程序数据输入模板-安全生产经费V2.xlsx"
}

module.exports = saftyProdExpense;