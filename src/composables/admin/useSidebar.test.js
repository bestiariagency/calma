import { describe, expect, it } from 'vitest'
import { readCollapsed, writeCollapsed } from './useSidebar.js'

const memory = () => {
  const data = {}
  return { getItem: k => data[k] ?? null, setItem: (k, v) => (data[k] = v) }
}
const blocked = { getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('denied') } }

describe('preferencia del sidebar', () => {
  it('persiste y recupera', () => {
    const storage = memory()
    expect(readCollapsed(storage)).toBe(false)
    writeCollapsed(true, storage)
    expect(readCollapsed(storage)).toBe(true)
  })
  it('tolera storage bloqueado', () => {
    expect(readCollapsed(blocked)).toBe(false)
    expect(() => writeCollapsed(true, blocked)).not.toThrow()
  })
})
