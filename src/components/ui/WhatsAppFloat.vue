<script setup>
import IconWhatsApp from './IconWhatsApp.vue'
import { WHATSAPP_URL } from '../../data/content.js'
</script>

<template>
  <a
    :href="WHATSAPP_URL"
    target="_blank"
    rel="noopener noreferrer"
    class="wa-float"
    aria-label="Contactar por WhatsApp"
  >
    <IconWhatsApp />
  </a>
</template>

<style scoped>
.wa-float {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 200;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #25D366;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}
.wa-float:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.5);
}
</style>
