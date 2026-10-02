import { describe, expect, it } from 'vitest'
import { ImageError, JPEG, MAX_INPUT_BYTES, QUALITIES, WEBP, decodeErrorCode, encodeBest, encodeUnderLimit, fitDimensions, validateImageFile } from './imageProcessing.js'

const file = (type, size = 1000, name = 'a') => ({ type, size, name })

describe('validateImageFile', () => {
  it('acepta jpeg/png/webp/avif', () => {
    for (const type of ['image/jpeg', 'image/png', 'image/webp', 'image/avif']) expect(validateImageFile(file(type))).toBeNull()
  })
  it('HEIC/HEIF se intentan decodificar (Safari puede); si falla → "type"', () => {
    expect(validateImageFile(file('image/heic'))).toBeNull()
    expect(validateImageFile(file('', 10, 'IMG_1.HEIC'))).toBeNull()
    expect(decodeErrorCode(file('image/heic'))).toBe('type')
    expect(decodeErrorCode(file('image/png'))).toBe('decode')
  })
  it('rechaza SVG, GIF y vacíos', () => {
    expect(validateImageFile(file('image/svg+xml'))).toBe('type')
    expect(validateImageFile(file('image/gif'))).toBe('type')
    expect(validateImageFile(file('image/png', 0))).toBe('empty')
    expect(validateImageFile(null)).toBe('empty')
  })
  it('usa la extensión si el navegador no informa el tipo', () => {
    expect(validateImageFile(file('', 10, 'foto.JPG'))).toBeNull()
    expect(validateImageFile(file('', 10, 'foto.gif'))).toBe('type')
  })
  it('limita el tamaño de entrada', () => {
    expect(validateImageFile(file('image/png', MAX_INPUT_BYTES))).toBeNull()
    expect(validateImageFile(file('image/png', MAX_INPUT_BYTES + 1))).toBe('size')
  })
})

describe('fitDimensions', () => {
  it('reduce al lado mayor conservando proporción', () => {
    expect(fitDimensions(4800, 3200)).toEqual({ width: 2400, height: 1600 })
    expect(fitDimensions(3000, 6000)).toEqual({ width: 1200, height: 2400 })
  })
  it('no amplía imágenes pequeñas', () => {
    expect(fitDimensions(800, 600)).toEqual({ width: 800, height: 600 })
  })
})

describe('encodeUnderLimit', () => {
  const blobOf = size => ({ type: 'image/webp', size })
  it('baja la calidad hasta que entra en el límite', async () => {
    const tried = []
    const sizes = [900, 700, 400, 100]
    const blob = await encodeUnderLimit(q => (tried.push(q), blobOf(sizes[tried.length - 1])), WEBP, 500)
    expect(tried).toEqual(QUALITIES.slice(0, 3))
    expect(blob.size).toBe(400)
  })
  it('usa la primera calidad si ya entra', async () => {
    const tried = []
    await encodeUnderLimit(q => (tried.push(q), blobOf(10)), WEBP, 500)
    expect(tried).toEqual([QUALITIES[0]])
  })
  it('falla con tooBig si ninguna calidad entra y con encode si no exporta WebP', async () => {
    await expect(encodeUnderLimit(() => blobOf(9999), WEBP, 500)).rejects.toMatchObject({ code: 'tooBig' })
    await expect(encodeUnderLimit(() => ({ type: 'image/png', size: 1 }), WEBP, 500)).rejects.toBeInstanceOf(ImageError)
  })
})

describe('encodeBest (WebP con fallback a JPEG)', () => {
  const blob = (type, size) => ({ type, size })
  it('Chromium/Firefox: usa WebP, extensión webp y reutiliza el primer blob', async () => {
    const calls = []
    const out = await encodeBest((mime, q) => (calls.push([mime, q]), blob(mime, 100)), 500)
    expect(out).toMatchObject({ mime: WEBP, extension: 'webp' })
    expect(calls).toEqual([[WEBP, QUALITIES[0]]])
  })
  it('Safari (devuelve PNG al pedir WebP): cae a JPEG con extensión jpg', async () => {
    const calls = []
    const out = await encodeBest((mime, q) => (calls.push([mime, q]), blob(mime === WEBP ? 'image/png' : mime, 100)), 500)
    expect(out).toMatchObject({ mime: JPEG, extension: 'jpg' })
    expect(out.blob.type).toBe(JPEG)
    expect(calls).toEqual([[WEBP, QUALITIES[0]], [JPEG, QUALITIES[0]]])
  })
  it('JPEG baja la calidad 0.82 → 0.45 hasta entrar en 5 MB', async () => {
    const sizes = { 0.82: 900, 0.7: 800, 0.58: 700, 0.45: 400 }
    const encode = (mime, q) => blob(mime === WEBP ? 'image/png' : mime, sizes[q])
    expect((await encodeBest(encode, 500)).blob.size).toBe(400)
    await expect(encodeBest(mime => blob(mime, 1), 0)).rejects.toMatchObject({ code: 'tooBig' })
  })
})
