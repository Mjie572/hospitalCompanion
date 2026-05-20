# 医院陪诊系统

医院陪诊系统是一个实现陪诊服务全流程线上化的解决方案，包含 H5 客户端与管理端后台两部分。项目旨在通过数字化手段，提升陪诊服务的运营效率与患者体验。

- **客户端 (pzH5)**：为患者提供在线预约、下单支付与进度跟踪的便捷入口。
- **管理后台 (pzadmin)**：为运营人员提供订单管理、用户与陪诊师管理及数据统计等核心运营能力。

## 功能特性

### 👤 客户端功能

- 用户注册与登录
- 陪诊订单下单与在线支付
- 陪诊服务进度实时查询

### 🛠️ 管理后台功能

- 系统权限管理（基于角色的访问控制 RBAC）
- 全流程订单管理
- 用户/陪诊员账户管控
- 运营数据统计与可视化

## 技术栈

### 客户端 (pzH5)

- **核心框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **UI 组件库**：Vant
- **HTTP 请求**：Axios
- **路由管理**：Vue Router
- **样式处理**：Less
- **其他**：二维码生成 (QRCode)

### 管理后台 (pzadmin)

- **核心框架**：Vue 3 (Composition API)
- **构建工具**：Vite
- **UI 组件库**：Element Plus
- **HTTP 请求**：Axios
- **路由管理**：Vue Router
- **状态管理**：Vuex + vuex-persistedstate (实现状态持久化)
- **数据可视化**：ECharts
- **样式处理**：Less

## 项目结构

```
hospitalCompanion/
├── pzH5/                     # H5客户端项目
│   ├── src/
│   │   ├── api/              # API接口封装
│   │   ├── assets/           # 静态资源
│   │   ├── components/       # 公共组件
│   │   ├── router/           # 路由配置
│   │   ├── store/            # 状态管理
│   │   ├── utils/            # 工具函数 (含axios拦截器配置)
│   │   ├── views/            # 页面视图组件
│   │   └── main.js           # 应用入口
│   ├── index.html
│   └── package.json
├── pzadmin/                  # 管理后台项目
│   ├── src/
│   │   ├── api/              # API接口封装
│   │   ├── assets/           # 静态资源
│   │   ├── components/       # 公共组件（如侧边栏、导航栏）
│   │   ├── router/           # 路由配置（含动态路由）
│   │   ├── store/            # 状态管理（菜单、权限等）
│   │   ├── utils/            # 工具函数 (含axios拦截器配置)
│   │   ├── views/            # 页面视图组件（dashboard、订单、权限管理等）
│   │   └── main.js           # 应用入口（含路由守卫）
│   ├── index.html
│   └── package.json
└── ...                       # 其他项目配置文件
```

## 快速开始

### 环境要求

- Node.js (推荐 v20.16.0 或更高版本)
- npm 或 yarn 或 pnpm

### 安装与运行

1. **克隆项目**

   ```bash
   git clone https://github.com/Mjie572/hospitalCompanion.git
   ```

2. **运行客户端 (pzH5)**

   ```bash
   cd hospitalCompanion/pzH5
   npm install
   npm run dev
   ```

   项目默认运行在 `http://localhost:5173` (Vite默认端口)。

3. **运行管理后台 (pzadmin)**

   ```bash
   cd ../pzadmin
   npm install
   npm run dev
   ```

   项目默认运行在 `http://localhost:5173` (Vite默认端口)。

### 生产环境打包

两个项目均使用 Vite 作为构建工具，打包命令统一为：

```bash
npm run build
```

执行后会在各自项目根目录下生成 `dist` 文件夹，将其部署至 Web 服务器即可。

## 注意事项

- **后端服务**：本项目为前端代码。为实现完整功能，需要配套后端 API 服务，并在项目的 `utils/request.js` 文件中配置正确的 `baseURL`。
- **环境配置**：确保开发环境 Node.js 版本与项目依赖兼容。如果遇到依赖安装或启动问题，可以尝试删除 `node_modules` 和 `package-lock.json` 后重新安装。
