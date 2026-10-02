import { ref, readonly } from 'vue'

// Error que abortó una navegación del panel. Estado de módulo: lo escribe router.onError y lo lee App.vue.
const error = ref(null)

export const panelError = readonly(error)
export const setPanelError = e => { error.value = e }
export const clearPanelError = () => { error.value = null }
