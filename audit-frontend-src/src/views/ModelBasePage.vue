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
              @click="validateFile">{{ props.executeButtonName }}</el-button>
            <el-button type="info" :disabled="messageRecorder.length <= 0" @click="openLog">日志</el-button>
            <el-button @click="handleTemplateDownload">模板下载</el-button>
          </span>
        </div>
      </div>
      <slot name="header" />
      <div class="upload-container-row" v-if="uploadProgress > 0">
        <el-progress :percentage="uploadProgress" :format="uploadStatus" style="width: 100%;" />
      </div>
    </div>
    <div class="result-body" v-loading="onFetch" style="height: 0;display: flex;flex-flow: column nowrap;">
      <slot name="search" />
      <el-table :data="queryResults" style="height: 100%;">
        <el-table-column type="index" width="60" align="center" label="#"></el-table-column>
        <template v-for="(column, index) in tableColumns" :key="index">
          <el-table-column :prop="column.prop || column.title" :label="column.title" :width="column.width"
            :align="column.align || 'left'"
            :formatter="column.formatter || voidFormatter"></el-table-column>
        </template>
      </el-table>
      <div class="body-toolbar">
        <div class="body-toolbar-left">
          <span v-if="queryResults && queryResults.length > 0"
            style="color: var(--el-text-color-regular);font-size: 14px;font-weight: normal;cursor: pointer;"
            @click="clearData">
            <el-icon>
              <Delete style="width: 1em; height: 1em;" />
            </el-icon>
            清空
          </span>
        </div>
        <div class="body-toolbar-right">
          <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper, default" :total="totalCount"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
          <span v-if="queryResults && queryResults.length > 0"
            style="color: var(--el-text-color-regular);font-size: 14px;font-weight: normal;cursor: pointer;"
            @click="downloadData">
            <el-icon>
              <Download style="width: 1em; height: 1em;" />
            </el-icon>
            下载
          </span>
        </div>
      </div>
    </div>
    <div v-if="configs.showModelDesc" class="upload-footer">
      <div class="modeldesc-container-row">
        <span class="label">模型说明：</span>
        <span class="content-desc">{{ modelDescription }}</span>
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
    default: "模型主题："
  },
  executeButtonName: {
    type: String,
    default: "运行"
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
  queryResults,
  tableColumns,
  currentPage,
  pageSize,
  totalCount
} = auditMixin.setup(props.pageType);
</script>

<style scoped>
/* 样式 */
</style>