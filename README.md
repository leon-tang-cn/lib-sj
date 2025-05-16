# 审计小程序

#### 开发初始化

确保计算机中已安装nodejs，版本22.14.0(LTS)。
链接：https://nodejs.org/zh-cn/download

```bash
cd audit-frontend-src
npm install
```

```bash
cd audit-nodejs-src
npm install
```

### 开发环境启动

```bash
cd audit-frontend-src
npm run dev
```

```bash
cd audit-nodejs-src
node server.js
```

### 打包可执行文件

1.编译前端页面文件

```bash
cd audit-frontend-src
npm run build
```

将编译后的/audit-frontend-src/dist目录中的内容拷贝到/audit-nodejs-src目录下，如audit-nodejs-src目录下已存在assets目录，则粘贴前先删除该目录。

2.编译可执行文件

```bash
cd audit-nodejs-src
npm run dist:win

或

npm run dist:mac
```

编译完成后，可执行文件会生成在/audit-nodejs-src/dist目录下。win-unpacked目录为win平台无需安装的可执行文件，mac-unpacked目录为mac平台无需安装的可执行文件。


