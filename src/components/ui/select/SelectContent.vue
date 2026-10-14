<script setup lang="ts">
import { SelectPortal, SelectContent, SelectViewport, type SelectContentProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<Omit<SelectContentProps, 'class'> & { class?: string }>(), {
  position: "popper",
  sideOffset: 4,
})
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="$attrs"
      :position="props.position"
      :side-offset="props.sideOffset"
      :class="cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border shadow-md',
        props.position === 'popper' && 'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        props.class
      )"
    >
      <SelectViewport
        :class="cn(
          'p-1',
          props.position === 'popper' && 'h-[var(--reka-select-trigger-height)] w-full min-w-[var(--reka-select-trigger-width)]'
        )"
      >
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>
