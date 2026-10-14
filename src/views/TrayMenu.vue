<script setup lang="ts">
import { useI18nStore } from "@/store"
import { WindowUtils } from "@/lib/window.utils"

const i18n = useI18nStore()

async function navigateTo(path: string) {
  /* 托盘窗口不路由，发事件给主窗口处理 */
  const { emit } = await import("@tauri-apps/api/event")
  await emit("navigate", path)
}

function quit() {
  void WindowUtils.windowsQuit()
}
</script>

<template>
	<div class="stack-2 select-none p-2 text-sm">
		<button
			class="w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
			@click="navigateTo('/settings')"
		>
			{{ i18n.t("Tray.menu.settings") }}
		</button>
		<button
			class="w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
			@click="navigateTo('/about')"
		>
			{{ i18n.t("Tray.menu.about") }}
		</button>
		<div class="bg-border h-px" />
		<button
			class="w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-accent"
			@click="quit"
		>
			{{ i18n.t("Tray.menu.quit") }}
		</button>
	</div>
</template>
