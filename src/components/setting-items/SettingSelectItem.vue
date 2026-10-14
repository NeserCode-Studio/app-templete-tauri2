<script setup lang="ts">
import { Button } from "@/components/ui/button"

const props = defineProps<{
  items: { value: string; label: string }[]
  value?: { value: string; label: string }
  placeholder?: string
  submit?: string
  label?: string
  title?: string
  description?: string
}>()

const emit = defineEmits<{ (e: "submit", data: FormData): void }>()

function onSubmit(e: Event) {
  e.preventDefault()
  emit("submit", new FormData(e.target as HTMLFormElement))
}
</script>

<template>
	<form @submit="onSubmit">
		<div
			class="group stack-3 hover:border-border hover:bg-accent/30 rounded-xl border border-border/60 bg-card p-4 transition-colors sm:flex-row sm:items-center sm:justify-between sm:gap-6"
		>
			<div class="flex min-w-0 flex-col gap-1">
				<span v-if="props.title" class="text-sm leading-tight font-medium">{{ props.title }}</span>
				<span v-if="props.description" class="text-muted-foreground text-xs leading-relaxed">{{ props.description }}</span>
			</div>
			<div class="flex shrink-0 items-center gap-2 sm:w-[22rem] sm:justify-end">
				<select
					name="select"
					:value="props.value?.value"
					class="border-input bg-background focus-visible:ring-ring flex h-9 w-full flex-1 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1"
				>
					<option v-if="props.placeholder" value="" disabled>{{ props.placeholder }}</option>
					<option v-for="item in props.items" :key="item.value" :value="item.value">
						{{ item.label }}
					</option>
				</select>
				<Button type="submit" size="sm">
					{{ props.submit ?? "Submit" }}
				</Button>
			</div>
		</div>
	</form>
</template>
