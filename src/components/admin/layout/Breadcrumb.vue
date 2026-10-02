<script setup>
import { ChevronRight } from 'lucide-vue-next'
import { adminShellText } from '../../../data/adminShellText.js'

// Spec 3.9 / 4.2: en móvil solo el título de la sección actual (Mono 14, truncado).
defineProps({ items: { type: Array, required: true } }) // [{ label, to? }]; el último es la página actual
</script>

<template>
  <nav :aria-label="adminShellText.breadcrumb" class="min-w-0">
    <ol class="flex min-w-0 items-center gap-2 font-mono text-xs/4 max-md:text-sm/5">
      <template v-for="(item, index) in items" :key="item.label">
        <li v-if="index < items.length - 1" class="flex items-center gap-2 max-md:hidden">
          <RouterLink
            v-if="item.to"
            :to="item.to"
            class="rounded-sm py-2 text-text-2 underline-offset-4 hover:text-text hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {{ item.label }}
          </RouterLink>
          <span v-else class="text-text-2">{{ item.label }}</span>
          <ChevronRight :size="14" class="text-text-3" aria-hidden="true" />
        </li>
        <li v-else class="min-w-0 truncate font-bold text-text" aria-current="page">{{ item.label }}</li>
      </template>
    </ol>
  </nav>
</template>
