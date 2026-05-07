<script setup>
import TheNav         from '../layout/TheNav.vue'
import TheMobileMenu  from '../layout/TheMobileMenu.vue'
import AppButton      from '../ui/AppButton.vue'
import { HERO, WHATSAPP_URL } from '../../data/content.js'
import { useMobileMenu } from '../../composables/useMobileMenu.js'


const { isOpen, toggle, close } = useMobileMenu()


</script>

<template>
  <section id="inicio" class="hero">
    <img class="hero__bg" src="/images/hero-dia.png" alt="Tinaja artesanal de hormigón en jardín" />
    <div class="hero__overlay" />

    <TheNav :isMenuOpen="isOpen" @toggleMenu="toggle" />

    <div class="hero__content">
      <!-- Mobile only: tag -->
      <!-- <p class="hero__tag">{{ HERO.tag }}</p> -->

      <!-- Mobile title -->
      <!-- <h1 class="hero__title hero__title--mobile" v-html="HERO.titleMobile.replace(/\n/g, '<br>')" /> -->
      <!-- Desktop title -->
      <!-- <h1 class="hero__title hero__title--desktop">{{ HERO.titleDesktop }}</h1> -->
       <div class="hero__logo-wrap">
        <img src="/images/logos/logo-blanco-calma.svg" alt="Calma" class="hero__logo" />
       </div>
      <!-- Mobile subtitle -->
      <!-- <p class="hero__sub hero__sub--mobile" v-html="HERO.subtitleMobile.replace(/\n/g, '<br>')" /> -->
      <!-- Desktop subtitle -->
      <!-- <p class="hero__sub hero__sub--desktop">{{ HERO.subtitle }}</p> -->

      <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" class="hero__cta-wrap">
        <AppButton :label="HERO.cta" size="sm" wa class="hero__btn" />
      </a>
    </div>

    <TheMobileMenu :isOpen="isOpen" @close="close" />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 680px;
  background: var(--c-mid);
  overflow: hidden;
}
.hero__bg {
  position: absolute;
  inset: 0;
  object-position: center;
}
.hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, var(--c-mid) 30%, transparent 100%);
}
.hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 0 24px;
  text-align: center;
}
.hero__tag {
  font-size: 9px;
  font-weight: 700;
  color: var(--c-accent);
  letter-spacing: 4px;
}
.hero__title {
  font-weight: 100;
  color: var(--c-text);
  text-align: center;
}
.hero__title--mobile  { font-size: 30px; line-height: 0.95; }
.hero__title--desktop { display: none; }

.hero__sub {
  font-size: 22px;
  color: var(--c-warm);
  line-height: 1.3;
}
.hero__sub--desktop { display: none; }

.hero__cta-wrap { display: inline-flex; }

@media (min-width: 768px) {
  .hero {
    min-height: 100vh;
  }
  .hero__overlay {
    background: rgba(0, 0, 0, 0.55);
  }
  .hero__tag { display: none; }

  .hero__title--mobile  { display: none; }
  .hero__title--desktop {
    display: block;
    font-size: 88px;
    font-weight: 10;
    line-height: 1;
    max-width: 900px;
    text-align: center;
  }
  .hero__sub--mobile  { display: none; }
  .hero__sub--desktop {
    display: block;
    color: var(--c-white);
  }
  .hero__btn { font-size: 15px; padding: 16px 44px; }
}
</style>
