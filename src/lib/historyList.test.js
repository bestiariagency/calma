import { describe, expect, it } from 'vitest'
import { buildHistoryRows, filterRows, paginate, sectionFilterOptions, sortRows } from './historyList.js'
import { classifyHistoryError } from './historyErrors.js'

const text = {
  allSections: 'Todas',
  altOf: l => `${l} (alt)`,
  summaryNone: 'nada',
  summary: (names, extra) => (extra ? `Cambió ${names} y ${extra} más` : `Cambió ${names}`),
}
const rev = (id, key, at, snapshot, by = 'u1') => ({ id, key, changed_at: at, snapshot, changed_by: by })
const hero = cta => ({ cta, image: { src: '/a', alt: 'A' } })

describe('buildHistoryRows', () => {
  const revisions = [
    rev(1, 'hero', '2026-10-01T10:00:00Z', hero('v0')),
    rev(2, 'hero', '2026-10-01T11:00:00Z', hero('v1')),
    rev(3, 'site_settings', '2026-10-01T12:00:00Z', { name: 'CALMA', social: {} }),
  ]
  const rows = buildHistoryRows(revisions, { hero: hero('v2'), site_settings: { name: 'CALMA 2', social: {} } }, { text })

  it('ordena de nueva a vieja y resume lo que cambió ese guardado (snapshot → siguiente estado)', () => {
    expect(rows.map(r => r.id)).toEqual([3, 2, 1])
    expect(rows.map(r => r.summary)).toEqual(['Cambió Nombre de la empresa', 'Cambió Texto del botón', 'Cambió Texto del botón'])
    expect(rows[0].sectionLabel).toBe('Datos de la empresa')
    expect(rows[2].snapshot).toEqual(hero('v0'))
  })

  it('sin estado actual de la clave: "sin cambios visibles"', () => {
    expect(buildHistoryRows([revisions[0]], {}, { text })[0].summary).toBe('nada')
  })

  it('filtra, ordena y pagina', () => {
    expect(filterRows(rows, 'hero')).toHaveLength(2)
    expect(filterRows(rows, '')).toHaveLength(3)
    expect(sortRows(rows, false).map(r => r.id)).toEqual([1, 2, 3])
    const many = Array.from({ length: 60 }, (_, i) => ({ id: i }))
    expect(paginate(many, 1)).toMatchObject({ from: 1, to: 25, total: 60, pages: 3 })
    expect(paginate(many, 3)).toMatchObject({ from: 51, to: 60, page: 3 })
    expect(paginate(many, 99).page).toBe(3)
    expect(paginate([], 1)).toMatchObject({ from: 0, to: 0, total: 0, pages: 1, items: [] })
  })

  it('opciones del filtro: todas + secciones del esquema + empresa', () => {
    const options = sectionFilterOptions(text)
    expect(options[0]).toEqual({ value: '', label: 'Todas' })
    expect(options.at(-1)).toEqual({ value: 'site_settings', label: 'Datos de la empresa' })
    expect(options.some(o => o.value === 'hero')).toBe(true)
    expect(options.some(o => o.value === 'company')).toBe(false)
  })
})

describe('classifyHistoryError', () => {
  it('mapea los códigos de restore_revision', () => {
    expect(classifyHistoryError({ code: '23514' })).toBe('invalid')
    expect(classifyHistoryError({ code: 'P0002' })).toBe('notFound')
    expect(classifyHistoryError({ code: '42501' })).toBe('permission')
    expect(classifyHistoryError({ status: 401 })).toBe('session')
    expect(classifyHistoryError({ message: 'Failed to fetch' }, true)).toBe('network')
    expect(classifyHistoryError({ code: 'XX' })).toBe('unknown')
  })
})
