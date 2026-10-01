<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import { QUE_ES }  from '../../data/content.js'
</script>

<template>
  <section id="producto" class="flex min-h-screen flex-col justify-center bg-dark desktop:flex-row">
    <!-- Imagen: arriba en móvil/tablet, columna izquierda en desktop -->
    <div v-reveal data-reveal="image" class="h-[280px] w-full shrink-0 overflow-hidden md:h-[50vh] desktop:h-auto desktop:min-h-screen desktop:w-[660px] desktop:reveal-from-left">
      <img data-reveal="zoom" src="/images/drones.png" alt="Vista aérea de tinaja de hormigón" />
    </div>

    <!-- Text panel -->
    <div v-reveal class="flex flex-col justify-center gap-[18px] px-[28px] py-12 md:flex-1 md:gap-6 md:px-16 desktop:min-h-screen desktop:gap-[28px] desktop:px-20 desktop:py-0 desktop:[--reveal-offset:var(--motion-follow)]">
      <SectionLabel data-reveal="text" :text="QUE_ES.label" />
      <h2 data-reveal="text" class="text-[38px] leading-[1.05] font-extrabold text-text md:text-[44px] desktop:max-w-[580px] desktop:text-[48px]">{{ QUE_ES.title }}</h2>
      <div class="flex flex-col gap-4">
        <p v-for="(p, i) in QUE_ES.paragraphs" :key="i" data-reveal="text" class="text-[15px] leading-[1.6] text-muted md:max-w-[680px] md:text-[17px] desktop:max-w-[560px] desktop:text-[20px]">{{ p }}</p>
      </div>
      <div data-reveal="bar" class="w-[36px] h-[2px] bg-accent md:w-12" />
    </div>
  </section>
</template>
