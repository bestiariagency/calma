<script setup>
defineProps({
  marker:      { type: String, default: '—' },
  title:       { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <div class="fi">
    <span class="fi__marker">{{ marker }}</span>
    <div class="fi__body">
      <p class="fi__title">{{ title }}</p>
      <p class="fi__desc">{{ description }}</p>
    </div>
  </div>
</template>

<style scoped>
.fi {
  display: flex;
  gap: 24px;
  padding: 20px 0;
}
.fi__marker { font-size: 14px; color: var(--c-accent); flex-shrink: 0; }
.fi__body   { display: flex; flex-direction: column; gap: 4px; }
.fi__title  { font-size: 18px; font-weight: 700; color: var(--c-text); }
.fi__desc   { font-size: 14px; color: var(--c-muted); line-height: 1.6; }
</style>
