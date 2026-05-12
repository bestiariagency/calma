<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import FeatureItem  from '../ui/FeatureItem.vue'
import FeatureCard  from '../ui/FeatureCard.vue'
import CarouselDots from '../ui/CarouselDots.vue'
import { POR_QUE }  from '../../data/content.js'
import { useCarousel } from '../../composables/useCarousel.js'

const { current, containerRef, onScroll, goTo } = useCarousel(290, 16)
</script>

<template>
  <section id="por-que-hormigon" class="porque">

    <!-- Mobile: top image -->
    <div class="porque__m-img">
      <img src="/images/hormigon.png" alt="Textura de hormigón artesanal" />
    </div>

    <!-- Mobile header -->
    <div class="porque__m-header">
      <SectionLabel :text="POR_QUE.label" />
      <h2 class="porque__title">{{ POR_QUE.title }}</h2>
    </div>

    <!-- Mobile carousel -->
    <div class="porque__m-carousel-wrap">
      <div class="porque__m-carousel" ref="containerRef" @scroll.passive="onScroll">
        <FeatureCard
          v-for="f in POR_QUE.features"
          :key="f.title"
          :number="f.number"
          :title="f.title"
          :description="f.description"
        />
      </div>
    </div>

    <!-- Mobile dots -->
    <div class="porque__m-dots">
      <CarouselDots :total="POR_QUE.features.length" :current="current" @go="goTo" />
    </div>

    <!-- ─── Desktop ─────────────────────────────────────── -->
    <div class="porque__d-content">
      <SectionLabel :text="POR_QUE.label" class="porque__d-label" />
      <h2 class="porque__d-title">{{ POR_QUE.title }}</h2>
      <div class="porque__d-spacer" />
      <div class="porque__d-grid">
        <div class="porque__d-col">
          <FeatureItem
            v-for="f in POR_QUE.features.slice(0, 2)"
            :key="f.title"
            :marker="f.marker"
            :title="f.title"
            :description="f.description"
          />
        </div>
        <div class="porque__d-col">
          <FeatureItem
            v-for="f in POR_QUE.features.slice(2, 4)"
            :key="f.title"
            :marker="f.marker"
            :title="f.title"
            :description="f.description"
          />
        </div>
      </div>
    </div>

    <!-- Desktop: bottom image -->
    <div class="porque__d-img">
      <img src="/images/hormigon.png" alt="Textura de hormigón" />
    </div>

  </section>
</template>

<style scoped>
.porque {
  background: var(--c-mid);
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* ─── Mobile ─────────────────────────────────────────── */
.porque__m-img {
  width: 100%;
  height: 240px;
  overflow: hidden;
}
.porque__m-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 28px 20px;
}
.porque__title {
  font-size: 30px;
  font-weight: 800;
  color: var(--c-text);
  line-height: 1.05;
  white-space: pre-line;
}
.porque__m-carousel-wrap { overflow: hidden; }
.porque__m-carousel {
  display: flex;
  gap: 16px;
  padding: 0 28px 0 28px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 28px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.porque__m-carousel::-webkit-scrollbar { display: none; }
.porque__m-carousel > * { scroll-snap-align: start; }
.porque__m-dots {
  padding: 16px 0 12px;
}

/* ─── Desktop ────────────────────────────────────────── */
.porque__d-content { display: none; }
.porque__d-img     { display: none; }

/* ─── Medium (carousel, like mobile) ─────────────────── */
@media (min-width: 768px) {
  .porque {
    min-height: 100vh;
    background: linear-gradient(to bottom, #000 0%, var(--c-dark) 100%);
  }
  .porque__m-img    { height: 360px; }
  .porque__m-header { padding: 40px 64px 28px; }
  .porque__title    { font-size: 38px; }
  .porque__m-carousel {
    padding: 0 64px;
    scroll-padding-left: 64px;
  }
  .porque__m-dots   { padding: 20px 0 16px; }
}

/* ─── Desktop (2-col grid) ────────────────────────────── */
@media (min-width: 1200px) {
  /* Hide mobile/medium carousel */
  .porque__m-img,
  .porque__m-header,
  .porque__m-carousel-wrap,
  .porque__m-dots { display: none; }

  /* Show desktop content */
  .porque__d-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 548px;
    padding: 60px 64px;
    gap: 0;
  }
  .porque__d-label { margin-bottom: 20px; }
  .porque__d-title {
    font-size: 44px;
    font-weight: 800;
    color: var(--c-text);
    line-height: 1.05;
    max-width: 560px;
    white-space: pre-line;
  }
  .porque__d-spacer { height: 40px; flex-shrink: 0; }
  .porque__d-grid {
    display: flex;
    gap: 0;
    flex: 1;
  }
  .porque__d-col {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* Desktop bottom image */
  .porque__d-img {
    display: block;
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 168px;
    overflow: hidden;
  }
}
</style>
