<template>
  <div class="config-row">
    <div class="label">保存目标表名</div>
    <div class="content">
      <el-input v-model="newTableName" @input="updateTableName"></el-input>
    </div>
  </div>
  <div class="config-row">
    <div class="label">保存目标表配置</div>
    <div class="content">
      <el-button @click="addDbField">添加字段</el-button>
    </div>
  </div>
  <div class="config-row">
    <div class="label"></div>
    <div class="content">
      <el-table :data="newInsertConfig" stripe>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column label="表字段名">
          <template #default="scope">
            <el-input v-model="scope.row.dbField"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="表字段类型">
          <template #default="scope">
            <el-select v-model="scope.row.fieldType" style="width: 240px">
              <el-option v-for="item in fieldTypes" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="Excel列名">
          <template #default="scope">
            <el-input v-model="scope.row.excelCellName"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="removeDbField(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
  tableName: {
    type: String,
    default: ''
  },
  insertConfig: {
    type: Object,
    default: {}
  }
});

const newInsertConfig = ref([]);
newInsertConfig.value = props.insertConfig || [];
const newTableName = ref();
newTableName.value = props.tableName || '';

const fieldTypes = ['TEXT', 'REAL'];
const addDbField = () => {
  newInsertConfig.value.push({
    dbField: '',
    fieldType: 'TEXT',
    excelCellName: ''
  })
  emits('update:insertConfig', props.uniqueKey, newInsertConfig.value);
}
const removeDbField = (index) => {
  newInsertConfig.value.splice(index, 1);
}
const emits = defineEmits(['update:insertConfig', 'update:tableName']);

const updateTableName = () => {
  emits('update:tableName', props.uniqueKey, newTableName.value);
}

watch(() => newInsertConfig.value, (newVal, oldVal) => {
  emits('update:insertConfig', props.uniqueKey, newVal);
}, { deep: true })

</script>

<style scoped>
</style>