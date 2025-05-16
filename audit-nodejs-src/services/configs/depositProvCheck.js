const depositProvCheck = {
  balance: {
    table: "多维度科目余额表_质保金及合同结算",
    insertConfig: [
      { dbField: "总账", excelCellName: "总账" },
      { dbField: "WBS元素", excelCellName: "WBS元素" },
      { dbField: "WBS元素描述", excelCellName: "WBS元素描述" },
      { dbField: "客户", excelCellName: "客户" },
      { dbField: "客户名称", excelCellName: "客户名称" },
      { dbField: "合同", excelCellName: "合同" },
      { dbField: "合同文本描述", excelCellName: "合同文本描述" },
      { dbField: "本币", excelCellName: "本币" },
      { dbField: "本期贷方金额", excelCellName: "本期贷方金额" },
      { dbField: "期末余额", excelCellName: "期末余额" }
    ]
  },
  queryConfig: {
    table: "TEMP2",
    params: [],
    subQuery: `
    WITH TEMP1 AS (
        SELECT
            "WBS元素" AS "项目",
            "WBS元素描述" AS "项目名称",
            "客户",
            "客户名称",
            "合同",
            "合同文本描述",
            "本币",
            SUM(CASE WHEN "总账" = '1125030000' THEN "期末余额" ELSE 0 END) AS "质保金余额",
            SUM(CASE WHEN "总账" = '1232010000' THEN "本期贷方金额" ELSE 0 END) * 1.09 AS "含税结算额"
        FROM
            "多维度科目余额表_质保金及合同结算"
        GROUP BY
            "WBS元素",
            "WBS元素描述",
            "客户",
            "客户名称",
            "合同",
            "合同文本描述",
            "本币"
    ),
    TEMP2 AS (
        SELECT
            A."项目",
            A."项目名称",
            A."客户",
            A."客户名称",
            A."合同",
            A."合同文本描述",
            A."本币",
            A."质保金余额",
            A."含税结算额",
            CASE WHEN A."质保金余额" > 0 AND A."含税结算额" > 0 THEN A."质保金余额" / A."含税结算额" ELSE NULL END AS "质保金实际计提比例",
            CASE
                WHEN A."含税结算额" < 0 OR A."质保金余额" < 0 THEN '质保金或含税结算余额方向异常'
                WHEN A."含税结算额" = 0 AND A."质保金余额" > 0 THEN '超额计提质保金(无结算额)'
                WHEN A."含税结算额" > 0 AND A."质保金余额" > 0 AND (A."质保金余额" / A."含税结算额") > 0.05 THEN '超额计提质保金(超5%)'
                ELSE ''
            END AS "校验结果"
        FROM
            TEMP1 A
    )`,
    needCountInRow: true,
    paging: true
  },
  excelDownloadConfig: [
    {
      title: "项目",
      width: 12
    },
    {
      title: "项目名称",
      width: 20
    },
    {
      title: "客户",
      width: 12
    },
    {
      title: "客户名称",
      width: 30
    },
    {
      title: "合同",
      width: 20
    },
    {
      title: "合同文本描述",
      width: 30
    },
    {
      title: "本币",
      width: 12,
      align: "center"
    },
    {
      title: "质保金余额",
      width: 20,
      align: "right"
    },
    {
      title: "含税结算额",
      width: 20,
      align: "right"
    },
    {
      title: "质保金实际计提比例",
      width: 20,
      align: "right"
    },
    {
      title: "校验结果",
      width: 20
    }
  ],
  deleteScope: [
    "多维度科目余额表_质保金及合同结算"
  ],
  templateFileName: "审计程序数据输入模板-质保金计提核查.xlsx"
}

module.exports = depositProvCheck;