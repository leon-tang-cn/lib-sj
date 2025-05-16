<template>
  <!-- 左侧菜单 -->
  <div style="height: 100vh;width: 100vw;display: flex;flex-direction: row;flex-basis: auto;">
    <div class="content">
      <div class="content-body">
        <div class="page-content">
          <div style="height: 100%;">
            <config />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import config from '@/views/config.vue'

onMounted(() => {
  // 组件挂载后获取数据
});
</script>

<style>
/* 全局样式，去除默认的外边距和内边距 */
html,
body {
  margin: 0 !important;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden !important;
}

#app {
  height: 100vh;
  width: 100vw;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.content {
  flex: 1;
  background-color: #f9f9f9;
  width: 0;
  overflow: hidden;
}

.content-body {
  display: flex;
  flex-flow: column nowrap;
  height: calc(100% / 1);
  width: calc(100% / 1);
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}
.container {
  padding: 20px;
  display: flex;
  flex-flow: column nowrap;
  gap: 20px;
}

.config-row {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
}

.config-row-left,
.config-row-right {
  width: calc((100% - 10px) / 2);
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 10px;
}

.config-row .label,
.config-row-left .label {
  text-align: end;
  width: 150px;
}

.config-row .content,
.config-row-left .content {
  flex: 1;
}

.el-card+.el-card {
  margin-top: 20px;
}

.config-row+.config-row {
  margin-top: 10px;
}
</style>
