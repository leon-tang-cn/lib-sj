export default {
  title: "企业破产重整案件-目标单位",
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
  showModelDesc: false,
  fetchByFunc: false,
  fetchUrl: "/api/spyderCompany/fetchData",
  downloadUrl: "/api/spyderCompany/download-result",
  templateUrl: "/api/spyderCompany/template-download",
  templateName: "破产信息数据抓取模板-目标单位.xlsx",
  clearDataUrl: "/api/spyderCompany/delete-data",
  dataCountUrl: "/api/spyderCompany/fetchDataCount",
  preConditions: [],
  modelDescription: "",
  resultColumnConfigs: [
    {
      title: "单位",
      prop: "关键词字段名",
      width: 500
    }
  ]
}