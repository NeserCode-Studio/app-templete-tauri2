<script lang="ts" setup>
import { useI18nStore } from "@/store/i18n"
const i18n = useI18nStore()
</script>

<template>
	<div class="view">
		<div class="view-framework">
			<h1 class="view-title">{{ i18n.t("Framework.title") }}</h1>
		</div>
	</div>
</template>
