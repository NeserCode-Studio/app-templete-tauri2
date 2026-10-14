<script setup lang="ts">
import { cn } from "@/lib/utils"
</script>

<template>
  <span :class="cn('text-muted-foreground ml-auto text-xs tracking-widest', $attrs.class)">
    <slot />
  </span>
</template>
