<script setup lang="ts">
import { MenubarTrigger, type MenubarTriggerProps, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<MenubarTriggerProps, 'class'> & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <MenubarTrigger
    v-bind="forwarded"
    :class="cn('focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default select-none items-center rounded-sm px-2 py-1 text-sm font-medium outline-none', props.class)"
  >
    <slot />
  </MenubarTrigger>
</template>
