<script setup lang="ts">
import { SelectTrigger, SelectIcon, type SelectTriggerProps } from "reka-ui"
import { ChevronDown } from "@lucide/vue"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<SelectTriggerProps, 'class'> & { class?: string }>()
</script>

<template>
  <SelectTrigger
    v-bind="$attrs"
    :class="cn(
      'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
      props.class
    )"
  >
    <slot />
    <SelectIcon as-child>
      <ChevronDown class="h-4 w-4 opacity-50" />
    </SelectIcon>
  </SelectTrigger>
</template>
