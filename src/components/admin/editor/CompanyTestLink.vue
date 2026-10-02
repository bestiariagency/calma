<script setup>
import { ExternalLink } from 'lucide-vue-next'
import { adminCompanyText as t } from '../../../data/adminEditorText.js'

// Enlace "Probar …" de Datos de la empresa. `external`: se abre en otra pestaña (https/WhatsApp); mailto:/tel: no.
defineProps({ href: { type: String, required: true }, external: { type: Boolean, default: true } })
</script>

<template>
  <a
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    class="inline-flex min-h-6 w-fit items-center gap-1.5 rounded-md font-sans text-[13px]/5 font-semibold text-accent-text underline underline-offset-4 pointer-coarse:min-h-11 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <slot />
    <ExternalLink v-if="external" :size="14" aria-hidden="true" />
    <span v-if="external" class="sr-only">{{ t.newTab }}</span>
  </a>
</template>
