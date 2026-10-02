import { ref } from 'vue'
import { adminHistoryText as t } from '../../data/adminEditorText.js'
import { classifyHistoryError } from '../../lib/historyErrors.js'
import { clearContentCache } from '../../lib/contentCache.js'
import { restoreRevision } from '../../services/historyService.js'
import { useToast } from './useToast.js'

// Restaurar una revisión: estado de carga y error legible; al terminar avisa (toast) y llama a `onRestored`.
export function useRestoreRevision(onRestored) {
  const toast = useToast()
  const restoring = ref(false)
  const error = ref(null) // { title, detail }

  async function restore(row) {
    if (restoring.value) return false
    restoring.value = true
    error.value = null
    try {
      await restoreRevision(row.id)
    } catch (caught) {
      error.value = t.restoreErrors[classifyHistoryError(caught)]
      return false
    } finally {
      restoring.value = false
    }
    clearContentCache() // la landing de este navegador parte del seed y trae lo nuevo
    toast.success(t.restored, { detail: t.restoredDetail(row.sectionLabel) })
    await onRestored?.()
    return true
  }

  return { restoring, error, restore, clearError: () => (error.value = null) }
}
