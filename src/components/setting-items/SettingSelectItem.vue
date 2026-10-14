<script setup lang="ts">
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select"

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

const selected = defineModel<string>()

function onSubmit(e: Event) {
  e.preventDefault()
  const data = new FormData(e.target as HTMLFormElement)
  /* reka-ui Select 不走原生 form，把当前选中值注入 FormData */
  data.set("select", selected.value ?? "")
  emit("submit", data)
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
				<Select v-model="selected" name="select">
					<SelectTrigger class="flex-1">
						<SelectValue
							:placeholder="props.placeholder ?? 'Select one'"
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel v-if="props.label">
								{{ props.label }}
							</SelectLabel>
							<SelectItem
								v-for="item in props.items"
								:key="item.value"
								:value="item.value"
							>
								{{ item.label }}
							</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
				<Button type="submit" size="sm">
					{{ props.submit ?? "Submit" }}
				</Button>
			</div>
		</div>
	</form>
</template>
