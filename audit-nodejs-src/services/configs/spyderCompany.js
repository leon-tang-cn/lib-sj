const spyderCompany = {
  targetCompany: {
    table: "企业破产信息查询参数表",
    insertConfig: [
      { dbField: "关键词字段名", excelCellName: "单位" }
    ]
  },
  queryConfig: {
    table: "企业破产信息查询参数表",
    params: [],
    subQuery: "",
    needCountInRow: false,
    paging: true
  },
  excelDownloadConfig: [
    {
      title: "单位",
      prop: "关键词字段名",
      width: 50
    }
  ],
  deleteScope: [
    "企业破产信息查询参数表"
  ],
  templateFileName: "破产信息数据抓取模板-目标单位.xlsx"
}

module.exports = spyderCompany;