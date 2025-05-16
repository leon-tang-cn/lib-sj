<template>
  <div style="height: 100%; display: flex;flex-flow: column nowrap;gap: 10px;">
    <div class="upload-container">
      <div class="upload-container-row">
        <span class="label" style="font-weight: bold;">{{ props.moduleName }}</span>
        <span class="content" style="text-align: center;font-weight: bold;">{{ configs.title }}</span>
      </div>
      <div class="upload-container-row">
        <span class="label">文件导入：</span>
        <div class="content" style="display: flex;flex-flow: row nowrap;gap: 20px;">
          <el-input v-model="selectedFilePath" disabled>
            <template #append>
              <el-upload :show-file-list="false" :before-upload="beforeUpload" :on-change="handleFileChange"
                :on-error="handleUploadError">
                <el-button size="small" type="info">选择文件</el-button>
              </el-upload>
            </template>
          </el-input>
          <span style="display: flex;flex-flow: row nowrap;gap: 10px;">
            <el-button :loading="onUploadLoading" :disabled="props.executeButtonControl && !selectedFile" type="primary"
              @click="validateFile">{{ executeButtonName }}</el-button>
            <el-button type="info" :disabled="messageRecorder.length <= 0" @click="openLog">日志</el-button>
            <el-button @click="handleTemplateDownload">模板下载</el-button>
          </span>
        </div>
      </div>
      <div v-if="configs.fetchByFunc && configs.sheets.length > 1" class="upload-container-row">
        <span class="label">导入对象：</span>
        <div class="content" style="display: flex;flex-flow: row nowrap;gap: 20px;align-items: center;">
          <el-checkbox-group v-model="targetUploadSheets">
            <template v-for="sheet in configs.sheets">
              <el-checkbox :label="sheet.name" :value="sheet.name" />
            </template>
          </el-checkbox-group>
          <span style="color:var(--el-color-info);font-size: 14px;">*Excel中存在多个Sheet页时，可以选择部分导入。</span>
        </div>
      </div>
      <div class="upload-container-row" v-if="uploadProgress > 0">
        <el-progress :percentage="uploadProgress" :format="uploadStatus" style="width: 100%;" />
      </div>
    </div>
    <div class="result-body" v-loading="onFetch" style="height: 0;display: flex;flex-flow: column nowrap;">
      <el-tabs v-model="currentTab" type="border-card" @tab-click="onTabChange">
        <el-tab-pane v-for="(tab, index) in tabs" :key="tab.index" :label="tab.title" :name="tab.index"
          style="border-radius: 8px;">
          <el-table :data="queryResultsByTab[tab.index]" style="height: 100%;">
            <el-table-column type="index" width="60" align="center" label="#"></el-table-column>
            <template v-for="(column, index) in tableColumnsByTab[tab.index]" :key="index">
              <el-table-column :prop="column.prop || column.title" :label="column.title" :width="column.width"
                :align="column.align || 'left'" :formatter="column.formatter || voidFormatter"></el-table-column>
            </template>
          </el-table>
          <div class="body-toolbar">
            <div class="body-toolbar-left">
              <span v-if="queryResultsByTab[tab.index] && queryResultsByTab[tab.index].length > 0"
                style="color: var(--el-text-color-regular);font-size: 14px;font-weight: normal;cursor: pointer;"
                @click="clearData">
                <el-icon>
                  <Delete style="width: 1em; height: 1em;" />
                </el-icon>
                清空
              </span>
            </div>
            <div class="body-toolbar-right">
              <el-pagination :current-page="tabPaging[tab.index] ? tabPaging[tab.index].currentPage : 0"
                :page-size="tabPaging[tab.index] ? tabPaging[tab.index].pageSize : 20" :page-sizes="[20, 50, 100]"
                layout="total, sizes, prev, pager, next, jumper, default"
                :total="tabPaging[tab.index] ? tabPaging[tab.index].totalCount : 0" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
              <span v-if="queryResultsByTab[tab.index] && queryResultsByTab[tab.index].length > 0"
                style="color: var(--el-text-color-regular);font-size: 14px;font-weight: normal;cursor: pointer;"
                @click="downloadData">
                <el-icon>
                  <Download style="width: 1em; height: 1em;" />
                </el-icon>
                下载
              </span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="configs.showModelDesc" class="upload-footer">
      <div class="modeldesc-container-row">
        <span class="label">模型说明：</span>
        <span class="content">{{ modelDescription }}</span>
      </div>
    </div>
    <el-dialog :title="`运行日志(${messageRecorder.length})`" v-model="logVisiable" width="50%" style="height: 500px;"
      body-class="log-container">
      <template v-for="(message, index) in messageRecorder" :key="index">
        <div :class="['log-container-row', message.type]">
          <span class="log-type">{{ message.typeDesc }}</span>
          <span class="log-time">{{ message.time ? message.time.toLocaleString() : "" }}</span>
          <span class="log-content">{{ message.message }}</span>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { voidFormatter } from '@/utils/utils.js';
import auditMixin from '@/mixins/auditMixin.js';

const props = defineProps({
  pageType: {
    type: String,
    required: true
  },
  moduleName: {
    type: String,
    default: "配置中心："
  },
  executeButtonName: {
    type: String,
    default: "上传"
  },
  executeButtonControl: {
    type: Boolean,
    default: true
  }
});

const {
  selectedFile,
  onUploadLoading,
  onFetch,
  selectedFilePath,
  uploadProgress,
  modelDescription,
  configs,
  uploadStatus,
  logVisiable,
  messageRecorder,
  targetUploadSheets,
  beforeUpload,
  handleSizeChange,
  handleCurrentChange,
  handleFileChange,
  handleUploadError,
  validateFile,
  downloadData,
  clearData,
  handleTemplateDownload,
  openLog,
  onTabChange,
  tabPaging,
  tabs,
  currentTab,
  queryResultsByTab,
  tableColumnsByTab
} = auditMixin.setup(props.pageType);
</script>

<style scoped>
/* 样式 */
.el-tabs.el-tabs--top.el-tabs--border-card {
  height: calc(100% - 2px);
}

.el-tabs.el-tabs--top.el-tabs--border-card .el-tabs__content .el-tab-pane {
  height: calc(100% - 50px);
}
</style>