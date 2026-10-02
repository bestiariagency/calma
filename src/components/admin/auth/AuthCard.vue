<script setup>
import Logo from '../ui/Logo.vue'
import SkipLink from '../ui/SkipLink.vue'

// Marco de las pantallas de acceso (spec 4.1): card centrada ≥ 768; en móvil sin card, arriba y a ancho completo.
defineProps({
  title: { type: String, required: true },
  help: { type: String, default: '' },
})
</script>

<template>
  <SkipLink />
  <main id="contenido" tabindex="-1" class="grid min-h-screen place-items-center p-4 max-md:place-items-start max-md:pt-12">
    <div
      class="flex w-full max-w-(--size-login-card) flex-col gap-6 rounded-lg border border-line bg-surface-2 p-8 max-md:border-0 max-md:bg-transparent max-md:p-0"
    >
      <header class="flex flex-col items-center gap-4 text-center">
        <Logo />
        <div class="flex flex-col gap-1">
          <h1 class="font-mono text-xl/7 font-bold tracking-title text-text max-md:text-lg/6">{{ title }}</h1>
          <p v-if="help" class="font-sans text-sm/5 text-text-2">{{ help }}</p>
        </div>
      </header>
      <slot />
    </div>
  </main>
</template>
