<script setup>
import { adminUiText } from '../../../data/adminUiText.js'

// Misma geometría que el componente real: pasar el tamaño con clases (h-10, h-24, h-4 w-32…).
// `announce`: lo anuncia como región aria-busy con "Cargando…" (UN bloque por zona, no cada uno).
defineProps({ announce: { type: Boolean, default: false } })
</script>

<template>
  <!-- shimmer: solo background-position (keyframes en @theme); estático con reduced-motion. -->
  <div
    :role="announce ? 'status' : undefined"
    :aria-busy="announce ? 'true' : undefined"
    :aria-hidden="announce ? undefined : 'true'"
    class="rounded-md bg-surface-4 bg-linear-to-r from-surface-4 via-line-strong to-surface-4 bg-size-[200%_100%] animate-shimmer motion-reduce:animate-none"
  >
    <span v-if="announce" class="sr-only">{{ adminUiText.loading }}</span>
  </div>
</template>
