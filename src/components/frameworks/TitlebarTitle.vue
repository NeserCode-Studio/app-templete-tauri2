<script setup lang="ts">
import { useTitleStore } from "@/store/title"
import { computed } from "vue"

const titleStore = useTitleStore()
const title = computed(() => titleStore.title)
</script>

<template>
	<span class="text-sm font-medium select-none">{{ title }}</span>
</template>
