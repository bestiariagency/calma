<script setup>
import { adminErrorText as t } from '../../data/adminShellText.js'

// Último recurso (sin Logo/Button/iconos): se usa si el chunk de la pantalla de error tampoco carga.
const reload = () => window.location.reload()
</script>

<template>
  <main class="grid min-h-screen place-items-center bg-app-bg p-4 text-center font-sans text-text">
    <div class="flex max-w-md flex-col items-center gap-4">
      <h1 class="text-xl font-bold">{{ t.chunk.title }}</h1>
      <p class="text-sm text-text-2">{{ t.chunk.help }}</p>
      <button type="button" class="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-on-accent focus-visible:outline-2 focus-visible:outline-offset-2" @click="reload">
        {{ t.reload }}
      </button>
    </div>
  </main>
</template>
