/**
 * 轻量日志模块。
 *
 * 目标：
 * 1. 统一格式 `[模块:级别] 内容`，便于控制台检索；
 * 2. 生产构建默认静默，避免调试噪音和无意泄露内部结构；
 * 3. 支持运行时开关（localStorage 覆盖），无需重新构建即可开/关；
 * 4. 支持子 logger 派生，模块内可批量降级或单独静音。
 */

/** 日志级别，数值越大越严重 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const LEVEL_STYLE: Record<LogLevel, string> = {
  debug: "color:#8b949e",
  info: "color:#58a6ff",
  warn: "color:#d29922",
  error: "color:#f85149",
};

/** localStorage key，设置后可覆盖构建期默认值（如 "debug" 打开全部日志） */
const OVERRIDE_KEY = "app-log-level";

function isDev(): boolean {
  return import.meta.env.DEV;
}

/**
 * 解析生效的最低级别。
 * 优先级：localStorage 覆盖 > 构建期默认值。
 */
function resolveThreshold(): number {
  const override = localStorage.getItem(OVERRIDE_KEY);
  if (override && override in LEVEL_ORDER) {
    return LEVEL_ORDER[override as LogLevel];
  }
  // 生产环境只保留 warn 及以上
  return isDev() ? LEVEL_ORDER.debug : LEVEL_ORDER.warn;
}

let threshold = resolveThreshold();

/** 重新读取日志级别（可在设置面板中调用） */
export function refreshLogLevel(): void {
  threshold = resolveThreshold();
}

/** 设置日志级别并持久化；传 undefined 表示恢复默认 */
export function setLogLevel(level: LogLevel | undefined): void {
  if (level === undefined) localStorage.removeItem(OVERRIDE_KEY);
  else localStorage.setItem(OVERRIDE_KEY, level);
  refreshLogLevel();
}

/** 当前生效的最低级别 */
export function getLogLevel(): LogLevel {
  return (
    (Object.keys(LEVEL_ORDER) as LogLevel[]).find(
      (k) => LEVEL_ORDER[k] === threshold
    ) ?? "debug"
  );
}

function emit(level: LogLevel, scope: string, args: unknown[]): void {
  if (LEVEL_ORDER[level] < threshold) return;

  const tag = `%c[${scope}:${level}]`;
  const style = `${LEVEL_STYLE[level]};font-weight:600`;
  // 首个参数带样式，后续参数原样透传，支持对象展开打印
  console.log(tag, style, ...args);
}

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  /** 派生一个带子前缀的 logger，如 log.child("Bus") */
  child: (sub: string) => Logger;
}

/**
 * 创建一个具名 logger。
 *
 * @param scope 模块名，显示为 `[scope:level]`
 *
 * @example
 * const log = createLogger("Lifecycle");
 * log.info("fire", stage);          // [Lifecycle:info] fire mount
 * const busLog = log.child("Bus");  // [Lifecycle/Bus:info] ...
 */
export function createLogger(scope: string): Logger {
  return {
    debug: (...args) => emit("debug", scope, args),
    info: (...args) => emit("info", scope, args),
    warn: (...args) => emit("warn", scope, args),
    error: (...args) => emit("error", scope, args),
    child: (sub: string) => createLogger(`${scope}/${sub}`),
  };
}

/** 默认 logger，用于零散输出 */
export const log = createLogger("App");
