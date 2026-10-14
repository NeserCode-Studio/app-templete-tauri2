<script setup lang="ts">
import { ListboxRoot, type ListboxRootEmits, type ListboxRootProps, useFilter, useForwardPropsEmits } from "reka-ui"
import { reactiveOmit } from "@vueuse/core"
import { computed, provide, ref } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<ListboxRootProps, 'class'> & { class?: string }>()
const emits = defineEmits<ListboxRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)

const searchTerm = ref("")
const { contains } = useFilter({ sensitivity: "base" })
const allItems = ref(new Map<string, string>())
const allGroups = ref(new Map<string, Set<string>>())

const filteredCount = computed(() => {
  if (!searchTerm.value) return allItems.value.size
  let count = 0
  for (const [value] of allItems.value) {
    if (contains(value, searchTerm.value)) count++
  }
  return count
})

provide("command", {
  searchTerm,
  allItems,
  allGroups,
  filteredCount,
})
</script>

<template>
  <ListboxRoot
    data-slot="command"
    v-bind="forwarded"
    :class="cn('bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md', props.class)"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <slot />
  </ListboxRoot>
</template>
