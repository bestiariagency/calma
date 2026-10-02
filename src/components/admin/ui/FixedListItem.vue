<script setup>
import { CircleAlert } from 'lucide-vue-next'
import { adminEditorText as t } from '../../../data/adminEditorText.js'

// Subcard numerada de una lista de tamaño fijo (spec 3.5): sin drag, sin añadir, sin eliminar.
defineProps({
  index: { type: Number, required: true }, // base 0
  total: { type: Number, required: true },
  invalid: { type: Boolean, default: false },
})
</script>

<template>
  <li
    :aria-label="t.itemLabel(index + 1, total)"
    :class="[
      'flex gap-4 rounded-lg border bg-surface-2 p-5 max-md:p-4 max-sm:flex-col',
      'transition-colors duration-(--motion-fast) ease-(--ease-panel) motion-reduce:transition-none',
      'hover:border-line-strong focus-within:border-accent-line',
      invalid ? 'border-danger-line' : 'border-line',
    ]"
  >
    <span
      aria-hidden="true"
      class="grid size-8 shrink-0 place-items-center rounded-md bg-surface-3 font-mono text-xs font-bold tabular-nums text-text-2"
    >
      <CircleAlert v-if="invalid" :size="16" class="text-danger" />
      <template v-else>{{ String(index + 1).padStart(2, '0') }}</template>
    </span>
    <div class="flex min-w-0 flex-1 flex-col gap-5"><slot /></div>
  </li>
</template>
