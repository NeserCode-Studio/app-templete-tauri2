<script setup lang="ts">
import { MenubarSeparator, type MenubarSeparatorProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<MenubarSeparatorProps, 'class'> & { class?: string }>()
</script>

<template>
  <MenubarSeparator :class="cn('bg-muted -mx-1 my-1 h-px', props.class)" />
</template>
