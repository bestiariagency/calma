import { describe, expect, it } from 'vitest'
import { nextTabIndex } from './useFocusTrap.js'

describe('nextTabIndex', () => {
  it('avanza y envuelve', () => {
    expect(nextTabIndex(3, 0, false)).toBe(1)
    expect(nextTabIndex(3, 2, false)).toBe(0)
  })
  it('retrocede y envuelve', () => {
    expect(nextTabIndex(3, 1, true)).toBe(0)
    expect(nextTabIndex(3, 0, true)).toBe(2)
  })
  it('foco fuera del contenedor entra por el extremo correcto', () => {
    expect(nextTabIndex(3, -1, false)).toBe(0)
    expect(nextTabIndex(3, -1, true)).toBe(2)
  })
  it('sin elementos enfocables', () => {
    expect(nextTabIndex(0, -1, false)).toBe(-1)
  })
})
