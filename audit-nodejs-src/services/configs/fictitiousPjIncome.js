const fictitiousPjIncome = {
  incomeContractDetail: {
    table: "合同统计查询_收入合同明细",
    insertConfig: [
      { "dbField": "项目名称", "excelCellName": "项目名称" },
      { "dbField": "计价币种", "excelCellName": "计价币种" },
      { "dbField": "合同分录金额", "excelCellName": "合同分录金额" },
      { "dbField": "合同税率", "excelCellName": "合同税率" },
      { "dbField": "收入支出", "excelCellName": "收入/支出" },
      { "dbField": "合同状态", "excelCellName": "合同状态" },
      { "dbField": "税率", "excelCellName": "合同税率", "convertMethod": "REGEXP_EXTRACT", "reg": "([0-9]+)%", "place": 1 }
    ]
  },
  projectEstimatedTotalIncome: {
    table: "管理口径建造合同_项目预计总收入",
    insertConfig: [
      { dbField: "项目编号", excelCellName: "项目编号" },
      { dbField: "项目名称", excelCellName: "项目名称" },
      { dbField: "期末预计总收入", excelCellName: "期末预计总收入" }
    ]
  },
  queryConfig: {
    table: "TEMP3",
    params: [],
    subQuery: `
      WITH TEMP1 AS (
        SELECT
            TB1."项目名称",
            SUM(
                TB1."合同分录金额" * TB2."汇率" / COALESCE(TB1."税率" / 100 + 1, 1)
            ) AS "收入合同人民币金额（不含税）"
        FROM
            "合同统计查询_收入合同明细" TB1
            LEFT JOIN "折算汇率" TB2 ON TB1."计价币种" = TB2."币种名称"
        WHERE
            TB1."项目名称" IS NOT NULL
            AND TRIM(TB1."项目名称") != ''
        GROUP BY
            TB1."项目名称"
      ),
      TEMP3 AS (
        SELECT
            TB1."项目编号",
            TB1."项目名称",
            TB1."期末预计总收入",
            TB2."收入合同人民币金额（不含税）",
            CASE
                WHEN TB2."收入合同人民币金额（不含税）" <= 0 THEN '收入合同金额异常'
                WHEN TB2."收入合同人民币金额（不含税）" IS NULL THEN '收入合同不存在'
                ELSE '预计总收入超收入合同金额'
            END AS "校验结果"
        FROM
            "管理口径建造合同_项目预计总收入" TB1
            LEFT JOIN TEMP1 TB2 ON TB1."项目名称" = TB2."项目名称"
        WHERE
            TB1."项目名称" IS NOT NULL
            AND TRIM(TB1."项目名称") != ''
            AND TB1."期末预计总收入" > 0
            AND (
                TB2."收入合同人民币金额（不含税）" <= 0
                OR TB2."收入合同人民币金额（不含税）" IS NULL
                OR TB2."收入合同人民币金额（不含税）" < TB1."期末预计总收入"
            )
    )`,
    needCountInRow: true,
    paging: true
  },
  excelDownloadConfig: [
    {
      title: "项目编号",
      width: 12
    },
    {
      title: "项目名称",
      width: 40
    },
    {
      title: "期末预计总收入",
      width: 20,
      align: "right"
    },
    {
      title: "收入合同人民币金额（不含税）",
      width: 25,
      align: "right"
    },
    {
      title: "校验结果",
      width: 30
    }
  ],
  deleteScope: [
    "合同统计查询_收入合同明细",
    "管理口径建造合同_项目预计总收入"
  ],
  templateFileName: "审计程序数据输入模板-虚增项目营业收入.xlsx"
}

module.exports = fictitiousPjIncome;