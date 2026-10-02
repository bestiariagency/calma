// Preparación de imágenes antes de subirlas: valida, decodifica (EXIF), redimensiona y exporta WebP.
// Las funciones puras (validación, dimensiones, calidad) se testean; processImage usa APIs del navegador.
export const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
export const MAX_INPUT_BYTES = 25 * 1024 * 1024
export const MAX_OUTPUT_BYTES = 5 * 1024 * 1024 // límite del bucket site-media
export const MAX_SIDE = 2400
export const QUALITIES = [0.82, 0.7, 0.58, 0.45]
export const WEBP = 'image/webp'
export const JPEG = 'image/jpeg'
// Fondo al aplanar transparencias para JPEG: el sitio es oscuro, así que `darkest` (#0E0C09) en vez de negro puro/blanco.
export const JPEG_BACKGROUND = '#0E0C09'
const OUTPUT_EXTENSIONS = { [WEBP]: 'webp', [JPEG]: 'jpg' }

// HEIC/HEIF no se aceptan en el selector, pero si llegan (arrastrar, Safari) se INTENTA decodificar:
// Safari puede; si el navegador no puede → 'type' ("Formato no compatible").
const DECODE_ATTEMPT_TYPES = ['image/heic', 'image/heif']

const EXTENSION_TYPES = {
  jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', avif: 'image/avif', heic: 'image/heic', heif: 'image/heif',
}

export class ImageError extends Error {
  constructor(code) {
    super(code)
    this.code = code // type | size | empty | decode | encode | tooBig
  }
}

const detectType = file => file.type || EXTENSION_TYPES[file.name?.split('.').pop()?.toLowerCase()] || ''

// Devuelve el código del problema o null si se puede intentar (SVG, GIF, etc. → 'type').
export function validateImageFile(file) {
  if (!file || !file.size) return 'empty'
  const type = detectType(file)
  if (!ACCEPTED_TYPES.includes(type) && !DECODE_ATTEMPT_TYPES.includes(type)) return 'type'
  if (file.size > MAX_INPUT_BYTES) return 'size'
  return null
}

// Si la decodificación falla: HEIC/HEIF → "formato no compatible"; el resto → "no se pudo leer".
export const decodeErrorCode = file => (DECODE_ATTEMPT_TYPES.includes(detectType(file)) ? 'type' : 'decode')

// Lado mayor ≤ max, conservando proporción y sin ampliar.
export function fitDimensions(width, height, max = MAX_SIDE) {
  const scale = Math.min(1, max / Math.max(width, height))
  return { width: Math.max(1, Math.round(width * scale)), height: Math.max(1, Math.round(height * scale)) }
}

// Prueba calidades de mayor a menor hasta que el resultado entra en `limit`; si ninguna entra → 'tooBig'.
// `first`: blob ya generado con la primera calidad (evita codificar dos veces).
export async function encodeUnderLimit(encode, mime, limit = MAX_OUTPUT_BYTES, qualities = QUALITIES, first = null) {
  for (const [index, quality] of qualities.entries()) {
    const blob = index === 0 && first ? first : await encode(quality)
    if (!blob || blob.type !== mime) throw new ImageError('encode')
    if (blob.size <= limit) return blob
  }
  throw new ImageError('tooBig')
}

// Intenta WebP; si el navegador no lo codifica (Safari devuelve PNG), cae a JPEG.
// `encode(mime, quality)` → Blob. Devuelve { blob, mime, extension }.
export async function encodeBest(encode, limit = MAX_OUTPUT_BYTES, qualities = QUALITIES) {
  const probe = await encode(WEBP, qualities[0])
  const mime = probe?.type === WEBP ? WEBP : JPEG
  const blob = await encodeUnderLimit(quality => encode(mime, quality), mime, limit, qualities, mime === WEBP ? probe : null)
  return { blob, mime, extension: OUTPUT_EXTENSIONS[mime] }
}

const newCanvas = ({ width, height }) =>
  typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(width, height) : Object.assign(document.createElement('canvas'), { width, height })

function drawToCanvas(bitmap, size, background) {
  const canvas = newCanvas(size)
  const context = canvas.getContext('2d')
  if (background) {
    context.fillStyle = background
    context.fillRect(0, 0, size.width, size.height)
  }
  context.drawImage(bitmap, 0, 0, size.width, size.height)
  return canvas
}

const toBlob = (canvas, mime, quality) =>
  canvas.convertToBlob ? canvas.convertToBlob({ type: mime, quality }) : new Promise(resolve => canvas.toBlob(resolve, mime, quality))

// → { blob, width, height, bytes, mime, extension } (lado mayor ≤ 2400, ≤ 5 MB). Lanza ImageError.
export async function processImage(file) {
  const invalid = validateImageFile(file)
  if (invalid) throw new ImageError(invalid)
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    throw new ImageError(decodeErrorCode(file))
  }
  try {
    const size = fitDimensions(bitmap.width, bitmap.height)
    const canvas = drawToCanvas(bitmap, size)
    let flat = null // versión con fondo, solo si hace falta JPEG (no admite transparencia)
    const encode = (mime, quality) => {
      if (mime !== JPEG) return toBlob(canvas, mime, quality)
      flat ??= drawToCanvas(bitmap, size, JPEG_BACKGROUND)
      return toBlob(flat, mime, quality)
    }
    const { blob, mime, extension } = await encodeBest(encode)
    return { blob, ...size, bytes: blob.size, mime, extension }
  } finally {
    bitmap.close?.()
  }
}
