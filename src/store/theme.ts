import { defineStore } from "pinia"
import { ref, watch } from "vue"
import { useDark, useLocalStorage, usePreferredDark } from "@vueuse/core"
import type { ThemeType } from "@/shared"

const THEME_KEY = "theme-mode"

/**
 * 主题全局状态。
 *
 * 对齐 rt 行为：
 * - 首次启动跟随系统（usePreferredDark）
 * - 用户手动切换后写入 localStorage，此后不再自动跟随
 */
export const useThemeStore = defineStore("app-theme", () => {
  const isDark = useDark({ storageKey: THEME_KEY })
  const prefersDark = usePreferredDark()
  /** 用户是否手动选择过主题（手动后不再跟随系统） */
  const manual = useLocalStorage(`${THEME_KEY}-manual`, false)

  const theme = ref<ThemeType>(isDark.value ? "dark" : "light")

  // 跟随系统：仅在未手动选择时生效
  watch(prefersDark, (dark) => {
    if (!manual.value) isDark.value = dark
  })

  watch(isDark, (dark) => {
    theme.value = dark ? "dark" : "light"
  })

  function setThemeMode(next: ThemeType): void {
    manual.value = true
    isDark.value = next === "dark"
    theme.value = next
  }

  return { theme, setThemeMode }
})
