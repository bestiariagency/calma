<script setup>
import Skeleton from '../ui/Skeleton.vue'
import { isWide } from './fieldWidth.js'

// Esqueleto de un campo simple con la geometría real: label, control (input/textarea/imagen) y fila de ayuda.
const LONG_HELP = 48 // caracteres a partir de los que la ayuda no cabe en una línea de media columna
const EXTRA_ROW_TYPES = ['email', 'phone']
defineProps({ field: { type: Object, required: true }, bare: { type: Boolean, default: false } })
</script>

<template>
  <div
    v-if="field.type === 'image'"
    class="flex flex-col gap-4 rounded-lg border border-line bg-surface-2 p-5 max-md:p-4"
  >
    <Skeleton class="h-4 w-32" />
    <Skeleton class="aspect-video max-h-80 w-full" />
    <div class="flex items-center justify-between">
      <Skeleton class="h-4 w-28" />
      <Skeleton class="h-10 w-40" />
    </div>
    <div class="flex flex-col gap-1.5"><Skeleton class="h-4 w-48" /><Skeleton class="h-10" /><Skeleton class="h-4 w-64" /></div>
  </div>
  <div
    v-else
    :class="['flex flex-col gap-2', !bare && 'rounded-lg border border-line bg-surface-2 p-5 max-md:p-4']"
  >
    <div class="flex flex-col gap-1.5">
      <Skeleton class="h-5 w-32" />
      <Skeleton :class="field.type === 'textarea' ? 'h-24' : 'h-10'" />
      <!-- Ayuda larga en columna estrecha (tablet, sidebar colapsada) = 2 líneas. -->
      <Skeleton :class="['h-4 w-48', bare && !isWide(field) && LONG_HELP < (field.help?.length ?? 0) && 'md:max-lg:h-8']" />
    </div>
    <!-- Fila "Probar correo/llamada" (CompanyFieldExtra): solo email/teléfono, que siempre tienen valor. -->
    <Skeleton v-if="bare && EXTRA_ROW_TYPES.includes(field.type)" class="h-6 w-24" />
  </div>
</template>
