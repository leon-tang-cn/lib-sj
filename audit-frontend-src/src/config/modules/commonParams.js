import { percentageFormatter } from '@/utils/utils.js';
export default {
  title: "公共参数",
  subTitles: {
    provisionRatio: "业务板块计提比例"
  },
  sheets: [
    {
      name: "业务板块计提比例",
      columns: [
        "业务板块",
        "应计提比例（参考）"
      ],
      uploadUrl: "/api/commonParams/provisionRatio/upload-data",
      ignoreDataKeyWhenEmpty: "业务板块"
    }
  ],
  showModelDesc: false,
  fetchByFunc: true,
  tabs: [
    {
      title: "业务板块计提比例",
      index: "1",
      funcName: "provisionRatio",
      resultColumnConfigs: [
        {
          title: "业务板块",
          width: 400
        },
        {
          title: "应计提比例（参考）",
          prop: "应计提比例",
          width: 200,
          align: "right",
          formatter: percentageFormatter
        }
      ]
    }
  ],
  fetchUrl: "/api/commonParams/fetchData",
  downloadUrl: "/api/commonParams/download-result",
  templateUrl: "/api/commonParams/template-download",
  templateName: "审计模型导入模板_公共参数.xlsx",
  clearDataUrl: "/api/commonParams/delete-data",
  dataCountUrl: "/api/commonParams/fetchDataCount",
  preConditions: [],
  modelDescription: ""
}