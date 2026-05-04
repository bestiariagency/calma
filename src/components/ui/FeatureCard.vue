<script setup>
defineProps({
  number:      { type: String, required: true },
  title:       { type: String, required: true },
  description: { type: String, required: true },
})
</script>

<template>
  <div class="fc">
    <span class="fc__num">{{ number }}</span>
    <p class="fc__title">{{ title }}</p>
    <p class="fc__desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.fc {
  flex-shrink: 0;
  width: 290px;
  background: var(--c-dark);
  border: 1px solid var(--c-b-deep);
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.fc__num   { font-size: 12px; font-weight: 700; color: var(--c-accent); letter-spacing: 3px; }
.fc__title { font-size: 18px; font-weight: 800; color: var(--c-text); line-height: 1.1; }
.fc__desc  { font-size: 14px; color: var(--c-muted); line-height: 1.5; }
</style>
