import type { LifecycleHook, LifecycleStage, LifecycleContext } from "./types";
import { createLogger } from "@/lib/logger";

const log = createLogger("Lifecycle");

/**
 * 生命周期总线（模块级单例）。
 *
 * 性能设计要点：
 * 1. 脱离 Vue 渲染：`lifecycle` 是模块顶层常量，register/fire 不触发 Vue 重渲染，
 *   也绝不要放进 provide/inject（否则会引发引用抖动导致的全局重渲染）。
 * 2. 注册零成本：register 仅做数组 push + sort，不在渲染热路径。
 * 3. 惰性执行：钩子只在对应 stage 被 fire 时才执行，未触发的阶段零开销。
 * 4. 稳定引用：register/unregister/fire 都是模块级方法，不产生新闭包。
 * 5. 可清理 + 幂等：register 返回卸载函数；once 钩子执行后自动移除，杜绝泄漏。
 * 6. 顺序可预测：同阶段默认按 priority 顺序 await 执行，便于排查。
 */
class LifecycleBus {
  private hooks = new Map<LifecycleStage, LifecycleHook[]>();

  /** 注册一个钩子，返回卸载函数 */
  register(hook: LifecycleHook): () => void {
    const list = [...(this.hooks.get(hook.stage) ?? []), hook];
    list.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    this.hooks.set(hook.stage, list);

    log.debug("register", {
      stage: hook.stage,
      id: hook.id,
      once: !!hook.once,
      priority: hook.priority ?? 0,
    });
    return () => this.unregister(hook.id);
  }

  /** 按 id 卸载钩子 */
  unregister(id: string): void {
    for (const [stage, list] of this.hooks) {
      const next = list.filter((h) => h.id !== id);
      if (next.length === list.length) continue;
      if (next.length === 0) this.hooks.delete(stage);
      else this.hooks.set(stage, next);
      log.debug("unregister", id);
      return;
    }
  }

  /** 触发某个阶段，按 priority 顺序执行该阶段所有钩子 */
  async fire(
    stage: LifecycleStage,
    ctx?: Partial<LifecycleContext>
  ): Promise<void> {
    // 日志打在开头：async 函数体在第一个 await 前是同步执行的，
    // 打在末尾会让人误以为 fire 是同步完成的
    const list = [...(this.hooks.get(stage) ?? [])];
    log.info("fire start", stage, `(${list.length} hooks)`);

    const context: LifecycleContext = { stage, ...ctx };
    // 快照遍历：钩子执行期间 register/unregister 不影响本次遍历
    for (const hook of list) {
      await hook.run(context);
      if (hook.once) this.unregister(hook.id);
    }
    log.info("fire done", stage);
  }
}

export const lifecycle = new LifecycleBus();
