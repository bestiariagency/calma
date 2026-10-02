import { describe, expect, it } from 'vitest'
import { COMPANY } from '../data/content.js'
import { buildFooterContact } from './footerContact.js'

const social = (over = {}) => ({ instagram: '', facebook: '', tiktok: '', youtube: '', ...over })

describe('buildFooterContact', () => {
  it('sin datos (semilla) no hay bloque', () => {
    expect(buildFooterContact(COMPANY)).toMatchObject({ address: '', hours: '', socials: [], hasText: false, hasContact: false })
    expect(buildFooterContact(undefined).hasContact).toBe(false)
  })
  it('une dirección, ciudad y región omitiendo vacíos', () => {
    expect(buildFooterContact({ address: 'Calle 1', city: 'Pucón', region: 'Araucanía' }).address).toBe('Calle 1, Pucón, Araucanía')
    expect(buildFooterContact({ city: 'Pucón', region: 'Araucanía' }).address).toBe('Pucón, Araucanía')
    expect(buildFooterContact({ address: ' ', city: '', region: 'X' }).address).toBe('X')
  })
  it('maps_url solo con dirección y https', () => {
    expect(buildFooterContact({ address: 'A', maps_url: 'https://m.test/x' }).mapsHref).toBe('https://m.test/x')
    expect(buildFooterContact({ address: 'A', maps_url: 'http://m.test/x' }).mapsHref).toBe('')
    expect(buildFooterContact({ address: 'A', maps_url: 'javascript:alert(1)' }).mapsHref).toBe('')
    const noAddress = buildFooterContact({ maps_url: 'https://m.test/x' })
    expect(noAddress.mapsHref).toBe('')
    expect(noAddress.hasContact).toBe(false)
  })
  it('solo horario / solo dirección', () => {
    expect(buildFooterContact({ opening_hours: 'Lun a Vie\nSáb' })).toMatchObject({ hours: 'Lun a Vie\nSáb', hasText: true, hasContact: true })
    expect(buildFooterContact({ address: 'A' })).toMatchObject({ hasText: true, hasContact: true, socials: [] })
  })
  it('redes: orden fijo, solo https y con valor', () => {
    const out = buildFooterContact({ social: social({ youtube: 'https://y.test/c', instagram: 'https://i.test/x', tiktok: 'http://t.test', facebook: '' }) })
    expect(out.socials.map(s => s.network)).toEqual(['instagram', 'youtube'])
    expect(out.hasText).toBe(false)
    expect(out.hasContact).toBe(true)
  })
})
