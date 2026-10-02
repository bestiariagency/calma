// Lógica pura del historial: compara dos estados de una clave (sección o datos de la empresa) campo a campo,
// siguiendo el esquema de contenido. Solo devuelve los campos que difieren.
import { CONTENT_SCHEMA } from '../data/contentSchema.js'
import { getAt, joinPath } from './sectionEditor.js'

export const SETTINGS_KEY = 'site_settings' // clave de la fila única de datos de la empresa en content_revisions
const COMPANY_SCHEMA_KEY = 'company'

export const schemaKeyOf = key => (key === SETTINGS_KEY ? COMPANY_SCHEMA_KEY : key)
export const sectionLabelOf = (key, schema = CONTENT_SCHEMA) => schema[schemaKeyOf(key)]?.label ?? key

const asText = value => (typeof value === 'string' ? value : '')
const imageRef = image => image?.media_id ?? image?.src ?? null
const asImage = image => (image && typeof image === 'object' ? image : null)

// "Enlaces 2: Texto del enlace"; si el ítem de la lista es la propia imagen: "Imagen 3".
function leafLabel(field, owner) {
  if (!owner) return field.label
  return field.path === '' ? `${field.label} ${owner.n}` : `${owner.list.label} ${owner.n}: ${field.label}`
}

function fieldChanges(field, label, path, { before, after, text }) {
  if (field.type !== 'image') {
    const [a, b] = [asText(getAt(before, path)), asText(getAt(after, path))]
    return a === b ? [] : [{ path, label, kind: 'text', before: a, after: b }]
  }
  const [imgA, imgB] = [asImage(getAt(before, path)), asImage(getAt(after, path))]
  const changes = []
  if (imageRef(imgA) !== imageRef(imgB)) changes.push({ path, label, kind: 'image', before: imgA, after: imgB })
  const [altA, altB] = [asText(imgA?.alt), asText(imgB?.alt)]
  if (altA !== altB) changes.push({ path: joinPath(path, 'alt'), label: text.altOf(label), kind: 'text', before: altA, after: altB })
  return changes
}

function walk(fields, context, prefix = '', owner = null) {
  return fields.flatMap(field => {
    const path = joinPath(prefix, field.path)
    if (field.type === 'list') {
      return Array.from({ length: field.maxItems }, (_, index) =>
        walk(field.fields, context, joinPath(path, index), { list: field, n: index + 1 }),
      ).flat()
    }
    return fieldChanges(field, leafLabel(field, owner), path, context)
  })
}

// `text.altOf(label)` aporta el nombre del texto alternativo de una imagen.
// → [{ path, label, kind: 'text' | 'image', before, after }]
export function diffSnapshots(key, before, after, { schema = CONTENT_SCHEMA, text }) {
  const fields = schema[schemaKeyOf(key)]?.fields
  return fields ? walk(fields, { before, after, text }) : []
}

// "Cambió Título y Texto del botón" / "Cambió Título, Imagen y 3 más" / texto de "sin cambios visibles".
export function summarizeChanges(changes, text, maxNamed = 2) {
  if (!changes.length) return text.summaryNone
  const labels = [...new Set(changes.map(change => change.label))]
  const named = labels.slice(0, maxNamed)
  const extra = labels.length - named.length
  const names = named.length > 1 && !extra ? `${named.slice(0, -1).join(', ')} y ${named.at(-1)}` : named.join(', ')
  return text.summary(names, extra)
}
