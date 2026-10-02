import { computed, ref } from 'vue'

// Estado de guardado que muestra el header. La Etapa 8 (editor) lo alimenta con setSaveState()
// y registra su acción con registerSave(). Estados: idle (cargando) | saved | dirty | saving | error | offline.
const state = ref({ status: 'saved', savedAt: null })
let saveHandler = null

export const setSaveState = patch => (state.value = { ...state.value, ...patch })
export const registerSave = handler => {
  saveHandler = handler
  return () => saveHandler === handler && (saveHandler = null)
}
export const resetSaveState = () => {
  state.value = { status: 'saved', savedAt: null }
  saveHandler = null
}

export function useSaveState() {
  return {
    status: computed(() => state.value.status),
    savedAt: computed(() => state.value.savedAt),
    canSave: computed(() => ['dirty', 'error'].includes(state.value.status)), // en error, Guardar reintenta
    save: () => saveHandler?.(),
  }
}
