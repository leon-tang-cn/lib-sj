const illegalFundsHandling = {
  largeExpendDetail: {
    table: "大额资金支出明细",
    insertConfig: [
      { dbField: "单位编号", excelCellName: "单位编号" },
      { dbField: "单位名称", excelCellName: "单位名称" },
      { dbField: "项目编号", excelCellName: "项目编号" },
      { dbField: "项目名称", excelCellName: "项目名称" },
      { dbField: "交易日期", excelCellName: "交易日期" },
      { dbField: "账号", excelCellName: "账号" },
      { dbField: "户名", excelCellName: "户名" },
      { dbField: "开户机构", excelCellName: "开户机构" },
      { dbField: "交易方向", excelCellName: "交易方向" },
      { dbField: "交易币种", excelCellName: "交易币种" },
      { dbField: "交易金额", excelCellName: "交易金额" },
      { dbField: "折算币种", excelCellName: "折算币种" },
      { dbField: "折算交易金额", excelCellName: "折算交易金额" },
      { dbField: "对方账号", excelCellName: "对方账号" },
      { dbField: "对方户名", excelCellName: "对方户名" }
    ]
  },
  queryConfig: {
    table: "TEMP1",
    params: [],
    subQuery: `
    WITH TEMP1 AS (SELECT
        TB1.*,
        CASE WHEN
            TB3."供应商名称" IS NULL THEN '重点关注'
            ELSE '一般关注'
        END AS "校验结果"
    FROM
        "大额资金支出明细" TB1
        JOIN "全量业主清单" TB2 ON (
            TB1."对方户名" = TB2."业主单位名称"
        )
        LEFT JOIN "全量供应商清单" TB3 ON (
            TB1."对方户名" = TB3."供应商名称"
        )
    WHERE
        TB1."对方户名" IS NOT NULL
        AND TRIM(TB1."对方户名") != ''
        AND TB1."交易方向" = 'Z'
    )`,
    needCountInRow: true,
    paging: true
  },
  excelDownloadConfig: [
    {
      title: "单位编号",
      width: 16
    },
    {
      title: "单位名称",
      width: 20
    },
    {
      title: "项目编号",
      width: 12
    },
    {
      title: "项目名称",
      width: 30
    },
    {
      title: "交易日期",
      width: 12,
      align: "center"
    },
    {
      title: "账号",
      width: 20
    },
    {
      title: "户名",
      width: 20
    },
    {
      title: "开户机构",
      width: 20
    },
    {
      title: "交易方向",
      width: 12,
      align: "center"
    },
    {
      title: "交易币种",
      width: 12,
      align: "center"
    },
    {
      title: "交易金额",
      width: 16,
      align: "right"
    },
    {
      title: "折算币种",
      width: 12,
      align: "center"
    },
    {
      title: "折算交易金额",
      width: 16,
      align: "right"
    },
    {
      title: "对方账号",
      width: 20
    },
    {
      title: "对方户名",
      width: 20
    },
    {
      title: "校验结果",
      width: 30
    }
  ],
  deleteScope: [
    "大额资金支出明细",
    "全量业主清单",
    "全量供应商清单"
  ],
  templateFileName: "审计程序数据输入模板-违规资金操作（业主倒账）检索III.xlsx"
}

module.exports = illegalFundsHandling;