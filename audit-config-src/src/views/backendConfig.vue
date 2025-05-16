<template>
  <div style="display: flex;flex-flow: column nowrap;gap: 10px;">
    <div class="config-row">
      <div class="config-row-left">
        <div class="label">功能路径定义</div>
        <div class="content">
          <el-input v-model="newFunc"></el-input>
        </div>
      </div>
      <div class="config-row-right">
        <el-button :disabled="!newFunc || newFunc === ''" @click="addFunc">{{ funcList.length <= 0 ? '开始配置' : '添加功能'
            }}</el-button>
      </div>
    </div>
    <template v-if="funcList.length > 0">
      <div class="config-row">
        <div class="label"></div>
        <div class="content">
          <el-tabs v-model="activeFuncConfig" closable @tab-remove="removeFunc">
            <template v-for="(item, index) in funcList" :key="item.value">
              <el-tab-pane :label="item.funcName" :name="item.funcName">
                <insertConfig :uniqueKey="item.funcName" :tableName="item.table" :insertConfig="item.insertConfig"
                  @update:insertConfig="updateInsertConfig" @update:tableName="updateTableName" />
                <template v-if="props.needConfigFunc">
                  <otherBackendConfig :uniqueKey="item.funcName" :queryConfig="item.queryConfig"
                    :deleteScope="item.deleteScope" :templateFileName="item.templateFileName"
                    @update:queryConfig="updateQueryConfig" @update:deleteScope="updateDeleteScope"
                    @update:templateFileName="updateTemplateFileName" />
                </template>
              </el-tab-pane>
            </template>
          </el-tabs>
        </div>
      </div>
    </template>
    <template v-if="!props.needConfigFunc">
          <otherBackendConfig uniqueKey="moduleConfig" :queryConfig="moduleQueryConfig" :deleteScope="moduleDeleteScope"
            :templateFileName="moduleTemplateFileName" @update:queryConfig="updateQueryConfig"
            @update:deleteScope="updateDeleteScope" @update:templateFileName="updateTemplateFileName" />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import insertConfig from '@/views/insertConfig.vue';
import otherBackendConfig from '@/views/otherBackendConfig.vue';

const props = defineProps({
  needConfigFunc: {
    type: Boolean,
    required: false
  },
  backendConfigs: {
    type: Object,
    default: () => {
      return {};
    }
  }
});

const configs = ref({});
configs.value = props.backendConfigs;

const activeFuncConfig = ref('');
const funcList = ref([]);
const newFunc = ref("");
const insertConfigExcludeKeys = ['queryConfig', 'excelDownloadConfig', 'deleteScope',
  'templateFileName'
]

const moduleQueryConfig = ref({});
const moduleDeleteScope = ref([]);
const moduleTemplateFileName = ref("");

if (props.needConfigFunc) {
  const funcKeys = Object.keys(configs.value);
  for (var key of funcKeys) {
    funcList.value.push({
      funcName: key,
      table: configs.value[key].table,
      insertConfig: configs.value[key].insertConfig,
      queryConfig: configs.value[key].queryConfig,
      deleteScope: configs.value[key].deleteScope,
      templateFileName: configs.value[key].templateFileName
    })
  }
} else {
  const configKeys = Object.keys(configs.value);
  for (var key of configKeys) {
    if (insertConfigExcludeKeys.includes(key)) {
      continue;
    }
    funcList.value.push({
      funcName: key,
      table: configs.value[key].table,
      insertConfig: configs.value[key].insertConfig
    })
  }
  moduleQueryConfig.value = configs.value.queryConfig || {};
  moduleDeleteScope.value = configs.value.deleteScope || [];
  moduleTemplateFileName.value = configs.value.templateFileName || '';
}

if (funcList.value.length > 0) {
  activeFuncConfig.value = funcList.value[0].funcName;
}

const emits = defineEmits(['update:backendConfigs', 'update:addFunc', 'update:removeFunc']);
const addFunc = () => {
  if (newFunc.value === "") {
    return;
  }
  const existIndex = funcList.value.findIndex(item => item.funcName === newFunc.value);
  if (existIndex > -1) {
    return;
  }
  if (props.needConfigFunc) {
    funcList.value.push({
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
    });
  } else {
    funcList.value.push({
      funcName: newFunc.value,
      table: "",
      insertConfig: []
    });
  }
  emits('update:addFunc', newFunc.value);
  activeFuncConfig.value = newFunc.value;
  newFunc.value = "";
}

const removeFunc = (tab) => {
  emits('update:removeFunc', tab);
  const index = funcList.value.findIndex(item => item.funcName === tab);
  funcList.value.splice(index, 1);
  if (activeFuncConfig.value === tab) {
    activeFuncConfig.value = funcList.value.length > 0 ? funcList.value[0].funcName : '';
  }
}

const updateTableName = (uniqueKey, newName) => {
  const index = funcList.value.findIndex(item => item.funcName === uniqueKey);
  funcList.value[index].table = newName;
  configs.value[uniqueKey].table = newName;
  emitAllConfigs();
}

const updateInsertConfig = (uniqueKey, newConfig) => {
  const index = funcList.value.findIndex(item => item.funcName === uniqueKey);
  funcList.value[index].insertConfig = newConfig;
  configs.value[uniqueKey].insertConfig = newConfig;
  emitAllConfigs();
}
const updateQueryConfig = (uniqueKey, newConfig) => {
  if (props.needConfigFunc) {
    const index = funcList.value.findIndex(item => item.funcName === uniqueKey);
    funcList.value[index].queryConfig = newConfig;
    configs.value[uniqueKey].queryConfig = newConfig;
  } else {
    moduleQueryConfig.value = newConfig;
    configs.value.queryConfig = newConfig;
  }
  emitAllConfigs();
}

const updateDeleteScope = (uniqueKey, newConfig) => {
  if (props.needConfigFunc) {
    const index = funcList.value.findIndex(item => item.funcName === uniqueKey);
    funcList.value[index].deleteScope = newConfig;
    configs.value[uniqueKey].deleteScope = newConfig;
  } else {
    moduleDeleteScope.value = newConfig;
    configs.value.deleteScope = newConfig;
  }
  emitAllConfigs();
}

const updateTemplateFileName = (uniqueKey, newConfig) => {
  if (props.needConfigFunc) {
    const index = funcList.value.findIndex(item => item.funcName === uniqueKey);
    funcList.value[index].templateFileName = newConfig;
    configs.value[uniqueKey].templateFileName = newConfig;
  } else {
    moduleTemplateFileName.value = newConfig;
    configs.value.templateFileName = newConfig;
  }
  emitAllConfigs();
}

const emitAllConfigs = () => {
  emits('update:backendConfigs', configs);
}
</script>

<style scoped></style>