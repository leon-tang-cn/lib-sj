import { percentageFormatter, cellFormatter } from '@/utils/utils.js';
export default {
  title: "质保金计提核查",
  sheets: [
    {
      name: "多维度科目余额表_质保金及合同结算",
      columns: [
        "总账",
        "WBS元素",
        "WBS元素描述",
        "客户",
        "客户名称",
        "合同",
        "合同文本描述",
        "本币",
        "本期贷方金额",
        "期末余额"
      ],
      uploadUrl: "/api/depositProvCheck/balance/upload-data",
      ignoreDataKeyWhenEmpty: "WBS元素"
    }
  ],
  showModelDesc: true,
  fetchByFunc: false,
  fetchUrl: "/api/depositProvCheck/fetchData",
  downloadUrl: "/api/depositProvCheck/download-result",
  templateUrl: "/api/depositProvCheck/template-download",
  templateName: "审计程序数据输入模板-质保金计提核查.xlsx",
  clearDataUrl: "/api/depositProvCheck/delete-data",
  modelDescription: "获取审计期间截止时点各项目合同结算科目累计发生额、质保金科目账面余额，计算质保金实际计提比例，大于设定阈值5%作为本模型线索。",
  dataCountUrl: "",
  preConditions: [],
  resultColumnConfigs: [
    {
      title: "项目",
      width: 120
    },
    {
      title: "项目名称",
      width: 200
    },
    {
      title: "客户",
      width: 120
    },
    {
      title: "客户名称",
      width: 300
    },
    {
      title: "合同",
      width: 200
    },
    {
      title: "合同文本描述",
      width: 300
    },
    {
      title: "本币",
      width: 120,
      align: "center"
    },
    {
      title: "质保金余额",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "含税结算额",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "质保金实际计提比例",
      width: 200,
      align: "right",
      formatter: percentageFormatter
    },
    {
      title: "校验结果",
      width: 200
    }
  ]
}