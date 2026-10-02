<script setup>
import { computed } from 'vue'

// Spec §3.28. full: logo-blanco (584×220) · iso: isotipo (21×21).
// `decorative` → alt="" (cuando va dentro de un enlace con aria-label); si no, alt="CALMA".
const props = defineProps({
  variant: { type: String, default: 'full', validator: v => ['full', 'iso'].includes(v) },
  size: { type: String, default: 'md', validator: v => ['md', 'sm'].includes(v) }, // md login (h-8) · sm sidebar (h-6)
  decorative: { type: Boolean, default: false },
})

const FILES = {
  full: { src: '/images/logos/logo-blanco-calma.svg', width: 584, height: 220 },
  iso: { src: '/images/logos/iso-calma.svg', width: 21, height: 21 },
}
const file = computed(() => FILES[props.variant])
const sizeClass = computed(() => (props.variant === 'iso' ? 'size-8' : props.size === 'sm' ? 'h-6 w-auto' : 'h-8 w-auto'))
</script>

<template>
  <img :src="file.src" :width="file.width" :height="file.height" :alt="decorative ? '' : 'CALMA'" :class="sizeClass" />
</template>
