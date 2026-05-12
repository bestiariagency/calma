<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import AppButton    from '../ui/AppButton.vue'
import { CTA, WHATSAPP_URL } from '../../data/content.js'
</script>

<template>
  <section id="contacto" class="cta">
    <img class="cta__bg" src="/images/parcela.png" alt="Jardín con tinaja instalada" />
    <div class="cta__overlay" />

    <!-- ─── Mobile ──────────────────────────────────── -->
    <div class="cta__m">
      <SectionLabel :text="CTA.label" />
      <h2 class="cta__m-title" v-html="CTA.title.replace(/\n/g, '<br>')" />
      <p class="cta__m-sub">{{ CTA.subtitle }}</p>
      <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" class="cta__m-btn-wrap">
        <AppButton :label="CTA.cta" size="sm" wa />
      </a>
      <p class="cta__m-contact">{{ CTA.email }}  ·  {{ CTA.phone }}</p>
    </div>

    <!-- ─── Desktop ─────────────────────────────────── -->
    <div class="cta__d">
      <!-- Contact sidebar -->
      <div class="cta__d-contact">
        <div class="cta__d-contact-line" />
        <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" class="cta__d-contact-text">{{ CTA.email }}</a>
        <a :href="`tel:${CTA.phone.replace(/\s/g, '')}`" class="cta__d-contact-text">{{ CTA.phone }}</a>
      </div>

      <!-- Main CTA content -->
      <div class="cta__d-main">
        <SectionLabel :text="CTA.label" />
        <h2 class="cta__d-title" v-html="CTA.title.replace(/\n/g, '<br>')" />
        <p class="cta__d-sub">{{ CTA.subtitle }}</p>
        <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer">
          <AppButton :label="CTA.cta" size="md" wa />
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  position: relative;
  overflow: hidden;
  background: var(--c-darkest);
  min-height: 100vh;
}
.cta__bg {
  position: absolute;
  inset: 0;
  object-position: center;
}
.cta__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--c-darkest) 0%, rgba(0,0,0,0.53) 51%, #000 92%);
}

/* ─── Mobile ─────────────────────────────────────────── */
.cta__d { display: none; }

.cta__m {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  text-align: center;
  padding: 60px 28px;
  min-height: 100vh;
}
.cta__m-title {
  font-size: 54px;
  font-weight: 900;
  color: var(--c-text);
  line-height: 0.95;
}
.cta__m-sub     { font-size: 15px; color: var(--c-muted); line-height: 1.5; max-width: 320px; }
.cta__m-btn-wrap{ width: 100%; max-width: 334px; }
.cta__m-btn-wrap .btn, .cta__m-btn-wrap :deep(.btn) { width: 100%; }
.cta__m-contact { font-size: 12px; color: var(--c-b-dark); }

/* ─── Desktop ────────────────────────────────────────── */
@media (min-width: 768px) {
  .cta__m { display: none; }
  .cta {
    min-height: 100vh;
  }
  .cta__overlay {
    background: linear-gradient(to bottom, var(--c-darkest) 0%, rgba(0,0,0,0.53) 51%, #000 92%);
  }
  .cta__d {
    display: block;
    position: relative;
    z-index: 1;
    min-height: 100vh;
    max-width: 1440px;
    margin: 0 auto;
  }

  /* Contact sidebar */
  .cta__d-contact {
    position: absolute;
    left: 325px; top: 0;
    width: 329px; height: 670px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
  }
  .cta__d-contact-line { width: 32px; height: 2px; background: var(--c-accent); }
  .cta__d-contact-text { font-size: 15px; color: var(--c-white); }
  .cta__d-contact-text:hover { color: var(--c-accent); }

  /* Main CTA */
  .cta__d-main {
    position: absolute;
    left: 657px; top: 0;
    width: 697px; height: 659px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 32px;
  }
  .cta__d-title {
    font-size: 80px;
    font-weight: 900;
    color: var(--c-text);
    line-height: 0.95;
    max-width: 600px;
  }
  .cta__d-sub { font-size: 18px; color: var(--c-white); line-height: 1.5; max-width: 520px; }
}
</style>
