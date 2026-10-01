<script setup>
import IconWhatsApp from '../ui/IconWhatsApp.vue'
import { NAV_LINKS } from '../../data/content.js'

defineProps({
  isMenuOpen: { type: Boolean, default: false },
})
defineEmits(['toggleMenu'])
</script>

<template>
  <nav class="absolute inset-x-0 top-0 z-10">
    <div class="flex items-center justify-between px-6 py-5 md:px-20 md:py-7">
      <!-- <a href="#inicio" class="text-[16px] font-bold text-text tracking-[3px] md:text-[20px]">CALMA</a> -->

      <!-- Desktop links -->
      <div class="hidden items-center gap-8 md:flex">
        <template v-for="link in NAV_LINKS" :key="link.href">
          <a
            v-if="!link.cta"
            :href="link.href"
            class="text-[13px] text-white transition-[color] duration-200 ease-[ease] hover:text-accent"
          >{{ link.label }}</a>
          <a
            v-else
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-[7px] rounded-[2px] bg-accent px-5 py-2.5 text-[12px] font-bold tracking-[1px] text-mid transition-opacity duration-200 ease-[ease] hover:opacity-85"
          >
            <IconWhatsApp />{{ link.label }}
          </a>
        </template>
      </div>

      <!-- Mobile hamburger -->
      <button class="flex items-center text-accent md:hidden" @click="$emit('toggleMenu')" aria-label="Abrir menú">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  </nav>
</template>
