<script setup>
import { LoaderCircle } from 'lucide-vue-next'
import { adminUiText } from '../../../data/adminUiText.js'

const SIZES = { 14: 'size-3.5', 16: 'size-4', 24: 'size-6 text-text-2' }

defineProps({
  size: { type: Number, default: 16, validator: v => [14, 16, 24].includes(v) },
  // Texto accesible; solo se anuncia dentro de una región role="status"/aria-busy.
  label: { type: String, default: '' },
})
</script>

<template>
  <span class="inline-flex items-center">
    <LoaderCircle :class="[SIZES[size], 'animate-spin motion-reduce:animate-pulse']" aria-hidden="true" />
    <span class="sr-only">{{ label || adminUiText.loading }}</span>
  </span>
</template>
