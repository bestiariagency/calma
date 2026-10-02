<script setup>
import { useId } from 'vue'

defineProps({
  title: { type: String, default: '' },
  help: { type: String, default: '' },
  invalid: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
const titleId = useId()
</script>

<template>
  <!-- <section> con landmark solo si hay título (spec §3.19). -->
  <component
    :is="title ? 'section' : 'div'"
    :aria-labelledby="title ? titleId : undefined"
    :class="[
      'flex flex-col gap-5 rounded-lg border bg-surface-2 p-5 max-md:p-4',
      'transition-colors duration-(--motion-fast) ease-(--ease-panel) motion-reduce:transition-none',
      'hover:border-line-strong focus-within:border-accent-line',
      invalid ? 'border-danger-line' : 'border-line',
      disabled && 'pointer-events-none opacity-60',
    ]"
  >
    <header v-if="title" class="flex flex-col gap-1">
      <h2 :id="titleId" class="font-mono text-sm/5 font-bold text-text">{{ title }}</h2>
      <p v-if="help" class="text-xs/4 text-text-2">{{ help }}</p>
    </header>
    <slot />
  </component>
</template>
