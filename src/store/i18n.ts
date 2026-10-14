import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { I18nTexts } from "@/lib/i18n.resource"

export type Lang = keyof typeof I18nTexts

const LANG_KEY = "app-lang"
const DEFAULT_LANG: Lang = "zh-CN"

function resolveInitialLang(): Lang {
  const stored = localStorage.getItem(LANG_KEY)
  if (stored && stored in I18nTexts) return stored as Lang
  const nav = navigator.language
  if (nav in I18nTexts) return nav as Lang
  return DEFAULT_LANG
}

/**
 * i18n 全局状态。
 *
 * 文案集中在 lib/i18n.resource.ts；本 store 只负责当前语言与 t() 查询。
 * 未命中的 key 回退为 key 本身（对齐 rt 行为，不崩溃）。
 */
export const useI18nStore = defineStore("app-i18n", () => {
  const lang = ref<Lang>(resolveInitialLang())

  function t(key: string, params?: Record<string, string | number>): string {
    const table = I18nTexts[lang.value] as Record<string, string>
    let text = table[key] ?? key
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        text = text.split(`{${k}}`).join(String(v))
      }
    }
    return text
  }

  function setLanguage(next: Lang): void {
    lang.value = next
    localStorage.setItem(LANG_KEY, next)
  }

  const langs = Object.keys(I18nTexts) as Lang[]

  return {
    lang,
    langs,
    t: computed(() => t),
    setLanguage,
  }
})
