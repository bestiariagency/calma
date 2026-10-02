<script setup>
import { defineAsyncComponent } from 'vue'
import { panelError } from './composables/admin/usePanelError.js'
import PanelErrorFallback from './components/admin/PanelErrorFallback.vue'

// Carga diferida: la landing no descarga la pantalla de error. Si su chunk también falló, queda el fallback sin dependencias.
const PanelErrorView = defineAsyncComponent({
  loader: () => import('./views/admin/PanelErrorView.vue'),
  errorComponent: PanelErrorFallback,
})
</script>

<template>
  <PanelErrorView v-if="panelError" :error="panelError" />
  <RouterView v-else />
</template>
