<script setup lang="ts">
import { TabsContent, type TabsContentProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<TabsContentProps & { class?: string }>()
</script>

<template>
  <TabsContent
    v-bind="$attrs"
    :value="props.value"
    :class="cn('ring-offset-background focus-visible:ring-ring mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2', props.class)"
  >
    <slot />
  </TabsContent>
</template>
