<script setup>
// Estado vacío (spec 3.21): sin borde propio; dentro de Table/Card. `icon` = componente Lucide.
defineProps({
  icon: { type: [Object, Function], required: true },
  title: { type: String, required: true },
  body: { type: String, default: '' },
})
</script>

<template>
  <div class="mx-auto flex max-w-sm flex-col items-center gap-2 px-6 py-12 text-center">
    <component :is="icon" :size="32" class="text-text-3" aria-hidden="true" />
    <p class="font-mono text-sm/5 font-bold text-text">{{ title }}</p>
    <p v-if="body" class="font-sans text-sm/5 text-text-2">{{ body }}</p>
    <div v-if="$slots.default" class="mt-2"><slot /></div>
  </div>
</template>
