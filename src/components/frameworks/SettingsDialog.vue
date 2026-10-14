<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea, ScrollAreaInner } from "@/components/ui/scroll-area"
import { useI18nStore, useDialogStore } from "@/store"
import { Settings2 } from "@lucide/vue"
import SettingsView from "@/views/Settings.vue"

const i18n = useI18nStore()
const dialogs = useDialogStore()
</script>

<template>
	<Dialog :open="dialogs.settingsOpen" @update:open="(v: boolean) => v ? dialogs.openSettings() : dialogs.closeSettings()">
		<DialogContent class="flex h-[80vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
			<header class="flex items-center gap-3 border-b bg-muted/40 px-6 py-4">
				<span class="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-lg">
					<Settings2 class="size-5" />
				</span>
				<div class="stack-1">
					<DialogTitle class="text-base leading-tight font-semibold">
						{{ i18n.t("Titlebar.menu.turnto.settings") }}
					</DialogTitle>
					<DialogDescription class="text-xs">
						{{ i18n.t("Settings.search.description") }}
					</DialogDescription>
				</div>
			</header>

			<ScrollArea class="min-h-0 flex-1">
				<ScrollAreaInner>
					<div class="px-6 py-5">
						<SettingsView />
					</div>
				</ScrollAreaInner>
			</ScrollArea>
		</DialogContent>
	</Dialog>
</template>
