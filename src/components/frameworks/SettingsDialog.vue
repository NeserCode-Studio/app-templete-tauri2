<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useI18nStore, useDialogStore } from "@/store"
import SettingItems from "@/components/SettingItems.vue"

const i18n = useI18nStore()
const dialogs = useDialogStore()
</script>

<template>
	<Dialog :open="dialogs.settingsOpen" @update:open="(v: boolean) => v ? dialogs.openSettings() : dialogs.closeSettings()">
		<DialogContent class="max-h-[80vh] overflow-y-auto">
			<DialogHeader>
				<DialogTitle>{{ i18n.t("Settings.general.description") }}</DialogTitle>
				<DialogDescription>{{ i18n.t("Settings.general.description") }}</DialogDescription>
			</DialogHeader>
			<SettingItems />
		</DialogContent>
	</Dialog>
</template>
