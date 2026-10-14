<script setup lang="ts">
import { TooltipContent, type TooltipContentProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<Omit<TooltipContentProps, 'class'> & { class?: string, sideOffset?: number }>(), {
  sideOffset: 4,
})
</script>

<template>
  <TooltipContent
    v-bind="$attrs"
    :side-offset="props.sideOffset"
    :class="cn('bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 z-50 overflow-hidden rounded-md border px-3 py-1.5 text-xs', props.class)"
  >
    <slot />
  </TooltipContent>
</template>
