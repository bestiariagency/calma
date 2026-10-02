// Lógica pura del editor de secciones: rutas, aplanado del esquema, diff, payload, validación y errores.
import { formatError, hasNormalizer, normalizeValue } from './fieldFormats.js'

// El esquema (src/data/contentSchema.js) es la fuente de verdad; la BD revalida con JSON Schema.

export const joinPath = (...parts) => parts.filter(part => part !== '' && part != null).join('.')

export function getAt(source, path) {
  return String(path)
    .split('.')
    .filter(Boolean)
    .reduce((node, key) => (node == null ? undefined : node[key]), source)
}

// Muta `target` (reactivo en el editor) creando objetos intermedios si faltan.
export function setAt(target, path, value) {
  const keys = String(path).split('.')
  const last = keys.pop()
  const parent = keys.reduce((node, key) => (node[key] ??= {}), target)
  parent[last] = value
}

export const cloneContent = content => JSON.parse(JSON.stringify(content))

export function deepEqual(a, b) {
  if (a === b) return true
  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false
  if (Array.isArray(a) !== Array.isArray(b)) return false
  const keysA = Object.keys(a)
  return keysA.length === Object.keys(b).length && keysA.every(key => deepEqual(a[key], b[key]))
}

// Longitud como la cuenta Postgres (caracteres, no unidades UTF-16: un emoji cuenta 1).
export const charLength = value => [...String(value ?? '')].length

// Campos "hoja" editables, con ruta absoluta: text/textarea/... y el `alt` de cada imagen.
export function flattenFields(fields, prefix = '') {
  return fields.flatMap(field => {
    const path = joinPath(prefix, field.path)
    if (field.type === 'list') {
      return Array.from({ length: field.maxItems }, (_, index) => flattenFields(field.fields, joinPath(path, index))).flat()
    }
    if (field.type === 'image') {
      return [
        { type: 'alt', path: joinPath(path, 'alt'), label: field.altLabel, maxLength: field.altMaxLength, required: true },
        { type: 'imageRef', path }, // qué archivo muestra (media_id/src/width/height): se cambia al reemplazar la foto
      ]
    }
    return [{ type: field.type, path, label: field.label, maxLength: field.maxLength, required: Boolean(field.required) }]
  })
}

const IMAGE_REF_KEYS = ['media_id', 'src', 'width', 'height']
const pickRef = image => Object.fromEntries(IMAGE_REF_KEYS.map(key => [key, image?.[key] ?? null]))
const leafValue = (leaf, source) => (leaf.type === 'imageRef' ? pickRef(getAt(source, leaf.path)) : getAt(source, leaf.path))

export const isDirty = (loaded, working) => Boolean(loaded) && !deepEqual(loaded, working)

export function changedPaths(leaves, loaded, working) {
  return leaves.filter(leaf => !deepEqual(leafValue(leaf, loaded), leafValue(leaf, working))).map(leaf => leaf.path)
}

// Deja en `working` los campos tipados tal como se guardarán (trim; WhatsApp sin separadores). Muta; devuelve si cambió algo.
export function normalizeWorking(leaves, working) {
  let changed = false
  for (const leaf of leaves) {
    if (!hasNormalizer(leaf.type)) continue
    const value = getAt(working, leaf.path)
    const normalized = normalizeValue(leaf.type, value)
    if (normalized === value) continue
    setAt(working, leaf.path, normalized)
    changed = true
  }
  return changed
}

// Parte de lo cargado (conserva media_id/src/width/height de las imágenes) y aplica SOLO los campos del esquema.
export function buildPayload(loaded, working, leaves) {
  const payload = cloneContent(loaded)
  for (const leaf of leaves) {
    if (leaf.type === 'imageRef') setAt(payload, leaf.path, { ...getAt(payload, leaf.path), ...pickRef(getAt(working, leaf.path)) })
    else setAt(payload, leaf.path, normalizeValue(leaf.type, getAt(working, leaf.path)))
  }
  return payload
}

// Devuelve { [path]: mensaje } (vacío = válido). `text` aporta los mensajes en español.
export function validateSection(leaves, working, text) {
  const errors = {}
  for (const leaf of leaves) {
    if (leaf.type === 'imageRef') continue
    const raw = getAt(working, leaf.path)
    if (typeof raw !== 'string') {
      errors[leaf.path] = text.invalidValue
      continue
    }
    const value = normalizeValue(leaf.type, raw) // se valida lo que se guardaría
    const message = leafError(leaf, value, text)
    if (message) errors[leaf.path] = message
  }
  return errors
}

function leafError(leaf, value, text) {
  if (leaf.required && value.trim() === '') return leaf.type === 'alt' ? text.altRequired : text.requiredField
  if (leaf.maxLength && charLength(value) > leaf.maxLength) return text.overLimit(charLength(value) - leaf.maxLength)
  return formatError(leaf.type, value, text)
}

// Clasifica un error de Supabase/red: 'invalid' | 'permission' | 'session' | 'network' | 'unknown'.
export function classifySaveError(error, online = globalThis.navigator?.onLine !== false) {
  if (!error) return null
  const { code, status, message = '' } = error
  if (code === '23514') return 'invalid'
  if (code === '42501') return 'permission'
  if (status === 401 || code === 'PGRST301' || code === 'PGRST303') return 'session'
  if (status === 403) return 'permission'
  if (!online || (!code && (!status || status === 0) && /fetch|network|load failed|timeout/i.test(message))) return 'network'
  return 'unknown'
}

// Fuente de la imagen para el preview: archivo del bucket (media_id) o ruta estática (src).
export function resolveImagePreview(image, mediaById = {}) {
  if (!image) return { url: null, width: null, height: null, bytes: null, mime: null }
  const media = image.media_id ? mediaById[image.media_id] : null
  return {
    url: media?.url ?? image.src ?? null,
    width: media?.width ?? image.width ?? null,
    height: media?.height ?? image.height ?? null,
    bytes: media?.bytes ?? null,
    mime: media?.mime ?? null,
  }
}

export const collectMediaIds = content => {
  const ids = new Set()
  const walk = node => {
    if (Array.isArray(node)) return node.forEach(walk)
    if (!node || typeof node !== 'object') return
    if (typeof node.media_id === 'string') ids.add(node.media_id)
    Object.values(node).forEach(walk)
  }
  walk(content)
  return [...ids]
}

// "1920 × 1080 · 177 KB · WEBP": solo las partes que se conocen (con src estático, solo medidas).
export function formatImageMeta({ width, height, bytes, mime }) {
  const kb = bytes ? `${Math.max(1, Math.round(bytes / 1024))} KB` : ''
  const format = mime ? mime.replace(/^image\//, '').toUpperCase() : ''
  return [width && height ? `${width} × ${height}` : '', kb, format].filter(Boolean).join(' · ')
}
