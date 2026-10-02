import { describe, expect, it } from 'vitest'
import { adminShellText } from '../data/adminShellText.js'
import { savedAgoLabel } from './savedAgo.js'

const t = adminShellText.saveStatus
describe('savedAgoLabel', () => {
  it('formatea según el tiempo', () => {
    expect(savedAgoLabel(null, 0, t)).toBe('Guardado')
    expect(savedAgoLabel(0, 30_000, t)).toBe('Guardado hace un momento')
    expect(savedAgoLabel(0, 120_000, t)).toBe('Guardado hace 2 min')
    expect(savedAgoLabel(0, 3 * 3_600_000, t)).toBe('Guardado hace 3 h')
  })
})
