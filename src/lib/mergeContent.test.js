import { describe, expect, it } from 'vitest'
import { COMPANY, GALERIA, HERO, WHATSAPP_URL } from '../data/content.js'
import { buildSiteContent, mergeDeep } from './mergeContent.js'

const dbImage = { media_id: 'abc', src: 'https://x.test/a.webp', alt: 'Nueva', width: 10, height: 20, blurhash: 'LEHV6n' }

describe('mergeDeep', () => {
  it('fusiona paths anidados sin tocar el resto', () => {
    const out = mergeDeep({ a: { b: 'x', c: 'y' }, d: 'z' }, { a: { b: 'nuevo' } })
    expect(out).toEqual({ a: { b: 'nuevo', c: 'y' }, d: 'z' })
  })

  it('fusiona listas por índice y mantiene el tamaño del seed', () => {
    const seed = [{ label: 'A', href: '#a' }, { label: 'B', href: '#b' }, { label: 'C', href: '#c' }]
    const out = mergeDeep(seed, [{ label: 'X' }, { label: 'Y' }, { label: 'Z' }, { label: 'extra' }])
    expect(out.map(l => l.label)).toEqual(['X', 'Y', 'Z'])
    expect(out.map(l => l.href)).toEqual(['#a', '#b', '#c'])
  })

  it('lista parcial: los ítems no recibidos conservan el seed', () => {
    expect(mergeDeep(['a', 'b'], ['z'])).toEqual(['z', 'b'])
  })

  it('ignora tipos incorrectos, null y claves desconocidas', () => {
    const out = mergeDeep({ a: 'x', n: 1, o: { p: 'q' } }, { a: 5, n: 'no', o: null, extra: 'zz' })
    expect(out).toEqual({ a: 'x', n: 1, o: { p: 'q' } })
  })

  it('acepta cadena vacía como valor válido', () => {
    expect(mergeDeep({ a: 'x' }, { a: '' })).toEqual({ a: '' })
  })

  it('ignora NaN, undefined y listas/objetos con forma cruzada', () => {
    const out = mergeDeep({ n: 1, l: ['a'], o: { p: 'q' } }, { n: NaN, l: { 0: 'z' }, o: ['x'] })
    expect(out).toEqual({ n: 1, l: ['a'], o: { p: 'q' } })
    expect(mergeDeep('x', undefined)).toBe('x')
  })

  it('no muta el seed', () => {
    const seed = { a: { b: 'x' } }
    mergeDeep(seed, { a: { b: 'y' } })
    expect(seed.a.b).toBe('x')
  })
})

describe('buildSiteContent', () => {
  it.each([[undefined], [null], [{}], ['corrupto'], [42], [{ sections: 'x', settings: [] }]])(
    'entrada inválida o vacía (%j) devuelve el seed',
    payload => {
      const out = buildSiteContent(payload)
      expect(out.hero).toEqual(HERO)
      expect(out.company).toEqual(COMPANY)
      expect(out.whatsappUrl).toBe(WHATSAPP_URL)
    },
  )

  it('imagen: solo src, alt, width y height (sin media_id ni blurhash)', () => {
    const out = buildSiteContent({ sections: { hero: { image: dbImage } } })
    expect(out.hero.image).toEqual({ src: dbImage.src, alt: 'Nueva', width: 10, height: 20 })
    expect(Object.keys(out.hero.image).sort()).toEqual(['alt', 'height', 'src', 'width'])
  })

  it('lista de imágenes de galería por índice', () => {
    const out = buildSiteContent({ sections: { galeria: { images: [dbImage] } } })
    expect(out.galeria.images).toHaveLength(GALERIA.images.length)
    expect(out.galeria.images[0].alt).toBe('Nueva')
    expect(out.galeria.images[1]).toEqual(GALERIA.images[1])
  })

  it('settings → company y recalcula whatsappUrl y hrefs de contacto', () => {
    const out = buildSiteContent({
      settings: { whatsapp: '+56911112222', whatsapp_message: 'Hola', social: { instagram: 'https://i.test/x' }, phone: '+56 9 1' },
    })
    expect(out.company.phone).toBe('+56 9 1')
    expect(out.company.social).toEqual({ ...COMPANY.social, instagram: 'https://i.test/x' })
    expect(out.company.logo).toEqual(COMPANY.logo)
    expect(out.whatsappUrl).toBe('https://wa.me/56911112222?text=Hola')
    expect(out.nav.links.find(l => l.cta).href).toBe(out.whatsappUrl)
    expect(out.mobile_menu.links.find(l => l.accent).href).toBe(out.whatsappUrl)
    expect(out.nav.links[0].href).toBe('#inicio')
  })

  it('tras guardar email/teléfono/WhatsApp, la landing los refleja en todos los puntos (RPC simulada)', () => {
    const rpc = { sections: {}, settings: { email: 'nuevo@calma.cl', phone: '+56 2 2222 3333', whatsapp: '+56933334444', whatsapp_message: 'Quiero una tinaja' } }
    const out = buildSiteContent(rpc)
    const wa = 'https://wa.me/56933334444?text=Quiero%20una%20tinaja'
    expect(out.company).toMatchObject({ email: 'nuevo@calma.cl', phone: '+56 2 2222 3333' }) // CTA y menú móvil
    expect(out.whatsappUrl).toBe(wa) // CTA y botón flotante
    expect(out.nav.links.find(l => l.cta).href).toBe(wa)
    expect(out.mobile_menu.links.find(l => l.accent).href).toBe(wa)
  })
})
