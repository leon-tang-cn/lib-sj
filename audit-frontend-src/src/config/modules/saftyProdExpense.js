import { percentageFormatter, cellFormatter } from '@/utils/utils.js';
export default {
  // 页面菜单名称
  title: "安全生产经费计提",
  // 页面中以tab页显示多个功能的数据时的配置，数据格式为{functionName: functionDesc}，例如{exchangeRate: "折算汇率"}
  subTitles: [],
  // 导入Excel文件配置
  sheets: [
    {
      // 导入文件的sheet名称
      name: "多维度科目余额表_安全生产经费",
      // 导入文件的列名配置
      columns: [
        "总账科目",
        "WBS元素",
        "WBS元素描述",
        "本币",
        "期初金额",
        "本期贷方金额"
      ],
      // 导入sheet的数据上传地址
      uploadUrl: "/api/saftyProdExpense/saftyProdExpense/upload-data",
      // 导入sheet检查需要跳过的空行的判定列名，读取数据时，对行数据中该列数据为空时将跳过
      ignoreDataKeyWhenEmpty: "总账科目"
    },
    {
      name: "管理口径建造合同_项目累计收入",
      columns: [
        "项目编码",
        "项目名称",
        "项目类别",
        "业务板块",
        "截止期末累计确认的合同收入"
      ],
      uploadUrl: "/api/saftyProdExpense/pjAccuIncome/upload-data",
      ignoreDataKeyWhenEmpty: "项目编码"
    }
  ],
  // 是否显示模型说明
  showModelDesc: true,
  // 是否按功能查询数据
  // 当fetchByFunc为true时，页面将以tab页签形式展示多个功能的数据查询、清空、下载功能，需要配置tabs项
  // 当fetchByFunc为false时，页面将不显示tab页签
  fetchByFunc: false,
  // 页面中以tab页显示多个功能的页面配置，数据格式为{title: "",index:"",funcName:"",resultColumnConfigs:""}，
  // 例如{title: "折算汇率",index:"1",funcName:"exchangeRate",resultColumnConfigs:[]}
  tabs:[],
  // 前端页面发起查询请求的请求地址
  fetchUrl: "/api/saftyProdExpense/fetchData",
  // 前端页面发起下载查询结果请求的请求地址
  downloadUrl: "/api/saftyProdExpense/download-result",
  // 前端页面发起下载模板请求的请求地址
  templateUrl: "/api/saftyProdExpense/template-download",
  // 前端页面发起下载模板请求，收到后端服务响应后，保存到本地的默认文件名
  templateName: "审计程序数据输入模板-安全生产经费.xlsx",
  // 前端页面发起清空请求的请求地址
  clearDataUrl: "/api/saftyProdExpense/delete-data",
  // 模型说明
  modelDescription: "取报表系统建造合同各项目当年营业收入数据，结合《关于进一步规范安全生产费用会计核算的通知》（中建财函字〔2022〕120号）对各业态安全生产经费的计提比例要求，计算当年应计提金额。进一步比对当年专项储备已计提金额（账面贷方累计发生额），关注未足额计提数据。",
  // 统计查询结果行数的请求地址，当后端服务的needCountInRow配置为false时必须配置，否则无需配置此项
  dataCountUrl: "",
  // 模型执行前，需要检查的参数配置
  preConditions: [
    {
      // 获取参数数据行数统计的地址
      checkUrl: "/api/pjParams/fetchDataCount?funcName=exchangeRate",
      // 校验逻辑，当返回的数据行数小于lowerLimit时，将触发校验失败
      lowerLimit: 3,
      // 校验失败时，提示的错误信息
      message: "【项目参数】配置文件中未检测到模型执行必要数据：[折算汇率]"
    },
    {
      checkUrl: "/api/commonParams/fetchDataCount?funcName=provisionRatio",
      lowerLimit: 3,
      message: "【公共参数】配置文件中未检测到模型执行必要数据：[业务板块计提比例]"
    }
  ],
  // 模型执行结果数据在页面中显示的配置，仅当fetchByFunc为false时此配置生效
  resultColumnConfigs: [
    {
      title: "项目编号",
      width: 120
    },
    {
      title: "项目名称_建造合同",
      width: 300
    },
    {
      title: "项目名称_核算系统",
      width: 300
    },
    {
      title: "项目类别",
      width: 150,
      align: "center"
    },
    {
      title: "业务板块",
      width: 200
    },
    {
      title: "应计提比例",
      width: 100,
      align: "right",
      formatter: percentageFormatter
    },
    {
      title: "累计确认收入",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "累计应计提金额",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "累计已计提金额",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "累计应提未提金额",
      width: 200,
      align: "right",
      formatter: cellFormatter
    },
    {
      title: "校验结果",
      width: 300
    }
  ]
}