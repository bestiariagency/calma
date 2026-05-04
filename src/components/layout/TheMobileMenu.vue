<script setup>
import { MOBILE_MENU_LINKS } from '../../data/content.js'

defineProps({
  isOpen: { type: Boolean, required: true },
})
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="menu" :class="{ 'menu--open': isOpen }" role="dialog" aria-modal="true" aria-label="Menú de navegación">

      <!-- Header -->
      <div class="menu__header">
        <span class="menu__logo">CALMA</span>
        <button class="menu__close" @click="$emit('close')" aria-label="Cerrar menú">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6"  x2="6"  y2="18" />
            <line x1="6"  y1="6"  x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="menu__divider" />

      <!-- Nav items -->
      <nav class="menu__nav">
        <a
          v-for="link in MOBILE_MENU_LINKS"
          :key="link.href"
          :href="link.href"
          class="menu__item"
          :class="{ 'menu__item--accent': link.accent }"
          :target="link.accent ? '_blank' : undefined"
          :rel="link.accent ? 'noopener noreferrer' : undefined"
          @click="$emit('close')"
        >
          <span>{{ link.label }}</span>
          <svg v-if="link.accent" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </nav>

      <!-- Footer info -->
      <div class="menu__foot">
        <span class="menu__tag">TINAJAS DE CONCRETO ARTESANAL</span>
        <a href="mailto:info@calma.es" class="menu__contact">info@calma.es</a>
        <a href="tel:+34600000000"     class="menu__contact">+34 600 000 000</a>
      </div>

    </div>
  </Teleport>
</template>

<style scoped>
.menu {
  position: fixed;
  inset: 0;
  background: var(--c-mid);
  z-index: 100;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}
.menu--open { transform: translateX(0); }

.menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  flex-shrink: 0;
}
.menu__logo  { font-size: 16px; font-weight: 700; color: var(--c-text); letter-spacing: 3px; }
.menu__close { color: var(--c-accent); display: flex; align-items: center; }
.menu__divider { height: 1px; background: var(--c-b-deep); flex-shrink: 0; }

.menu__nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
}
.menu__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 28px;
  font-size: 26px;
  font-weight: 800;
  color: var(--c-text);
  letter-spacing: 2px;
  border-bottom: 1px solid var(--c-b-deep);
  transition: color 0.2s;
}
.menu__item--accent { color: var(--c-accent); border-bottom: none; }
.menu__item:active  { color: var(--c-accent); }

.menu__foot {
  flex-shrink: 0;
  padding: 22px 28px 32px;
  border-top: 1px solid var(--c-b-deep);
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.menu__tag     { font-size: 9px; color: var(--c-b-dark); letter-spacing: 2px; }
.menu__contact { font-size: 13px; color: var(--c-muted); }
</style>
