<script setup>
import TheNav         from '../layout/TheNav.vue'
import TheMobileMenu  from '../layout/TheMobileMenu.vue'
import AppButton      from '../ui/AppButton.vue'
import { HERO, WHATSAPP_URL } from '../../data/content.js'
import { useMobileMenu } from '../../composables/useMobileMenu.js'

const { isOpen, toggle, close } = useMobileMenu()
</script>

<template>
  <section id="inicio" class="relative min-h-screen overflow-hidden bg-mid">
    <img class="absolute inset-0" src="/images/hero-dia.png" alt="Tinaja artesanal de hormigón en jardín" />
    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-mid)_30%,transparent_100%)] md:bg-none md:bg-black/55" />

    <TheNav :isMenuOpen="isOpen" @toggleMenu="toggle" />

    <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <!-- Mobile only: tag -->
      <!-- <p class="text-[9px] font-bold text-accent tracking-[4px] md:hidden">{{ HERO.tag }}</p> -->

      <!-- Mobile title -->
      <!-- <h1 class="font-thin text-text text-center text-[30px] leading-[0.95] md:hidden" v-html="HERO.titleMobile.replace(/\n/g, '<br>')" /> -->
      <!-- Desktop title -->
      <!-- <h1 class="hidden font-thin text-text text-center md:block md:text-[88px] md:font-[10] md:leading-none md:max-w-[900px]">{{ HERO.titleDesktop }}</h1> -->
      <div class="motion-ok:animate-hero-logo">
        <img src="/images/logos/logo-blanco-calma.svg" alt="Calma" />
      </div>
      <!-- Mobile subtitle -->
      <!-- <p class="text-[22px] text-warm leading-[1.3] md:hidden" v-html="HERO.subtitleMobile.replace(/\n/g, '<br>')" /> -->
      <!-- Desktop subtitle -->
      <!-- <p class="hidden text-[22px] text-warm leading-[1.3] md:block md:text-white">{{ HERO.subtitle }}</p> -->

      <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" class="inline-flex motion-ok:animate-hero-cta">
        <AppButton :label="HERO.cta" size="sm-md" wa />
      </a>
    </div>

    <TheMobileMenu :isOpen="isOpen" @close="close" />
  </section>
</template>
