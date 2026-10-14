<script setup lang="ts">
import { TabsList, type TabsListProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<TabsListProps, 'class'> & { class?: string }>()
</script>

<template>
  <TabsList
    v-bind="$attrs"
    :class="cn('bg-muted text-muted-foreground inline-flex h-9 items-center justify-center rounded-lg p-1', props.class)"
  >
    <slot />
  </TabsList>
</template>
