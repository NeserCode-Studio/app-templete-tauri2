<script setup lang="ts">
import { useI18nStore, useTitleStore } from "@/store"
import { useToast } from "@/composables/useToast"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import SettingItemGroup from "@/components/SettingItemGroup.vue"
import { Button } from "@/components/ui/button"
import { useTemplateRef } from "vue"

const i18n = useI18nStore()
const titleStore = useTitleStore()
const toast = useToast()

const titleInput = useTemplateRef<HTMLInputElement>("titleInput")

function submitTitle(e: Event) {
  e.preventDefault()
  const value = titleInput.value?.value ?? ""
  if (!value || value === titleStore.title) {
    toast.warning(i18n.t("Settings.items.title.error"))
    return
  }
  titleStore.setTitle(value)
  toast.success(i18n.t("Settings.items.title.success"))
}

const autoComplete = defineModel<boolean>("autoComplete", { default: true })
</script>

<template>
	<div class="stack-5">
		<SettingItemGroup
			:title="i18n.t('Settings.groups.examples.title')"
			:description="i18n.t('Settings.groups.examples.description')"
		>
			<!-- 标题设置项 -->
			<form @submit="submitTitle">
				<div
					class="group stack-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
				>
					<div class="flex min-w-0 flex-col gap-1">
						<span class="text-sm leading-tight font-medium">
							{{ i18n.t("Settings.items.title.title") }}
						</span>
						<span class="text-xs leading-relaxed text-muted-foreground">
							{{ i18n.t("Settings.items.title.description") }}
						</span>
					</div>
					<div class="flex shrink-0 items-center gap-2 sm:w-[22rem] sm:justify-end">
						<Input
							ref="titleInput"
							type="text"
							name="input"
							:placeholder="i18n.t('Settings.items.title.placeholder')"
							:default-value="titleStore.title"
							class="flex-1"
						/>
						<Button type="submit" size="sm">
							{{ i18n.t("Settings.items.input.default.submit") }}
						</Button>
					</div>
				</div>
			</form>

			<!-- 语言设置项 -->
			<div
				class="group stack-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
			>
				<div class="flex min-w-0 flex-col gap-1">
					<span class="text-sm leading-tight font-medium">
						{{ i18n.t("Settings.items.lang.title") }}
					</span>
					<span class="text-xs leading-relaxed text-muted-foreground">
						{{ i18n.t("Settings.items.lang.description") }}
					</span>
				</div>
				<div class="flex shrink-0 items-center gap-2 sm:w-[22rem] sm:justify-end">
					<select
						:value="i18n.lang"
						class="border-input bg-background flex h-9 w-full flex-1 rounded-md border px-3 py-1 text-sm shadow-sm focus:outline-none"
						@change="(e: Event) => { i18n.setLanguage((e.target as HTMLSelectElement).value as never); toast.success(i18n.t('Settings.items.lang.success')) }"
					>
						<option v-for="lang in i18n.langs" :key="lang" :value="lang">
							{{ lang }}
						</option>
					</select>
				</div>
			</div>

			<!-- 自动补全开关 -->
			<div
				class="group stack-3 rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border hover:bg-accent/30 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
			>
				<div class="flex min-w-0 flex-col gap-1">
					<span class="text-sm leading-tight font-medium">
						{{ i18n.t("Settings.items.auto-complete.title") }}
					</span>
					<span class="text-xs leading-relaxed text-muted-foreground">
						{{ i18n.t("Settings.items.auto-complete.description") }}
					</span>
				</div>
				<div class="flex shrink-0 items-center gap-2 sm:w-[22rem] sm:justify-end">
					<Switch id="auto-complete" v-model="autoComplete" />
					<Label for="auto-complete" class="cursor-pointer text-sm font-normal">
						{{ i18n.t("Settings.items.auto-complete.label") }}
					</Label>
				</div>
			</div>
		</SettingItemGroup>
	</div>
</template>
