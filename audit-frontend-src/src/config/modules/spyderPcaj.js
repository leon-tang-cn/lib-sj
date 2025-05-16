export default {
  title: "企业破产重整信息",
  sheets: [
    {
      name: "单位",
      columns: [
        "单位"
      ],
      uploadUrl: "/api/spyderCompany/targetCompany/upload-data",
      ignoreDataKeyWhenEmpty: "单位"
    }
  ],
  showModelDesc: true,
  fetchByFunc: false,
  fetchUrl: "/api/spyderPcaj/fetchData",
  downloadUrl: "/api/spyderPcaj/download-result",
  templateUrl: "/api/spyderCompany/template-download",
  templateName: "破产信息数据抓取模板-目标单位.xlsx",
  clearDataUrl: "/api/spyderPcaj/delete-data",
  modelDescription: "取上传文件中单位为关键字，抓取【全国企业破产重整案件信息网】数据并整理出相关文书链接。",
  dataCountUrl: "/api/spyderPcaj/fetchDataCount",
  keywordCountUrl: "/api/spyderCompany/fetchDataCount",
  dataExtractUrl: "/api/spyderPcajxx/serch-keywords",
  preConditions: [],
  resultColumnConfigs: [
    {
      title: "企业名称",
      prop: "keyword",
      width: 300
    },
    {
      title: "标题",
      prop: "title",
      width: 500,
      defaultSlot: true,
      linkProp: "link"
    },
    {
      title: "日期",
      prop: "date",
      width: 120,
      align: "center"
    }
  ]
}