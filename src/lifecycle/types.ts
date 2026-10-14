/**
 * 软件生命周期阶段定义。
 *
 * 当前只保留两个阶段 —— 它们是项目中唯一有实际触发点（fire）的阶段。
 *
 * 扩展方式：新增阶段只需在 LifecycleStage 联合类型里加一个字符串，
 * 并在**合适的位置**补上对应的 `lifecycle.fire(...)` 调用。
 * fire/register 的实现无需改动。
 *
 * 约定：
 * - 均为一次性阶段，钩子应设 once: true；
 * - 若后续新增高频阶段（如窗口聚焦、主题切换），钩子必须轻量，
 *   禁止在钩子里做同步大计算或连锁的全局状态写入。
 */

export type LifecycleStage =
  /** Vue 挂载完成：App 首次挂载后触发一次。适合注册全局事件监听、启动定时任务。 */
  | "mount"
  /** 应用就绪：主窗口已显示并聚焦、可交互。适合放需要窗口就绪后才能执行的动作（如聚焦、请求注意力）。 */
  | "ready";

export interface LifecycleContext {
  stage: LifecycleStage;
  /** 预留：允许 fire 时携带任意上下文字段，例如 { window: "main" } */
  [key: string]: unknown;
}

export interface LifecycleHook {
  /** 唯一 id，用于 unregister */
  id: string;
  stage: LifecycleStage;
  run: (ctx: LifecycleContext) => void | Promise<void>;
  /** 是否只执行一次，执行后自动移除。默认 false */
  once?: boolean;
  /** 同阶段内执行顺序，越小越先执行。默认 0 */
  priority?: number;
}
