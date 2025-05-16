<template>
  <div class="config-row">
    <div class="label">查询目标表名</div>
    <div class="content">
      <el-input v-model="newQueryConfig.table"></el-input>
    </div>
  </div>
  <div class="config-row">
    <div class="label">查询参数</div>
    <div class="content">
      <el-button @click="addQueryParam">添加参数</el-button>
    </div>
  </div>
  <div class="config-row">
    <div class="label"></div>
    <div class="content">
      <el-table :data="newQueryConfig.params" stripe>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column label="参数名称">
          <template #default="scope">
            <el-input v-model="scope.row.paramName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="匹配字段名">
          <template #default="scope">
            <el-input v-model="scope.row.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="匹配逻辑">
          <template #default="scope">
            <el-select v-model="scope.row.logic" style="width: 240px">
              <el-option v-for="item in queryLogics" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="removeQueryParam(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="config-row">
    <div class="label">查询语句</div>
    <div class="content">
      <el-input v-model="newQueryConfig.subQuery"></el-input>
    </div>
  </div>
  <div class="config-row">
    <div class="config-row-left">
      <div class="label">行内计数</div>
      <div class="content">
        <el-switch v-model="newQueryConfig.needCountInRow" active-text="启用" inactive-text="禁用" :active-value="true"
          :inactive-value="false" />
      </div>
    </div>
    <div class="config-row-right">
      <div class="label">分页</div>
      <div class="content">
        <el-switch v-model="newQueryConfig.paging" active-text="启用" inactive-text="禁用" :active-value="true"
          :inactive-value="false" />
      </div>
    </div>
  </div>
  <div class="config-row">
    <div class="label">删除操作表范围</div>
    <div class="content">
      <el-button @click="addDeleteTarget">添加删除目标</el-button>
    </div>
  </div>
  <div class="config-row">
    <div class="label"></div>
    <div class="content">
      <el-table :data="newDeleteScope" stripe>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column label="表名">
          <template #default="scope">
            <el-input v-model="scope.row.tableName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="removeDeleteTarget(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <div class="config-row">
    <div class="label">下载模板文件名称</div>
    <div class="content">
      <el-input v-model="newTemplateFileName"></el-input>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  uniqueKey: {
    type: String,
    default: ''
  },
  queryConfig: {
    type: Object,
    default: () => {
      return {};
    }
  },
  deleteScope: {
    type: Array,
    default: () => {
      return []
    }
  },
  templateFileName: {
    type: String,
    default: ''
  }
});

const newQueryConfig = ref({});
newQueryConfig.value = props.queryConfig || {};
const newDeleteScope = ref([]);
const newTemplateFileName = ref("");
newTemplateFileName.value = props.templateFileName || "";
const queryLogics = ['LIKE', 'RLIKE', 'LLIKE'];

for (var key in props.deleteScope.value) {
  newDeleteScope.value.push({
    tableName: key
  })
}

const addQueryParam = () => {
  newQueryConfig.value.params.push({
    paramName: '',
    name: '',
    logic: ''
  })
}

const removeQueryParam = (index) => {
  newQueryConfig.value.params.splice(index, 1);
}

const addDeleteTarget = () => {
  newDeleteScope.value.push({
    tableName: ''
  })
}

const removeDeleteTarget = (index) => {
  newDeleteScope.value.splice(index, 1);
}

const emits = defineEmits(['update:queryConfig', 'update:deleteScope', 'update:templateFileName']);

watch(() => newQueryConfig.value, (newVal, oldVal) => {
  emits('update:queryConfig', props.uniqueKey, newVal);
}, { deep: true })
watch(() => newDeleteScope.value, (newVal, oldVal) => {
  newVal = newVal.map(item => {
    return item.tableName;
  })
  emits('update:deleteScope', props.uniqueKey, newVal);
}, { deep: true })
watch(() => newTemplateFileName.value, (newVal, oldVal) => {
  emits('update:templateFileName', props.uniqueKey, newVal);
})

</script>

<style scoped>
</style>