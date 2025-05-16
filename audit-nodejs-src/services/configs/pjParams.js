const pjParams = {
  exchangeRate: {
    table: "折算汇率",
    insertConfig: [
      { dbField: "币种", excelCellName: "币种" },
      { dbField: "币种名称", excelCellName: "币种名称" },
      { dbField: "汇率", excelCellName: "汇率（1外币兑换人民币）" }
    ],
    queryConfig: {
      table: "折算汇率",
      params: [],
      subQuery: "",
      needCountInRow: false,
      paging: true
    },
    excelDownloadConfig: [
      {
        title: "币种",
        width: 5
      },
      {
        title: "币种名称",
        width: 30
      },
      {
        title: "汇率（1外币兑换人民币）",
        prop: "汇率",
        width: 15,
        align: "right"
      }
    ],
    deleteScope: [
      "折算汇率"
    ],
    templateFileName: "审计模型导入模板_项目参数.xlsx"
  },
  fullOwnerList: {
    table: "全量业主清单",
    insertConfig: [
      { dbField: "业主单位名称", excelCellName: "业主单位名称" }
    ],
    queryConfig: {
      table: "全量业主清单",
      params: [],
      subQuery: "",
      needCountInRow: false,
      paging: true
    },
    excelDownloadConfig: [
      {
        title: "业主单位名称",
        width: 40
      }
    ],
    deleteScope: [
      "全量业主清单"
    ],
    templateFileName: "审计模型导入模板_项目参数.xlsx"
  },
  fullVendorList: {
    table: "全量供应商清单",
    insertConfig: [
      { dbField: "供应商名称", excelCellName: "供应商名称" }
    ],
    queryConfig: {
      table: "全量供应商清单",
      params: [],
      subQuery: "",
      needCountInRow: false,
      paging: true
    },
    excelDownloadConfig: [
      {
        title: "供应商名称",
        width: 40
      }
    ],
    deleteScope: [
      "全量供应商清单"
    ],
    templateFileName: "审计模型导入模板_项目参数.xlsx"
  }
};

module.exports = pjParams;