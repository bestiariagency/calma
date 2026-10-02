<script setup>
import { adminUiText } from '../../../data/adminUiText.js'
import Logo from '../ui/Logo.vue'

// Logo del sidebar (spec 3.28): enlace al inicio del panel; colapsado = isotipo.
defineProps({ collapsed: { type: Boolean, default: false } })
</script>

<template>
  <RouterLink
    :to="{ name: 'admin-home' }"
    :aria-label="adminUiText.logoHomeLabel"
    :class="[
      'flex h-11 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      collapsed ? 'w-full justify-center' : '',
    ]"
  >
    <Logo :variant="collapsed ? 'iso' : 'full'" size="sm" decorative />
  </RouterLink>
</template>
