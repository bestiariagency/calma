<script setup>
defineProps({
  marker:      { type: String, default: '—' },
  title:       { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <div class="flex gap-6 py-5">
    <span class="shrink-0 text-[14px] text-accent">{{ marker }}</span>
    <div class="flex flex-col gap-1">
      <p class="text-[18px] font-bold text-text">{{ title }}</p>
      <p class="text-[14px] leading-[1.6] text-muted">{{ description }}</p>
    </div>
  </div>
</template>
