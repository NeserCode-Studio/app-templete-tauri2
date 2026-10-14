<script setup lang="ts">
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const props = defineProps<{
  label: string
  id: string
  value?: boolean
  title?: string
  description?: string
}>()

const emit = defineEmits<{ (e: "change", value: boolean): void }>()

const model = defineModel<boolean>({ default: false })

function onChange(v: boolean) {
  model.value = v
  emit("change", v)
}
</script>

<template>
	<div
		class="group stack-3 hover:border-border hover:bg-accent/30 rounded-xl border border-border/60 bg-card p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-6"
	>
		<div class="flex min-w-0 flex-col gap-1">
			<span v-if="props.title" class="text-sm leading-tight font-medium">{{ props.title }}</span>
			<span v-if="props.description" class="text-muted-foreground text-xs leading-relaxed">{{ props.description }}</span>
		</div>
		<div class="flex shrink-0 items-center gap-2 sm:w-[22rem] sm:justify-end">
			<Switch :id="props.id" :model-value="model" @update:model-value="onChange" />
			<Label :for="props.id" class="cursor-pointer text-sm font-normal">
				{{ props.label }}
			</Label>
		</div>
	</div>
</template>
