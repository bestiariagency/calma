<script setup>
import IconWhatsApp from './IconWhatsApp.vue'

defineProps({
  label: { type: String, required: true },
  size:  { type: String, default: 'md' }, // 'sm' | 'md'
  wa:    { type: Boolean, default: false },
})
</script>

<template>
  <button class="btn" :class="`btn--${size}`">
    <IconWhatsApp v-if="wa" />
    {{ label }}
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--c-accent);
  color: var(--c-mid);
  font-family: var(--font);
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 2px;
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
  white-space: nowrap;
}
.btn:hover { opacity: 0.85; }

.btn--sm { padding: 14px 36px; font-size: 12px; }
.btn--md { padding: 16px 44px; font-size: 15px; }
</style>
