<script setup>
import { computed } from 'vue'
import { getInitials } from '../../../lib/initials.js'

// Decorativo: el correo/nombre visible al lado es el nombre accesible.
const props = defineProps({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
})
const initials = computed(() => getInitials(props.name, props.email))
</script>

<template>
  <span
    aria-hidden="true"
    class="grid size-8 shrink-0 place-items-center rounded-full border border-line bg-surface-3 font-mono text-xs font-bold text-text-2 uppercase"
  >
    {{ initials }}
  </span>
</template>
