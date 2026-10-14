<script setup lang="ts">
import { DialogTitle, type DialogTitleProps, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<DialogTitleProps, 'class'> & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogTitle
    v-bind="forwarded"
    :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
  >
    <slot />
  </DialogTitle>
</template>
