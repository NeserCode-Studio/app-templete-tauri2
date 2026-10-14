<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useI18nStore, useDialogStore } from "@/store"
import { openUrl } from "@tauri-apps/plugin-opener"
import { ExternalLink, Info } from "@lucide/vue"
import { ref, computed, watch } from "vue"
import { getIdentifier, getName, getTauriVersion, getVersion } from "@tauri-apps/api/app"
import { useRouter } from "vue-router"

interface AboutMeta {
  name: string
  version: string
  tauriVersion: string
  identifier: string
}

const i18n = useI18nStore()
const dialogs = useDialogStore()
const router = useRouter()
const meta = ref<AboutMeta | null>(null)

/* 弹窗打开时拉取应用元信息；失败时降级为「未知」而非报错 */
watch(
  () => dialogs.aboutOpen,
  async (open) => {
    if (!open || meta.value) return
    const [name, version, tauriVersion, identifier] = await Promise.all([
      getName().catch(() => "—"),
      getVersion().catch(() => "—"),
      getTauriVersion().catch(() => "—"),
      getIdentifier().catch(() => "—"),
    ])
    meta.value = { name, version, tauriVersion, identifier }
  }
)

const appName = computed(() => meta.value?.name ?? "Tauri App")
const title = computed(() =>
  i18n.t("About.title", { name: appName.value })
)

const rows = computed(() => [
  { label: i18n.t("About.version"), value: meta.value?.version ?? "—" },
  { label: i18n.t("About.frontend"), value: meta.value?.tauriVersion ?? "—" },
  { label: i18n.t("About.identifier"), value: meta.value?.identifier ?? "—" },
])

async function openWebsite() {
  await openUrl("https://tauri.app/").catch(() => {})
}

function goFramework() {
  dialogs.closeAbout()
  void router.push("/framework")
}
</script>

<template>
	<Dialog :open="dialogs.aboutOpen" @update:open="(v: boolean) => v ? dialogs.openAbout() : dialogs.closeAbout()">
		<DialogContent class="sm:max-w-md">
			<div class="flex flex-col items-center gap-1 pt-2 text-center">
				<DialogTitle class="text-lg">{{ title }}</DialogTitle>
				<p class="text-muted-foreground text-xs">
					{{ i18n.t("About.tagline") }}
				</p>
			</div>

			<dl class="divide-border mt-2 divide-y overflow-hidden rounded-lg border border-border/60">
				<div
					v-for="row in rows"
					:key="row.label"
					class="bg-muted/30 flex items-baseline gap-4 px-3 py-2"
				>
					<dt class="text-muted-foreground w-24 shrink-0 text-xs">
						{{ row.label }}
					</dt>
					<dd class="min-w-0 flex-1 truncate font-mono text-xs">
						{{ row.value }}
					</dd>
				</div>
			</dl>

			<p class="text-muted-foreground text-center text-xs">
				{{ i18n.t("About.copyright") }}
			</p>

			<div class="flex items-center justify-between gap-2">
				<Button
					variant="ghost"
					size="sm"
					class="text-muted-foreground"
					@click="goFramework"
				>
					<Info class="icon-md" />
					{{ i18n.t("Titlebar.menu.about.framework") }}
				</Button>
				<Button variant="outline" size="sm" @click="openWebsite">
					{{ i18n.t("About.website") }}
					<ExternalLink class="icon-md" />
				</Button>
			</div>
		</DialogContent>
	</Dialog>
</template>
