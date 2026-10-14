<script setup lang="ts">
import { computed, inject } from "vue"
import { cn } from "@/lib/utils"

const command = inject<{ filteredCount: import("vue").ComputedRef<number> }>("command")

const show = computed(() => (command ? command.filteredCount.value === 0 : false))
</script>

<template>
  <div
    v-show="show"
    data-slot="command-empty"
    :class="cn('py-6 text-center text-sm', $attrs.class)"
  >
    <slot />
  </div>
</template>
