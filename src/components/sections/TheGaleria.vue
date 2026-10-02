<script setup>
import { ref } from 'vue'
import SectionLabel    from '../ui/SectionLabel.vue'
import CarouselDots    from '../ui/CarouselDots.vue'
import GaleriaLightbox from '../ui/GaleriaLightbox.vue'
import { useSiteContent } from '../../composables/useSiteContent.js'
import { useCarousel } from '../../composables/useCarousel.js'

const { galeria, company } = useSiteContent()
const { current, containerRef, onScroll, goTo } = useCarousel(300, 12)

const lightboxIndex = ref(null)

// Mosaico desktop: posición/tamaño de cada imagen clicable (índice = imagen de GALERIA.images)
const DESKTOP_MOSAIC_SLOTS = [
  'left-20 top-[160px] h-[520px] w-[480px]',     // grande principal
  'left-[576px] top-[160px] h-[254px] w-[380px]', // apilada superior
  'left-[576px] top-[426px] h-[254px] w-[380px]', // apilada inferior
]
// Entrada del mosaico y la caja del logo: arrancan tras el título, con su propio stagger
const MOSAIC_REVEAL = '[--reveal-offset:var(--motion-follow-short)] [--reveal-step:var(--motion-stagger-mosaic)]'
</script>

<template>
  <section id="galeria" class="min-h-screen bg-darkest md:bg-[linear-gradient(to_bottom,#000_31%,var(--color-darkest)_100%)]">

    <!-- ─── Mobile ────────────────────────────────────── -->
    <div v-reveal.each class="flex min-h-screen flex-col justify-center gap-[28px] py-12 pl-[28px] md:hidden">
      <div class="flex flex-col gap-3 pr-[28px]">
        <SectionLabel data-reveal="text" :text="galeria.label" />
        <h2 data-reveal="text" class="text-[34px] font-extrabold text-text leading-[1.05]">{{ galeria.title }}</h2>
      </div>
      <div data-reveal="image" class="overflow-hidden reveal-from-left">
        <div ref="containerRef" class="scrollbar-none flex snap-x snap-mandatory gap-3 overflow-x-auto" @scroll.passive="onScroll">
          <div
            v-for="(img, i) in galeria.images"
            :key="img.src"
            class="h-[45vh] w-[300px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-[4px]"
            @click="lightboxIndex = i"
          >
            <img data-reveal="zoom" v-bind="img" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
      <div data-reveal="fade" class="px-[28px]">
        <CarouselDots :total="galeria.images.length" :current="current" @go="goTo" />
      </div>
    </div>

    <!-- ─── Desktop ───────────────────────────────────── -->
    <div v-reveal class="relative mx-auto hidden h-[700px] max-w-[1440px] overflow-hidden md:block">
      <SectionLabel data-reveal="text" :text="galeria.label" class="absolute top-[56px] left-20" />
      <h2 data-reveal="text" class="absolute top-20 left-20 text-[52px] font-extrabold text-text leading-none">{{ galeria.title }}</h2>

      <!-- Mosaico: imagen grande + dos apiladas (zoom suave al hover) -->
      <div
        v-for="(slot, i) in DESKTOP_MOSAIC_SLOTS"
        :key="galeria.images[i].src"
        data-reveal="image"
        :data-reveal-i="i"
        class="group absolute cursor-pointer overflow-hidden rounded-[3px]"
        :class="[slot, MOSAIC_REVEAL]"
        @click="lightboxIndex = i"
      >
        <!-- Zoom de entrada en un envoltorio: la img conserva su transición de hover -->
        <div data-reveal="zoom" class="size-full">
          <img
            class="transition-transform duration-400 ease-[ease] group-hover:transform-[scale(1.03)]"
            v-bind="galeria.images[i]"
            loading="lazy" decoding="async"
          />
        </div>
      </div>

      <!-- Quote box -->
      <div data-reveal="text" :data-reveal-i="DESKTOP_MOSAIC_SLOTS.length" :class="MOSAIC_REVEAL" class="absolute top-[160px] left-[972px] flex h-[520px] w-[388px] flex-col justify-end gap-[20px] bg-dark px-4 py-[20px]">
        <img v-bind="company.logo" class="w-[250px] h-auto object-contain" />
      </div>
    </div>

    <p v-reveal data-reveal="fade" class="px-[28px] pt-4 pb-8 text-[10px] leading-[1.6] text-white opacity-50 md:max-w-[700px] md:px-20 md:pt-[20px] md:pb-0">{{ galeria.disclaimer }}</p>

    <GaleriaLightbox
      :images="galeria.images"
      :index="lightboxIndex"
      @close="lightboxIndex = null"
      @update:index="lightboxIndex = $event"
    />

  </section>
</template>
