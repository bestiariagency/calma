import { describe, expect, it } from 'vitest'
import { COMPANY } from '../data/content.js'
import { CONTENT_SCHEMA } from '../data/contentSchema.js'
import { adminEditorText as text } from '../data/adminEditorText.js'
import { buildPayload, cloneContent, flattenFields, normalizeWorking, validateSection } from './sectionEditor.js'

const leaves = flattenFields(CONTENT_SCHEMA.company.fields)
const valid = () => ({
  name: 'CALMA', tagline: 'Tinajas', email: 'hola@calma.cl', phone: '+56 9 1234 5678', whatsapp: '+56912345678',
  whatsapp_message: 'Hola', address: '', city: '', region: '', maps_url: '', opening_hours: '',
  social: { instagram: '', facebook: '', tiktok: '', youtube: '' },
})
const errorsFor = patch => validateSection(leaves, { ...valid(), ...patch }, text)

describe('validación de Datos de la empresa', () => {
  it('los datos semilla y un conjunto válido no dan errores', () => {
    expect(errorsFor({})).toEqual({})
    expect(validateSection(leaves, cloneContent(COMPANY), text)).toEqual({})
  })
  it('obligatorios: name, email, phone y whatsapp; el resto admite vacío', () => {
    const errors = errorsFor({ name: ' ', email: '', phone: '', whatsapp: '' })
    expect(Object.keys(errors).sort()).toEqual(['email', 'name', 'phone', 'whatsapp'])
    expect(errors.name).toBe(text.requiredField)
  })
  it('email con formato inválido', () => {
    expect(errorsFor({ email: 'hola@calma' }).email).toBe(text.invalidEmail)
  })
  it('WhatsApp: normaliza antes de validar E.164', () => {
    expect(errorsFor({ whatsapp: '+56 9 1234-5678' })).toEqual({})
    expect(errorsFor({ whatsapp: '56912345678' }).whatsapp).toBe(text.invalidE164)
    expect(errorsFor({ whatsapp: '+1234567' }).whatsapp).toBe(text.invalidE164)
  })
  it('longitudes: cuenta lo normalizado y marca el exceso', () => {
    expect(errorsFor({ name: 'x'.repeat(21) }).name).toBe(text.overLimit(1))
    expect(errorsFor({ tagline: 'x'.repeat(61) }).tagline).toBe(text.overLimit(1))
    expect(errorsFor({ email: `${'a'.repeat(30)}@b.cl` }).email).toBe(text.overLimit(5))
    expect(errorsFor({ opening_hours: 'x'.repeat(200) })).toEqual({})
  })
  it('maps y redes: solo https (vacío permitido)', () => {
    expect(errorsFor({ maps_url: 'http://maps.test/x' }).maps_url).toBe(text.invalidUrl)
    expect(errorsFor({ maps_url: 'https://maps.app.goo.gl/x' })).toEqual({})
    expect(errorsFor({ social: { ...valid().social, instagram: 'instagram.com/x' } })['social.instagram']).toBe(text.invalidUrl)
    expect(errorsFor({ social: { ...valid().social, tiktok: `https://t.co/${'x'.repeat(200)}` } })['social.tiktok']).toBeTruthy()
    expect(errorsFor({ social: { instagram: 'https://i.cl/x', facebook: '', tiktok: '', youtube: 'https://y.cl/c' } })).toEqual({})
  })
  it('normalizeWorking deja el valor como se guardará y buildPayload lo usa; social conserva sus 4 claves', () => {
    const working = { ...valid(), whatsapp: ' +56 9 1234-5678 ', email: ' hola@calma.cl ' }
    expect(normalizeWorking(leaves, working)).toBe(true)
    expect(working.whatsapp).toBe('+56912345678')
    expect(normalizeWorking(leaves, working)).toBe(false)
    const payload = buildPayload(valid(), { ...valid(), whatsapp: '+56 9 8765 4321' }, leaves)
    expect(payload.whatsapp).toBe('+56987654321')
    expect(Object.keys(payload.social)).toEqual(['instagram', 'facebook', 'tiktok', 'youtube'])
  })
})
