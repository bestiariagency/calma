import { describe, expect, it } from 'vitest'
import { diffSnapshots, schemaKeyOf, sectionLabelOf, summarizeChanges } from './historyDiff.js'

const text = {
  altOf: label => `${label} (alt)`,
  summaryNone: 'nada',
  summary: (names, extra) => (extra ? `Cambió ${names} y ${extra} más` : `Cambió ${names}`),
}
const diff = (key, before, after) => diffSnapshots(key, before, after, { text })

describe('historyDiff', () => {
  it('mapea la clave de datos de la empresa al esquema company', () => {
    expect(schemaKeyOf('site_settings')).toBe('company')
    expect(sectionLabelOf('site_settings')).toBe('Datos de la empresa')
    expect(sectionLabelOf('hero')).toBe('Portada')
    expect(sectionLabelOf('desconocida')).toBe('desconocida')
  })

  it('solo devuelve los campos de texto que difieren, con el label del esquema', () => {
    const before = { cta: 'Cotiza', image: { src: '/a.webp', alt: 'A' } }
    const after = { cta: 'Cotizar', image: { src: '/a.webp', alt: 'A' } }
    expect(diff('hero', before, after)).toEqual([{ path: 'cta', label: 'Texto del botón', kind: 'text', before: 'Cotiza', after: 'Cotizar' }])
    expect(diff('hero', before, before)).toEqual([])
  })

  it('imagen: cambio de archivo (media_id o src) y de alt por separado', () => {
    const before = { cta: 'x', image: { media_id: 'm1', alt: 'Vieja' } }
    const after = { cta: 'x', image: { media_id: 'm2', alt: 'Nueva' } }
    const [image, alt] = diff('hero', before, after)
    expect(image).toMatchObject({ kind: 'image', label: 'Imagen de fondo', before: before.image, after: after.image })
    expect(alt).toMatchObject({ kind: 'text', label: 'Imagen de fondo (alt)', before: 'Vieja', after: 'Nueva' })
    expect(diff('hero', { image: { src: '/a', alt: 'z', width: 1 } }, { image: { src: '/a', alt: 'z', width: 2 } })).toEqual([])
  })

  it('listas: etiqueta con el número del elemento y ruta con índice', () => {
    const links = labels => ({ links: labels.map(label => ({ label })) })
    const [change] = diff('nav', links(['Inicio', 'Producto']), links(['Inicio', 'Tinajas']))
    expect(change).toMatchObject({ path: 'links.1.label', label: 'Enlaces 2: Texto del enlace', before: 'Producto', after: 'Tinajas' })
  })

  it('galería: la imagen es el propio ítem de la lista', () => {
    const gallery = ids => ({ images: ids.map(id => ({ media_id: id, alt: 'x' })) })
    const [change] = diff('galeria', gallery(['a', 'b', 'c']), gallery(['a', 'b', 'z']))
    expect(change).toMatchObject({ kind: 'image', path: 'images.2', label: 'Imagen 3' })
  })

  it('site_settings: valores nulos o ausentes cuentan como vacío', () => {
    const changes = diff('site_settings', { name: 'CALMA', city: null, social: { instagram: 'https://i' } }, { name: 'CALMA', city: 'Pucón', social: {} })
    expect(changes.map(c => [c.path, c.before, c.after])).toEqual([
      ['city', '', 'Pucón'],
      ['social.instagram', 'https://i', ''],
    ])
  })

  it('clave sin esquema o sin estado actual no revienta', () => {
    expect(diff('otra', {}, {})).toEqual([])
    expect(diff('hero', {}, undefined)).toEqual([])
  })

  it('resume: nada, uno, dos, y con "N más"', () => {
    const c = label => ({ label })
    expect(summarizeChanges([], text)).toBe('nada')
    expect(summarizeChanges([c('A')], text)).toBe('Cambió A')
    expect(summarizeChanges([c('A'), c('B')], text)).toBe('Cambió A y B')
    expect(summarizeChanges([c('A'), c('B'), c('C'), c('D')], text)).toBe('Cambió A, B y 2 más')
    expect(summarizeChanges([c('A'), c('A')], text)).toBe('Cambió A')
  })
})
