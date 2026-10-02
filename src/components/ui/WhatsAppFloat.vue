<script setup>
import IconWhatsApp from './IconWhatsApp.vue'
import { useSiteContent } from '../../composables/useSiteContent.js'

const { whatsappUrl } = useSiteContent()
</script>

<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed right-7 bottom-7 z-[200] flex size-[52px] items-center justify-center rounded-[50%] bg-whatsapp text-[26px] text-white shadow-[0_4px_16px_rgba(0,0,0,0.4)] transition-[transform,box-shadow] duration-200 ease-[ease] hover:[transform:scale(1.08)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.5)]"
    aria-label="Contactar por WhatsApp"
  >
    <IconWhatsApp />
  </a>
</template>
