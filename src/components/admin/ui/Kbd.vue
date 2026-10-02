<script setup>
// `inherit`: dentro de un Button, hereda el color del botón (spec 3.1: sin caja, 70 %) en vez de text-text-2.
defineProps({ inherit: { type: Boolean, default: false } })
</script>

<template>
  <kbd
    :class="[
      'inline-flex h-5 min-w-5 items-center justify-center rounded-sm font-mono text-xs/4 tabular-nums max-md:hidden pointer-coarse:hidden',
      inherit ? 'px-0 text-current opacity-70' : 'border border-line-strong bg-surface-3 px-1.5 text-text-2',
    ]"
  >
    <slot />
  </kbd>
</template>
