<script setup>
// Raíz del panel: carga Inter y los recursos exclusivos del panel (la landing no los descarga) y monta ToastHost una vez.
import './adminStyles.js'
import ToastHost from '../../components/admin/ui/ToastHost.vue'
</script>

<template>
  <div class="min-h-screen bg-app-bg font-sans text-text scheme-dark">
    <RouterView />
    <ToastHost />
  </div>
</template>
