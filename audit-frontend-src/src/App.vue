<template>
  <!-- 左侧菜单 -->
  <div style="height: 100vh;width: 100vw;display: flex;flex-direction: row;flex-basis: auto;">
    <div class="sidebar">
      <el-menu :default-active="$route.path" mode="vertical" :collapse="isCollapse" background-color="#2f4050"
        text-color="#fff" active-text-color="#66ccff">
        <template v-for="menuItem in menuData" :key="menuItem.name">
          <template v-if="menuItem.children">
            <el-sub-menu :index="menuItem.name">
              <template #title>
                <el-icon>
                  <Menu v-if="menuItem.meta.icon === 'models'" />
                  <Mouse v-else-if="menuItem.meta.icon === 'spyder'" />
                  <Setting v-else-if="menuItem.meta.icon === 'params'" />
                </el-icon>
                <span>{{ menuItem.meta.menuName }}</span>
              </template>
              <template v-for="child in menuItem.children" :key="child.path">
                <el-menu-item :index="child.path" @click="handleMenuItemClick(child.path)">
                  <span>{{ child.meta.menuName }}</span>
                </el-menu-item>
              </template>
            </el-sub-menu>
          </template>
          <template v-else>
            <el-menu-item :index="menuItem.path" @click="handleMenuItemClick(menuItem.path)">
              <el-icon>
                <Menu v-if="menuItem.meta.icon === 'models'" />
                <Mouse v-else-if="menuItem.meta.icon === 'spyder'" />
                <Setting v-else-if="menuItem.meta.icon === 'params'" />
              </el-icon>
              <span>{{ menuItem.meta.menuName }}</span>
            </el-menu-item>
          </template>
        </template>
      </el-menu>
      <div :class="['sidebar-toggle', isCollapse ? 'is-collapsed' : 'is-expanded']">
        <span v-if="!isCollapse" class="prod-version">当前版本1.0.0<br>2025-04-21</span>
        <el-icon style="font-size: 24px;" @click="toggleSidebar">
          <Expand v-if="isCollapse" />
          <Fold v-else />
        </el-icon>
      </div>
    </div>
    <!-- 右侧内容 -->
    <div class="content">
      <div class="content-body">
        <div class="page-content">
          <div style="height: 100%;">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getMenus } from '@/config/menu.js';

const router = useRouter();
const menuData = getMenus();
const isCollapse = ref(false);

const handleMenuItemClick = (path) => {
  router.push(path);
};

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value;
};

onMounted(() => {
  // 组件挂载后获取数据
  router.push(menuData[0].children[0].path);
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

.sidebar {
  background-color: #2f4050;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  transition: width 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sidebar .sidebar-toggle {
  display: flex;
  color: #fff;
  cursor: pointer;
  align-items: center;
}

.sidebar .sidebar-toggle .prod-version {
  width: 100%;
  text-align: center;
  font-size: 14px;
  cursor: default;
}

.sidebar .sidebar-toggle.is-collapsed {
  justify-content: center;
  margin: 10px 0;
}

.sidebar .sidebar-toggle.is-expanded {
  justify-content: flex-end;
  margin: 10px 0;
  margin-right: 10px;
}

.sidebar .el-menu {
  border-right: none;
}

.sidebar .el-sub-menu__title,
.sidebar .el-menu-item {
  padding-left: 20px;
}

.sidebar .el-sub-menu__title:hover,
.sidebar .el-menu-item:hover {
  background-color: #243443;
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

.header {
  height: 60px;
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.page-content {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.upload-container {
  display: flex;
  flex-flow: column nowrap;
  border: 1px solid var(--el-color-info);
  padding: 0 10px;
}

.upload-container-row {
  display: flex;
  flex-flow: row nowrap;
  margin: 10px 0;
  align-items: center;
}

.upload-container-row .label {
  width: 80px;
  text-align: right;
  justify-content: center;
  align-items: center;
}

.upload-container-row .content {
  flex: 1;
}

.modeldesc-container-row {
  display: flex;
  flex-flow: row nowrap;
  margin: 10px 0;
}

.modeldesc-container-row .label {
  width: 80px;
  text-align: right;
  justify-content: center;
  align-items: center;
}

.modeldesc-container-row .content-desc {
  flex: 1;
  overflow: auto;
  height: 50px;
}

.result-body {
  flex: 1;
  border: 1px solid var(--el-color-info);
}

.upload-footer {
  height: 60px;
  border: 1px solid var(--el-color-info);
  padding: 0 10px;
}

.result-body .body-toolbar {
  margin: 10px 10px;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
}

.result-body,
.upload-footer,
.upload-container,
.result-body .el-tabs {
  border-radius: 8px;
}

.result-body .el-tabs .el-tabs__header,
.result-body>.el-table--fit:first-child {
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
}

.result-body .el-tabs .el-tabs__header .el-tabs__nav .el-tabs__item:first-child {
  border-top-left-radius: 8px;
}

.el-tabs--border-card>.el-tabs__content {
  padding: 0 !important;
}

.body-toolbar .body-toolbar-left {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

.body-toolbar .body-toolbar-right {
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.log-container {
  height: calc(100% - 40px);
  overflow: auto;
  display: flex;
  flex-flow: column nowrap;
  gap: 5px;
}

.log-container .log-container-row {
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  gap: 10px;
}

.log-container .log-container-row .log-type {
  width: 60px;
}

.log-container .log-container-row.success {
  color: #67c23a;
}

.log-container .log-container-row.error {
  color: #f56c6c;
}

.log-container .log-container-row.warning {
  color: #e6a23c;
}

.log-container .log-container-row .log-time {
  width: 120px;
}

.log-container .log-container-row .log-content {
  flex: 1;
}
</style>
