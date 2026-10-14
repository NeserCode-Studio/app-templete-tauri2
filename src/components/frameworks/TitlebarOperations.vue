<script setup lang="ts">
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Minus, X, Sun, Moon, Paperclip, Square, Copy } from "@lucide/vue"
import { useThemeStore, useI18nStore } from "@/store"
import { useLocalStorage } from "@vueuse/core"
import { ref, onMounted, onScopeDispose, watch } from "vue"
import { getCurrentWindow } from "@tauri-apps/api/window"
import { WindowUtils } from "@/lib/window.utils"
import { createLogger } from "@/lib/logger"

const log = createLogger("Titlebar")
const i18n = useI18nStore()
const theme = useThemeStore()

const currentWindow = getCurrentWindow()

const alwaysOnTop = useLocalStorage("app-always-on-top", false)
const maximized = ref(false)

watch(alwaysOnTop, (v) => {
  void currentWindow.setAlwaysOnTop(v)
})

/* 同步最大化状态：覆盖双击标题栏、系统快捷键、外部 resize 等场景 */
let unlisten: (() => void) | undefined
onMounted(async () => {
  void currentWindow.setAlwaysOnTop(alwaysOnTop.value)
  maximized.value = await currentWindow.isMaximized().catch(() => false)
  const fn = await currentWindow.onResized(async () => {
    maximized.value = await currentWindow.isMaximized().catch(() => false)
  })
  unlisten = fn
})
onScopeDispose(() => unlisten?.())

function handleOperation(operation: "minimize" | "close") {
  switch (operation) {
    case "minimize":
      void currentWindow.minimize()
      break
    case "close":
      void WindowUtils.windowsQuit()
      break
  }
}

async function toggleMaximize(): Promise<void> {
  const isMax = await currentWindow.isMaximized().catch(() => false)
  if (isMax) {
    await currentWindow.unmaximize()
  } else {
    await currentWindow.maximize()
  }
  const next = await currentWindow.isMaximized().catch(() => false)
  log.debug("toggleMaximize ->", next ? "maximized" : "restored")
  maximized.value = next
}
</script>

<template>
	<div class="inline-flex h-full w-fit flex-row items-center justify-center">
		<Separator
			orientation="vertical"
			class="mx-0.5 h-1/2 rounded bg-neutral-300 transition-colors duration-100 ease-in-out dark:bg-neutral-700"
		/>
		<Tooltip>
			<TooltipTrigger as-child>
				<span
					:class="alwaysOnTop ? 'titlebar-op is-pinned' : 'titlebar-op'"
					@mouseup="() => { alwaysOnTop = !alwaysOnTop; void currentWindow.setAlwaysOnTop(!alwaysOnTop) }"
				>
					<Paperclip class="titlebar-op-icon" />
				</span>
			</TooltipTrigger>
			<TooltipContent>{{ i18n.t("Titlebar.operations.always-on-top.tooltip") }}</TooltipContent>
		</Tooltip>
		<Tooltip>
			<TooltipTrigger as-child>
				<span
					class="titlebar-op"
					@mouseup="() => theme.setThemeMode(theme.theme === 'dark' ? 'light' : 'dark')"
				>
					<Sun v-if="theme.theme === 'dark'" class="titlebar-op-icon" />
					<Moon v-else class="titlebar-op-icon" />
				</span>
			</TooltipTrigger>
			<TooltipContent>{{ i18n.t("Titlebar.operations.theme.tooltip") }}</TooltipContent>
		</Tooltip>
		<Tooltip>
			<TooltipTrigger as-child>
				<span class="titlebar-op" @mouseup="() => handleOperation('minimize')">
					<Minus class="titlebar-op-icon" />
				</span>
			</TooltipTrigger>
			<TooltipContent>{{ i18n.t("Titlebar.operations.minimize.tooltip") }}</TooltipContent>
		</Tooltip>
		<Tooltip>
			<TooltipTrigger as-child>
				<span class="titlebar-op" @mouseup="() => void toggleMaximize()">
					<Copy v-if="maximized" class="titlebar-op-icon" />
					<Square v-else class="titlebar-op-icon" />
				</span>
			</TooltipTrigger>
			<TooltipContent>
				{{ i18n.t(maximized ? "Titlebar.operations.restore.tooltip" : "Titlebar.operations.maximize.tooltip") }}
			</TooltipContent>
		</Tooltip>
		<Tooltip>
			<TooltipTrigger as-child>
				<span class="titlebar-op" @mouseup="() => handleOperation('close')">
					<X class="titlebar-op-icon" />
				</span>
			</TooltipTrigger>
			<TooltipContent>{{ i18n.t("Titlebar.operations.close.tooltip") }}</TooltipContent>
		</Tooltip>
	</div>
</template>
