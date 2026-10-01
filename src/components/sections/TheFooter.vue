<script setup>
import { FOOTER } from '../../data/content.js'

const anchors = {
  Producto:  '#producto',
  Galería:   '#galeria',
  Contacto:  '#contacto',
}
</script>

<template>
  <footer class="border-t border-t-b-deep bg-darkest">
    <div v-reveal.edge class="mx-auto flex max-w-[1440px] flex-col gap-8 px-[28px] py-10 md:px-20">
      <div data-reveal="text-soft" class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <img src="/images/logos/logo-blanco-calma.svg" alt="CALMA" class="h-[100px] w-auto object-contain" />
        <nav class="flex gap-8">
          <a
            v-for="link in FOOTER.links"
            :key="link"
            :href="anchors[link]"
            class="text-[12px] text-muted transition-[color] duration-200 ease-[ease] hover:text-text"
          >{{ link }}</a>
        </nav>
      </div>
      <div data-reveal="text-soft" class="flex items-center justify-between">
        <span class="text-[11px] text-b-dark">{{ FOOTER.copyright }}</span>
        <span class="text-[11px] text-faint">Sitio desarrollado por Bestiari · <a href="https://www.bestiari.es" target="_blank" rel="noopener noreferrer" class="underline underline-offset-3 transition-[color] duration-200 ease-[ease] hover:text-muted">www.bestiari.es</a></span>
      </div>
    </div>
  </footer>
</template>
