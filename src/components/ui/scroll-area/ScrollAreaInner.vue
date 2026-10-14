<script setup lang="ts">
import { ScrollAreaViewport, ScrollAreaScrollbar, ScrollAreaThumb } from "reka-ui"
</script>

<template>
  <ScrollAreaViewport class="size-full rounded-[inherit]">
    <slot />
  </ScrollAreaViewport>
  <ScrollAreaScrollbar
    orientation="vertical"
    class="flex w-2.5 touch-none select-none border-l border-l-transparent p-[1px] transition-colors"
  >
    <ScrollAreaThumb class="bg-border relative flex-1 rounded-full" />
  </ScrollAreaScrollbar>
</template>
