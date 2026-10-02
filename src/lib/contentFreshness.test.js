import { describe, expect, it } from 'vitest'
import { isNewer, pickFreshest } from './contentFreshness.js'

const at = updated_at => ({ updated_at, sections: {} })

describe('isNewer', () => {
  it('compara por fecha, no por texto', () => {
    expect(isNewer(at('2026-10-02T10:00:00Z'), at('2026-10-01T10:00:00Z'))).toBe(true)
    expect(isNewer(at('2026-10-01T10:00:00Z'), at('2026-10-02T10:00:00Z'))).toBe(false)
    expect(isNewer(at('2026-10-02T10:00:00Z'), at('2026-10-02T10:00:00Z'))).toBe(false)
  })
  it('sin fecha actual gana cualquier payload fechado; sin fecha candidata nunca gana', () => {
    expect(isNewer(at('2026-10-02T10:00:00Z'), null)).toBe(true)
    expect(isNewer(at('2026-10-02T10:00:00Z'), at(null))).toBe(true)
    expect(isNewer(at(null), at('2026-10-02T10:00:00Z'))).toBe(false)
    expect(isNewer(null, null)).toBe(false)
  })
})

describe('pickFreshest', () => {
  it('elige el más reciente e ignora nulos', () => {
    const old = at('2026-10-01T10:00:00Z')
    const fresh = at('2026-10-02T10:00:00Z')
    expect(pickFreshest(fresh, old)).toBe(fresh)
    expect(pickFreshest(old, null, fresh)).toBe(fresh)
    expect(pickFreshest(null, undefined)).toBeNull()
  })
  it('en empate gana el primero (el del build)', () => {
    const a = at('2026-10-02T10:00:00Z')
    expect(pickFreshest(a, { ...a })).toBe(a)
  })
})
