// Lógica pura de la tabla del historial: filas con resumen, filtro por sección, orden y paginación.
import { CONTENT_SCHEMA } from '../data/contentSchema.js'
import { landingKeys } from './adminMenu.js'
import { diffSnapshots, SETTINGS_KEY, sectionLabelOf, summarizeChanges } from './historyDiff.js'

export const PAGE_SIZE = 25

const byNewest = (a, b) => (a.changed_at < b.changed_at ? 1 : a.changed_at > b.changed_at ? -1 : b.id - a.id)

// El snapshot es el estado ANTERIOR al guardado: lo que cambió ese guardado = snapshot → siguiente snapshot de la
// misma clave (o el estado actual si es el último). `currentByKey[key]` = contenido publicado ahora.
export function buildHistoryRows(revisions, currentByKey, { schema = CONTENT_SCHEMA, text }) {
  const newestFirst = [...revisions].sort(byNewest)
  const after = { ...currentByKey } // por clave: estado que "sigue" a la revisión que se está recorriendo
  return newestFirst.map(revision => {
    const next = after[revision.key] ?? revision.snapshot
    after[revision.key] = revision.snapshot
    const changes = diffSnapshots(revision.key, revision.snapshot, next, { schema, text })
    return {
      id: revision.id,
      key: revision.key,
      sectionLabel: sectionLabelOf(revision.key, schema),
      changedAt: revision.changed_at,
      changedBy: revision.changed_by ?? null,
      snapshot: revision.snapshot,
      summary: summarizeChanges(changes, text),
    }
  })
}

// Opciones del filtro: "Todas las secciones" + las secciones del esquema (la empresa va con la clave `site_settings`).
export function sectionFilterOptions(text, schema = CONTENT_SCHEMA) {
  const keys = [...landingKeys(schema), SETTINGS_KEY]
  return [{ value: '', label: text.allSections }, ...keys.map(key => ({ value: key, label: sectionLabelOf(key, schema) }))]
}

export const filterRows = (rows, key) => (key ? rows.filter(row => row.key === key) : rows)
export const sortRows = (rows, newestFirst) => (newestFirst ? rows : [...rows].reverse())

// `page` base 1, acotada al rango válido. → { items, page, pages, from, to, total } (from/to base 1; 0 si vacío)
export function paginate(rows, page, size = PAGE_SIZE) {
  const total = rows.length
  const pages = Math.max(1, Math.ceil(total / size))
  const current = Math.min(Math.max(1, page), pages)
  const start = (current - 1) * size
  const items = rows.slice(start, start + size)
  return { items, page: current, pages, from: total ? start + 1 : 0, to: start + items.length, total }
}
