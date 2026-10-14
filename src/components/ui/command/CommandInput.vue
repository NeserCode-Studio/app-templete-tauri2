<script setup lang="ts">
import { ListboxFilter } from "reka-ui"
import { Search } from "@lucide/vue"
import { inject } from "vue"
import { cn } from "@/lib/utils"
import type { ClassValue } from "clsx"

interface Props {
  class?: ClassValue
  placeholder?: string
}

const props = defineProps<Props>()

/* 受控值：外部 v-model 优先；未传时回退到 Command 注入的 searchTerm */
const model = defineModel<string>()

const command = inject<{ searchTerm: import("vue").Ref<string> } | null>("command", null)

if (model.value === undefined && command) {
  model.value = command.searchTerm.value
}

function onInput(e: Event) {
  model.value = (e.target as HTMLInputElement).value
}
</script>

<template>
  <div data-slot="command-input-wrapper" class="flex h-12 items-center gap-2 border-b px-3">
    <Search class="size-5 shrink-0 opacity-50" />
    <ListboxFilter
      :model-value="model ?? ''"
      @update:model-value="model = $event"
      @input="onInput"
      data-slot="command-input"
      auto-focus
      :class="cn('placeholder:text-muted-foreground flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50', props.class)"
      :placeholder="props.placeholder"
    />
  </div>
</template>
