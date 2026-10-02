import { describe, expect, it } from 'vitest'
import { parseAuthHash } from './authLinkHint.js'

describe('parseAuthHash', () => {
  it('detecta el enlace de recuperación', () => {
    expect(parseAuthHash('#access_token=a&type=recovery')).toEqual({ recovery: true, linkError: '' })
  })
  it('detecta enlace caducado', () => {
    expect(parseAuthHash('#error=access_denied&error_code=otp_expired')).toEqual({ recovery: false, linkError: 'otp_expired' })
  })
  it('hash vacío', () => {
    expect(parseAuthHash('')).toEqual({ recovery: false, linkError: '' })
  })
})
