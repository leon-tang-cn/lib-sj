<template>
  <div style="height: 100%; overflow:auto;">
    <el-card header="模块配置">
      <div class="config-row">
        <div class="config-row-left">
          <div class="label">模块名称</div>
          <div class="content">
            <el-input v-model="moduleConfig.name"></el-input>
          </div>
        </div>
        <div class="config-row-right">
          <div class="label">模块路径定义</div>
          <div class="content">
            <el-input v-model="moduleConfig.value"></el-input>
          </div>
        </div>
      </div>
      <div class="config-row">
        <div class="config-row-left">
          <div class="label">功能级后端配置</div>
          <div class="content">
            <el-switch v-model="needConfigFunc" active-text="启用" inactive-text="禁用" :active-value="true"
              :inactive-value="false" />
          </div>
        </div>
      </div>
    </el-card>
    <el-card header="后端配置">
      <backendConfig :needConfigFunc="needConfigFunc" :backendConfigs="backendConfigs"
        @update:backendConfigs="updateBackendConfig" @update:addFunc="addFunc" @update:removeFunc="removeFunc"/>
    </el-card>
    <el-card header="前端配置">
      <frontendConfig :needConfigFunc="needConfigFunc" :configs="pageConfigs" @update:configs="updateFrontendConfig" />
    </el-card>
    <pre class="mt-4">{{ pageConfigs }}</pre>
    <pre class="mt-4">{{ backendConfigs }}</pre>
  </div>

</template>

<script setup>
import { ref } from 'vue';
import backendConfig from '@/views/backendConfig.vue';
import frontendConfig from '@/views/frontendConfig.vue';

const moduleConfig = ref({});
const pageConfigs = ref({});
const newFunc = ref({});
const needConfigFunc = ref(false);
const configDetailKey = ref("depositProvCheck")

let configFromDb = {
  needConfigFunc: false,
  backend: {
    balance: {
      table: "多维度科目余额表_质保金及合同结算",
      insertConfig: [
        { dbField: "总账", excelCellName: "总账" },
        { dbField: "WBS元素", excelCellName: "WBS元素" },
        { dbField: "WBS元素描述", excelCellName: "WBS元素描述" },
        { dbField: "客户", excelCellName: "客户" },
        { dbField: "客户名称", excelCellName: "客户名称" },
        { dbField: "合同", excelCellName: "合同" },
        { dbField: "合同文本描述", excelCellName: "合同文本描述" },
        { dbField: "本币", excelCellName: "本币" },
        { dbField: "本期贷方金额", excelCellName: "本期贷方金额" },
        { dbField: "期末余额", excelCellName: "期末余额" }
      ]
    },
    queryConfig: {
      table: "TEMP2",
      params: [],
      subQuery: `
    WITH TEMP1 AS (
        SELECT
            "WBS元素" AS "项目",
            "WBS元素描述" AS "项目名称",
            "客户",
            "客户名称",
            "合同",
            "合同文本描述",
            "本币",
            SUM(CASE WHEN "总账" = '1125030000' THEN "期末余额" ELSE 0 END) AS "质保金余额",
            SUM(CASE WHEN "总账" = '1232010000' THEN "本期贷方金额" ELSE 0 END) * 1.09 AS "含税结算额"
        FROM
            "多维度科目余额表_质保金及合同结算"
        GROUP BY
            "WBS元素",
            "WBS元素描述",
            "客户",
            "客户名称",
            "合同",
            "合同文本描述",
            "本币"
    ),
    TEMP2 AS (
        SELECT
            A."项目",
            A."项目名称",
            A."客户",
            A."客户名称",
            A."合同",
            A."合同文本描述",
            A."本币",
            A."质保金余额",
            A."含税结算额",
            CASE WHEN A."质保金余额" > 0 AND A."含税结算额" > 0 THEN A."质保金余额" / A."含税结算额" ELSE NULL END AS "质保金实际计提比例",
            CASE
                WHEN A."含税结算额" < 0 OR A."质保金余额" < 0 THEN '质保金或含税结算余额方向异常'
                WHEN A."含税结算额" = 0 AND A."质保金余额" > 0 THEN '超额计提质保金(无结算额)'
                WHEN A."含税结算额" > 0 AND A."质保金余额" > 0 AND (A."质保金余额" / A."含税结算额") > 0.05 THEN '超额计提质保金(超5%)'
                ELSE ''
            END AS "校验结果"
        FROM
            TEMP1 A
    )`,
      needCountInRow: true,
      paging: true
    },
    excelDownloadConfig: [
      {
        title: "项目",
        width: 12
      },
      {
        title: "项目名称",
        width: 20
      },
      {
        title: "客户",
        width: 12
      },
      {
        title: "客户名称",
        width: 30
      },
      {
        title: "合同",
        width: 20
      },
      {
        title: "合同文本描述",
        width: 30
      },
      {
        title: "本币",
        width: 12,
        align: "center"
      },
      {
        title: "质保金余额",
        width: 20,
        align: "right"
      },
      {
        title: "含税结算额",
        width: 20,
        align: "right"
      },
      {
        title: "质保金实际计提比例",
        width: 20,
        align: "right"
      },
      {
        title: "校验结果",
        width: 20
      }
    ],
    deleteScope: [
      "多维度科目余额表_质保金及合同结算"
    ],
    templateFileName: "审计程序数据输入模板-质保金计提核查.xlsx"
  },
  frontend: {
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
    clearDataUrl: "/api/depositProvCheck/delete-data",
    modelDescription: "获取审计期间截止时点各项目合同结算科目累计发生额、质保金科目账面余额，计算质保金实际计提比例，大于设定阈值5%作为本模型线索。",
    dataCountUrl: "",
    preConditions: [],
    resultColumnConfigs: [
      {
        title: "项目",
        width: 120,
        wch: 12
      },
      {
        title: "项目名称",
        width: 200,
        wch: 20
      },
      {
        title: "客户",
        width: 120,
        wch: 12
      },
      {
        title: "客户名称",
        width: 300,
        wch: 30
      },
      {
        title: "合同",
        width: 200,
        wch: 20
      },
      {
        title: "合同文本描述",
        width: 300,
        wch: 30
      },
      {
        title: "本币",
        width: 120,
        align: "center",
        wch: 12
      },
      {
        title: "质保金余额",
        width: 200,
        align: "right",
        formatter: "cellFormatter",
        wch: 20
      },
      {
        title: "含税结算额",
        width: 200,
        align: "right",
        formatter: "cellFormatter",
        wch: 20
      },
      {
        title: "质保金实际计提比例",
        width: 200,
        align: "right",
        formatter: "percentageFormatter",
        wch: 20
      },
      {
        title: "校验结果",
        width: 200,
        wch: 20
      }
    ]
  }
}

let configByFuncFromDb = {
  needConfigFunc: true,
  backend: {
    exchangeRate: {
      table: "折算汇率",
      insertConfig: [
        { dbField: "币种", excelCellName: "币种" },
        { dbField: "币种名称", excelCellName: "币种名称" },
        { dbField: "汇率", excelCellName: "汇率（1外币兑换人民币）" }
      ],
      queryConfig: {
        table: "折算汇率",
        params: [],
        subQuery: "",
        needCountInRow: false,
        paging: true
      },
      excelDownloadConfig: [
        {
          title: "币种",
          width: 5
        },
        {
          title: "币种名称",
          width: 30
        },
        {
          title: "汇率（1外币兑换人民币）",
          prop: "汇率",
          width: 15,
          align: "right"
        }
      ],
      deleteScope: [
        "折算汇率"
      ],
      templateFileName: "审计模型导入模板_项目参数.xlsx"
    },
    fullOwnerList: {
      table: "全量业主清单",
      insertConfig: [
        { dbField: "业主单位名称", excelCellName: "业主单位名称" }
      ],
      queryConfig: {
        table: "全量业主清单",
        params: [],
        subQuery: "",
        needCountInRow: false,
        paging: true
      },
      excelDownloadConfig: [
        {
          title: "业主单位名称",
          width: 40
        }
      ],
      deleteScope: [
        "全量业主清单"
      ],
      templateFileName: "审计模型导入模板_项目参数.xlsx"
    },
    fullVendorList: {
      table: "全量供应商清单",
      insertConfig: [
        { dbField: "供应商名称", excelCellName: "供应商名称" }
      ],
      queryConfig: {
        table: "全量供应商清单",
        params: [],
        subQuery: "",
        needCountInRow: false,
        paging: true
      },
      excelDownloadConfig: [
        {
          title: "供应商名称",
          width: 40
        }
      ],
      deleteScope: [
        "全量供应商清单"
      ],
      templateFileName: "审计模型导入模板_项目参数.xlsx"
    }
  },
  frontend: {
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
          "币种名称",
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
            formatter: "cellFormatter"
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
}

const backendConfigs = ref({});

// configFromDb = configByFuncFromDb;

const initialModuleConfig = () => {
  moduleConfig.value = {
    name: configFromDb.frontend.title,
    value: configDetailKey
  }
}

initialModuleConfig()

needConfigFunc.value = configFromDb.needConfigFunc;
backendConfigs.value = configFromDb.backend;
pageConfigs.value = configFromDb.frontend;

const updateBackendConfig = (value) => {
  backendConfigs.value = value;
}
const updateFrontendConfig = (value) => {
  pageConfigs.value = value;
}
const addFunc = (funcName) => {
  if (needConfigFunc.value) {
    backendConfigs.value[funcName] = {
      funcName: newFunc.value,
      table: "",
      insertConfig: [],
      queryConfig: {
        table: "",
        params: [],
        subQuery: "",
        needCountInRow: false,
        paging: true
      },
      deleteScope: [],
      templateFileName: ""
    };
  } else {
    backendConfigs.value[funcName] = {
      funcName: newFunc.value,
      table: "",
      insertConfig: []
    };
  }
}
const removeFunc = (funcName) => {
  delete backendConfigs.value[funcName];
}
</script>

<style scoped>
</style>