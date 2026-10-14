<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { useI18nStore, useDialogStore } from "@/store"
import { getVersion } from "@tauri-apps/api/app"
import { ref, onMounted } from "vue"

const i18n = useI18nStore()
const dialogs = useDialogStore()
const version = ref("")

onMounted(async () => {
  version.value = await getVersion().catch(() => "unknown")
})
</script>

<template>
	<Dialog :open="dialogs.aboutOpen" @update:open="(v: boolean) => v ? dialogs.openAbout() : dialogs.closeAbout()">
		<DialogContent class="max-w-sm">
			<DialogHeader>
				<DialogTitle>{{ i18n.t("About.title", { name: "Tauri App" }) }}</DialogTitle>
				<DialogDescription>{{ i18n.t("About.tagline") }}</DialogDescription>
			</DialogHeader>
			<Separator />
			<div class="stack-3 text-sm">
				<div class="row-label justify-between">
					<span>{{ i18n.t("About.version") }}</span>
					<span class="font-mono">{{ version }}</span>
				</div>
				<div class="row-label justify-between">
					<span>{{ i18n.t("About.frontend") }}</span>
					<span>Vue 3 + TypeScript</span>
				</div>
				<div class="row-label justify-between">
					<span>{{ i18n.t("About.identifier") }}</span>
					<span class="font-mono">com.tauri-app.app</span>
				</div>
			</div>
			<p class="text-muted-xs text-center">{{ i18n.t("About.copyright") }}</p>
		</DialogContent>
	</Dialog>
</template>
