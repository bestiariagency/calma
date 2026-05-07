<script setup>
import IconWhatsApp from '../ui/IconWhatsApp.vue'
import { NAV_LINKS } from '../../data/content.js'

defineProps({
  isMenuOpen: { type: Boolean, default: false },
})
defineEmits(['toggleMenu'])
</script>

<template>
  <nav class="nav">
    <div class="nav__inner">
      <!-- <a href="#inicio" class="nav__logo">CALMA</a> -->

      <!-- Desktop links -->
      <div class="nav__links">
        <template v-for="link in NAV_LINKS" :key="link.href">
          <a
            v-if="!link.cta"
            :href="link.href"
            class="nav__link"
          >{{ link.label }}</a>
          <a
            v-else
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="nav__cta"
          >
            <IconWhatsApp />{{ link.label }}
          </a>
        </template>
      </div>

      <!-- Mobile hamburger -->
      <button class="nav__burger" @click="$emit('toggleMenu')" aria-label="Abrir menú">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <line x1="3" y1="6"  x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 10;
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
}
.nav__logo {
  font-size: 16px;
  font-weight: 700;
  color: var(--c-text);
  letter-spacing: 3px;
}
.nav__links { display: none; gap: 32px; align-items: center; }
.nav__link  { font-size: 13px; color: var(--c-white); transition: color 0.2s; }
.nav__link:hover { color: var(--c-accent); }
.nav__cta {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--c-accent);
  color: var(--c-mid);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 10px 20px;
  border-radius: 2px;
  transition: opacity 0.2s;
}
.nav__cta:hover { opacity: 0.85; }

.nav__burger { color: var(--c-accent); display: flex; align-items: center; }

@media (min-width: 768px) {
  .nav__inner { padding: 28px 80px; }
  .nav__logo  { font-size: 20px; }
  .nav__links { display: flex; }
  .nav__burger{ display: none; }
}
</style>
