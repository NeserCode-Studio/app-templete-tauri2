import {
  getAllWindows,
  getCurrentWindow,
  Window,
} from "@tauri-apps/api/window";
import { createLogger } from "@/lib/logger";

const log = createLogger("Window");

/** 统一的窗口查询，失败时记日志并返回空数组 */
async function safeGetAllWindows(): Promise<Window[]> {
  try {
    return await getAllWindows();
  } catch (reason) {
    log.error("getAllWindows failed", reason);
    return [];
  }
}

/**
 * 绑定到指定 label 的窗口实例。
 *
 * 构造时发起预取，但那是异步的 —— 在 promise resolve 之前调用 renderFocus
 * 时 $bound 仍是 undefined，因此 resolveTarget() 会主动重查一次，
 * 避免错误地 fallback 到当前窗口。
 */
export class WindowUtils {
  private readonly $current: Window;
  private readonly $label: string;
  /** 构造期预取的结果；未 resolve 时为 undefined */
  private $bound: Window | undefined;
  /** 预取的 promise，保证并发调用只发一次查询 */
  private $pending: Promise<void> | undefined;

  constructor(label: string) {
    this.$current = getCurrentWindow();
    this.$label = label;
    void this.prefetch();
  }

  /** 幂等预取：并发调用共享同一个 in-flight promise */
  private prefetch(): Promise<void> {
    if (!this.$pending) {
      this.$pending = WindowUtils.getWindowByLabel(this.$label).then((window) => {
        this.$bound = window;
        log.debug("bound window", this.$label, window ? "found" : "not found");
      });
    }
    return this.$pending;
  }

  /**
   * 解析目标窗口。
   *
   * 构造期预取是异步的，若在 resolve 之前调用 renderFocus，$bound 仍是
   * undefined —— 此处等待同一个 promise，绝不重复发起查询，也绝不静默
   * fallback 到可能错误的窗口。
   */
  private async resolveTarget(): Promise<Window> {
    if (this.$bound) return this.$bound;
    await this.prefetch();
    if (this.$bound) return this.$bound;

    log.warn("bound window not found, fallback to current", this.$label);
    return this.$current;
  }

  /** 取消最小化 → 显示 → 聚焦 */
  async renderFocus(): Promise<void> {
    const target = await this.resolveTarget();
    await WindowUtils.restoreAndFocus(target);
  }

  /**
   * 取消最小化 → 显示 → 聚焦。
   *
   * 注意：最小化的窗口 is_visible() 仍返回 true，直接 show() 不会让它回到屏幕，
   * 必须先 unminimize()。
   */
  static async restoreAndFocus(window: Window): Promise<void> {
    const minimized = await window.isMinimized().catch(() => false);
    if (minimized) {
      log.debug("unminimize before show", window.label);
      await window.unminimize();
    }
    await window.show();
    await window.setFocus();
    log.debug("restored & focused", window.label);
  }

  static async getWindowByLabel(label: string): Promise<Window | undefined> {
    const windows = await safeGetAllWindows();
    return windows.find((w) => w.label === label);
  }

  /** 按 label 恢复并置前窗口；窗口不存在时静默返回 */
  static async showAndFocus(label: string): Promise<void> {
    const window = await WindowUtils.getWindowByLabel(label);
    if (!window) {
      log.warn("showAndFocus: window not found", label);
      return;
    }
    await WindowUtils.restoreAndFocus(window);
  }

  static async windowsQuit(): Promise<void> {
    const windows = await safeGetAllWindows();
    log.info("windowsQuit", `${windows.length} window(s)`);
    await Promise.all(windows.map((window) => window.close()));
  }
}
