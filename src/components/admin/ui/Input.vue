<script setup>
import { CONTROL_BASE } from './controlStyles.js'

defineProps({
  type: { type: String, default: 'text' },
})
const model = defineModel({ type: [String, Number], default: '' })
</script>

<template>
  <input
    v-model="model"
    :type="type"
    :class="[CONTROL_BASE, 'h-10 pointer-coarse:h-11 text-sm max-md:text-base']"
  />
</template>
