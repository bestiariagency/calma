<script setup>
import { ref } from 'vue'
import SectionLabel    from '../ui/SectionLabel.vue'
import CarouselDots    from '../ui/CarouselDots.vue'
import GaleriaLightbox from '../ui/GaleriaLightbox.vue'
import { GALERIA }     from '../../data/content.js'
import { useCarousel } from '../../composables/useCarousel.js'

const { current, containerRef, onScroll, goTo } = useCarousel(300, 12)

const lightboxIndex = ref(null)
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
            v-for="(img, i) in GALERIA.images"
            :key="img.src"
            class="galeria__m-slide"
            @click="lightboxIndex = i"
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
      <div class="galeria__d-img-a galeria__d-img--click" @click="lightboxIndex = 0">
        <img :src="GALERIA.images[0].src" :alt="GALERIA.images[0].alt" />
      </div>

      <!-- Two stacked images -->
      <div class="galeria__d-img-b galeria__d-img--click" @click="lightboxIndex = 1">
        <img :src="GALERIA.images[1].src" :alt="GALERIA.images[1].alt" />
      </div>
      <div class="galeria__d-img-c galeria__d-img--click" @click="lightboxIndex = 2">
        <img :src="GALERIA.images[2].src" :alt="GALERIA.images[2].alt" />
      </div>

      <!-- Quote box -->
      <div class="galeria__d-quote">
        <img src="/images/logos/logo-blanco-calma.svg" alt="CALMA" class="galeria__d-q-logo" />
      </div>
    </div>

    <p class="galeria__footnote">* Imágenes referenciales. Incluye escalera, banca interior y protección de cañerías. Pala y deck se venden por separado.</p>

    <GaleriaLightbox
      :images="GALERIA.images"
      :index="lightboxIndex"
      @close="lightboxIndex = null"
      @update:index="lightboxIndex = $event"
    />

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
  cursor: pointer;
}
.galeria__footnote {
  font-size: 10px;
  color: var(--c-white);
  line-height: 1.6;
  padding: 16px 28px 32px;
  opacity: 0.5;
}
.galeria__m-dots { padding: 0 28px; }

/* ─── Desktop ────────────────────────────────────────── */
@media (min-width: 768px) {
  .galeria__m { display: none; }

  .galeria {
    min-height: 100vh;
    background: linear-gradient(to bottom, #000 31%, var(--c-darkest) 100%);
  }
  .galeria__d {
    display: block;
    position: relative;
    height: 700px;
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
  .galeria__footnote {
    padding: 20px 80px 0;
    max-width: 700px;
  }

  /* Images */
  .galeria__d-img--click {
    cursor: pointer;
  }
  .galeria__d-img--click img {
    transition: transform 0.4s ease;
  }
  .galeria__d-img--click:hover img {
    transform: scale(1.03);
  }

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
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 20px;
  }
  .galeria__d-q-logo {
    width: 250px;
    height: auto;
    object-fit: contain;
  }
}
</style>
