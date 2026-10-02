<script setup>
import { ref } from 'vue'
import { useAutosize } from '../../../composables/admin/useAutosize.js'
import { CONTROL_BASE } from './controlStyles.js'

const model = defineModel({ type: String, default: '' })
const el = ref(null)
useAutosize(el, model)
</script>

<template>
  <!-- Autosize (altura = scrollHeight); el contador vive en Field. Respeta saltos de línea. -->
  <textarea
    ref="el"
    v-model="model"
    :class="[
      CONTROL_BASE,
      'min-h-24 max-h-80 overflow-y-auto resize-none py-2.5 text-sm leading-[22px] max-md:text-base whitespace-pre-wrap',
    ]"
  />
</template>
