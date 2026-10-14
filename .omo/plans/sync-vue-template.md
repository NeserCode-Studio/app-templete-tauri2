# Plan: sync-vue-template

- intent: clear
- review_required: false
- status: approved (plan written)
- target repo: Z:\Repo\Github\NCS\app-templete-tauri2 (Vue 3)
- reference repo: Z:\Repo\Github\NCS\app-template-tauri2-rt (React 19, 领先进度)
- artifact relocation: 执行完成后将本计划书复制到 `.agent/plans/`，并把 `.agent/` 从 `.gitignore` 中排除（`.agent/` 目录当前不存在）

## TL;DR (For humans)
将 rt 模板（React）的框架能力同步到本 Vue 模板：Rust 侧与配置 1:1 对齐；纯 TS 模块直接移植；React 特有部分用 Vue 生态等价物替换（shadcn-vue/reka-ui、Pinia、VueUse、vue-router 4）。底座升级 Tailwind 4 + pnpm。清除演示性代码。保持 Vue 生态，不引入 React。

## Scope
- IN: 双窗口+托盘、无边框标题栏、命令面板(普通+@super)、设置中心、关于对话框、i18n、生命周期总线、logger、window.utils、主题跟随系统、编辑菜单、open_devtools、Tailwind 3→4、shadcn-vue 落地、yarn→pnpm、.agent 落位、README 重写
- OUT (Must-NOT-Have): 不迁移 rt 的 Home/Software/Framework 页面具体内容（仅建等价路由占位）；不引入 cmdk-vue（除非 shadcn-vue Command 验证失败）；不改 rt 仓库；不引入 React；不做 CI/打包流水线

## Verification strategy
- 每步：`pnpm build`（vue-tsc --noEmit + vite build）零错误
- 交互验证：`pnpm tauri dev` 手动核对托盘弹出/显隐、Ctrl+K 命令面板、设置/关于弹窗、主题切换、语言切换
- 最终：完整走一遍 Success criteria 清单

## Execution strategy
按依赖顺序串行执行 Todos；Rust/配置同步最先行（窗口标签是后续所有前端分流的依赖）；底座升级在组件移植前完成。

## Todos
- [ ] 1. 底座升级：package.json 改 pnpm 脚本、迁移 lockfile（删除 yarn.lock，pnpm install）、Tailwind 3→4（@tailwindcss/vite 插件、重写 tailwind.config.js 为 CSS-first 配置、style.tailwind.css 对齐 rt 的 App.css 令牌结构）、Vite 6、初始化 shadcn-vue（npx shadcn-vue@latest init，reka-ui 底座，components.json）。验收：pnpm dev 正常渲染，pnpm build 零错误。QA: 构建输出作为证据。Commit: "build: migrate to pnpm, tailwind 4, shadcn-vue"
- [ ] 2. Rust 与配置同步：将 rt 的 src-tauri/src/lib.rs（托盘+toggle_main_window+open_devtools）、tauri.conf.json（main+tray 双窗口、devUrl 8888、pnpm 脚本）、capabilities/ 对齐移植（保留本项目 productName/identifier 可按需改名，默认对齐 rt）。验收：pnpm tauri dev 出现托盘图标，右键发 tray-popup 事件。QA: 运行日志证据。Commit: "feat(tauri): sync tray, dual-window config and devtools from rt"
- [ ] 3. 纯 TS 模块移植：复制并适配 rt 的 src/lifecycle/*（bus/types/index/useLifecycle，删除 React StrictMode 相关注释）、src/lib/logger.ts、src/lib/window.utils.ts、src/lib/i18n.resource.ts、src/lib/utils.ts（cn）、src/shared/*。这些为框架无关 TS，仅改 import 路径别名。验收：vue-tsc 类型检查通过。QA: tsc 输出。Commit: "feat(core): port lifecycle bus, logger, window utils, i18n resource from rt"
- [ ] 4. 状态与组合式：新建 Pinia stores（theme/i18n/title/settings 弹窗开关，对齐 rt 的 contexts/*），composables 重写 useTheme（VueUse useLocalStorage + 跟随系统逻辑）、useI18n、useToast（vue-sonner 保留）、useSuperCommand（命令注册表，结构对齐 rt）。安装 @vueuse/core（已有）。验收：类型通过 + dev 页面可用。QA: 构建证据。Commit: "feat(state): pinia stores and composables replacing rt contexts"
- [ ] 5. 框架组件移植：shadcn-vue add 所需组件（dialog command dropdown-menu tooltip scroll-area switch select sonner separator badge button input kbd），然后移植 Titlebar（含拖拽、标题、操作按钮、Windows 风格菜单/编辑菜单）、CommandDialog（Ctrl+K 绑定，普通+@super 模式）、SettingsDialog、AboutDialog、SettingItems、TrayMenu 视图。react-router 逻辑 → vue-router 4（已有 router.ts 扩展为 /tray 分流；App.vue 按窗口 label 分流渲染 TrayMenu 或主布局，对齐 rt App.tsx 结构）。验收：dev 下全部弹窗可开。QA: 手动交互截图/日志。Commit: "feat(ui): port titlebar, command palette, settings/about dialogs"
- [ ] 6. 联调双窗口：main 窗口监听 tray-popup 定位并弹 tray 窗口；tray 菜单操作经 navigate 事件回传主窗口；托盘失焦自动隐藏；lifecycle.fire("mount"→"ready") 在 App.vue onMounted 触发，含 renderFocus 钩子。验收：完整托盘交互链路可用。QA: tauri dev 手动走查记录。Commit: "feat(tray): cross-window tray popup flow with lifecycle hooks"
- [ ] 7. 清理与落位：删除 Greet.vue、Pagination.vue、counter.ts、About.vue（演示物）、components.json 中无关项；确认 .agent/ 不被 .gitignore 排除（加 `!.agent/` 或确认无匹配规则），将本计划书复制到 .agent/plans/sync-vue-template.md。验收：pnpm build 通过 + git status 显示 .agent 可跟踪。QA: git check-ignore -v .agent 输出为空。Commit: "chore: remove demo code, track .agent artifacts"
- [ ] 8. README 重写：对齐 rt README 结构，技术栈改为 Vue 3/Pinia/shadcn-vue/Tailwind 4/pnpm，保留双窗口/托盘/命令面板/设置/i18n/生命周期/日志说明，命令表改 pnpm。验收：README 与实际结构一致。QA: 人工比对。Commit: "docs: rewrite README for vue template"

## Final verification wave
- [ ] F1. Plan compliance audit：逐条核对 Todos 1-8 是否全部完成且无越界改动
- [ ] F2. Code quality review：vue-tsc --noEmit 零错误、无残留 React import、无 yarn.lock
- [ ] F3. Real manual QA：pnpm tauri dev 完整走查（托盘左右键、Ctrl+K、@super、设置、关于、主题、语言、i18n 回退）
- [ ] F4. Scope fidelity：确认 OUT 清单项均未引入

## Commit strategy
每个 Todo 一个 commit，message 见各条；全部完成后在 main 合并。

## Success criteria
- 与 rt 模板功能清单（README 特性表 9 项）在 Vue 版中全部可用
- pnpm tauri dev/build 在 Windows 上通过
- .agent/ 被 git 跟踪且含本计划书
- 仓库中无 React 依赖、无 yarn 残留、无演示性死代码
