import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { usePreferredDark, useLocalStorage } from "@vueuse/core";
import { createLogger } from "@/lib/logger";
import type { ThemeType } from "@/shared";

const log = createLogger("Theme");

const THEME_KEY = "theme-mode";

/**
 * 主题全局状态。
 *
 * 对齐 rt 行为（原生 classList 直切，无 useDark）：
 * - 首次启动跟随系统（usePreferredDark）
 * - 用户手动切换后写入 localStorage，此后不再自动跟随
 * - CSS 过渡由全局 base 层的 transition 规则驱动，切换不闪烁
 */
export const useThemeStore = defineStore("app-theme", () => {
  const stored = localStorage.getItem(THEME_KEY);
  const initial: ThemeType =
    stored === "dark" || stored === "light"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";

  const theme = ref<ThemeType>(initial);
  /** 用户是否手动选择过主题（手动后不再跟随系统） */
  const manual = useLocalStorage(`${THEME_KEY}-manual`, false);
  if (stored) manual.value = true;

  const prefersDark = usePreferredDark();

  // 应用到 DOM：初值与后续变化都走这里（对齐 rt 的 effect 同步）
  watch(
    theme,
    (next) => {
      document.documentElement.classList.toggle("dark", next === "dark");
      log.debug("theme applied to DOM", next);
    },
    { immediate: true }
  );

  // 跟随系统：仅在未手动选择时生效
  watch(prefersDark, (dark) => {
    if (manual.value) return;
    log.info("follow system theme change", dark ? "dark" : "light");
    theme.value = dark ? "dark" : "light";
  });

  function setThemeMode(next: ThemeType): void {
    log.info("setTheme", next, "(user choice, stops following system)");
    manual.value = true;
    theme.value = next;
    localStorage.setItem(THEME_KEY, next);
  }

  return { theme, setThemeMode };
});
