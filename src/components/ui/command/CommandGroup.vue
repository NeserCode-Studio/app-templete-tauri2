<script setup lang="ts">
import { ListboxGroup, ListboxGroupLabel, useForwardProps, type ListboxGroupProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<ListboxGroupProps, 'class'> & { class?: string, heading?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <ListboxGroup
    v-bind="forwarded"
    data-slot="command-group"
    :class="cn('text-foreground overflow-hidden p-1', props.class)"
  >
    <ListboxGroupLabel v-if="props.heading" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {{ props.heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
