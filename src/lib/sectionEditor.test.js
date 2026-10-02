import { describe, expect, it } from 'vitest'
import { CONTENT_SCHEMA } from '../data/contentSchema.js'
import { adminEditorText as text } from '../data/adminEditorText.js'
import {
  buildPayload, changedPaths, charLength, classifySaveError, cloneContent, collectMediaIds, deepEqual,
  flattenFields, formatImageMeta, getAt, isDirty, joinPath, resolveImagePreview, setAt, validateSection,
} from './sectionEditor.js'

const image = (over = {}) => ({ media_id: null, src: '/images/a.webp', alt: 'Tinaja', width: 1200, height: 800, ...over })
const queEs = () => ({ label: 'QUÉ ES', title: 'Hormigón', paragraphs: ['uno', 'dos'], image: image() })
const leavesOf = key => flattenFields(CONTENT_SCHEMA[key].fields)

describe('rutas', () => {
  it('joinPath ignora vacíos y conserva el índice 0', () => {
    expect(joinPath('images', 0, '')).toBe('images.0')
    expect(joinPath('', 'title')).toBe('title')
  })
  it('getAt/setAt recorren objetos y listas', () => {
    const data = queEs()
    expect(getAt(data, 'paragraphs.1')).toBe('dos')
    expect(getAt(data, 'x.y.z')).toBeUndefined()
    setAt(data, 'paragraphs.0', 'nuevo')
    expect(data.paragraphs[0]).toBe('nuevo')
  })
})

describe('flattenFields', () => {
  it('expande listas fijas y toma el alt de las imágenes', () => {
    const paths = leavesOf('galeria').map(l => l.path)
    expect(paths).toContain('images.0.alt')
    expect(paths).toContain('images.3.alt')
    expect(paths).not.toContain('images.4.alt')
    expect(leavesOf('nav').map(l => l.path)).toEqual(['links.0.label', 'links.1.label', 'links.2.label', 'links.3.label'])
  })
  it('el alt es obligatorio y usa altMaxLength', () => {
    const alt = leavesOf('que_es').find(l => l.path === 'image.alt')
    expect(alt).toMatchObject({ required: true, maxLength: 60 })
  })
})

describe('dirty', () => {
  it('deepEqual compara en profundidad', () => {
    expect(deepEqual(queEs(), queEs())).toBe(true)
    expect(deepEqual(queEs(), { ...queEs(), paragraphs: ['uno', 'otro'] })).toBe(false)
    expect(deepEqual([1], { 0: 1 })).toBe(false)
  })
  it('es dirty solo si difiere de lo cargado (y vuelve a limpio al deshacer)', () => {
    const loaded = queEs()
    const working = cloneContent(loaded)
    expect(isDirty(loaded, working)).toBe(false)
    working.title = 'Otro'
    expect(isDirty(loaded, working)).toBe(true)
    working.title = loaded.title
    expect(isDirty(loaded, working)).toBe(false)
    expect(isDirty(null, working)).toBe(false)
  })
  it('changedPaths cuenta campos modificados', () => {
    const loaded = queEs()
    const working = cloneContent(loaded)
    working.title = 'x'
    working.image.alt = 'y'
    expect(changedPaths(leavesOf('que_es'), loaded, working)).toEqual(['title', 'image.alt'])
  })
})

describe('buildPayload', () => {
  it('al reemplazar la foto viajan media_id/src(null)/width/height y se conserva el alt', () => {
    const loaded = queEs()
    const working = cloneContent(loaded)
    const id = '44444444-4444-4444-4444-444444444444'
    Object.assign(working.image, { media_id: id, src: null, width: 2400, height: 1600 })
    const leaves = leavesOf('que_es')
    expect(changedPaths(leaves, loaded, working)).toEqual(['image'])
    expect(buildPayload(loaded, working, leaves).image).toEqual({ media_id: id, src: null, alt: 'Tinaja', width: 2400, height: 1600 })
    expect(validateSection(leaves, working, text)).toEqual({})
  })
  it('conserva media_id/src/width/height y aplica solo campos del esquema', () => {
    const loaded = queEs()
    loaded.image = image({ media_id: '11111111-1111-1111-1111-111111111111' })
    const working = cloneContent(loaded)
    working.title = 'Nuevo título'
    working.image.alt = 'Nuevo alt'
    working.image.evil = 'intruso' // clave ajena al esquema: no debe viajar
    working.extra = 'intruso'
    const payload = buildPayload(loaded, working, leavesOf('que_es'))
    expect(payload.title).toBe('Nuevo título')
    expect(payload.image).toEqual({ ...loaded.image, alt: 'Nuevo alt' })
    expect(payload).not.toHaveProperty('extra')
    expect(loaded.title).toBe('Hormigón') // no muta lo cargado
  })
})

describe('validateSection', () => {
  it('detecta alt vacío/solo espacios y exceso de longitud', () => {
    const working = queEs()
    working.image.alt = '   '
    working.title = 'x'.repeat(61)
    const errors = validateSection(leavesOf('que_es'), working, text)
    expect(errors['image.alt']).toBe(text.altRequired)
    expect(errors.title).toBe(text.overLimit(1))
    expect(Object.keys(errors)).toHaveLength(2)
  })
  it('cuenta caracteres como Postgres (emoji = 1) y acepta el límite exacto', () => {
    expect(charLength('😀😀')).toBe(2)
    const working = queEs()
    working.title = '😀'.repeat(60)
    expect(validateSection(leavesOf('que_es'), working, text)).toEqual({})
  })
  it('conserva saltos de línea en textareas', () => {
    const working = { label: 'a', title: 'Línea 1\nLínea 2', imageTop: image(), imageBottom: image(), features: [] }
    expect(validateSection(leavesOf('por_que').slice(0, 2), working, text)).toEqual({})
    expect(getAt(working, 'title')).toContain('\n')
  })
  it('marca valores que no son texto', () => {
    const working = queEs()
    working.title = null
    expect(validateSection(leavesOf('que_es'), working, text).title).toBe(text.invalidValue)
  })
})

describe('classifySaveError', () => {
  it('mapea 23514, 42501, sesión, red y desconocido', () => {
    expect(classifySaveError({ code: '23514', message: 'violates check constraint' })).toBe('invalid')
    expect(classifySaveError({ code: '42501', message: 'forbidden' })).toBe('permission')
    expect(classifySaveError({ status: 403, message: 'x' })).toBe('permission')
    expect(classifySaveError({ status: 401, code: 'PGRST301', message: 'JWT expired' })).toBe('session')
    expect(classifySaveError({ message: 'TypeError: Failed to fetch' }, true)).toBe('network')
    expect(classifySaveError({ code: '', message: 'algo' }, false)).toBe('network')
    expect(classifySaveError({ code: '500', status: 500, message: 'boom' }, true)).toBe('unknown')
    expect(classifySaveError(null)).toBeNull()
  })
})

describe('imágenes', () => {
  it('preview: usa src si no hay media_id; si hay, la URL del bucket', () => {
    expect(resolveImagePreview(image())).toEqual({ url: '/images/a.webp', width: 1200, height: 800, bytes: null, mime: null })
    const id = '22222222-2222-2222-2222-222222222222'
    const media = { [id]: { url: 'https://x/site-media/a.webp', width: 640, height: 480, bytes: 181248, mime: 'image/webp' } }
    expect(resolveImagePreview(image({ media_id: id }), media)).toEqual(media[id])
    expect(resolveImagePreview(image({ media_id: id, src: null }), {})).toMatchObject({ url: null, width: 1200, height: 800 })
    expect(resolveImagePreview(undefined).url).toBeNull()
  })
  it('collectMediaIds recorre el contenido', () => {
    const id = '33333333-3333-3333-3333-333333333333'
    const data = { images: [image({ media_id: id }), image({ media_id: id }), image()] }
    expect(collectMediaIds(data)).toEqual([id])
  })
})

describe('formatImageMeta', () => {
  it('muestra W × H · KB · FORMATO según los datos disponibles', () => {
    expect(formatImageMeta({ width: 1920, height: 1080, bytes: 181248, mime: 'image/webp' })).toBe('1920 × 1080 · 177 KB · WEBP')
    expect(formatImageMeta({ width: 1200, height: 800, bytes: null, mime: null })).toBe('1200 × 800')
    expect(formatImageMeta({ width: 800, height: 600, bytes: 52224, mime: 'image/jpeg' })).toBe('800 × 600 · 51 KB · JPEG')
    expect(formatImageMeta({})).toBe('')
  })
})
