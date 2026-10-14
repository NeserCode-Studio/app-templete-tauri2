// ============================================================
// Super Command Registry - 抽象化的超级命令系统（Vue 组合式版本）
// ============================================================

import { invoke } from "@tauri-apps/api/core";
import { reactive } from "vue";
import { createLogger } from "@/lib/logger";

const log = createLogger("SuperCommand");

/** 命令执行结果 */
export interface SuperCommandResult {
  success: boolean;
  message?: string;
}

/** 超级命令定义 */
export interface SuperCommandItem {
  /** 唯一标识 */
  id: string;
  /** 关键词（搜索用） */
  keywords: string[];
  /** 执行动作（可选，后端优先） */
  invoke?: string;
  invokeArgs?: Record<string, unknown>;
  /** 前端动作（invoke 不存在时执行） */
  action?: () => SuperCommandResult | Promise<SuperCommandResult>;
}

/** 注册表 */
export type SuperCommandRegistry = SuperCommandItem[];

/** 内置命令工厂 */
export function createBuiltinCommands(ctx: {
  navigate: (path: string) => void;
  setLang: (lang: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  openSettings: () => void;
}): SuperCommandItem[] {
  const { navigate, setLang, setTheme, openSettings } = ctx;

  return [
    {
      id: "navigate.home",
      keywords: ["首页", "home", "主页", "navigate"],
      action: () => {
        navigate("/");
        return { success: true, message: "Navigated to home" };
      },
    },
    {
      id: "navigate.settings",
      keywords: ["设置", "settings", "配置", "preferences"],
      action: () => {
        openSettings();
        return { success: true, message: "Opened settings dialog" };
      },
    },
    {
      id: "navigate.software",
      keywords: ["软件", "software"],
      action: () => {
        navigate("/software");
        return { success: true, message: "Navigated to software" };
      },
    },
    {
      id: "navigate.framework",
      keywords: ["框架", "framework"],
      action: () => {
        navigate("/framework");
        return { success: true, message: "Navigated to framework" };
      },
    },
    {
      id: "lang.en-US",
      keywords: ["english", "英文", "en", "语言"],
      action: () => {
        setLang("en-US");
        return { success: true, message: "Language set to English" };
      },
    },
    {
      id: "lang.zh-CN",
      keywords: ["中文", "chinese", "zh", "语言"],
      action: () => {
        setLang("zh-CN");
        return { success: true, message: "语言已切换为简体中文" };
      },
    },
    {
      id: "theme.light",
      keywords: ["light", "亮色", "浅色", "主题"],
      action: () => {
        setTheme("light");
        return { success: true, message: "Theme set to light" };
      },
    },
    {
      id: "theme.dark",
      keywords: ["dark", "暗黑", "深色", "主题"],
      action: () => {
        setTheme("dark");
        return { success: true, message: "Theme set to dark" };
      },
    },
    {
      id: "devtools.open",
      keywords: ["devtools", "开发者工具", "open-devtools", "调试"],
      invoke: "open_devtools",
    },
  ];
}

/** 超级命令组合式函数 */
export function useSuperCommand(
  ctx: {
    navigate: (path: string) => void;
    setLang: (lang: string) => void;
    setTheme: (theme: "light" | "dark") => void;
    openSettings: () => void;
  },
  extraCommands: SuperCommandItem[] = []
) {
  const registry = reactive<SuperCommandItem[]>([
    ...createBuiltinCommands(ctx),
    ...extraCommands,
  ]);

  function register(cmd: SuperCommandItem): void {
    if (registry.some((c) => c.id === cmd.id)) return;
    registry.push(cmd);
  }

  function search(query: string): SuperCommandItem[] {
    if (!query.trim()) return registry;
    const lower = query.toLowerCase();
    return registry.filter(
      (cmd) =>
        cmd.id.toLowerCase().includes(lower) ||
        cmd.keywords.some((k) => k.toLowerCase().includes(lower))
    );
  }

  async function execute(id: string): Promise<SuperCommandResult> {
    const cmd = registry.find((c) => c.id === id);
    if (!cmd) {
      log.warn("execute: command not found", id);
      return { success: false, message: `Command not found: ${id}` };
    }

    try {
      // 后端优先
      if (cmd.invoke) {
        log.info("execute (invoke)", id, "→", cmd.invoke);
        await invoke(cmd.invoke, cmd.invokeArgs ?? {});
        log.info("execute done", id);
        return { success: true };
      }
      // 前端 fallback
      if (cmd.action) {
        log.info("execute (action)", id);
        const result = await cmd.action();
        log.info("execute done", id, result.success ? "ok" : "failed");
        return result;
      }
      log.warn("execute: no handler", id);
      return { success: false, message: "No handler for this command" };
    } catch (err) {
      log.error("execute failed", id, err);
      return { success: false, message: String(err) };
    }
  }

  return { commands: registry, register, search, execute };
}
