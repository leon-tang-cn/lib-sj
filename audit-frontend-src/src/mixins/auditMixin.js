// src/mixins/auditMixin.js
import { ref, onMounted, nextTick } from 'vue';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import { converExcelData } from '@/utils/utils.js';
import { getConfigs } from '@/config/config.js';
import { sendRequest, sendStreamRequest } from '@/utils/request.js';

export default {
  setup(importType) {
    let selectedFile = ref(null);
    let searchConditions = ref([]);
    const logVisiable = ref(false);
    const queryResults = ref([]); // 存储接口返回的数据

    const tableColumns = ref([]);
    const tableColumnsByTab = ref({
      "1": []
    });
    const onUploadLoading = ref(false);
    const onFetch = ref(false);
    const selectedFilePath = ref('');
    const uploadProgress = ref(0);
    const currentPage = ref(1);
    const pageSize = ref(20);
    const totalCount = ref(0);
    const modelDescription = ref('');
    const configs = getConfigs(importType);
    const customProgressMessage = ref('');
    const messageRecorder = ref([]);
    const targetUploadSheets = ref([]);
    let funcName = ref('');
    let tabPaging = ref({
      "1": {}
    });
    let currentTab = ref("1");
    const queryResultsByTab = ref({
      "1": []
    });

    tableColumns.value = configs.resultColumnConfigs;

    const fetchByFunc = configs.fetchByFunc;
    const tabs = configs.tabs;

    const uploadPercentage = ref({});
    uploadPercentage.value = {
      0: '',
      1: '开始校验参数...',
      10: '开始读取文件...',
      20: '开始校验文件...',
      30: '开始转换数据...',
      90: '查询结果...',
      100: '完成'
    }

    const typeDesc = {
      "success": "【成功】",
      "error": "【失败】",
      "warning": "【警告】",
      "info": "【信息】"
    }

    if (fetchByFunc) {
      for (let i = 0; i < tabs.length; i++) {
        tabPaging.value[tabs[i].index] = {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0
        }
        queryResultsByTab.value[tabs[i].index] = [];
        if (i == 0) {
          funcName.value = tabs[i].funcName;
        }
        tableColumnsByTab.value[tabs[i].index] = tabs[i].resultColumnConfigs;
      }
      const sheets = configs.sheets;
      for (let i = 0; i < sheets.length; i++) {
        targetUploadSheets.value.push(sheets[i].name);
      }
    }

    const buildQueryParams = (params, hasPageParams) => {
      let queryParams = params;
      if (hasPageParams) {
        if (fetchByFunc) {
          queryParams = {
            ...queryParams,
            pageSize: tabPaging.value[currentTab.value].pageSize,
            currentPage: tabPaging.value[currentTab.value].currentPage
          }
        } else {
          queryParams = {
            ...queryParams,
            pageSize: pageSize.value,
            currentPage: currentPage.value
          }
        }
      }
      if (searchConditions.value.length > 0) {
        queryParams = {
          ...queryParams,
          ...searchConditions.value.reduce((acc, condition) => ({ ...acc, [condition.name]: condition.value }), {})
        }
      }
      return queryParams;
    }

    const handleMessage = (type, message, onlyRecord) => {
      if (!onlyRecord) {
        ElMessage[type](message);
      }
      messageRecorder.value.push({
        type: type,
        typeDesc: typeDesc[type],
        message: message,
        time: new Date()
      });
    }

    const openLog = () => {
      logVisiable.value = true;
      nextTick(() => {
        document.querySelector(".log-container").scrollTop = document.querySelector(".log-container").scrollHeight;
      })
    }

    const uploadStatus = (percentage) => {
      handleMessage(percentage === 100 ? 'success' : 'info', uploadPercentage.value[percentage] || customProgressMessage.value || '', true);
      if (percentage === 100) {
        setTimeout(() => {
          uploadProgress.value = 0;
        }, 3000);
      }
      return uploadPercentage.value[percentage] || customProgressMessage.value || '';
    };

    const beforeUpload = async (file) => {
      const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isExcel) {
        handleMessage('error', '请选择 Excel 类型文件');
        return false;
      }
      selectedFile.value = file;
      return false;
    };

    const handleSizeChange = (val) => {
      if (fetchByFunc) {
        tabPaging.value[currentTab.value].currentPage = 1;
        tabPaging.value[currentTab.value].pageSize = val;
      } else {
        pageSize.value = val;
        currentPage.value = 1;
        uploadProgress.value = 0;
      }
      fetchData();
    }

    const handleCurrentChange = (val) => {
      if (fetchByFunc) {
        tabPaging.value[currentTab.value].currentPage = val;
      } else {
        currentPage.value = val;
        uploadProgress.value = 0;
      }
      fetchData();
    }

    const onTabChange = (pane, ev) => {
      currentTab.value = pane.paneName;
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].index == pane.paneName) {
          funcName.value = tabs[i].funcName;
          break;
        }
      }
      if (!queryResultsByTab.value[currentTab.value] || queryResultsByTab.value[currentTab.value].length == 0) {
        fetchData();
      }
    }

    const handleFileChange = (file) => {
      selectedFile.value = file;
      selectedFilePath.value = file.name;
      uploadProgress.value = 0;
    };

    const handleUploadError = (error) => {
      handleMessage('error', `文件上传失败: ${error.message}`);
    };

    const readFileAsArrayBuffer = (file) => {
      return new Promise((resolve, reject) => {
        try {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = () => {
            reject(reader.error);
          };
          reader.readAsArrayBuffer(file);
        } catch (error) {
          reject(error);
        }
      });
    }

    const validateFile = async (callback, processStep) => {
      if (!selectedFile.value) {
        handleMessage('error', '请选择文件');
        onUploadLoading.value = false;
        return false;
      }
      onUploadLoading.value = true;
      await nextTick();
      uploadProgress.value = 0;
      await nextTick();
      uploadProgress.value = 1;
      await nextTick();
      try {
        const checkResult = await validatePreConditions();

        if (!checkResult) {
          handleMessage('error', '缺少必要参数配置，点击日志查看详情。');
          onUploadLoading.value = false;
          return false;
        }

        await nextTick();
        uploadProgress.value = 10;
        await nextTick();
        const result = await readFileAsArrayBuffer(selectedFile.value);

        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: 'array' });
        uploadProgress.value = 20;
        await nextTick();
        const sheetNames = workbook.SheetNames;
        let requiredSheets = configs.sheets;
        if (fetchByFunc) {
          requiredSheets = requiredSheets.filter(sheet => targetUploadSheets.value.includes(sheet.name));
        }
        const missingSheets = requiredSheets.filter(sheet => !sheetNames.includes(sheet.name));
        if (missingSheets.length > 0) {
          handleMessage('error', `输入文件中未检测到模型执行必要数据: ${missingSheets.map(sheet => sheet.name).join(', ')}`);
          onUploadLoading.value = false;
          return false;
        }
        uploadProgress.value = 30;
        await nextTick();
        var step = processStep || Math.ceil(40 / requiredSheets.length);
        for (let i = 0; i < requiredSheets.length; i++) {
          const sheetName = requiredSheets[i].name;
          customProgressMessage.value = `正在处理${sheetName}数据...`;
          const sheet = workbook.Sheets[sheetName];
          const jsonData = converExcelData(XLSX.utils.sheet_to_json(sheet), requiredSheets[i].ignoreDataKeyWhenEmpty);
          if (!jsonData || jsonData.length === 0) {
            handleMessage('error', `${sheetName}的内容为空，请重新上传！`);
            onUploadLoading.value = false;
            return false;
          }

          const requiredColumns = requiredSheets[i].columns;
          const jsonDataKeys = Object.keys(jsonData[0] || {});

          const missingColumns = requiredColumns.filter(column => !jsonDataKeys.includes(column));
          if (missingColumns.length > 0) {
            handleMessage('error', `${sheetName}的列名已被篡改，请修复后重新执行程序！`);
            handleMessage('error', `缺少以下列: ${missingColumns.join(', ')}`, true);
            onUploadLoading.value = false;
            return false;
          }

          const chunkSize = 5000;
          for (let j = 0; j < jsonData.length; j += chunkSize) {
            const chunk = jsonData.slice(j, j + chunkSize);
            uploadProgress.value += step / Math.ceil(jsonData.length / chunkSize);
            customProgressMessage.value = `正在处理${sheetName}数据(${(j + chunkSize >= jsonData.length ? jsonData.length : j + chunkSize)}/${jsonData.length})...`;
            await uploadData(requiredSheets[i].uploadUrl, j == 0, i == requiredSheets.length - 1 && j + chunkSize >= jsonData.length, { jsonData: chunk });
          }
        }

        await nextTick();
        if (callback && typeof callback === 'function') {
          await callback();
        } else {
          await fetchData();
          uploadProgress.value = 100;
          onUploadLoading.value = false;
        }
        return false; // 阻止默认上传行为，等待校验完成后手动上传
      } catch (error) {
        handleMessage('error', `文件处理过程报错: ${error.message}`);
        return false;
      }
    };

    const validatePreConditions = async () => {
      const preConditions = configs.preConditions;
      let isValid = true;
      for (let i = 0; i < preConditions.length; i++) {
        try {
          const resData = await sendRequest(preConditions[i].checkUrl);

          if (resData.count < preConditions[i].lowerLimit) {
            handleMessage('error', preConditions[i].message, true);
            isValid = false
          }
        } catch (error) {
          handleMessage('error', `执行前置条件检查失败: ${error.message}`);
          isValid = false
        }
      }
      return isValid;
    };

    const uploadData = async (uploadUrl, isFirst, islast, data) => {
      try {
        const queryParams = buildQueryParams({ isFirst });
        const resData = await sendRequest(uploadUrl, queryParams, 'POST', data);
        handleMessage('success', resData.message, true);
        if (islast) {
          handleMessage('success', '上传成功');
        }
      } catch (error) {
        handleMessage('error', `上传过程报错: ${error.message}`);
      }
    };

    const fetchData = async () => {
      if (configs.fetchByFunc && funcName.value) {
        await fetchDataByTab();
      } else {
        await fetchDataByTable();
      }
    }

    const fetchDataByTable = async () => {
      onFetch.value = true;
      await nextTick();
      try {
        const queryParams = buildQueryParams({}, true);
        const resData = await sendRequest(configs.fetchUrl, queryParams);
        await getDataCountByTable(resData);
        queryResults.value = resData;
      } catch (error) {
        handleMessage('error', `查询数据失败: ${error.message}`);
      } finally {
        onFetch.value = false;
      }
    }

    const fetchDataByTab = async () => {
      onFetch.value = true;
      await nextTick();
      try {
        const queryParams = buildQueryParams({ funcName: funcName.value }, true);
        const resData = await sendRequest(configs.fetchUrl, queryParams);
        await getDataCountByTab(resData);
        queryResultsByTab.value[currentTab.value] = resData;
      } catch (error) {
        handleMessage('error', `查询数据失败: ${error.message}`);
      } finally {
        onFetch.value = false;
      }
    }

    const getDataCountByTable = async (data) => {
      if (!configs.dataCountUrl) {
        totalCount.value = data.length > 0 ? data[0].totalCount : 0;
        return;
      }
      try {
        const queryParams = buildQueryParams({});
        const resData = await sendRequest(configs.dataCountUrl, queryParams);
        if (resData.count) {
          totalCount.value = resData.count;
        } else {
          totalCount.value = 0;
        }
      } catch (error) {
        handleMessage('error', `查询数据行数失败: ${error.message}`);
      }
    }

    const getDataCountByTab = async (data) => {
      if (!tabPaging.value[currentTab.value]) {
        tabPaging.value[currentTab.value] = {};
      }
      if (!configs.dataCountUrl) {
        tabPaging.value[currentTab.value].totalCount = data[0].totalCount;
        return;
      }
      try {
        const queryParams = buildQueryParams({ funcName: funcName.value });
        const resData = await sendRequest(configs.dataCountUrl, queryParams);
        if (resData.count) {
          tabPaging.value[currentTab.value].totalCount = resData.count;
        } else {
          tabPaging.value[currentTab.value].totalCount = 0;
        }
      } catch (error) {
        handleMessage('error', `查询数据行数失败: ${error.message}`);
      }
    }

    const downloadData = async () => {
      uploadProgress.value = 0;
      try {
        let params = {}
        if (configs.fetchByFunc && funcName.value) {
          params = {
            funcName: funcName.value
          }
        }
        const queryParams = buildQueryParams(params);
        const resData = await sendStreamRequest(configs.downloadUrl, queryParams);
        const blob = new Blob([resData]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${configs.fetchByFunc ? configs.subTitles[funcName.value] : configs.title}_${new Date().getTime()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        handleMessage('error', `结果下载失败: ${error.message}`);
      }
    }

    const clearData = async () => {
      uploadProgress.value = 0;
      try {
        let params = {}
        if (configs.fetchByFunc && funcName.value) {
          params = {
            funcName: funcName.value
          }
        }
        const queryParams = buildQueryParams(params);
        await sendRequest(configs.clearDataUrl, queryParams);
        uploadProgress.value = 0;
        handleMessage('success', '数据已清空');
        currentPage.value = 1;
        totalCount.value = 0;
        await fetchData();
      } catch (error) {
        handleMessage('error', `清除数据失败: ${error.message}`);
      }
    }

    const handleTemplateDownload = async () => {
      uploadProgress.value = 0;
      try {
        let params = {}
        if (configs.fetchByFunc && funcName.value) {
          params = {
            funcName: funcName.value
          }
        }
        const queryParams = buildQueryParams(params);
        const resData = await sendStreamRequest(configs.templateUrl, queryParams);
        const blob = new Blob([resData]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = configs.templateName;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        handleMessage('error', `模板文件下载失败: ${error.message}`);
      }
    }

    onMounted(() => {
      modelDescription.value = configs.modelDescription;
      fetchData();
    });

    return {
      selectedFile,
      searchConditions,
      queryResults,
      tableColumns,
      onUploadLoading,
      onFetch,
      selectedFilePath,
      uploadProgress,
      customProgressMessage,
      currentPage,
      pageSize,
      totalCount,
      modelDescription,
      configs,
      tabPaging,
      tabs,
      currentTab,
      queryResultsByTab,
      tableColumnsByTab,
      messageRecorder,
      logVisiable,
      targetUploadSheets,
      uploadStatus,
      beforeUpload,
      handleSizeChange,
      handleCurrentChange,
      handleFileChange,
      handleUploadError,
      onTabChange,
      fetchData,
      validateFile,
      downloadData,
      clearData,
      handleTemplateDownload,
      openLog,
      handleMessage
    };
  }
};