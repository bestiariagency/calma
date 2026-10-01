<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import FeatureItem  from '../ui/FeatureItem.vue'
import FeatureCard  from '../ui/FeatureCard.vue'
import CarouselDots from '../ui/CarouselDots.vue'
import { POR_QUE }  from '../../data/content.js'
import { useCarousel } from '../../composables/useCarousel.js'

const { current, containerRef, onScroll, goTo } = useCarousel(290, 16)

// Desktop: rejilla de dos columnas con dos features cada una
const DESKTOP_COLUMNS = [POR_QUE.features.slice(0, 2), POR_QUE.features.slice(2, 4)]
</script>

<template>
  <section id="por-que-hormigon" v-reveal.each class="relative flex min-h-screen flex-col justify-center overflow-hidden bg-mid md:bg-[linear-gradient(to_bottom,#000_0%,var(--color-dark)_100%)]">

    <!-- Mobile: top image -->
    <div data-reveal="image" class="h-[240px] w-full overflow-hidden md:h-[360px] desktop:hidden">
      <img data-reveal="zoom" src="/images/hormigon.png" alt="Textura de hormigón artesanal" />
    </div>

    <!-- Mobile header -->
    <div class="flex flex-col gap-2 px-[28px] pt-[28px] pb-[20px] md:px-16 md:pt-10 md:pb-[28px] desktop:hidden">
      <SectionLabel data-reveal="text" :text="POR_QUE.label" />
      <h2 data-reveal="text" class="text-[30px] font-extrabold text-text leading-[1.05] whitespace-pre-line md:text-[38px]">{{ POR_QUE.title }}</h2>
    </div>

    <!-- Mobile carousel -->
    <div class="overflow-hidden desktop:hidden">
      <div ref="containerRef" class="scrollbar-none flex snap-x snap-mandatory scroll-pl-[28px] gap-4 overflow-x-auto px-[28px] *:snap-start md:scroll-pl-16 md:px-16" @scroll.passive="onScroll">
        <FeatureCard
          v-for="f in POR_QUE.features"
          :key="f.title"
          data-reveal="text"
          :number="f.number"
          :title="f.title"
          :description="f.description"
        />
      </div>
    </div>

    <!-- Mobile dots -->
    <div data-reveal="fade" class="pt-4 pb-3 md:pt-5 md:pb-4 desktop:hidden">
      <CarouselDots :total="POR_QUE.features.length" :current="current" @go="goTo" />
    </div>

    <!-- ─── Desktop ─────────────────────────────────────── -->
    <div class="absolute inset-x-0 top-0 hidden h-[548px] flex-col justify-center px-16 py-[60px] desktop:flex">
      <SectionLabel data-reveal="text" :text="POR_QUE.label" class="mb-[20px]" />
      <h2 data-reveal="text" class="max-w-[560px] text-[44px] leading-[1.05] font-extrabold whitespace-pre-line text-text">{{ POR_QUE.title }}</h2>
      <div class="h-10 shrink-0" />
      <div class="flex flex-1">
        <div v-for="(column, c) in DESKTOP_COLUMNS" :key="c" class="flex flex-1 flex-col">
          <FeatureItem
            v-for="f in column"
            :key="f.title"
            data-reveal="text"
            :marker="f.marker"
            :title="f.title"
            :description="f.description"
          />
        </div>
      </div>
    </div>

    <!-- Desktop: bottom image -->
    <div v-reveal data-reveal="image" class="absolute inset-x-0 bottom-0 hidden h-[168px] overflow-hidden desktop:block reveal-from-left">
      <img data-reveal="zoom" src="/images/hormigon.png" alt="Textura de hormigón" />
    </div>

  </section>
</template>
