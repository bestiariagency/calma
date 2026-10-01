<script setup>
defineProps({
  number:      { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <div class="flex w-[290px] shrink-0 flex-col gap-[14px] rounded-[4px] border border-b-deep bg-dark p-6">
    <span class="text-[12px] font-bold tracking-[3px] text-accent">{{ number }}</span>
    <p class="text-[18px] leading-[1.1] font-extrabold text-text">{{ title }}</p>
    <p class="text-[14px] leading-[1.5] text-muted">{{ description }}</p>
  </div>
</template>
