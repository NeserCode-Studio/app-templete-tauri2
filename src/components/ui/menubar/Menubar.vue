<script setup lang="ts">
import { MenubarRoot, type MenubarRootEmits, type MenubarRootProps, useForwardPropsEmits } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<MenubarRootProps, 'class'> & { class?: string }>()
const emits = defineEmits<MenubarRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <MenubarRoot
    v-bind="forwarded"
    :class="cn('bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-sm', props.class)"
  >
    <slot />
  </MenubarRoot>
</template>
