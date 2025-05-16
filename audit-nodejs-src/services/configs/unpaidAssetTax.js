const unpaidAssetTax = {
  checkPoint: {
    table: "长账龄工程债权_核查时点",
    insertConfig: [
      { dbField: "项目", excelCellName: "项目" },
      { dbField: "项目名称", excelCellName: "项目名称" },
      { dbField: "客商", excelCellName: "客商" },
      { dbField: "客商名称", excelCellName: "客商名称" },
      { dbField: "科目类型", excelCellName: "科目类型" },
      { dbField: "余额减原值", excelCellName: "余额-原值" },
      { dbField: "减值金额", excelCellName: "减值金额" },
      { dbField: "账期金额负3年以上", excelCellName: "账期金额-3年以上" },
      { dbField: "逾期金额负1至2年", excelCellName: "逾期金额-1至2年" },
      { dbField: "逾期金额负2至3年", excelCellName: "逾期金额-2至3年" },
      { dbField: "逾期金额负3年以上", excelCellName: "逾期金额-3年以上" }
    ]
  },
  finishPoint: {
    table: "长账龄工程债权_审截时点",
    insertConfig: [
      { dbField: "项目", excelCellName: "项目" },
      { dbField: "项目名称", excelCellName: "项目名称" },
      { dbField: "客商", excelCellName: "客商" },
      { dbField: "客商名称", excelCellName: "客商名称" },
      { dbField: "余额减原值", excelCellName: "余额-原值" },
      { dbField: "减值金额", excelCellName: "减值金额" },
      { dbField: "科目类型", excelCellName: "科目类型" },
      { dbField: "账期金额负3年以上", excelCellName: "账期金额-3年以上" },
      { dbField: "逾期金额负1至2年", excelCellName: "逾期金额-1至2年" },
      { dbField: "逾期金额负2至3年", excelCellName: "逾期金额-2至3年" },
      { dbField: "逾期金额负3年以上", excelCellName: "逾期金额-3年以上" }
    ]
  },
  queryConfig: {
    table: "TEMP3",
    params: [],
    subQuery: `
    WITH TEMP1 AS (
        SELECT 
            TB1."项目",
            TB1."项目名称",
            TB1."客商",
            TB1."客商名称",
            TB1."科目类型",
            TB1."余额减原值", 
            TB1."减值金额",
            TB1."账期金额负3年以上",
            TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上" AS "逾期金额负1年以上",
            CASE
                WHEN TB1."科目类型" IN ('应收账款', '质保金') AND TB1."余额减原值" <= (TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上") THEN TB1."余额减原值"
                WHEN TB1."科目类型" IN ('应收账款', '质保金') AND TB1."余额减原值" > (TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上") THEN (TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上")
                WHEN TB1."科目类型" IN ('预付账款', '其他应收款') AND TB1."余额减原值" <= TB1."账期金额负3年以上" THEN TB1."余额减原值"
                WHEN TB1."科目类型" IN ('预付账款', '其他应收款') AND TB1."余额减原值" > TB1."账期金额负3年以上" THEN TB1."账期金额负3年以上"
                ELSE 0
            END AS "长账龄逾期债权金额"
        FROM
            "长账龄工程债权_核查时点" TB1
        WHERE
            TB1."余额减原值" > 0
            AND TB1."余额减原值" > TB1."减值金额"
    ),
    TEMP2 AS (
        SELECT 
            TB1."项目",
            TB1."项目名称",
            TB1."客商",
            TB1."客商名称",
            TB1."科目类型",
            TB1."余额减原值", 
            TB1."减值金额",
            TB1."账期金额负3年以上",
            TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上" AS "逾期金额负1年以上",
            CASE
                WHEN TB1."科目类型" IN ('应收账款', '质保金') AND TB1."余额减原值" <= (TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上") THEN TB1."余额减原值"
                WHEN TB1."科目类型" IN ('应收账款', '质保金') AND TB1."余额减原值" > (TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上") THEN (TB1."逾期金额负1至2年" + TB1."逾期金额负2至3年" + TB1."逾期金额负3年以上")
                WHEN TB1."科目类型" IN ('预付账款', '其他应收款') AND TB1."余额减原值" <= TB1."账期金额负3年以上" THEN TB1."余额减原值"
                WHEN TB1."科目类型" IN ('预付账款', '其他应收款') AND TB1."余额减原值" > TB1."账期金额负3年以上" THEN TB1."账期金额负3年以上"
                ELSE 0
            END AS "长账龄逾期债权金额"
        FROM
            "长账龄工程债权_审截时点" TB1
        WHERE
            TB1."余额减原值" > 0
            AND TB1."余额减原值" > TB1."减值金额"
    ),
    TEMP3 AS (
      SELECT
          TB1."项目",
          TB1."项目名称",
          TB1."客商",
          TB1."客商名称",
          TB1."科目类型",
          TB1."余额减原值",
          TB1."减值金额",
          TB1."账期金额负3年以上",
          TB1."逾期金额负1年以上",
          TB1."长账龄逾期债权金额" AS "长账龄逾期债权金额_核查时点",
          TB2."长账龄逾期债权金额" AS "长账龄逾期债权金额_审截时点",
          '五类资产应纳未纳' AS "校验结果"
      FROM
          TEMP1 TB1
          JOIN TEMP2 TB2 ON (
              TB1."项目" = TB2."项目"
              AND TB1."客商" = TB2."客商"
              AND TB1."科目类型" = TB2."科目类型"
          )
      WHERE
          TB1."长账龄逾期债权金额" > 0
          AND TB2."长账龄逾期债权金额" > 0
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
      width: 30
    },
    {
      title: "客商",
      width: 15
    },
    {
      title: "客商名称",
      width: 30
    },
    {
      title: "科目类型",
      width: 10
    },
    {
      title: "余额-原值",
      prop: "余额减原值",
      width: 20,
      align: "right"
    },
    {
      title: "减值金额",
      width: 20,
      align: "right"
    },
    {
      title: "账期金额-3年以上",
      prop: "账期金额负3年以上",
      width: 20,
      align: "right"
    },
    {
      title: "逾期金额-1年以上",
      prop: "逾期金额负1年以上",
      width: 20,
      align: "right"
    },
    {
      title: "长账龄逾期债权金额(核查时点)",
      prop: "长账龄逾期债权金额_核查时点",
      width: 22,
      align: "right"
    },
    {
      title: "长账龄逾期债权金额(审截时点)",
      prop: "长账龄逾期债权金额_审截时点",
      width: 22,
      align: "right"
    },
    {
      title: "校验结果",
      width: 30
    }
  ],
  deleteScope: [
    "长账龄工程债权_核查时点",
    "长账龄工程债权_审截时点"
  ],
  templateFileName: "审计程序数据输入模板-五类资产应纳未纳.xlsx"
}

module.exports = unpaidAssetTax;