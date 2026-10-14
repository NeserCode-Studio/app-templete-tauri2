<script setup lang="ts">
import { MenubarItem, type MenubarItemEmits, type MenubarItemProps, useForwardPropsEmits } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<MenubarItemProps, 'class'> & {
  class?: string
  inset?: boolean
}>()
const emits = defineEmits<MenubarItemEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <MenubarItem
    v-bind="forwarded"
    :class="cn('focus:bg-accent focus:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', props.inset && 'pl-8', props.class)"
  >
    <slot />
  </MenubarItem>
</template>
