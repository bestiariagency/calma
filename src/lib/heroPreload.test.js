import { describe, expect, it } from 'vitest'
import { heroPreloadFor, imageMimeType, rewriteHeroPreload } from './heroPreload.js'

const HTML = '<head><link rel="preload" as="image" href="/images/hero-dia.webp" type="image/webp" fetchpriority="high" /></head>'
const BUCKET = 'https://x.supabase.co/storage/v1/object/public/site-media/sections/hero/a.jpg'

describe('imageMimeType', () => {
  it('deduce el MIME por extensión (ignorando query)', () => {
    expect(imageMimeType('/a.webp')).toBe('image/webp')
    expect(imageMimeType('/a.JPG?v=1')).toBe('image/jpeg')
    expect(imageMimeType('/a.bin')).toBeNull()
  })
})

describe('heroPreloadFor', () => {
  it('toma el src del hero', () => {
    expect(heroPreloadFor({ hero: { image: { src: BUCKET } } })).toEqual({ href: BUCKET, type: 'image/jpeg' })
  })
  it('sin hero/src devuelve null', () => {
    expect(heroPreloadFor(null)).toBeNull()
    expect(heroPreloadFor({ hero: { image: { src: null } } })).toBeNull()
  })
})

describe('rewriteHeroPreload', () => {
  it('reescribe href y type conservando el resto de atributos', () => {
    const out = rewriteHeroPreload(HTML, { href: BUCKET, type: 'image/jpeg' })
    expect(out).toContain(`href="${BUCKET}" type="image/jpeg" fetchpriority="high"`)
  })
  it('type desconocido lo quita; sin preload nuevo deja el HTML intacto', () => {
    expect(rewriteHeroPreload(HTML, { href: '/a.bin', type: null })).not.toContain('type=')
    expect(rewriteHeroPreload(HTML, null)).toBe(HTML)
  })
})
