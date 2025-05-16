import { cellFormatter } from '@/utils/utils.js';
export default {
  title: "项目参数",
  subTitles: {
    exchangeRate: "折算汇率",
    fullOwnerList: "全量业主清单",
    fullVendorList: "全量供应商清单"
  },
  sheets: [
    {
      name: "折算汇率",
      columns: [
        "币种",
        "汇率（1外币兑换人民币）"
      ],
      uploadUrl: "/api/pjParams/exchangeRate/upload-data",
      ignoreDataKeyWhenEmpty: "币种"
    },
    {
      name: "全量业主清单",
      columns: [
        "业主单位名称"
      ],
      uploadUrl: "/api/pjParams/fullOwnerList/upload-data",
      ignoreDataKeyWhenEmpty: "业主单位名称"
    },
    {
      name: "全量供应商清单",
      columns: [
        "供应商名称"
      ],
      uploadUrl: "/api/pjParams/fullVendorList/upload-data",
      ignoreDataKeyWhenEmpty: "供应商名称"
    }
  ],
  showModelDesc: false,
  fetchByFunc: true,
  tabs: [
    {
      title: "折算汇率",
      index: "1",
      funcName: "exchangeRate",
      resultColumnConfigs: [
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
      title: "全量业主清单",
      index: "2",
      funcName: "fullOwnerList",
      resultColumnConfigs: [
        {
          title: "业主单位名称",
          width: 400
        }
      ]
    },
    {
      title: "全量供应商清单",
      index: "3",
      funcName: "fullVendorList",
      resultColumnConfigs: [
        {
          title: "供应商名称",
          width: 400
        }
      ]
    }
  ],
  fetchUrl: "/api/pjParams/fetchData",
  downloadUrl: "/api/pjParams/download-result",
  templateUrl: "/api/pjParams/template-download",
  templateName: "审计模型导入模板_项目参数.xlsx",
  clearDataUrl: "/api/pjParams/delete-data",
  dataCountUrl: "/api/pjParams/fetchDataCount",
  preConditions: [],
  modelDescription: ""
}