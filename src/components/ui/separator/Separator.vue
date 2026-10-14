<script setup lang="ts">
import { Separator as SeparatorPrimitive, type SeparatorProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(
  defineProps<Omit<SeparatorProps, 'class'> & { class?: string, orientation?: "horizontal" | "vertical", decorative?: boolean }>(),
  { orientation: "horizontal", decorative: true }
)
</script>

<template>
  <SeparatorPrimitive
    :orientation="props.orientation"
    :decorative="props.decorative"
    :class="
      cn(
        'bg-border shrink-0',
        props.orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]',
        props.class
      )
    "
  />
</template>
