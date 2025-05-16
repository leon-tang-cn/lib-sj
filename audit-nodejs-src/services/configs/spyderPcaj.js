const spyderPcaj = {
  queryConfig: {
    table: "企业破产信息查询结果表",
    params: [
      {
        paramName: "companyName",
        name: "keyword",
        logic: "LIKE",
      }
    ],
    subQuery: "",
    needCountInRow: false,
    orderBy: "keyword, date",
    paging: true
  },
  excelDownloadConfig: [
    {
      title: "企业名称",
      prop: "keyword",
      width: 30
    },
    {
      title: "标题",
      prop: "title",
      width: 30
    },
    {
      title: "日期",
      prop: "date",
      width: 12,
      align: "center"
    },
    {
      title: "链接",
      prop: "link",
      width: 60,
      defaultSlot: true
    }
  ],
  deleteScope: [
    "企业破产信息查询结果表"
  ],
  templateFileName: "破产信息数据抓取模板-目标单位.xlsx"
}

module.exports = spyderPcaj;