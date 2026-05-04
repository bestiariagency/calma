<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import CarouselDots from '../ui/CarouselDots.vue'
import { GALERIA }  from '../../data/content.js'
import { useCarousel } from '../../composables/useCarousel.js'

const { current, containerRef, onScroll, goTo } = useCarousel(300, 12)
</script>

<template>
  <section id="galeria" class="galeria">

    <!-- ─── Mobile ────────────────────────────────────── -->
    <div class="galeria__m">
      <div class="galeria__m-header">
        <SectionLabel :text="GALERIA.label" />
        <h2 class="galeria__m-title">{{ GALERIA.title }}</h2>
      </div>
      <div class="galeria__m-carousel-wrap">
        <div class="galeria__m-carousel" ref="containerRef" @scroll.passive="onScroll">
          <div
            v-for="img in GALERIA.images"
            :key="img.src"
            class="galeria__m-slide"
          >
            <img :src="img.src" :alt="img.alt" />
          </div>
        </div>
      </div>
      <div class="galeria__m-dots">
        <CarouselDots :total="GALERIA.images.length" :current="current" @go="goTo" />
      </div>
    </div>

    <!-- ─── Desktop ───────────────────────────────────── -->
    <div class="galeria__d">
      <SectionLabel :text="GALERIA.label" class="galeria__d-label" />
      <h2 class="galeria__d-title">{{ GALERIA.title }}</h2>

      <!-- Main large image -->
      <div class="galeria__d-img-a">
        <img src="/images/frente-gem-3.png" alt="Tinaja frontal" />
      </div>

      <!-- Two stacked images -->
      <div class="galeria__d-img-b">
        <img src="/images/drones.png" alt="Vista aérea" />
      </div>
      <div class="galeria__d-img-c">
        <img src="/images/close-up.png" alt="Detalle de hormigón" />
      </div>

      <!-- Quote box -->
      <div class="galeria__d-quote">
        <p class="galeria__d-q-text">{{ GALERIA.quote.text }}</p>
        <div class="galeria__d-q-line" />
        <p class="galeria__d-q-author">{{ GALERIA.quote.author }}</p>
      </div>
    </div>

  </section>
</template>

<style scoped>
.galeria { background: var(--c-darkest); }

/* ─── Mobile ─────────────────────────────────────────── */
.galeria__d { display: none; }

.galeria__m {
  display: flex;
  flex-direction: column;
  padding: 48px 0 48px 28px;
  gap: 28px;
}
.galeria__m-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 28px;
}
.galeria__m-title {
  font-size: 34px;
  font-weight: 800;
  color: var(--c-text);
  line-height: 1.05;
}
.galeria__m-carousel-wrap { overflow: hidden; }
.galeria__m-carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.galeria__m-carousel::-webkit-scrollbar { display: none; }
.galeria__m-slide {
  flex-shrink: 0;
  width: 300px;
  height: 300px;
  border-radius: 4px;
  overflow: hidden;
  scroll-snap-align: start;
}
.galeria__m-dots { padding: 0 28px; }

/* ─── Desktop ────────────────────────────────────────── */
@media (min-width: 768px) {
  .galeria__m { display: none; }

  .galeria {
    background: linear-gradient(to bottom, #000 31%, var(--c-darkest) 100%);
  }
  .galeria__d {
    display: block;
    position: relative;
    min-height: 100vh;
    max-width: 1440px;
    margin: 0 auto;
    overflow: hidden;
  }

  .galeria__d-label {
    position: absolute;
    top: 56px; left: 80px;
  }
  .galeria__d-title {
    position: absolute;
    top: 80px; left: 80px;
    font-size: 52px;
    font-weight: 800;
    color: var(--c-text);
    line-height: 1;
  }

  /* Images */
  .galeria__d-img-a {
    position: absolute;
    left: 80px; top: 160px;
    width: 480px; height: 520px;
    border-radius: 3px;
    overflow: hidden;
  }
  .galeria__d-img-b {
    position: absolute;
    left: 576px; top: 160px;
    width: 380px; height: 254px;
    border-radius: 3px;
    overflow: hidden;
  }
  .galeria__d-img-c {
    position: absolute;
    left: 576px; top: 426px;
    width: 380px; height: 254px;
    border-radius: 3px;
    overflow: hidden;
  }

  /* Quote box */
  .galeria__d-quote {
    position: absolute;
    left: 972px; top: 160px;
    width: 388px; height: 520px;
    background: var(--c-dark);
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 20px;
  }
  .galeria__d-q-text {
    font-size: 20px;
    font-weight: 700;
    color: var(--c-text);
    line-height: 1.5;
  }
  .galeria__d-q-line  { width: 40px; height: 2px; background: var(--c-accent); }
  .galeria__d-q-author{ font-size: 12px; color: var(--c-faint); }
}
</style>
