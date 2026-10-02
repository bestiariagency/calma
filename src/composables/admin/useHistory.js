import { computed, ref, shallowRef } from 'vue'
import { adminHistoryText as t } from '../../data/adminEditorText.js'
import { buildHistoryRows, filterRows, paginate, sortRows } from '../../lib/historyList.js'
import { fetchCurrentContent, fetchRevisions } from '../../services/historyService.js'

// Carga y vista de la tabla del historial: todo en memoria (≤ 30 revisiones por clave), filtro/orden/página en el cliente.
export function useHistory() {
  const phase = ref('loading') // loading | ready | error
  const rows = shallowRef([])
  const currentByKey = shallowRef({})
  const sectionKey = ref('')
  const newestFirst = ref(true)
  const requestedPage = ref(1)

  const filtered = computed(() => sortRows(filterRows(rows.value, sectionKey.value), newestFirst.value))
  const view = computed(() => paginate(filtered.value, requestedPage.value))

  async function load() {
    phase.value = 'loading'
    try {
      const [revisions, current] = await Promise.all([fetchRevisions(), fetchCurrentContent()])
      currentByKey.value = current
      rows.value = buildHistoryRows(revisions, current, { text: t })
      phase.value = 'ready'
    } catch {
      phase.value = 'error'
    }
  }

  const setSection = key => {
    sectionKey.value = key
    requestedPage.value = 1
  }
  const toggleSort = () => {
    newestFirst.value = !newestFirst.value
    requestedPage.value = 1
  }
  const goToPage = page => (requestedPage.value = page)

  return { phase, rows, currentByKey, sectionKey, newestFirst, view, load, setSection, toggleSort, goToPage }
}
