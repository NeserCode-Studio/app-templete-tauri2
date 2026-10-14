import { defineStore } from "pinia"
import { ref } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { useI18nStore } from "./i18n"

/**
 * 标题全局状态。
 *
 * 对齐 rt：标题持久化到 localStorage，默认值来自 i18n 文案。
 */
export const useTitleStore = defineStore("app-title", () => {
  const i18n = useI18nStore()
  const title = useLocalStorage<string>(
    "app-title",
    i18n.t("Titlebar.default.title")
  )

  function setTitle(next: string): void {
    title.value = next
  }

  function resetTitle(): void {
    title.value = i18n.t("Titlebar.default.title")
  }

  return { title: ref(title), setTitle, resetTitle }
})
