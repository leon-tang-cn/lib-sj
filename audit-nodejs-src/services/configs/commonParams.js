const commonParams = {
  provisionRatio: {
    table: "业务板块计提比例",
    insertConfig: [
      { dbField: "业务板块", excelCellName: "业务板块" },
      { dbField: "应计提比例", excelCellName: "应计提比例（参考）" }
    ],
    queryConfig: {
      table: "业务板块计提比例",
      params: [],
      subQuery: "",
      needCountInRow: false,
      paging: true
    },
    excelDownloadConfig: [
      {
        title: "业务板块",
        width: 40
      },
      {
        title: "应计提比例（参考）",
        prop: "应计提比例",
        width: 20,
        align: "right"
      }
    ],
    deleteScope: [
      "业务板块计提比例"
    ],
    templateFileName: "审计模型导入模板_公共参数.xlsx"
  }
}

module.exports = commonParams;