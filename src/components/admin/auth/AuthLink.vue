<script setup>
// Enlace secundario subrayado de las pantallas de acceso (acceso ↔ recuperar contraseña).
defineProps({ to: { type: Object, required: true } })
</script>

<template>
  <RouterLink
    :to="to"
    class="self-center inline-flex min-h-6 items-center rounded-sm px-2 pointer-coarse:min-h-11 text-[13px] text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <slot />
  </RouterLink>
</template>
