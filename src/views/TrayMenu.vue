<script setup lang="ts">
import { useI18nStore, useThemeStore } from "@/store"
import { WindowUtils } from "@/lib/window.utils"
import { Info, Settings, LogOut } from "@lucide/vue"
import { ref, onMounted, onScopeDispose } from "vue"
import { getCurrentWindow, PhysicalSize } from "@tauri-apps/api/window"

type MenuAction = "about" | "settings" | "quit"

const menuItems: { action: MenuAction; icon: typeof Info; labelKey: string }[] = [
  { action: "about", icon: Info, labelKey: "Tray.menu.about" },
  { action: "settings", icon: Settings, labelKey: "Tray.menu.settings" },
  { action: "quit", icon: LogOut, labelKey: "Tray.menu.quit" },
]

const i18n = useI18nStore()
const theme = useThemeStore()
const trayWin = getCurrentWindow()
const menuRef = ref<HTMLElement | null>(null)

onMounted(() => {
  void trayWin.hide()

  if (menuRef.value) {
    const h = menuRef.value.scrollHeight
    if (h > 0) void trayWin.setSize(new PhysicalSize(220, h))
  }

  const onBlur = () => {
    void trayWin.hide()
  }
  window.addEventListener("blur", onBlur)

  const unlisten = trayWin.onFocusChanged(({ payload: focused }) => {
    if (!focused) onBlur()
  })
  onScopeDispose(() => {
    window.removeEventListener("blur", onBlur)
    void unlisten.then((fn) => fn?.())
  })
})

async function handleAction(action: MenuAction) {
  switch (action) {
    case "about":
    case "settings": {
      const mainWin = await WindowUtils.getWindowByLabel("main")
      if (mainWin) await mainWin.emit("navigate", `/${action}`)
      await WindowUtils.showAndFocus("main")
      break
    }
    case "quit": {
      await WindowUtils.windowsQuit()
      break
    }
  }
  await trayWin.hide()
}
</script>

<template>
	<div
		ref="menuRef"
		class="w-full select-none"
		:class="theme.theme === 'dark' ? 'bg-[#1e1e1e] text-[#cccccc]' : 'bg-white text-[#333333]'"
		style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
	>
		<div class="py-1">
			<template v-for="(item, index) in menuItems" :key="item.action">
				<button
					class="flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors"
					:class="theme.theme === 'dark'
						? 'hover:bg-[#264f78] hover:text-white'
						: 'hover:bg-[#e8f0fe] hover:text-[#1a73e8]'"
					@click="handleAction(item.action)"
				>
					<component :is="item.icon" class="h-4 w-4 shrink-0" />
					<span>{{ i18n.t(item.labelKey) }}</span>
				</button>
				<div
					v-if="index === 0 && index !== menuItems.length - 1"
					class="mx-3 my-1 h-px"
					:class="theme.theme === 'dark' ? 'bg-[#333333]' : 'bg-[#e0e0e0]'"
				/>
			</template>
		</div>
	</div>
</template>
