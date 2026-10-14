<script setup lang="ts">
import { SelectItem, SelectItemText, SelectItemIndicator, type SelectItemProps } from "reka-ui"
import { Check } from "@lucide/vue"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<SelectItemProps, 'class'> & { class?: string }>()
</script>

<template>
  <SelectItem
    v-bind="$attrs"
    :value="props.value"
    :disabled="props.disabled"
    :class="cn(
      'focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      props.class
    )"
  >
    <span class="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicator>
        <Check class="h-4 w-4" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
