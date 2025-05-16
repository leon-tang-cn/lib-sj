import { cellFormatter } from '@/utils/utils.js';
export default {
  title: "虚增项目营业收入",
  sheets: [
    {
      name: "合同统计查询-收入合同明细",
      columns: [
        "项目名称",
        "计价币种",
        "合同分录金额",
        "合同税率",
        "收入/支出",
        "合同状态"
      ],
      uploadUrl: "/api/fictitiousPjIncome/incomeContractDetail/upload-data",
      ignoreDataKeyWhenEmpty: "项目名称"
    },
    {
      name: "管理口径建造合同-项目预计总收入",
      columns: [
        "项目编号",
        "项目名称",
        "期末预计总收入"
      ],
      uploadUrl: "/api/fictitiousPjIncome/projectEstimatedTotalIncome/upload-data",
      ignoreDataKeyWhenEmpty: "项目编号"
    }
  ],
  showModelDesc: true,
  fetchByFunc: false,
  fetchUrl: "/api/fictitiousPjIncome/fetchData",
  downloadUrl: "/api/fictitiousPjIncome/download-result",
  templateUrl: "/api/fictitiousPjIncome/template-download",
  templateName: "审计程序数据输入模板-虚增项目营业收入.xlsx",
  clearDataUrl: "/api/fictitiousPjIncome/delete-data",
  modelDescription: "审计期末披露的建造合同预计总收入金额大于项目收入合同总额。",
  dataCountUrl: "",
  preConditions: [
    {
      checkUrl: "/api/pjParams/fetchDataCount?funcName=exchangeRate",
      lowerLimit: 1,
      message: "【项目参数】配置文件中未检测到模型执行必要数据：[折算汇率]"
    }
  ],
  resultColumnConfigs: [
    {
      title: "项目编号",
      width: 120
    },
    {
      title: "项目名称",
      width: 400
    },
    {
      title: "期末预计总收入",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "收入合同人民币金额（不含税）",
      width: 250,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "校验结果",
      width: 300
    }
  ]
}