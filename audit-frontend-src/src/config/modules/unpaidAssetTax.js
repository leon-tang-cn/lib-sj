import { cellFormatter } from '@/utils/utils.js';
export default {
  title: "五类资产应纳未纳",
  sheets: [
    {
      name: "长账龄工程债权_核查时点",
      columns: [
        "项目",
        "项目名称",
        "客商",
        "客商名称",
        "科目类型",
        "余额-原值",
        "减值金额",
        "账期金额-3年以上",
        "逾期金额-1至2年",
        "逾期金额-2至3年",
        "逾期金额-3年以上"
      ],
      uploadUrl: "/api/unpaidAssetTax/checkPoint/upload-data",
      ignoreDataKeyWhenEmpty: "项目"
    },
    {
      name: "长账龄工程债权_审截时点",
      columns: [
        "项目",
        "项目名称",
        "客商",
        "客商名称",
        "科目类型",
        "余额-原值",
        "减值金额",
        "账期金额-3年以上",
        "逾期金额-1至2年",
        "逾期金额-2至3年",
        "逾期金额-3年以上"
      ],
      uploadUrl: "/api/unpaidAssetTax/finishPoint/upload-data",
      ignoreDataKeyWhenEmpty: "项目"
    }
  ],
  showModelDesc: true,
  fetchByFunc: false,
  fetchUrl: "/api/unpaidAssetTax/fetchData",
  downloadUrl: "/api/unpaidAssetTax/download-result",
  templateUrl: "/api/unpaidAssetTax/template-download",
  templateName: "审计程序数据输入模板-五类资产应纳未纳.xlsx",
  clearDataUrl: "/api/unpaidAssetTax/delete-data",
  modelDescription: "根据应收账款、质保金、预付账款、其他应收款的账期逾期金额，比对核查时点与审计期间截止时点余额情况，筛查应纳入“五类资产”中的长账龄工程债权明细。",
  dataCountUrl: "",
  preConditions: [],
  resultColumnConfigs: [
    {
      title: "项目",
      width: 120
    },
    {
      title: "项目名称",
      width: 300
    },
    {
      title: "客商",
      width: 150
    },
    {
      title: "客商名称",
      width: 300
    },
    {
      title: "科目类型",
      width: 100
    },
    {
      title: "余额-原值",
      prop: "余额减原值",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "减值金额",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "账期金额-3年以上",
      prop: "账期金额负3年以上",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "逾期金额-1年以上",
      prop: "逾期金额负1年以上",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "长账龄逾期债权金额(核查时点)",
      prop: "长账龄逾期债权金额_核查时点",
      width: 220,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "长账龄逾期债权金额(审截时点)",
      prop: "长账龄逾期债权金额_审截时点",
      width: 220,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "校验结果",
      width: 300
    }
  ]
}