<script lang="ts" setup>
import { useI18nStore } from "@/store/i18n";
const i18n = useI18nStore();
</script>

<template>
  <div class="view transition-colors duration-100">
    <div class="view-home">
      <h1 class="view-title">{{ i18n.t("Home.title") }}</h1>
    </div>
  </div>
</template>
