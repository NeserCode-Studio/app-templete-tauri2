<script setup lang="ts">
import { MenubarPortal, MenubarContent, type MenubarContentProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<Omit<MenubarContentProps, 'class'> & { class?: string }>(), {
  sideOffset: 4,
  align: "start",
})
</script>

<template>
  <MenubarPortal>
    <MenubarContent
      v-bind="$attrs"
      :side-offset="props.sideOffset"
      :align="props.align"
      :class="cn('bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 z-50 min-w-48 overflow-hidden rounded-md border p-1 shadow-md', props.class)"
    >
      <slot />
    </MenubarContent>
  </MenubarPortal>
</template>
