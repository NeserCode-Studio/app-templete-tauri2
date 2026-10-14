<script setup lang="ts">
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const props = defineProps<{
  type: "text" | "email" | "password" | "number"
  value?: string
  placeholder?: string
  submit?: string
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
				<Input
					:type="props.type"
					:placeholder="props.placeholder"
					:default-value="props.value"
					name="input"
					class="flex-1"
				/>
				<Button type="submit" size="sm">
					{{ props.submit ?? "Submit" }}
				</Button>
			</div>
		</div>
	</form>
</template>
