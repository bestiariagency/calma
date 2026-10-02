import { describe, expect, it } from 'vitest'
import { authorLabel, formatAbsolute, formatBytes, formatRelative } from './historyFormat.js'

const text = {
  justNow: 'justo ahora',
  minutesAgo: n => `hace ${n} min`,
  hoursAgo: n => `hace ${n} h`,
  yesterday: 'ayer',
  daysAgo: n => `hace ${n} días`,
  authorYou: 'Tú',
  authorAdmin: 'Administrador',
}
const NOW = Date.parse('2026-10-02T12:00:00Z')
const ago = ms => new Date(NOW - ms).toISOString()
const [MIN, HOUR, DAY] = [60_000, 3_600_000, 86_400_000]

describe('historyFormat', () => {
  it('fecha relativa por tramos', () => {
    expect(formatRelative(ago(10_000), NOW, text)).toBe('justo ahora')
    expect(formatRelative(ago(5 * MIN), NOW, text)).toBe('hace 5 min')
    expect(formatRelative(ago(3 * HOUR), NOW, text)).toBe('hace 3 h')
    expect(formatRelative(ago(30 * HOUR), NOW, text)).toBe('ayer')
    expect(formatRelative(ago(12 * DAY), NOW, text)).toBe('hace 12 días')
    expect(formatRelative(ago(45 * DAY), NOW, text)).toBe('')
    expect(formatRelative('nada', NOW, text)).toBe('')
  })

  it('fecha absoluta en es-CL y vacío si es inválida', () => {
    expect(formatAbsolute('2026-10-02T15:30:00Z', 'UTC')).toMatch(/2026/)
    expect(formatAbsolute('2026-10-02T15:30:00Z', 'UTC')).toMatch(/15:30/)
    expect(formatAbsolute('x')).toBe('')
  })

  it('autor: "Tú" si es el usuario actual; si no, Administrador', () => {
    expect(authorLabel('u1', 'u1', text)).toBe('Tú')
    expect(authorLabel('u2', 'u1', text)).toBe('Administrador')
    expect(authorLabel(null, 'u1', text)).toBe('Administrador')
    expect(authorLabel(null, '', text)).toBe('Administrador')
  })

  it('tamaños en KB o MB', () => {
    expect(formatBytes(0)).toBe('1 KB')
    expect(formatBytes(340 * 1024)).toBe('340 KB')
    expect(formatBytes(1.5 * 1024 * 1024)).toBe('1,5 MB')
  })
})
