<template>
  <div style="display: flex;flex-flow: column nowrap;gap: 10px;">
    <div class="config-row">
      <div class="label">页面名称</div>
      <div class="content">
        <el-input v-model="pageConfigs.title"></el-input>
      </div>
    </div>
    <template v-if="needConfigFunc">
      <div class="config-row">
        <div class="label">页签配置</div>
        <div class="content">
          <el-button @click="addSubtitle">添加页签</el-button>
        </div>
      </div>
      <template v-if="subTitles.length > 0">
        <div class="config-row">
          <div class="label">
          </div>
          <div class="content">
            <el-table :data="subTitles" stripe>
              <el-table-column label="#" type="index">
              </el-table-column>
              <el-table-column label="功能定义">
                <template #default="scope">
                  <el-input v-model="scope.row.funcName"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="功能名称">
                <template #default="scope">
                  <el-input v-model="scope.row.title"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button @click="removeSubtitle(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </template>
    <div class="config-row">
      <div class="config-row-left">
        <div class="label">导入文件读取配置</div>
        <div class="content">
          <el-input v-model="newSheetName"></el-input>
        </div>
      </div>
      <div class="config-row-right">
        <el-button :disabled="!newSheetName || newSheetName === ''" @click="addSheet">添加Excel工作表</el-button>
      </div>
    </div>
    <div class="config-row" v-if="sheetConfigs.length > 0">
      <div class="label"></div>
      <div class="content">
        <el-tabs v-model="activeSheet" closable @tab-remove="removeSheet">
          <template v-for="(item, index) in sheetConfigs" :key="item.name">
            <el-tab-pane :label="item.name" :name="item.name">
              <div class="config-row">
                <div class="label">Excel读取列</div>
                <div class="content">
                  <el-button @click="addColumn">添加列</el-button>
                </div>
              </div>
              <div class="config-row">
                <div class="label"></div>
                <div class="content">
                  <el-table :data="item.columns" stripe>
                    <el-table-column label="#" type="index">
                    </el-table-column>
                    <el-table-column label="列名">
                      <template #default="scope">
                        <el-input v-model="scope.row.columnName"></el-input>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template #default="scope">
                        <el-button @click="removeColumn(scope.$index)">删除</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="config-row">
                <div class="config-row-left">
                  <div class="label">非空校验字段</div>
                  <div class="content">
                    <el-input v-model="item.ignoreDataKeyWhenEmpty"></el-input>
                  </div>
                </div>
                <div class="config-row-right">
                  <div class="label">数据上传接口</div>
                  <div class="content">
                    <el-input v-model="item.uploadUrl"></el-input>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </template>
        </el-tabs>
      </div>
    </div>
    <div class="config-row">
      <div class="label">前置检查目标</div>
      <div class="content">
        <el-button @click="addPrecondition">添加</el-button>
      </div>
    </div>
    <template v-if="preConditions.length > 0">
      <div class="config-row">
        <div class="label">
        </div>
        <div class="content">
          <el-table :data="preConditions" stripe>
            <el-table-column label="#" type="index">
            </el-table-column>
            <el-table-column label="检查目标表名">
              <template #default="scope">
                <el-input v-model="scope.row.condition"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button @click="removePrecondition(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </template>
    <template v-if="needConfigFunc">
      <div class="config-row" v-if="subTitles.length > 0" style="align-items: flex-start;">
        <div class="label">查询配置</div>
        <div class="content">
          <el-tabs v-model="activeTabName">
            <template v-for="(item, index) in subTitles" :key="item.funcName">
              <el-tab-pane :label="item.title" :name="item.funcName">
                <resultColumnConfig :configs="tabConfigs[index].resultColumnConfigs"
                  @update:configs="updateResultColumnConfigs" />
              </el-tab-pane>
            </template>
          </el-tabs>
        </div>
      </div>
    </template>
    <template v-else>
      <resultColumnConfig :configs="pageConfigs.resultColumnConfigs" @update:configs="updateResultColumnConfigs" />
    </template>
    <div class="config-row">
      <div class="label">是否显示模型描述</div>
      <div class="content">
        <el-switch v-model="pageConfigs.showModelDesc" active-text="显示" inactive-text="不显示" :active-value="true"
          :inactive-value="false" />
      </div>
    </div>
    <template v-if="pageConfigs.showModelDesc">
      <div class="config-row">
        <div class="label">模型描述</div>
        <div class="content">
          <el-input type="textarea" v-model="pageConfigs.modelDescription"></el-input>
        </div>
      </div>
    </template>
    <div class="config-row">
      <div class="label">查询数据接口</div>
      <div class="content">
        <el-input v-model="pageConfigs.fetchUrl"></el-input>
      </div>
    </div>
    <div class="config-row">
      <div class="label">下载数据接口</div>
      <div class="content">
        <el-input v-model="pageConfigs.downloadUrl"></el-input>
      </div>
    </div>
    <div class="config-row">
      <div class="label">下载导入模板接口</div>
      <div class="content">
        <el-input v-model="pageConfigs.templateUrl"></el-input>
      </div>
    </div>
    <div class="config-row">
      <div class="label">清除数据接口</div>
      <div class="content">
        <el-input v-model="pageConfigs.clearDataUrl"></el-input>
      </div>
    </div>
    <div class="config-row">
      <div class="label">查询数据行数接口</div>
      <div class="content">
        <el-input v-model="pageConfigs.dataCountUrl"></el-input>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import resultColumnConfig from '@/views/resultColumnConfig.vue';

const props = defineProps({
  moduleCode: {
    type: String,
    default: ""
  },
  needConfigFunc: {
    type: Boolean,
    required: false
  },
  configs: {
    type: Object,
    default: {}
  }
});

const pageConfigs = ref({});
pageConfigs.value = props.configs;
const subTitles = ref([]);
for (var key in pageConfigs.value.subTitles) {
  subTitles.value.push({
    funcName: key,
    title: pageConfigs.value.subTitles[key]
  })
}
if (!pageConfigs.value.fetchUrl || pageConfigs.value.fetchUrl === "") {
  pageConfigs.value.fetchUrl = `/api/${props.moduleCode}/fetchData`;
}
if (!pageConfigs.value.downloadUrl || pageConfigs.value.downloadUrl === "") {
  pageConfigs.value.downloadUrl = `/api/${props.moduleCode}/download-result`;
}
if (!pageConfigs.value.templateUrl || pageConfigs.value.templateUrl === "") {
  pageConfigs.value.templateUrl = `/api/${props.moduleCode}/template-download`;
}
if (!pageConfigs.value.clearDataUrl || pageConfigs.value.clearDataUrl === "") {
  pageConfigs.value.clearDataUrl = `/api/${props.moduleCode}/delete-data`;
}
if (!pageConfigs.value.dataCountUrl || pageConfigs.value.dataCountUrl === "") {
  pageConfigs.value.dataCountUrl = `/api/${props.moduleCode}/fetchDataCount`;
}
const newTabName = ref("");
const activeTabName = ref("");
const tabConfigs = ref([]);
if (pageConfigs.value.tabs && pageConfigs.value.tabs.length > 0) {
  tabConfigs.value = pageConfigs.value.tabs;
  activeTabName.value = pageConfigs.value.tabs[0].funcName;
}
const addSubtitle = () => {
  subTitles.value.push({
    funcName: "",
    title: ""
  })
  tabConfigs.value.push({
    title: "",
    index: tabConfigs.length + 1,
    funcName: "",
    resultColumnConfigs: []
  })
}
const removeSubtitle = (index) => {
  subTitles.value.splice(index, 1);
  if (activeTabName.value === tabConfigs.value[index].funcName) {
    if (index - 1 < 0) {
      activeTabName.value = tabConfigs.value[index + 1].funcName;
    } else {
      activeTabName.value = tabConfigs.value[index - 1].funcName;
    }
  }
  tabConfigs.value.splice(index, 1);
}

const preConditions = ref([]);
if (pageConfigs.value.preConditions) {
  for (var i = 0; i < pageConfigs.value.preConditions.length; i++) {
    preConditions.value.push({
      condition: pageConfigs.value.preConditions[i]
    })
  }
}
const addPrecondition = () => {
  preConditions.value.push({
    condition: ""
  })
}
const removePrecondition = (index) => {
  preConditions.value.splice(index, 1);
}

const activeSheet = ref("");
if (pageConfigs.value.sheets.length > 0) {
  activeSheet.value = pageConfigs.value.sheets[0].name;
}
const handleSheetChange = (tab) => {
  activeSheet.value = tab.name;
}

const sheetConfigs = ref([]);
const newSheetName = ref("");
if (pageConfigs.value.sheets.length > 0) {
  for (var i = 0; i < pageConfigs.value.sheets.length; i++) {
    const columnConfigs = ref([]);
    for (var j = 0; j < pageConfigs.value.sheets[i].columns.length; j++) {
      columnConfigs.value.push({
        columnName: pageConfigs.value.sheets[i].columns[j]
      })
    }
    sheetConfigs.value.push({
      name: pageConfigs.value.sheets[i].name,
      columns: columnConfigs,
      uploadUrl: pageConfigs.value.sheets[i].uploadUrl,
      ignoreDataKeyWhenEmpty: pageConfigs.value.sheets[i].ignoreDataKeyWhenEmpty
    })
  }
}
const addSheet = () => {
  sheetConfigs.value.push({
    name: newSheetName.value,
    columns: [],
    uploadUrl: "",
    ignoreDataKeyWhenEmpty: ""
  })
  activeSheet.value = newSheetName.value;
  newSheetName.value = ""
}
const removeSheet = (index) => {
  sheetConfigs.value.splice(index, 1);
}

const addColumn = () => {
  sheetConfigs.value.find(item => item.name === activeSheet.value).columns.push({
    columnName: ""
  });
}
const removeColumn = (index) => {
  sheetConfigs.value.find(item => item.name === activeSheet.value).columns.splice(index, 1);
}

const addTab = () => {
  tabConfigs.value.push({
    title: newTabName.value,
    index: tabConfigs.length + 1,
    funcName: "",
    resultColumnConfigs: []
  })
  activeTabName.value = newTabName.value;
  newTabName.value = "";
}
const removeTab = (index) => {
  tabConfigs.value.splice(index, 1);
}

const updateResultColumnConfigs = (newConfigs) => {
  if (props.needConfigFunc) {
    tabConfigs.value.find(item => item.title === activeTabName.value).resultColumnConfigs = newConfigs;
  } else {
    pageConfigs.value.resultColumnConfigs = newConfigs;
  }
}

const emits = defineEmits(['update:configs']);

watch(() => subTitles.value, (newValue) => {
  pageConfigs.value.subTitles = {};
  for (var i = 0; i < newValue.length; i++) {
    pageConfigs.value.subTitles[newValue[i].funcName] = newValue[i].title;
    tabConfigs.value[i].title = newValue[i].title;
    tabConfigs.value[i].funcName = newValue[i].funcName;
  }
}, { deep: true });

watch(() => tabConfigs.value, (newValue) => {
  pageConfigs.value.tabs = newValue;
}, { deep: true });

watch(() => sheetConfigs.value, (newValue) => {
  pageConfigs.value.sheets = [];
  for (var i = 0; i < newValue.length; i++) {
    pageConfigs.value.sheets.push({
      name: newValue[i].name,
      columns: newValue[i].columns.map(item => item.columnName),
      uploadUrl: newValue[i].uploadUrl,
      ignoreDataKeyWhenEmpty: newValue[i].ignoreDataKeyWhenEmpty
    })
  }
}, { deep: true });

watch(() => pageConfigs.value, (newValue) => {
  emits('update:configs', newValue);
}, {
  deep: true
});

</script>

<style scoped>
</style>