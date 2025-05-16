import { dateFormatter, cellFormatter } from '@/utils/utils.js';
export default {
  title: "违规资金操作（业主倒账）检索III",
  sheets: [
    {
      name: "大额资金支出明细",
      columns: [
        "单位编号",
        "单位名称",
        "项目编号",
        "项目名称",
        "交易日期",
        "账号",
        "户名",
        "开户机构",
        "交易方向",
        "交易币种",
        "交易金额",
        "折算币种",
        "折算交易金额",
        "对方账号",
        "对方户名"
      ],
      uploadUrl: "/api/illegalFundsHandling/largeExpendDetail/upload-data",
      ignoreDataKeyWhenEmpty: "项目编号"
    }
  ],
  showModelDesc: true,
  fetchByFunc: false,
  fetchUrl: "/api/illegalFundsHandling/fetchData",
  downloadUrl: "/api/illegalFundsHandling/download-result",
  templateUrl: "/api/illegalFundsHandling/template-download",
  templateName: "审计程序数据输入模板-违规资金操作（业主倒账）检索III.xlsx",
  clearDataUrl: "/api/illegalFundsHandling/delete-data",
  modelDescription: "获取被审计单位的银行账户交易流水，通过将收款方名称与业主单位名称相匹配，筛查其中支付给业主单位的资金交易记录。",
  dataCountUrl: "",
  preConditions: [
    {
      checkUrl: "/api/pjParams/fetchDataCount?funcName=fullOwnerList",
      lowerLimit: 1,
      message: "【项目参数】配置文件中未检测到模型执行必要数据：[全量业主清单]"
    },
    {
      checkUrl: "/api/pjParams/fetchDataCount?funcName=fullVendorList",
      lowerLimit: 1,
      message: "【项目参数】配置文件中未检测到模型执行必要数据：[全量供应商清单]"
    }
  ],
  resultColumnConfigs: [
    {
      title: "单位编号",
      width: 160
    },
    {
      title: "单位名称",
      width: 200
    },
    {
      title: "项目编号",
      width: 120
    },
    {
      title: "项目名称",
      width: 300
    },
    {
      title: "交易日期",
      width: 120,
      align: "center",
      formatter: dateFormatter
    },
    {
      title: "账号",
      width: 200
    },
    {
      title: "户名",
      width: 200
    },
    {
      title: "开户机构",
      width: 200
    },
    {
      title: "交易方向",
      width: 120,
      align: "center"
    },
    {
      title: "交易币种",
      width: 120,
      align: "center"
    },
    {
      title: "交易金额",
      width: 160,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "折算币种",
      width: 120,
      align: "center"
    },
    {
      title: "折算交易金额",
      width: 160,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "对方账号",
      width: 200
    },
    {
      title: "对方户名",
      width: 200
    },
    {
      title: "校验结果",
      width: 300
    }
  ]
}