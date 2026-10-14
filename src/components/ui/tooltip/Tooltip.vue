<script setup lang="ts">
import { TooltipProvider, TooltipRoot, type TooltipRootEmits, type TooltipRootProps, useForwardPropsEmits } from "reka-ui"

const props = withDefaults(defineProps<TooltipRootProps & { delayDuration?: number }>(), {
  delayDuration: 200,
})
const emits = defineEmits<TooltipRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <TooltipProvider :delay-duration="props.delayDuration">
    <TooltipRoot v-bind="forwarded">
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
