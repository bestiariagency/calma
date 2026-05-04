<script setup>
defineProps({
  text: { type: String, required: true },
})
</script>

<template>
  <span class="lbl">{{ text }}</span>
</template>

<style scoped>
.lbl {
  display: block;
  font-family: var(--font);
  font-size: 9px;
  font-weight: 700;
  color: var(--c-accent);
  letter-spacing: 4px;
  text-transform: uppercase;
}
@media (min-width: 768px) {
  .lbl { font-size: 10px; letter-spacing: 5px; }
}
</style>
