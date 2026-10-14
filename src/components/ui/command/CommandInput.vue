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
const command = inject<{ searchTerm: import("vue").Ref<string> }>("command")!
</script>

<template>
  <div data-slot="command-input-wrapper" class="flex h-9 items-center gap-2 border-b px-3">
    <Search class="size-4 shrink-0 opacity-50" />
    <ListboxFilter
      :model-value="command.searchTerm.value"
      @update:model-value="command.searchTerm.value = $event"
      data-slot="command-input"
      auto-focus
      :class="cn('placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50', props.class)"
      :placeholder="props.placeholder"
    />
  </div>
</template>
