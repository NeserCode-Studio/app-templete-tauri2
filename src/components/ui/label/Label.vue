<script setup lang="ts">
import { Label as LabelPrimitive, type LabelProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<LabelProps, 'class'> & { class?: string }>()
</script>

<template>
  <LabelPrimitive
    v-bind="$attrs"
    :for="props.for"
    :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)"
  >
    <slot />
  </LabelPrimitive>
</template>
