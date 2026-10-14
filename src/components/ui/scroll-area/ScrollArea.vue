<script setup lang="ts">
import { ScrollAreaRoot, type ScrollAreaRootProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<ScrollAreaRootProps, 'class'> & { class?: string }>()
</script>

<template>
  <ScrollAreaRoot v-bind="$attrs" :class="cn('relative overflow-hidden', props.class)">
    <slot />
  </ScrollAreaRoot>
</template>
