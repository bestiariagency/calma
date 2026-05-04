<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import { QUE_ES }  from '../../data/content.js'
</script>

<template>
  <section id="producto" class="quees">
    <!-- Mobile: image at top -->
    <div class="quees__img-wrap">
      <img src="/images/drones.png" alt="Vista aérea de tinaja de hormigón" />
    </div>

    <!-- Text panel -->
    <div class="quees__text">
      <SectionLabel :text="QUE_ES.label" />
      <h2 class="quees__title">{{ QUE_ES.title }}</h2>
      <div class="quees__body">
        <p v-for="(p, i) in QUE_ES.paragraphs" :key="i" class="quees__p">{{ p }}</p>
      </div>
      <div class="quees__line" />
    </div>
  </section>
</template>

<style scoped>
.quees {
  background: var(--c-dark);
  display: flex;
  flex-direction: column;
}

/* Mobile: image at top */
.quees__img-wrap {
  width: 100%;
  height: 280px;
  flex-shrink: 0;
  overflow: hidden;
}
.quees__img-wrap img { object-position: center; }

.quees__text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 18px;
  padding: 48px 28px;
}
.quees__title {
  font-size: 38px;
  font-weight: 800;
  color: var(--c-text);
  line-height: 1.05;
}
.quees__body { display: flex; flex-direction: column; gap: 16px; }
.quees__p    { font-size: 15px; color: var(--c-muted); line-height: 1.6; }
.quees__line { width: 36px; height: 2px; background: var(--c-accent); }

/* ─── Medium (2 rows) ────────────────────────────────── */
@media (min-width: 768px) {
  .quees {
    flex-direction: column;
    min-height: 100vh;
  }
  .quees__img-wrap {
    width: 100%;
    height: 50vh;
    flex-shrink: 0;
  }
  .quees__text {
    flex: 1;
    padding: 48px 64px;
    gap: 24px;
    justify-content: center;
  }
  .quees__title { font-size: 44px; }
  .quees__p     { font-size: 17px; max-width: 680px; }
  .quees__line  { width: 48px; }
}

/* ─── Desktop (2 columns) ────────────────────────────── */
@media (min-width: 1200px) {
  .quees {
    flex-direction: row;
  }
  .quees__img-wrap {
    width: 660px;
    height: auto;
    min-height: 100vh;
    flex-shrink: 0;
  }
  .quees__text {
    min-height: 100vh;
    padding: 0 80px;
    gap: 28px;
  }
  .quees__title { font-size: 48px; max-width: 580px; }
  .quees__p     { font-size: 20px; max-width: 560px; }
}
</style>
