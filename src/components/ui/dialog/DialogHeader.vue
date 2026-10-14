<script setup lang="ts">
import { DialogTitle, type DialogTitleProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<DialogTitleProps & { class?: string }>()
</script>

<template>
  <div :class="cn('flex flex-col gap-1.5 text-center sm:text-left', $attrs.class)">
    <DialogTitle
      v-bind="props"
      :class="cn('text-lg font-semibold leading-none tracking-tight', props.class)"
    >
      <slot />
    </DialogTitle>
    <slot name="description" />
  </div>
</template>
