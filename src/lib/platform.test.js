import { describe, expect, it } from 'vitest'
import { shortcutLabel } from './platform.js'

describe('shortcutLabel', () => {
  it('usa ⌘ en Apple y Ctrl en el resto', () => {
    expect(shortcutLabel('S', { platform: 'MacIntel' })).toBe('⌘S')
    expect(shortcutLabel('S', { platform: 'Win32' })).toBe('Ctrl S')
  })
})
