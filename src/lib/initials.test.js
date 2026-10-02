import { describe, expect, it } from 'vitest'
import { getInitials } from './initials.js'

describe('getInitials', () => {
  it('usa dos letras del nombre', () => {
    expect(getInitials('Ana Pérez Soto')).toBe('AP')
    expect(getInitials('marta')).toBe('MA')
  })
  it('cae a la primera letra del correo', () => {
    expect(getInitials('', 'dueno@calma.cl')).toBe('D')
    expect(getInitials(undefined, undefined)).toBe('')
  })
})
