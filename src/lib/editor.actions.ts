/**
 * 标题栏「编辑」菜单的原生编辑命令实现。
 *
 * 说明：Tauri 应用的 WebView 本身已提供 Ctrl+C/V/X 等系统级快捷键，
 * 此模块为菜单点击提供等价的程序化入口，便于鼠标用户使用。
 *
 * `document.execCommand` 虽已废弃，但在 WebView2 / WKWebView 中
 * 仍是唯一无需额外权限即可执行 copy/cut/undo/redo 的途径。
 * `paste` 为浏览器明确禁止的命令，改用剪贴板读取 + insertText 组合实现。
 */

import { createLogger } from "@/lib/logger";

const log = createLogger("Editor");

/** 当前是否存在非空选区 */
export function hasSelection(): boolean {
  const selection = window.getSelection();
  return !!selection && selection.toString().length > 0;
}

/** 焦点是否落在可编辑元素上 */
function activeEditable(): HTMLElement | null {
  const el = document.activeElement;
  if (!el) return null;
  const tag = el.tagName;
  const isEditable =
    (el as HTMLElement).isContentEditable ||
    tag === "INPUT" ||
    tag === "TEXTAREA";
  return isEditable ? (el as HTMLElement) : null;
}

/** 执行 execCommand，返回是否成功 */
function exec(command: string): boolean {
  try {
    return document.execCommand(command);
  } catch (reason) {
    log.warn("execCommand failed", command, reason);
    return false;
  }
}

export function undo(): boolean {
  return exec("undo");
}

export function redo(): boolean {
  return exec("redo");
}

export function copy(): boolean {
  return hasSelection() && exec("copy");
}

export function cut(): boolean {
  // 剪切要求选区位于可编辑区域内，否则会静默失败
  if (!activeEditable() || !hasSelection()) return false;
  return exec("cut");
}

export async function paste(): Promise<boolean> {
  // 粘贴必须落到可编辑元素上，否则 insertText 无处生效
  if (!activeEditable()) {
    log.debug("paste skipped: focus not on editable element");
    return false;
  }

  let text: string;
  try {
    text = await navigator.clipboard.readText();
  } catch (reason) {
    // 无剪贴板权限时回退到 execCommand（部分 WebView 可用）
    log.warn("clipboard.readText denied, fallback to execCommand", reason);
    const ok = exec("paste");
    log.debug("paste via execCommand", ok ? "ok" : "failed");
    return ok;
  }
  if (!text) {
    log.debug("paste: clipboard empty");
    return false;
  }
  // insertText 会自动替换当前选区，等价于「先删后插」
  exec("insertText");
  log.debug("paste via insertText", `${text.length} chars`);
  return true;
}

/** 全选：可编辑元素用 execCommand，其余走 Selection API */
export function selectAll(): boolean {
  if (activeEditable() && exec("selectAll")) return true;

  const selection = window.getSelection();
  if (!selection || !document.body) return false;
  const range = document.createRange();
  range.selectNodeContents(document.body);
  selection.removeAllRanges();
  selection.addRange(range);
  return true;
}

/** 查找：唤起应用内命令面板（本应用统一的搜索入口） */
export function find(): void {
  window.dispatchEvent(new CustomEvent("app:open-command-palette"));
}
