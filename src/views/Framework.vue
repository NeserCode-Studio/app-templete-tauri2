<script setup lang="ts">
import { useI18nStore } from "@/store/i18n"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ExternalLink } from "@lucide/vue"
import { useRouter } from "vue-router"

const TECH_KEYS = [
  "vite",
  "react",
  "typescript",
  "tailwind",
  "tauri",
  "radix",
  "react-router",
  "zod",
  "ahooks",
] as const

const i18n = useI18nStore()
const router = useRouter()
</script>

<template>
	<div class="view-framework">
		<div class="mb-6 flex flex-row items-start justify-between gap-4">
			<div class="flex min-w-0 flex-col">
				<h1 class="text-foreground mb-2 text-2xl font-bold">
					{{ i18n.t("Framework.title") }}
				</h1>
				<p class="text-muted-foreground text-sm">
					{{ i18n.t("Framework.intro") }}
				</p>
			</div>
			<Button
				variant="outline"
				size="sm"
				class="shrink-0"
				@click="() => router.push('/')"
			>
				<ArrowLeft class="icon-md" />
				{{ i18n.t("Command.turnto.home") }}
			</Button>
		</div>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<a
				v-for="key in TECH_KEYS"
				:key="key"
				:href="i18n.t(`Framework.card.${key}.url`)"
				target="_blank"
				rel="noopener noreferrer"
				class="hover:border-primary/50 hover:shadow-md flex flex-row items-center gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground no-underline transition-all duration-150 ease-in-out"
			>
				<div class="flex min-w-0 flex-col gap-0.5">
					<span class="text-card-foreground flex items-center gap-1 text-sm font-semibold">
						{{ i18n.t(`Framework.card.${key}.name`) }}
						<ExternalLink class="text-muted-foreground h-3 w-3" />
					</span>
					<span class="text-muted-foreground text-xs leading-snug">
						{{ i18n.t(`Framework.card.${key}.description`) }}
					</span>
				</div>
			</a>
		</div>
	</div>
</template>
