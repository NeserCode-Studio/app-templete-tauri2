import { defineStore } from "pinia"
import { computed } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { useI18nStore } from "./i18n"

/**
 * 标题全局状态。
 *
 * 对齐 rt：标题持久化到 localStorage，默认值来自 i18n 文案。
 * 注意：直接返回 useLocalStorage 的 ref（Pinia setup store 会自动解包），
 * 不要再包一层 ref() —— 否则 title 变成 Ref<Ref<string>>，赋值与比较全部失效。
 */
export const useTitleStore = defineStore("app-title", () => {
  const i18n = useI18nStore()
  const titleRef = useLocalStorage<string>(
    "app-title",
    i18n.t("Titlebar.default.title")
  )

  function setTitle(next: string): void {
    titleRef.value = next
  }

  function resetTitle(): void {
    titleRef.value = i18n.t("Titlebar.default.title")
  }

  const title = computed(() => titleRef.value)

  return { title, setTitle, resetTitle }
})
