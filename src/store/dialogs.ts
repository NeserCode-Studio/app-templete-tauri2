import { defineStore } from "pinia"
import { ref } from "vue"

/**
 * 弹窗开关全局状态（对齐 rt 的 SettingsDialogContext）。
 * 集中在根组件挂载对应弹窗，通过本 store 控制开关。
 */
export const useDialogStore = defineStore("app-dialogs", () => {
  const settingsOpen = ref(false)
  const aboutOpen = ref(false)

  function openSettings(): void {
    settingsOpen.value = true
  }
  function closeSettings(): void {
    settingsOpen.value = false
  }
  function openAbout(): void {
    aboutOpen.value = true
  }
  function closeAbout(): void {
    aboutOpen.value = false
  }

  return {
    settingsOpen,
    aboutOpen,
    openSettings,
    closeSettings,
    openAbout,
    closeAbout,
  }
})
