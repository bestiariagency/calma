import { computed, ref, shallowRef, watch } from 'vue'
import { adminHistoryText as t } from '../../data/adminEditorText.js'
import { diffSnapshots } from '../../lib/historyDiff.js'
import { collectMediaIds } from '../../lib/sectionEditor.js'
import { fetchMediaByIds } from '../../services/mediaService.js'

// Diferencias entre una revisión y lo publicado AHORA. Rojo = lo publicado hoy (lo que se reemplaza);
// verde = lo que traería esa versión. Las fotos del bucket se resuelven (media_id → URL) al abrir.
export function useRevisionDiff(row, currentByKey) {
  const phase = ref('idle') // idle | loading | ready | error
  const media = shallowRef({})

  const changes = computed(() => {
    if (!row.value) return []
    const current = currentByKey.value[row.value.key]
    return current ? diffSnapshots(row.value.key, current, row.value.snapshot, { text: t }) : []
  })

  async function load() {
    const ids = collectMediaIds(changes.value.filter(change => change.kind === 'image').map(({ before, after }) => [before, after]))
    if (!ids.length) {
      media.value = {}
      phase.value = 'ready'
      return
    }
    phase.value = 'loading'
    try {
      media.value = await fetchMediaByIds(ids)
      phase.value = 'ready'
    } catch {
      phase.value = 'error'
    }
  }

  watch(row, next => (next ? load() : (phase.value = 'idle')), { immediate: true })

  return { changes, media, phase, reload: load }
}
