import { beforeEach, describe, expect, it } from 'vitest'
import { lockScroll, resetScrollLock, unlockScroll } from './useScrollLock.js'

const makeRoot = () => ({ style: { overflow: '', paddingRight: '' } })

describe('scroll lock', () => {
  beforeEach(resetScrollLock)

  it('bloquea y restaura', () => {
    const root = makeRoot()
    lockScroll(root, 15)
    expect(root.style).toEqual({ overflow: 'hidden', paddingRight: '15px' })
    unlockScroll(root)
    expect(root.style).toEqual({ overflow: '', paddingRight: '' })
  })

  it('restaura la posición de scroll exacta al soltar', () => {
    const root = makeRoot()
    const seen = []
    lockScroll(root, 0, 480)
    unlockScroll(root, y => seen.push(y))
    expect(seen).toEqual([480])
  })

  it('apilado: solo restaura al soltar el último', () => {
    const root = makeRoot()
    lockScroll(root)
    lockScroll(root)
    unlockScroll(root)
    expect(root.style.overflow).toBe('hidden')
    unlockScroll(root)
    expect(root.style.overflow).toBe('')
  })

  it('unlock sin lock es no-op', () => {
    const root = makeRoot()
    unlockScroll(root)
    expect(root.style.overflow).toBe('')
  })
})
