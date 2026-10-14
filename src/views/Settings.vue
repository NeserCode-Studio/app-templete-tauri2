<script setup lang="ts">
import { ref, computed } from "vue"
import { useLocalStorage } from "@vueuse/core"
import { useI18nStore, useTitleStore } from "@/store"
import { useToast } from "@/composables/useToast"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SettingInputItem, SettingSelectItem, SettingOptionalItem } from "@/components/setting-items"
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Search,
  Settings2,
  Trash2,
} from "@lucide/vue"

/** 设置项索引：供搜索与「最近修改」跳转使用 */
interface SettingIndexItem {
  id: string
  group: string
  labelKey: string
  keywords: string[]
}

const SETTING_INDEX: SettingIndexItem[] = [
  {
    id: "title",
    group: "general",
    labelKey: "Settings.items.title.title",
    keywords: ["title", "window", "标题", "窗口"],
  },
  {
    id: "lang",
    group: "general",
    labelKey: "Settings.items.lang.title",
    keywords: ["lang", "language", "i18n", "语言"],
  },
  {
    id: "auto-complete",
    group: "general",
    labelKey: "Settings.items.auto-complete.title",
    keywords: ["auto", "complete", "自动补全", "补全"],
  },
]

interface ChangedRecord {
  id: string
  label: string
  group: string
  at: number
}

const MAX_HISTORY = 8

const i18n = useI18nStore()
const titleStore = useTitleStore()
const { success, error } = useToast({ duration: 2000 })

/* 搜索历史 + 修改记录（localStorage 持久化） */
const searchHistory = useLocalStorage<string[]>("settings-search-history", [])
const changedRecords = useLocalStorage<ChangedRecord[]>(
  "settings-changed-history",
  []
)

/* 搜索状态 */
const query = ref("")
const activeTab = ref("search")
const autoComplete = useLocalStorage("use-auto-complete", true)

function recordChange(id: string, labelKey: string) {
  const meta = SETTING_INDEX.find((item) => item.id === id)
  const record: ChangedRecord = {
    id,
    label: i18n.t(labelKey),
    group: meta?.group ?? "general",
    at: Date.now(),
  }
  changedRecords.value = [
    record,
    ...changedRecords.value.filter((r) => r.id !== id),
  ].slice(0, MAX_HISTORY)
}

function recordSearch(term: string) {
  const s = term.trim()
  if (!s) return
  searchHistory.value = [
    s,
    ...searchHistory.value.filter((x) => x !== s),
  ].slice(0, MAX_HISTORY)
}

function clearHistory() {
  searchHistory.value = []
  changedRecords.value = []
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return SETTING_INDEX.filter((item) => {
    const label = i18n.t(item.labelKey).toLowerCase()
    return (
      label.includes(q) ||
      item.keywords.some((k) => k.toLowerCase().includes(q))
    )
  })
})

function jumpTo(group: string) {
  activeTab.value = group
  query.value = ""
}

/* setting title item */
function titleAction(data: FormData) {
  const value = data.get("input")
  if (!value || value === titleStore.title)
    return error(i18n.t("Settings.items.title.error"))
  titleStore.setTitle(value as string)
  recordChange("title", "Settings.items.title.title")
  success(i18n.t("Settings.items.title.success"))
}

/* setting lang item */
const langItems = [
  { value: "en-US", label: "English(US)" },
  { value: "zh-CN", label: "简体中文" },
]
function langAction(data: FormData) {
  const value = data.get("select")
  if (!value || value === i18n.lang)
    return error(i18n.t("Settings.items.lang.error"))

  i18n.setLanguage(value as never)
  recordChange("lang", "Settings.items.lang.title")
  success(i18n.t("Settings.items.lang.success"))
}

/* setting auto-complete item */
function autoCompleteAction(checked: boolean) {
  autoComplete.value = checked
  recordChange("auto-complete", "Settings.items.auto-complete.title")
  success(i18n.t("Settings.items.auto-complete.success"))
}
</script>

<template>
	<div class="view-settings">
		<Tabs v-model="activeTab" class="w-full">
			<TabsList class="w-full justify-start gap-1 rounded-xl bg-muted/50 p-1">
				<TabsTrigger value="search" class="flex-none gap-1.5 rounded-lg">
					<Search class="icon-md" />
					{{ i18n.t("Settings.tabs.search") }}
				</TabsTrigger>
				<TabsTrigger value="general" class="flex-none gap-1.5 rounded-lg">
					<Settings2 class="icon-md" />
					{{ i18n.t("Settings.tabs.general") }}
				</TabsTrigger>
			</TabsList>

			<TabsContent value="search" class="mt-5">
				<div class="stack-5">
					<p class="text-muted-sm">
						{{ i18n.t("Settings.search.description") }}
					</p>
					<div class="relative">
						<Search class="text-muted-foreground pointer-events-none absolute left-3 top-1/2 icon-md -translate-y-1/2" />
						<Input
							v-model="query"
							@keydown="(e: KeyboardEvent) => { if (e.key === 'Enter') recordSearch(query) }"
							:placeholder="i18n.t('Settings.search.placeholder')"
							class="bg-muted/40 h-10 rounded-lg pl-9"
						/>
					</div>

					<template v-if="query.trim()">
						<div class="stack-1">
							<template v-if="results.length">
								<button
									v-for="r in results"
									:key="r.id"
									type="button"
									class="group hover:border-border hover:bg-accent/50 hover:text-accent-foreground flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-left text-sm transition-colors"
									@click="() => { recordSearch(query); jumpTo(r.group) }"
								>
									<Search class="icon-action" />
									<span class="truncate">{{ i18n.t(r.labelKey) }}</span>
									<ChevronRight class="text-muted-foreground/50 icon-sm ml-auto shrink-0 transition-transform group-hover:translate-x-0.5" />
								</button>
							</template>
							<div v-else class="text-muted-sm rounded-lg border border-dashed border-border px-3 py-6 text-center">
								{{ i18n.t("Settings.search.empty") }}
							</div>
						</div>
					</template>
					<div v-else class="stack-5">
						<template v-if="searchHistory.length || changedRecords.length">
							<div v-if="searchHistory.length" class="stack-2">
								<div class="row-label">
									<Clock class="icon-sm" />
									{{ i18n.t("Settings.search.history") }}
								</div>
								<div class="flex flex-wrap gap-1.5">
									<button
										v-for="s in searchHistory"
										:key="s"
										type="button"
										class="hover:border-primary/40 hover:bg-accent hover:text-accent-foreground rounded-full border border-border/60 bg-muted/60 px-2.5 py-1 text-xs transition-colors"
										@click="query = s"
									>
										{{ s }}
									</button>
								</div>
							</div>

							<div v-if="changedRecords.length" class="stack-2">
								<div class="row-label">
									<History class="icon-sm" />
									{{ i18n.t("Settings.search.changed") }}
								</div>
								<div class="stack-1">
									<button
										v-for="r in changedRecords"
										:key="r.id"
										type="button"
										class="group hover:bg-accent/50 hover:text-accent-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors"
										@click="jumpTo(r.group)"
									>
										<CheckCircle2 class="icon-action" />
										<span class="truncate">{{ r.label }}</span>
									</button>
								</div>
							</div>

							<Button
								type="button"
								variant="ghost"
								size="sm"
								class="text-muted-foreground self-start"
								@click="clearHistory"
							>
								<Trash2 class="icon-md" />
								{{ i18n.t("Settings.search.clear") }}
							</Button>
						</template>
						<div v-else class="text-muted-sm flex flex-col items-center gap-2 rounded-lg border border-dashed border-border px-3 py-10 text-center">
							<Search class="text-muted-foreground/60 h-5 w-5" />
							<p>{{ i18n.t("Settings.search.noHistory") }}</p>
						</div>
					</div>
				</div>
			</TabsContent>

			<TabsContent value="general" class="mt-5">
				<div class="flex flex-col gap-4">
					<p class="text-muted-sm">
						{{ i18n.t("Settings.general.description") }}
					</p>
					<SettingInputItem
						type="text"
						:value="titleStore.title"
						:placeholder="i18n.t('Settings.items.title.placeholder')"
						:title="i18n.t('Settings.items.title.title')"
						:description="i18n.t('Settings.items.title.description')"
						:on-item-submit="titleAction"
					/>
					<SettingSelectItem
						:items="langItems"
						:value="langItems.find((i) => i.value === i18n.lang)"
						:label="i18n.t('Settings.items.lang.label')"
						:placeholder="i18n.t('Settings.items.select.default.placeholder')"
						:title="i18n.t('Settings.items.lang.title')"
						:description="i18n.t('Settings.items.lang.description')"
						:on-item-submit="langAction"
					/>
					<SettingOptionalItem
						:label="i18n.t('Settings.items.auto-complete.label')"
						:value="autoComplete"
						id="optional.auto-complete"
						:title="i18n.t('Settings.items.auto-complete.title')"
						:description="i18n.t('Settings.items.auto-complete.description')"
						:on-item-change="autoCompleteAction"
					/>
				</div>
			</TabsContent>
		</Tabs>
	</div>
</template>
