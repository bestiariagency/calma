<script setup>
import TheNav         from '../layout/TheNav.vue'
import TheMobileMenu  from '../layout/TheMobileMenu.vue'
import AppButton      from '../ui/AppButton.vue'
import { useSiteContent } from '../../composables/useSiteContent.js'
import { useMobileMenu } from '../../composables/useMobileMenu.js'

const { isOpen, toggle, close } = useMobileMenu()
const { hero, company, whatsappUrl } = useSiteContent()
</script>

<template>
  <section id="inicio" class="relative min-h-screen overflow-hidden bg-mid">
    <img class="absolute inset-0" v-bind="hero.image" fetchpriority="high" />
    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-mid)_30%,transparent_100%)] md:bg-none md:bg-black/55" />

    <TheNav :is-menu-open="isOpen" @toggle-menu="toggle" />

    <div class="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center">
      <!-- Mobile only: tag -->
      <!-- <p class="text-[9px] font-bold text-accent tracking-[4px] md:hidden">{{ hero.tag }}</p> -->

      <!-- Mobile title -->
      <!-- <h1 class="font-thin text-text text-center text-[30px] leading-[0.95] md:hidden" v-html="hero.titleMobile.replace(/\n/g, '<br>')" /> -->
      <!-- Desktop title -->
      <!-- <h1 class="hidden font-thin text-text text-center md:block md:text-[88px] md:font-[10] md:leading-none md:max-w-[900px]">{{ hero.titleDesktop }}</h1> -->
      <div class="motion-ok:animate-hero-logo">
        <img v-bind="company.logo" />
      </div>
      <!-- Mobile subtitle -->
      <!-- <p class="text-[22px] text-warm leading-[1.3] md:hidden" v-html="hero.subtitleMobile.replace(/\n/g, '<br>')" /> -->
      <!-- Desktop subtitle -->
      <!-- <p class="hidden text-[22px] text-warm leading-[1.3] md:block md:text-white">{{ hero.subtitle }}</p> -->

      <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="inline-flex motion-ok:animate-hero-cta">
        <AppButton :label="hero.cta" size="sm-md" wa />
      </a>
    </div>

    <TheMobileMenu :is-open="isOpen" @close="close" />
  </section>
</template>
