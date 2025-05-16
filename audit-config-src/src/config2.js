const moduleName = 'pjParams';
const functionList = ["exchangeRate", "fullOwnerList", "fullVendorList"];
const pageLayout = "tab";
const uploadSaveConfig = [
  {
    moduleName: "pjParams",
    functionName: "exchangeRate",
    table: "折算汇率",
    insertConfig: [
      { dbField: "币种", excelCellName: "币种" },
      { dbField: "币种名称", excelCellName: "币种名称" },
      { dbField: "汇率", excelCellName: "汇率（1外币兑换人民币）" }
    ]
  },
  {
    moduleName: "pjParams",
    functionName: "fullOwnerList",
    table: "全量业主清单",
    insertConfig: [
      { dbField: "业主单位名称", excelCellName: "业主单位名称" }
    ]
  },
  {
    moduleName: "pjParams",
    functionName: "fullVendorList",
    table: "全量供应商清单",
    insertConfig: [
      { dbField: "供应商名称", excelCellName: "供应商名称" }
    ]
  }
];
const uploadFileImportPreChecks = [
  {
    moduleName: "pjParams",
    functionName: "",
    preChecks: []
  }
];
const uploadFileImportConfig = [
  {
    moduleName: "pjParams",
    functionName: "",
    sheets: [
      {
        functionName: "exchangeRate",
        name: "折算汇率",
        columns: [
          "币种",
          "币种名称",
          "汇率（1外币兑换人民币）"
        ],
        uploadUrl: "/api/pjParams/exchangeRate/upload-data",
        ignoreDataKeyWhenEmpty: "币种"
      },
      {
        functionName: "fullOwnerList",
        name: "全量业主清单",
        columns: [
          "业主单位名称"
        ],
        uploadUrl: "/api/pjParams/fullOwnerList/upload-data",
        ignoreDataKeyWhenEmpty: "业主单位名称"
      },
      {
        functionName: "fullVendorList",
        name: "全量供应商清单",
        columns: [
          "供应商名称"
        ],
        uploadUrl: "/api/pjParams/fullVendorList/upload-data",
        ignoreDataKeyWhenEmpty: "供应商名称"
      }
    ]
  }
];
const moduleQueryConfig = [
  {
    moduleName: "pjParams",
    functionName: "exchangeRate",
    table: "折算汇率",
    params: [],
    subQuery: "",
    needCountInRow: false,
    paging: true
  },
  {
    moduleName: "pjParams",
    functionName: "fullOwnerList",
    table: "全量业主清单",
    params: [],
    subQuery: "",
    needCountInRow: false,
    paging: true
  },
  {
    moduleName: "pjParams",
    functionName: "fullVendorList",
    table: "全量供应商清单",
    params: [],
    subQuery: "",
    needCountInRow: false,
    paging: true
  }
];
const moduleDeleteScope = [
  {
    moduleName: "pjParams",
    functionName: "exchangeRate",
    deleteScope: ["折算汇率"]
  },
  {
    moduleName: "pjParams",
    functionName: "fullOwnerList",
    deleteScope: ["全量业主清单"]
  },
  {
    moduleName: "pjParams",
    functionName: "fullVendorList",
    deleteScope: ["全量供应商清单"]
  }
];
const moduleTemplateFileName = "审计模型导入模板_项目参数.xlsx";
const showModelDesc = false;
const modelDescription = "";
const pageTitle = "项目参数";
const backendInterfaces = [{
  moduleName: "pjParams",
  functionName: "",
  fetchUrl: "/api/pjParams/fetchData",
  downloadUrl: "/api/pjParams/download-result",
  templateUrl: "/api/pjParams/template-download",
  clearDataUrl: "/api/pjParams/delete-data",
  dataCountUrl: "/api/pjParams/fetchDataCount"
}];
const queryResultLayoutConfig = [
  {
    moduleName: "pjParams",
    functionName: "exchangeRate",
    columns: [
      {
        title: "币种",
        width: 120
      },
      {
        title: "币种名称",
        width: 400
      },
      {
        title: "汇率（1外币兑换人民币）",
        prop: "汇率",
        width: 200,
        align: "right",
        formatter: cellFormatter
      }
    ]
  },
  {
    moduleName: "pjParams",
    functionName: "fullOwnerList",
    columns: [
      {
        title: "业主单位名称",
        width: 400
      }
    ]
  },
  {
    moduleName: "pjParams",
    functionName: "fullVendorList",
    columns: [
      {
        title: "供应商名称",
        width: 400
      }
    ]
  }
];

