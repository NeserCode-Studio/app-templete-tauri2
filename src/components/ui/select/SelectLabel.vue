<script setup lang="ts">
import { SelectLabel, type SelectLabelProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<SelectLabelProps, 'class'> & { class?: string }>()
</script>

<template>
  <SelectLabel :class="cn('px-2 py-1.5 text-sm font-semibold', props.class)">
    <slot />
  </SelectLabel>
</template>
