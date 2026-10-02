import { computed, ref, shallowRef } from 'vue'
import { summarizeOrphans, cleanOrphans } from '../../lib/mediaCleanup.js'
import { deleteMediaRecord, listOrphanMedia, removeStorageObject } from '../../services/mediaService.js'

// Fotos sin uso: lista, totales y borrado con progreso y resumen (borradas / fallidas).
export function useMediaCleanup() {
  const phase = ref('loading') // loading | ready | error
  const items = shallowRef([])
  const running = ref(false)
  const progress = ref({ done: 0, total: 0 })
  const result = ref(null) // { deleted, freedBytes, failed }

  const totals = computed(() => summarizeOrphans(items.value))

  async function load({ silent = false } = {}) {
    if (!silent) phase.value = 'loading'
    try {
      items.value = await listOrphanMedia()
      phase.value = 'ready'
    } catch {
      phase.value = 'error'
    }
  }

  async function clean() {
    if (running.value || !items.value.length) return null
    running.value = true
    result.value = null
    progress.value = { done: 0, total: items.value.length }
    try {
      result.value = await cleanOrphans(items.value, {
        removeObject: removeStorageObject,
        deleteRecord: deleteMediaRecord,
        onProgress: value => (progress.value = value),
      })
    } finally {
      running.value = false
    }
    await load({ silent: true }) // lo que falló sigue listado
    return result.value
  }

  return { phase, items, totals, running, progress, result, load, clean, dismissResult: () => (result.value = null) }
}
