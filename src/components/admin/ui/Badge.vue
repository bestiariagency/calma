<script setup>
import { BADGE_ICONS, BADGE_STYLES } from './statusStyles.js'

defineProps({
  variant: { type: String, default: 'neutral', validator: v => v in BADGE_STYLES },
})
</script>

<template>
  <span
    :class="[
      'inline-flex h-5 items-center gap-1 rounded-sm border px-2 font-mono text-[11px]/4 font-bold uppercase tracking-eyebrow',
      BADGE_STYLES[variant],
    ]"
  >
    <component :is="BADGE_ICONS[variant]" :size="12" aria-hidden="true" />
    <slot />
  </span>
</template>
