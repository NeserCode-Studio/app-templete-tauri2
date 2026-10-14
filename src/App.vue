<script setup lang="ts">
import { computed, onMounted, onScopeDispose, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Toaster } from "vue-sonner"
import { getCurrentWindow, PhysicalPosition } from "@tauri-apps/api/window"
import { listen } from "@tauri-apps/api/event"

import Titlebar from "@/components/frameworks/Titlebar.vue"
import CommandDialog from "@/components/frameworks/CommandDialog.vue"
import SettingsDialog from "@/components/frameworks/SettingsDialog.vue"
import AboutDialog from "@/components/frameworks/AboutDialog.vue"

import { useThemeStore, useDialogStore } from "@/store"
import { WindowUtils } from "@/lib/window.utils"
import { lifecycle } from "@/lifecycle"
import { createLogger } from "@/lib/logger"

const log = createLogger("App")

const theme = useThemeStore()
const dialogs = useDialogStore()
const route = useRoute()
const router = useRouter()

/* 检测当前窗口 */
const currentLabel = getCurrentWindow().label
const isTrayWindow = computed(() => currentLabel === "tray")
const colorSchemeClass = computed(() => (theme.theme === "dark" ? "dark" : "light"))

/* 应用就绪钩子：主窗口显示并聚焦。
   托盘窗口跳过。 */
const $windowMain = new WindowUtils("main")
lifecycle.register({
  id: "window.render-focus",
  stage: "ready",
  once: true,
  run: () => {
    if (getCurrentWindow().label === "tray") return
    return $windowMain.renderFocus()
  },
})

/* 生命周期阶段只触发一次（Vue 下无 StrictMode 问题，但保持幂等） */
const fired = ref(false)

onMounted(() => {
  if (fired.value) return
  fired.value = true
  void lifecycle.fire("mount").then(() => lifecycle.fire("ready"))
})

/* 跨窗口事件监听（主窗口） */
let unlisteners: Array<() => void> = []
onMounted(async () => {
  if (currentLabel === "tray") return

  const unlistenPopup = await listen<{ x: number; y: number }>(
    "tray-popup",
    async (event) => {
      const trayWindow = await WindowUtils.getWindowByLabel("tray")
      if (!trayWindow) {
        log.warn("tray-popup: tray window not found")
        return
      }
      const size = await trayWindow.outerSize()
      const x = Math.round(event.payload.x - size.width / 2)
      const y = Math.max(0, Math.round(event.payload.y - size.height))
      await trayWindow.setPosition(new PhysicalPosition(x, y))
      await trayWindow.show()
      await trayWindow.setFocus()
      log.info("tray menu popped", { x, y })
    }
  )

  const unlistenNavigate = await listen<string>("navigate", (event) => {
    const target = event.payload
    log.info("navigate event", target)
    if (target === "/settings") {
      dialogs.openSettings()
    } else if (target === "/about") {
      dialogs.openAbout()
    } else {
      void router.push(target)
    }
  })

  unlisteners = [unlistenPopup, unlistenNavigate]
})
onScopeDispose(() => {
  unlisteners.forEach((fn) => fn())
})

/* 托盘窗口失焦自动隐藏 */
if (currentLabel === "tray") {
  void (async () => {
    const win = getCurrentWindow()
    const fn = await win.onFocusChanged(({ payload: focused }) => {
      if (!focused) void win.hide()
    })
    onScopeDispose(() => fn())
  })()
}

/* 托盘路由守卫：主窗口不允许进入 /tray */
watch(
  () => route.path,
  (path) => {
    if (isTrayWindow.value && path !== "/tray") void router.push("/tray")
    if (!isTrayWindow.value && path === "/tray") void router.push("/")
  },
  { immediate: true }
)
</script>

<template>
	<div v-if="isTrayWindow" class="app-tray">
		<router-view />
	</div>
	<main v-else id="app-main" class="app-shell transition-colors duration-100 ease-in-out">
		<Titlebar />
		<CommandDialog />

		<div id="container" class="app-body">
			<router-view />
		</div>

		<SettingsDialog />
		<AboutDialog />
		<Toaster :theme="colorSchemeClass" richColors position="bottom-right" />
	</main>
</template>

<style lang="postcss" scoped>
.app-tray {
	height: 100vh;
	width: 100vw;
	overflow: hidden;
	background-color: var(--background);
	transition: background-color 100ms ease-in-out;
}
</style>
