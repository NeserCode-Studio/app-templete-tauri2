<script setup lang="ts">
import { DialogRoot, type DialogRootEmits, type DialogRootProps, useForwardPropsEmits } from "reka-ui"
import Command from "./Command.vue"
import CommandDialogOverlayContent from "./CommandDialogContent.vue"

const props = defineProps<DialogRootProps>()
const emits = defineEmits<DialogRootEmits>()

const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <DialogRoot v-bind="forwarded">
    <slot />
    <CommandDialogOverlayContent>
      <Command class="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-group]:p-0">
        <slot />
      </Command>
    </CommandDialogOverlayContent>
  </DialogRoot>
</template>
