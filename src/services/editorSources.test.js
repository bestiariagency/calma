import { beforeEach, describe, expect, it, vi } from 'vitest'

// Cliente Supabase simulado: registra las llamadas y responde con lo que se configure. No toca la BD real.
const calls = []
let responses = []
const builder = table => {
  const call = { table, ops: [] }
  calls.push(call)
  const chain = new Proxy(() => {}, {
    get: (_, op) => {
      if (op === 'then') return resolve => resolve(responses.shift() ?? { data: [], error: null, status: 200 })
      return (...args) => (call.ops.push([op, ...args]), chain)
    },
  })
  return chain
}
vi.mock('../lib/supabase.js', () => ({ supabase: { from: builder, storage: { from: () => ({ getPublicUrl: () => ({ data: { publicUrl: '' } }) }) } } }))

const { companySource, sectionSource } = await import('./editorSources.js')
const ops = call => Object.fromEntries(call.ops.map(([op, ...args]) => [op, args]))
const ROW = { name: 'CALMA', tagline: '', email: 'a@b.cl', phone: '+56 9', whatsapp: '+56912345678', whatsapp_message: '', address: '', city: '', region: '', maps_url: '', opening_hours: '', social: {}, updated_at: 't1' }

beforeEach(() => {
  calls.length = 0
  responses = []
})

describe('companySource', () => {
  it('fetch lee la fila única y devuelve el contrato { content, updated_at, media }', async () => {
    responses = [{ data: { ...ROW, updated_by: 'x', id: true }, error: null }]
    const out = await companySource.fetch('company')
    expect(calls[0].table).toBe('site_settings')
    expect(ops(calls[0]).match).toEqual([{ id: true }])
    expect(out.updated_at).toBe('t1')
    expect(out.media).toEqual({})
    expect(Object.keys(out.content)).not.toContain('updated_by')
    expect(out.content.email).toBe('a@b.cl')
  })

  it('save: UPDATE solo de columnas editables, condicional por updated_at', async () => {
    responses = [{ data: [{ updated_at: 't2' }], error: null }]
    const out = await companySource.save('company', { ...ROW, id: true }, { expectedUpdatedAt: 't1' })
    expect(out).toEqual({ updated_at: 't2' })
    const call = ops(calls[0])
    expect(calls[0].table).toBe('site_settings')
    expect(Object.keys(call.update[0])).not.toContain('updated_at')
    expect(Object.keys(call.update[0])).not.toContain('id')
    expect(call.match).toEqual([{ id: true }])
    expect(call.eq).toEqual(['updated_at', 't1'])
  })

  it('save con overwrite omite la condición', async () => {
    responses = [{ data: [{ updated_at: 't3' }], error: null }]
    await companySource.save('company', ROW, { expectedUpdatedAt: 't1', overwrite: true })
    expect(ops(calls[0]).eq).toBeUndefined()
  })

  it('cero filas + updated_at remoto distinto = conflicto', async () => {
    responses = [{ data: [], error: null }, { data: { updated_at: 't9' }, error: null }]
    await expect(companySource.save('company', ROW, { expectedUpdatedAt: 't1' })).resolves.toEqual({ conflict: true, remoteUpdatedAt: 't9' })
  })

  it('cero filas sin conflicto = 42501 (RLS); error 23514 se propaga con su código', async () => {
    responses = [{ data: [], error: null }, { data: { updated_at: 't1' }, error: null }]
    await expect(companySource.save('company', ROW, { expectedUpdatedAt: 't1' })).rejects.toMatchObject({ code: '42501' })
    responses = [{ data: null, error: { code: '23514', message: 'check' }, status: 400 }]
    await expect(companySource.save('company', ROW, { expectedUpdatedAt: 't1' })).rejects.toMatchObject({ code: '23514' })
  })
})

describe('sectionSource', () => {
  it('save escribe solo `content` en section_content por key', async () => {
    responses = [{ data: [{ updated_at: 't2' }], error: null }]
    await sectionSource.save('hero', { title: 'x' }, { expectedUpdatedAt: 't1' })
    expect(calls[0].table).toBe('section_content')
    expect(ops(calls[0]).update).toEqual([{ content: { title: 'x' } }])
    expect(ops(calls[0]).match).toEqual([{ key: 'hero' }])
  })
})
