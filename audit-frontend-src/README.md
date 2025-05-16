# 前端页面开发说明

1. 前端页面组件
前端页面组件分为HTML组件和JS组件。
- HTML组件：在/src/pages/下的ModelBasePage.vue和ParamBasePage.vue
- JS组件：在/src/mixins/下的auditMixin.js
<br>新增一个页面时，参考下面的代码实现：
  ```javascript
    <template>
      <ModelBasePage pageType="depositProvCheck" pageName="质保金计提核查"/>
    </template>

    <script setup>
    import ModelBasePage from '@/views/ModelBasePage.vue';
    </script>

    <style scoped>
    /* 样式 */
    </style>
  ```
  如不使用HTML组件，可单独调用JS组件，参考示例：
  ```javascript
    import auditMixin from '@/mixins/auditMixin.js';

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
      host,
      handleMessage
    } = auditMixin.setup("spyderPcaj"); // 参数为页面配置文件中的配置主键
  ```

2. /config/modules下的页面配置文件

- 工作表配置
  ```json
  sheets: [
    {
      name: "折算汇率",
      columns: ["币种", "币种名称", "汇率（1外币兑换人民币）"],
      uploadUrl: "/api/pjParams/exchangeRate/upload-data" // 上传数据的URL，/api/模块名/功能名(对应每个sheet)/upload-data
    },
    // 其他工作表配置...
  ]
  ```
- 功能页签配置
  ```json
  tabs: [
    {
      title: "折算汇率",
      index: "1",
      funcName: "exchangeRate",
      resultColumnConfigs: [
        { title: "币种", width: "120" },
        { title: "币种名称", width: "400" },
        { title: "汇率（1外币兑换人民币）", prop: "汇率", width: "200", align: "right", formatter: cellFormatter }
      ]
    },
    // 其他选项卡配置...
  ]
  ```
- 后端接口调用配置
<br>fetchUrl: 获取数据的接口地址，/api/模块名/fetchData，示例：/api/pjParams/fetchData
<br>downloadUrl: 下载查询结果的接口地址，/api/模块名/download-result，示例：/api/pjParams/download-result
<br>templateUrl: 下载模板的接口地址，/api/模块名/template-download，示例：/api/pjParams/template-download
<br>clearDataUrl: 清除数据的接口地址，/api/模块名/delete-data，示例：/api/pjParams/delete-data
<br>dataCountUrl: 获取数据行数统计的接口地址，/api/模块名/fetchDataCount，示例：/api/pjParams/fetchDataCount
- 其他设置
<br>showModelDesc: 布尔值，是否显示模型说明（默认: true）
<br>fetchByFunc: 布尔值，是否按功能名展示数据（默认: false）,当设置为true时，需要进行功能页签配置
<br>templateName: 模板文件名 "审计模型导入模板_项目参数.xlsx"
<br>preConditions: 前置条件数组，示例：
  ```json
  [
    {
      checkUrl: "/api/pjParams/fetchDataCount?funcName=exchangeRate", //校验数据行数获取url
      lowerLimit: 3,//数据行数下限
      message: "【项目参数】配置文件中未检测到模型执行必要数据：[折算汇率]"//校验失败时提示信息
    },
    // 其他条件...
  ]
  ```
  <br>modelDescription: 模型说明

3. 菜单配置
<br>在/src/config/menu.js中，根据需要添加菜单。示例：
  ```json
  {
    id: 1,
    name: "auditModels",
    meta: {
      menuName: "审计模型"
    },
    children: [
      {
        id: 11,
        name: "saftyFoundingAudit",
        path: "/saftyFoundingAudit",
        meta: {
          menuName: "安全生产经费计提"
        }
      },
    ]
  },
  ```