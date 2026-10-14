<script setup lang="ts">
import { ListboxContent, type ListboxContentProps, useForwardProps } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<ListboxContentProps, 'class'> & { class?: string }>()
const forwarded = useForwardProps(props)
</script>

<template>
  <ListboxContent
    v-bind="forwarded"
    data-slot="command-list"
    :class="cn('max-h-[400px] scroll-py-1 overflow-x-hidden overflow-y-auto', props.class)"
  >
    <div role="presentation">
      <slot />
    </div>
  </ListboxContent>
</template>
