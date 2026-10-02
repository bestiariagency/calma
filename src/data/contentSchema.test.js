// Garantiza que el esquema del panel y el contenido semilla no se desincronicen.
import { describe, expect, it } from 'vitest'
import { CONTENT_SCHEMA } from './contentSchema.js'
import * as content from './content.js'

const SECTION_CONTENT = {
  nav: { links: content.NAV_LINKS },
  mobile_menu: { links: content.MOBILE_MENU_LINKS },
  hero: content.HERO,
  que_es: content.QUE_ES,
  por_que: content.POR_QUE,
  proceso: content.PROCESO,
  galeria: content.GALERIA,
  cta: content.CTA,
  footer: content.FOOTER,
  company: content.COMPANY,
}

const resolve = (obj, path) => (path ? path.split('.').reduce((acc, key) => acc?.[key], obj) : obj)

function checkField(field, data, where) {
  const value = resolve(data, field.path)
  const at = `${where}.${field.path || '[item]'}`

  if (field.type === 'list') {
    expect(Array.isArray(value), `${at} debe ser una lista`).toBe(true)
    expect(value.length, `${at} tamaño fijo`).toBe(field.maxItems)
    value.forEach((item, i) => field.fields.forEach((f) => checkField(f, item, `${at}.${i}`)))
    return
  }

  if (field.type === 'image') {
    expect(typeof value?.src, `${at}.src`).toBe('string')
    expect(value.alt.length, `${at}.alt excede altMaxLength`).toBeLessThanOrEqual(field.altMaxLength)
    return
  }

  expect(typeof value, `${at} debe existir como texto`).toBe('string')
  expect(value.length, `${at} excede maxLength`).toBeLessThanOrEqual(field.maxLength)
}

describe('CONTENT_SCHEMA', () => {
  it('cubre exactamente las secciones con contenido', () => {
    expect(Object.keys(CONTENT_SCHEMA).sort()).toEqual(Object.keys(SECTION_CONTENT).sort())
  })

  it.each(Object.entries(CONTENT_SCHEMA))('%s: cada campo existe y respeta sus límites', (key, section) => {
    expect(section.label).toBeTruthy()
    section.fields.forEach((field) => checkField(field, SECTION_CONTENT[key], key))
  })

  it('no expone el crédito de Bestiari', () => {
    expect(JSON.stringify(CONTENT_SCHEMA)).not.toMatch(/bestiari/i)
    expect(JSON.stringify(content)).not.toMatch(/bestiari/i)
  })
})
