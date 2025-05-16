<template>
  <div style="height: 100%; display: flex;flex-flow: column nowrap;gap: 10px;">
    <div class="upload-container">
      <div class="upload-container-row">
        <span class="label" style="font-weight: bold;">数据抓取：</span>
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
            <el-button :loading="onUploadLoading" type="primary" @click="startExtract">运行</el-button>
            <el-button type="info" :disabled="messageRecorder.length <= 0" @click="openLog">日志</el-button>
            <el-button @click="handleTemplateDownload">模板下载</el-button>
          </span>
        </div>
      </div>
      <div class="upload-container-row">
        <span class="label" style="width: 130px;">浏览器文件位置：</span>
        <div class="content" style="display: flex;flex-flow: row nowrap;gap: 20px;">
          <el-input v-model="browserPath" clearable
            placeholder="请填写您的浏览器安装文件地址，例如C:\Program Files\Google\Chrome\Application\chrome.exe"></el-input>
        </div>
      </div>
      <div class="upload-container-row" v-if="uploadProgress > 0">
        <el-progress :percentage="uploadProgress" :format="uploadStatus" style="width: 100%;" />
      </div>
    </div>
    <div class="result-body" v-loading="onFetch" style="height: 0;display: flex;flex-flow: column nowrap;">
      <div class="search-conditions">
        <div class="search-conditions-row">
          <span class="label">企业名称：</span>
          <el-input v-model="companyName" clearable placeholder="请输入企业名称" style="width: 200px;" @change="filterData" />
        </div>
        <div class="search-conditions-row">
          <el-button type="primary" @click="filterData">查询</el-button>
        </div>
      </div>
      <el-table :data="queryResults" style="height: 100%;">
        <el-table-column type="index" width="60" align="center" label="#"></el-table-column>
        <template v-for="(column, index) in tableColumns" :key="index">
          <el-table-column :prop="column.prop || column.title" :label="column.title" :width="column.width"
            :align="column.align || 'left'" :formatter="column.formatter || voidFormatter">
            <template v-if="column.defaultSlot" #default="scope">
              <el-link :href="scope.row[column.linkProp || column.prop]" target="_blank">{{
                scope.row[column.prop] }}</el-link>
            </template>
          </el-table-column>
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
    <div class="upload-footer">
      <div class="modeldesc-container-row">
        <span class="label" style="width: 112px;">数据抓取说明：</span>
        <span class="content-desc">{{ modelDescription }}</span>
      </div>
    </div>
    <el-dialog :title="`运行日志(${messageRecorder.length})`" v-model="logVisiable" width="75%" style="height: 600px;"
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
import { ref, nextTick } from 'vue';
import { ElMessageBox } from 'element-plus';
import { voidFormatter } from '@/utils/utils.js';
import auditMixin from '@/mixins/auditMixin.js';
import { sendRequest } from '@/utils/request.js';
const host = import.meta.env.VITE_APP_HOST;

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
  totalCount,
  searchConditions,
  customProgressMessage,
  fetchData,
  handleMessage
} = auditMixin.setup("spyderPcaj");

const companyName = ref("");
const browserPath = ref("");
browserPath.value = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const totalCompanies = ref(0);

const filterData = async () => {
  if (companyName.value) {
    searchConditions.value = [{
      name: "companyName",
      value: companyName.value
    }]
  } else {
    searchConditions.value = []
  }
  await fetchData();
}

const startExtract = async () => {
  if (!browserPath.value) {
    handleMessage('error', '请填写您的浏览器运行文件地址');
    return false;
  }
  totalCompanies.value = 0;
  if (!selectedFile.value) {
    totalCompanies.value = await validateCompanyParams();
    if (totalCompanies.value > 0) {
      ElMessageBox.confirm(
        `您未上传目标单位数据文件，将根据已上传的目标单位数据（${totalCompanies.value}家）执行抓取操作，是否继续？`,
        '确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          startExecution();
        })
        .catch(() => {
          return false;
        })
    } else {
      handleMessage('error', '请上传目标单位数据文件');
      return false;
    }
  } else {
    startExecution();
  }
}

const startExecution = async () => {
  onUploadLoading.value = true;
  await nextTick();
  if (selectedFile.value) {
    validateFile(executeLogic, 1);
  } else {
    await executeLogic();
  }
};

const executeLogic = async () => {
  uploadProgress.value = 2;
  await nextTick();
  totalCompanies.value = await validateCompanyParams();
  if (totalCompanies.value <= 0) {
    handleMessage('error', '未获取到目标单位数据');
    onUploadLoading.value = false;
    return false;
  }
  customProgressMessage.value = `开始抓取 ${totalCompanies.value} 家单位数据...`;
  const eventSource = new EventSource(`${host}${configs.dataExtractUrl}?browserPath=${browserPath.value}`);

  const step = Math.ceil((90 - uploadProgress.value) / totalCompanies.value);

  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.processingKeyword) {
      uploadProgress.value += step;
      customProgressMessage.value = `处理完成: ${data.processingKeyword}`;
    } else if (data.finalResult) {
      eventSource.close();
      await fetchData();
      uploadProgress.value = 100;
      onUploadLoading.value = false;
    } else if (data.error) {
      uploadProgress.value = 100;
      onUploadLoading.value = false;
      handleMessage('error', data.error);
      eventSource.close();
    }
  };

  eventSource.onerror = (error) => {
    uploadProgress.value = 100;
    onUploadLoading.value = false;
    handleMessage('error', error.message);
    eventSource.close();
  };
}

const validateCompanyParams = async () => {
  try {
    const resData = await sendRequest(configs.keywordCountUrl);
    if (resData) {
      return resData.count;
    } else {
      return 0;
    }
  } catch (error) {
    handleMessage('error', '获取参数数据失败');
  }
};
</script>

<style scoped>
/* 样式 */
.search-conditions {
  display: flex;
  flex-flow: row nowrap;
  margin-left: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  gap: 10px;
}

.search-condition-row {
  display: flex;
}

.column-link {
  color: var(--el-table-text-color);
  text-decoration: none;
}

.column-link:focus,
.column-link:hover {
  text-decoration: underline;
}
</style>