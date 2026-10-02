<script setup>
import { ChevronDown } from 'lucide-vue-next'
import { CONTROL_BASE } from './controlStyles.js'

// <select> nativo estilizado (spec 3.24): mejor a11y y táctil que un listbox propio.
defineProps({
  label: { type: String, required: true }, // nombre accesible (sin label visible)
  options: { type: Array, required: true }, // [{ value, label }]
})
const model = defineModel({ type: String, default: '' })
</script>

<template>
  <div class="relative w-full sm:w-56">
    <select
      v-model="model"
      :aria-label="label"
      :class="[CONTROL_BASE, 'h-10 appearance-none pr-9 text-sm pointer-coarse:h-11 max-md:text-base']"
    >
      <option v-for="option in options" :key="option.value" :value="option.value" class="bg-surface-3 text-text">
        {{ option.label }}
      </option>
    </select>
    <ChevronDown :size="16" class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-text-2" aria-hidden="true" />
  </div>
</template>
