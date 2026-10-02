<script setup>
import { onMounted } from 'vue'
import TheHero            from '../components/sections/TheHero.vue'
import TheQueEs           from '../components/sections/TheQueEs.vue'
import ThePorQueHormigon  from '../components/sections/ThePorQueHormigon.vue'
import TheProceso         from '../components/sections/TheProceso.vue'
import TheGaleria         from '../components/sections/TheGaleria.vue'
import TheCta             from '../components/sections/TheCta.vue'
import TheFooter          from '../components/sections/TheFooter.vue'
import WhatsAppFloat      from '../components/ui/WhatsAppFloat.vue'
import { useSiteContent } from '../composables/useSiteContent.js'

const { refreshAfterPaint } = useSiteContent()
onMounted(refreshAfterPaint)
</script>

<template>
  <TheHero />
  <TheQueEs />
  <ThePorQueHormigon />
  <TheProceso />
  <TheGaleria />
  <TheCta />
  <TheFooter />
  <WhatsAppFloat />
</template>
