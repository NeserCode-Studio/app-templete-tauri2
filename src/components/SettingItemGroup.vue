<script setup lang="ts">
defineProps<{ title: string; description?: string }>()
</script>

<template>
	<section class="stack-3">
		<div class="stack-1">
			<h3 class="text-sm font-semibold tracking-tight">{{ title }}</h3>
			<p v-if="description" class="text-xs text-muted-foreground">{{ description }}</p>
		</div>
		<div class="stack-3">
			<slot />
		</div>
	</section>
</template>
