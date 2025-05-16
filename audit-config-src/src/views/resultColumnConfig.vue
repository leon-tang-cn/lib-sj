<template>
  <div class="config-row">
    <div class="label">查询结果列</div>
    <div class="content">
      <el-button @click="addTableColumn">添加列</el-button>
    </div>
  </div>
  <div class="config-row">
    <div class="label"></div>
    <div class="content">
      <el-table :data="resultColumnConfigs" stripe>
        <el-table-column label="#" type="index">
        </el-table-column>
        <el-table-column label="列名">
          <template #default="scope">
            <el-input v-model="scope.row.title"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="列宽（像素）">
          <template #default="scope">
            <el-input v-model="scope.row.width"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="列宽（字符）">
          <template #default="scope">
            <el-input v-model="scope.row.wch"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="对其">
          <template #default="scope">
            <el-select v-model="scope.row.align" clearable>
              <el-option v-for="item in alignOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="格式化">
          <template #default="scope">
            <el-select v-model="scope.row.formatter" clearable>
              <el-option v-for="item in formatterOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button @click="removeTableColumn(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  configs: {
    type: Array,
    default: () => {
      return [];
    }
  }
});

const alignOptions = [
  "left",
  "center",
  "right"
]
const formatterOptions = [
  "cellFormatter",
  "percentageFormatter"
]
const resultColumnConfigs = ref([]);
resultColumnConfigs.value = props.configs;
const addTableColumn = () => {
  resultColumnConfigs.value.push({
    title: "",
    width: "",
    wch: "",
    align: "left",
    formatter: ""
  });
}

const removeTableColumn = (index) => {
  resultColumnConfigs.value.splice(index, 1);
}

const emits = defineEmits(['update:configs']);

watch(() => resultColumnConfigs.value, (newValue) => {
  emits('update:configs', newValue);
}, { deep: true })
</script>

<style scoped>
</style>