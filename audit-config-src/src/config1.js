const moduleName = 'saftyProdExpense';
const functionList = ["saftyProdExpense", "pjAccuIncome"];
const pageLayout = "normal";
const uploadSaveConfig = [
  {
    moduleName: "saftyProdExpense",
    functionName: "saftyProdExpense",
    table: "多维度科目余额表_安全生产经费",
    insertConfig: [
      { dbField: "总账科目", excelCellName: "总账科目" },
      { dbField: "WBS元素", excelCellName: "WBS元素" },
      { dbField: "WBS元素描述", excelCellName: "WBS元素描述" },
      { dbField: "本币", excelCellName: "本币" },
      { dbField: "期初金额", excelCellName: "期初金额" },
      { dbField: "本期贷方金额", excelCellName: "本期贷方金额" }
    ]
  },
  {
    moduleName: "saftyProdExpense",
    functionName: "pjAccuIncome",
    table: "管理口径建造合同_项目累计收入",
    insertConfig: [
      { dbField: "项目编码", excelCellName: "项目编码" },
      { dbField: "项目名称", excelCellName: "项目名称" },
      { dbField: "项目类别", excelCellName: "项目类别" },
      { dbField: "业务板块", excelCellName: "业务板块" },
      { dbField: "截止期末累计确认的合同收入", excelCellName: "截止期末累计确认的合同收入" }
    ]
  }
];
const uploadFileImportPreChecks = [
  {
    moduleName: "saftyProdExpense",
    functionName: "",
    preChecks: [
      {
        checkUrl: "/api/pjParams/fetchDataCount?funcName=exchangeRate",
        lowerLimit: 3,
        message: "【项目参数】配置文件中未检测到模型执行必要数据：[折算汇率]"
      },
      {
        checkUrl: "/api/commonParams/fetchDataCount?funcName=provisionRatio",
        lowerLimit: 3,
        message: "【公共参数】配置文件中未检测到模型执行必要数据：[业务板块计提比例]"
      }]
  }
]
const uploadFileImportConfig = [
  {
    moduleName: "saftyProdExpense",
    functionName: "",
    sheets: [
      {
        functionName: "saftyProdExpense",
        name: "多维度科目余额表_安全生产经费",
        columns: [
          "总账科目",
          "WBS元素",
          "WBS元素描述",
          "本币",
          "期初金额",
          "本期贷方金额"
        ],
        ignoreDataKeyWhenEmpty: "总账科目"
      },
      {
        moduleName: "saftyProdExpense",
        functionName: "pjAccuIncome",
        name: "管理口径建造合同_项目累计收入",
        columns: [
          "项目编码",
          "项目名称",
          "项目类别",
          "业务板块",
          "截止期末累计确认的合同收入"
        ],
        ignoreDataKeyWhenEmpty: "项目编码"
      }
    ]
  }
]
const moduleQueryConfig = [{
  moduleName: "saftyProdExpense",
  functionName: "",
  table: "TEMP3",
  params: [
    {
      paramName: "pjCode",
      name: "项目编码",
      logic: "LIKE",
    }
  ],
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
  needCountInRow: true,
  paging: true
}]
const moduleDeleteScope = [
  {
    moduleName: "saftyProdExpense",
    functionName: "",
    deleteScope: ["多维度科目余额表_安全生产经费", "管理口径建造合同_项目累计收入"]
  }
];
const moduleTemplateFileName = "审计程序数据输入模板-安全生产经费.xlsx";
const showModelDesc = true;
const modelDescription = "取报表系统建造合同各项目当年营业收入数据，结合《关于进一步规范安全生产费用会计核算的通知》（中建财函字〔2022〕120号）对各业态安全生产经费的计提比例要求，计算当年应计提金额。进一步比对当年专项储备已计提金额（账面贷方累计发生额），关注未足额计提数据。";
const pageTitle = "安全生产经费";
const backendInterfaces = [{
  moduleName: "saftyProdExpense",
  functionName: "",
  fetchUrl: "/api/saftyProdExpense/fetchData",
  downloadUrl: "/api/saftyProdExpense/download-result",
  templateUrl: "/api/saftyProdExpense/template-download",
  clearDataUrl: "/api/saftyProdExpense/delete-data",
  dataCountUrl: ""
}]
const queryResultLayoutConfig = [
  {
    moduleName: "saftyProdExpense",
    functionName: "",
    columns: [
      {
        title: "项目编号",
        width: 120
      },
      {
        title: "项目名称_建造合同",
        width: 300
      },
      {
        title: "项目名称_核算系统",
        width: 300
      },
      {
        title: "项目类别",
        width: 150,
        align: "center"
      },
      {
        title: "业务板块",
        width: 200
      },
      {
        title: "应计提比例",
        width: 100,
        align: "right",
        formatter: percentageFormatter
      },
      {
        title: "累计确认收入",
        width: 200,
        align: "right",
        formatter: cellFormatter
      },
      {
        title: "累计应计提金额",
        width: 200,
        align: "right",
        formatter: cellFormatter
      },
      {
        title: "累计已计提金额",
        width: 200,
        align: "right",
        formatter: cellFormatter
      },
      {
        title: "累计应提未提金额",
        width: 200,
        align: "right",
        formatter: cellFormatter
      },
      {
        title: "校验结果",
        width: 300
      }
    ]
  }
];

