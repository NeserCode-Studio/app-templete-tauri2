<div align="center">

# app-templete-tauri2

**Tauri 2 + Vue 3 桌面应用开发模板**

开箱即用的桌面应用骨架 —— 窗口管理、系统托盘、命令面板、设置中心、多语言、主题切换，一次配好，直接写业务。

[![Tauri](https://img.shields.io/badge/Tauri-2-blue?style=flat-round&logo=tauri&logoColor=white)](https://tauri.app)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=flat-round&logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-round&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-round&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-round)](LICENSE)

</div>

---

## 特性

| | |
| --- | --- |
| **双窗口架构** | 主窗口 + 托盘弹窗，同一 bundle 按窗口标签分流 |
| **无边框标题栏** | Windows 风格原生菜单（转到 / 编辑 / 帮助），标题栏可拖拽 |
| **系统托盘** | 托盘图标 + 自绘弹出菜单，左键显隐主窗口、右键唤出菜单 |
| **命令面板** | `⌘K` / `Ctrl+K` 唤起，支持模糊搜索与快捷键提示 |
| **设置中心** | 搜索 / 通用双 Tab，通用设置项组件（输入框 / 下拉 / 开关），内置搜索历史与修改记录 |
| **主题切换** | 亮色 / 暗色，跟随系统，用户手动选择后不再自动跟随 |
| **国际化** | 中英双语，语言可运行时切换 |
| **生命周期钩子** | 阶段化的启动 / 挂载 / 就绪钩子，业务初始化有明确落点 |
| **跨窗口通信** | Rust ↔ 前端双向事件通道，托盘可直接唤起主窗口功能 |

技术底座：**Tauri 2** · **Vue 3** · **TypeScript** · **Tailwind CSS 4** · **shadcn-vue**（reka-ui）· **Pinia** · **VueUse** · **Rust**

---

## 快速开始

### 环境要求

- Node.js ≥ 18
- pnpm ≥ 9
- Rust（stable）
- Tauri 平台依赖（Linux 需 `webkit2gtk` 等，详见[官方文档](https://tauri.app/start/prerequisites/)）

### 安装与启动

```bash
# 安装前端依赖
pnpm install

# 启动开发环境（自动编译 Rust，首次较慢）
pnpm tauri:dev
```

### 构建

```bash
pnpm tauri:build     # 生成安装包
pnpm build           # 仅构建前端（vue-tsc 类型检查 + vite build）
```

### 其他命令

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动前端开发服务器（端口 8888） |
| `pnpm preview` | 预览前端构建产物 |
| `pnpm tauri` | Tauri CLI 入口 |

> 浏览器环境下界面可渲染，但托盘、跨窗口、原生能力不可用 —— 这些需 `pnpm tauri:dev` 验证。

---

## 项目结构

```
src/
├── main.ts               # 入口
├── App.vue               # 根组件：窗口分流、跨窗口事件、生命周期触发
├── router.ts             # 路由（含 /tray 托盘分流路由）
├── style.tailwind.css    # Tailwind 4 CSS-first 设计令牌 + 组件类
│
├── components/
│   ├── frameworks/       # 框架组件
│   │   ├── Titlebar*.vue     # 无边框标题栏（菜单/编辑/帮助 + 操作按钮）
│   │   ├── CommandDialog     # 命令面板（普通 + @super 模式）
│   │   ├── SettingsDialog    # 设置弹窗
│   │   └── AboutDialog       # 关于弹窗
│   ├── SettingItems.vue  # 通用设置项
│   └── ui/               # shadcn-vue 组件库（reka-ui 封装）
│
├── views/                # 页面
│   ├── Home / Software / Framework
│   └── TrayMenu          # 托盘菜单
│
├── store/                # Pinia 全局状态（i18n / theme / title / dialogs）
├── composables/          # 组合式函数（useSuperCommand / useToast）
├── lifecycle/            # 生命周期总线（阶段：mount / ready）
├── lib/                  # 工具与资源
│   ├── i18n.resource.ts  # 中英文案表
│   ├── window.utils.ts   # 窗口工具
│   ├── editor.actions.ts # 编辑命令
│   ├── logger.ts         # 日志模块
│   └── utils.ts          # cn()
└── shared/               # 共享类型

src-tauri/
├── tauri.conf.json       # 窗口与打包配置（main + tray 双窗口）
├── capabilities/         # 权限白名单
└── src/lib.rs            # 托盘与 Rust 命令
```

---

## 架构说明

### 双窗口模型

配置了两个窗口，**同一份前端代码按窗口标签分流**：

| 窗口 | 用途 |
| --- | --- |
| `main` | 主界面：无边框、可拖拽标题栏、路由内容 |
| `tray` | 托盘弹出菜单：独立小窗、失焦自动隐藏 |

托盘右键 → Rust 侧发出定位事件 → 主窗口计算坐标后弹出托盘菜单；托盘菜单中的操作通过事件反向通知主窗口。

### 生命周期系统

提供阶段化钩子，让初始化逻辑有明确落点：

```
mount（Vue 挂载完成） → ready（应用就绪）
```

钩子支持优先级排序、一次性执行、卸载函数。同阶段按优先级顺序 `await` 执行，行为可预测。

| 阶段 | 时机 | 典型用途 |
| --- | --- | --- |
| `mount` | Vue 挂载完成 | 注册全局事件监听、启动定时任务 |
| `ready` | 挂载完成后 | 需要窗口就绪才能执行的动作（聚焦、置前） |

需要扩展时，在 `src/lifecycle/types.ts` 的 `LifecycleStage` 联合类型里加阶段，并在合适位置补上 `lifecycle.fire(...)`，`register` / `fire` 的实现无需改动。

### 状态与持久化

- 全局状态用 Pinia store（`i18n` / `theme` / `title` / `dialogs`）
- 用户偏好（主题、语言、标题、置顶状态等）持久化到 `localStorage`（经 VueUse `useLocalStorage`）
- 弹窗开关状态集中在 `useDialogStore`，根组件挂载对应弹窗

### 主题机制

- CSS 变量驱动，所有颜色集中在 `style.tailwind.css` 定义（Tailwind 4 CSS-first `@theme`），亮/暗两套令牌
- 首次启动跟随系统；用户手动切换后不再自动跟随
- 切换无闪烁：背景 100ms 平滑过渡，前景文字/图标瞬时切换（规避 OKLCH 变量过渡的中间帧异常）

### 国际化

- 文案集中在 `src/lib/i18n.resource.ts`，新增文案改一处即可
- 运行时可切换语言，无需重启
- 未命中的 key 会回退为 key 本身，不会崩溃

### 命令系统

命令面板提供两种模式：

- **普通模式** —— 页面跳转、设置打开、重载等常用操作
- **高级模式** —— 输入 `@super` 前缀后执行扩展命令，支持前端动作与 Rust 命令两种执行方式

命令以注册表形式管理（`useSuperCommand`），新增命令即插即用。

### 日志

`src/lib/logger.ts` 提供带级别过滤的日志模块：

```ts
import { createLogger } from "@/lib/logger";

const log = createLogger("MyModule");
log.debug("detail", { some: "data" });
log.info("something happened");
log.warn("recoverable problem");
log.error("failed", error);
```

- 输出格式统一为 `[模块:级别]`，带颜色高亮，可按模块检索
- **开发环境**输出全部级别；**生产构建**默认只保留 `warn` / `error`
- 支持子 logger：`log.child("Sub")` → `[MyModule/Sub:info]`

运行时切换级别（无需重新构建），在控制台执行：

```js
localStorage.setItem("app-log-level", "debug"); // 打开全部
localStorage.removeItem("app-log-level");        // 恢复默认
```

---

## 开发约定

### 样式

- **shadcn-vue 组件的样式覆盖请平铺写进 `class`**，由 `cn()`（`twMerge`）自动合并
- `@layer components` 只用于纯自有元素；该层优先级低于 Tailwind 工具类，覆盖 shadcn 组件会静默失效
- 重复出现 3 次以上的样式组合可收纳为组件类，统一维护在 `style.tailwind.css`

### shadcn-vue 组件

`src/components/ui/` 由 shadcn-vue CLI（`npx shadcn-vue@latest add ...`）生成或按官方模式手写，请勿随意修改内部实现。全局定制请改 `style.tailwind.css` 中的设计令牌。

### 权限

Tauri 采用权限白名单机制。新增原生能力时，在 `src-tauri/capabilities/default.json` 中显式声明后前端才能调用。

---

## 许可

[MIT](LICENSE)
