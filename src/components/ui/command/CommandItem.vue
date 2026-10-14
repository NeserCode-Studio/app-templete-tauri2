<script setup lang="ts">
import { ListboxItem, type ListboxItemEmits, type ListboxItemProps } from "reka-ui"
import { computed, inject } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<Omit<ListboxItemProps, 'class'> & { class?: string }>()
const emits = defineEmits<ListboxItemEmits>()

const command = inject<{ allItems: import("vue").Ref<Map<string, string>> }>("command")

const localValue = computed(() => String(props.value ?? ""))

if (command) {
  command.allItems.value.set(localValue.value, localValue.value)
}
</script>

<template>
  <ListboxItem
    v-bind="$attrs"
    :value="props.value"
    :disabled="props.disabled"
    :class="cn('data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0', props.class)"
    @select="emits('select', $event)"
  >
    <slot />
  </ListboxItem>
</template>
