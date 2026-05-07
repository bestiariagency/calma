<script setup>
import { FOOTER } from '../../data/content.js'

const anchors = {
  Producto:  '#producto',
  Galería:   '#galeria',
  Contacto:  '#contacto',
}
</script>

<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__top">
        <img src="/images/logos/logo-blanco-calma.svg" alt="CALMA" class="footer__logo" />
        <nav class="footer__links">
          <a
            v-for="link in FOOTER.links"
            :key="link"
            :href="anchors[link]"
            class="footer__link"
          >{{ link }}</a>
        </nav>
      </div>
      <div class="footer__bottom">
        <span class="footer__copy">{{ FOOTER.copyright }}</span>
        <span class="footer__dev">Sitio desarrollado por Bestiari · <a href="https://www.bestiari.es" target="_blank" rel="noopener noreferrer" class="footer__dev-link">www.bestiari.es</a></span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--c-darkest);
  border-top: 1px solid var(--c-b-deep);
}
.footer__inner {
  max-width: 1440px;
  margin: 0 auto;
  padding: 40px 28px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.footer__top {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.footer__logo {
  height: 100px;
  width: auto;
  object-fit: contain;
}
.footer__links { display: flex; gap: 32px; }
.footer__link  { font-size: 12px; color: var(--c-muted); transition: color 0.2s; }
.footer__link:hover { color: var(--c-text); }

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.footer__copy     { font-size: 11px; color: var(--c-b-dark); }
.footer__dev      { font-size: 11px; color: var(--c-faint); }
.footer__dev-link { color: var(--c-faint); text-decoration: underline; text-underline-offset: 3px; transition: color 0.2s; }
.footer__dev-link:hover { color: var(--c-muted); }

@media (min-width: 768px) {
  .footer__inner  { padding: 40px 80px; }
  .footer__top    { flex-direction: row; align-items: center; justify-content: space-between; }
}
</style>
