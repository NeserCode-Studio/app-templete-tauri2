<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<DialogDescriptionProps, 'class'> & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <DialogDescription
    v-bind="forwarded"
    :class="cn('text-muted-foreground text-sm', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
