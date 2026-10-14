<script setup lang="ts">
import { ref, computed, watch, onMounted, onScopeDispose } from "vue"
import { useRouter } from "vue-router"
import { Home, Settings, RefreshCcw, Sparkles } from "@lucide/vue"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { useI18nStore, useThemeStore, useDialogStore } from "@/store"
import { useSuperCommand } from "@/composables/useSuperCommand"
import { createLogger } from "@/lib/logger"

const log = createLogger("CommandMenu")

const SUPER_PREFIX = "@super"

interface CommonItem {
  value: string
  icon: unknown
  label: string
  shortcut?: string
  keywords: string[]
}

const i18n = useI18nStore()
const theme = useThemeStore()
const dialogs = useDialogStore()
const router = useRouter()

const open = ref(false)
const search = ref("")

const superCmd = useSuperCommand({
  navigate: (path) => void router.push(path),
  setLang: (lang) => i18n.setLanguage(lang as never),
  setTheme: (t) => theme.setThemeMode(t),
  openSettings: () => dialogs.openSettings(),
})

/* ── Super 模式判定 ─────────────────────────── */
const isSuperMode = computed(() => search.value.startsWith(SUPER_PREFIX + " "))
const superQuery = computed(() =>
  isSuperMode.value
    ? search.value.slice(SUPER_PREFIX.length + 1).trim().toLowerCase()
    : ""
)
const superResults = computed(() => {
  if (!isSuperMode.value) return []
  const q = superQuery.value
  if (!q) return [...superCmd.commands]
  return superCmd.commands.filter(
    (cmd) =>
      cmd.id.toLowerCase().includes(q) ||
      cmd.keywords.some((k) => k.toLowerCase().includes(q))
  )
})

/* ── 普通命令 ───────────────────────────────── */
const commonItems: CommonItem[] = [
  {
    value: "navigate::/",
    icon: Home,
    label: i18n.t("Command.turnto.home"),
    shortcut: "⌘H",
    keywords: ["home", "index", "首页", "主页"],
  },
  {
    value: "settings::open",
    icon: Settings,
    label: i18n.t("Command.turnto.settings"),
    shortcut: "⌘S",
    keywords: ["settings", "设置", "配置", "选项", "preferences"],
  },
  {
    value: "reload",
    icon: RefreshCcw,
    label: i18n.t("Command.suggestions.reload"),
    keywords: ["reload", "refresh", "重新加载", "刷新"],
  },
]

/* ── 命令选择 ───────────────────────────────── */
function handleSelect(command: string) {
  if (isSuperMode.value) {
    if (superResults.value.length === 1) {
      void superCmd.execute(superResults.value[0].id)
    }
    open.value = false
    search.value = ""
    return
  }

  const [symbol, value] = command.split("::")

  if (symbol === "navigate") {
    void router.push(value)
  } else if (symbol === "settings") {
    dialogs.openSettings()
  } else if (symbol === "reload") {
    void router.push("/")
    window.location.reload()
  } else if (symbol === "super") {
    const item = superCmd.commands.find((c) => c.id === value)
    if (!item) return
    void superCmd.execute(item.id)
  }

  open.value = false
  search.value = ""
}

function openShortcut(e: KeyboardEvent) {
  if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
    e.preventDefault()
    open.value = !open.value
    search.value = ""
  }
}

onMounted(() => {
  document.addEventListener("keydown", openShortcut)

  /* 标题栏「编辑 > 查找」通过自定义事件打开命令面板 */
  window.addEventListener("app:open-command-palette", paletteHandler)
})
onScopeDispose(() => {
  document.removeEventListener("keydown", openShortcut)
  window.removeEventListener("app:open-command-palette", paletteHandler)
})

function paletteHandler() {
  open.value = true
  search.value = ""
}

watch(open, (v) => log.debug("open", v))
</script>

<template>
	<CommandDialog :open="open" @update:open="open = $event">
		<CommandInput
			v-model="search"
			:placeholder="i18n.t('Command.placeholder')"
		/>
		<CommandList>
			<template v-if="isSuperMode">
				<CommandEmpty>{{ i18n.t("Command.super.empty") }}</CommandEmpty>
				<CommandGroup :heading="i18n.t('Command.super.heading')">
					<CommandItem
						:value="search"
						@select="() => handleSelect('')"
					>
						<Sparkles class="icon-md mr-2" />
						<span>{{ SUPER_PREFIX }}</span>
					</CommandItem>
				</CommandGroup>
			</template>
			<template v-else>
				<CommandEmpty>{{ i18n.t("Command.notFound") }}</CommandEmpty>
				<CommandGroup :heading="i18n.t('Command.suggestions')">
					<CommandItem
						v-for="item in commonItems"
						:key="item.value"
						:value="item.value"
						:keywords="item.keywords"
						@select="() => handleSelect(item.value)"
					>
						<component :is="item.icon" class="icon-md mr-2" />
						<span class="flex-1">{{ item.label }}</span>
						<CommandShortcut v-if="item.shortcut">{{ item.shortcut }}</CommandShortcut>
					</CommandItem>
				</CommandGroup>
			</template>
		</CommandList>
	</CommandDialog>
</template>
