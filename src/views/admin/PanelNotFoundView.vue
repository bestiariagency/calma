<script setup>
import { FileQuestion } from 'lucide-vue-next'
import { adminShellText as t } from '../../data/adminShellText.js'
</script>

<template>
  <section class="flex flex-col items-center gap-3 py-16 text-center">
    <FileQuestion :size="32" class="text-text-3" aria-hidden="true" />
    <h1 class="font-mono text-sm/5 font-bold text-text">{{ t.notFoundTitle }}</h1>
    <p class="font-sans text-sm/5 text-text-2">{{ t.notFoundHelp }}</p>
    <RouterLink
      :to="{ name: 'admin-home' }"
      class="inline-flex min-h-6 items-center rounded-sm px-2 pointer-coarse:min-h-11 text-sm text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {{ t.backToPanel }}
    </RouterLink>
  </section>
</template>
