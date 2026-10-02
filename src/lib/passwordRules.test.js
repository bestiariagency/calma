import { describe, expect, it } from 'vitest'
import { validateNewPassword } from './passwordRules.js'

describe('validateNewPassword', () => {
  it('valida largo y coincidencia', () => {
    expect(validateNewPassword('corta', 'corta')).toBe('tooShort')
    expect(validateNewPassword('suficiente1', 'otra-cosa')).toBe('mismatch')
    expect(validateNewPassword('suficiente1', 'suficiente1')).toBe('')
  })
})
