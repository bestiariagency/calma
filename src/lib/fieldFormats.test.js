import { describe, expect, it } from 'vitest'
import { adminEditorText as text } from '../data/adminEditorText.js'
import { formatError, isValidFormat, normalizeE164, normalizeValue } from './fieldFormats.js'

describe('normalizeValue', () => {
  it('WhatsApp: quita espacios, guiones, puntos y paréntesis', () => {
    expect(normalizeE164('+56 9 1234-5678')).toBe('+56912345678')
    expect(normalizeValue('e164', ' +56 (9) 1234.5678 ')).toBe('+56912345678')
  })
  it('email, teléfono y url: solo trim; el teléfono conserva sus separadores', () => {
    expect(normalizeValue('email', '  a@b.cl ')).toBe('a@b.cl')
    expect(normalizeValue('phone', ' +56 9 1234 5678 ')).toBe('+56 9 1234 5678')
    expect(normalizeValue('url', ' https://x.cl ')).toBe('https://x.cl')
  })
  it('text/textarea y no-strings pasan intactos', () => {
    expect(normalizeValue('text', '  hola  ')).toBe('  hola  ')
    expect(normalizeValue('email', null)).toBeNull()
  })
})

describe('isValidFormat (espejo de los CHECK)', () => {
  it.each([['a@b.cl', true], ['nombre.apellido+x@sub.dominio.com', true], ['A@B.CL', true], ['sin-arroba', false], ['a@b', false], ['a@b.c', false], ['a b@c.cl', false]])(
    'email %s → %s',
    (value, ok) => expect(isValidFormat('email', value)).toBe(ok),
  )
  it.each([['+56 9 1234 5678', true], ['(02) 2345-6789', false], ['56912345678', true], ['+', false], ['abc', false], ['+56-9.123', true]])(
    'teléfono %s → %s',
    (value, ok) => expect(isValidFormat('phone', value)).toBe(ok),
  )
  it.each([['+56912345678', true], ['+1234567', false], ['+123456789012345', true], ['+1234567890123456', false], ['56912345678', false], ['+0123456789', false], ['+56 912345678', false]])(
    'E.164 %s → %s',
    (value, ok) => expect(isValidFormat('e164', value)).toBe(ok),
  )
  it.each([['https://instagram.com/calma', true], ['http://x.cl', false], ['https://', false], ['https://a b.cl', false], ['instagram.com/x', false], ['https://maps.app.goo.gl/abc?x=1', true]])(
    'url %s → %s',
    (value, ok) => expect(isValidFormat('url', value)).toBe(ok),
  )
  it('vacío y tipos sin patrón siempre pasan (lo decide `required`)', () => {
    expect(isValidFormat('url', '')).toBe(true)
    expect(isValidFormat('text', 'lo que sea')).toBe(true)
  })
})

describe('formatError', () => {
  it('devuelve el mensaje del tipo o vacío', () => {
    expect(formatError('email', 'x', text)).toBe(text.invalidEmail)
    expect(formatError('e164', '123', text)).toBe(text.invalidE164)
    expect(formatError('url', 'http://x.cl', text)).toBe(text.invalidUrl)
    expect(formatError('phone', 'x', text)).toBe(text.invalidPhone)
    expect(formatError('email', 'a@b.cl', text)).toBe('')
  })
})
