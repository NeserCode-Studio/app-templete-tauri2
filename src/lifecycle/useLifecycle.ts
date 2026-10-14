import { onScopeDispose } from "vue";
import type { LifecycleHook, LifecycleStage } from "./types";
import { lifecycle } from "./bus";

/**
 * 声明式注册一个生命周期钩子（Vue 组合式版本）。
 *
 * 组件/作用域存活期间注册，作用域销毁时自动移除
 * （register 返回的卸载函数交给 onScopeDispose）。
 *
 * 示例：组件想在应用就绪时上报一次统计
 *   useLifecycle("ready", () => report());
 */
export function useLifecycle(
  stage: LifecycleStage,
  run: LifecycleHook["run"]
): void {
  const hook: LifecycleHook = {
    id: `${stage}:${Math.random().toString(36).slice(2)}`,
    stage,
    run,
  };
  const unregister = lifecycle.register(hook);
  onScopeDispose(unregister);
}
