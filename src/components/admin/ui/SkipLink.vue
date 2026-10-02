<script setup>
import { adminUiText } from '../../../data/adminUiText.js'

// Primer elemento del shell y del login. Apunta a <main id="contenido" tabindex="-1">.
defineProps({ href: { type: String, default: '#contenido' } })
</script>

<template>
  <a
    :href="href"
    class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:inline-flex focus:h-10 focus:items-center focus:rounded-md focus:bg-accent focus:px-4 focus:font-sans focus:text-sm focus:font-semibold focus:text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    {{ adminUiText.skipToContent }}
  </a>
</template>
