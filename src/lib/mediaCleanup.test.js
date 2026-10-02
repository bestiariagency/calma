import { describe, expect, it, vi } from 'vitest'
import { cleanOrphans, summarizeOrphans } from './mediaCleanup.js'

const items = [
  { media_id: 'm1', path: 'sections/a/1.webp', bytes: 1000 },
  { media_id: null, path: 'sections/a/2.webp', bytes: 500 },
  { media_id: 'm3', path: 'sections/a/3.webp', bytes: 250 },
]

describe('mediaCleanup', () => {
  it('suma cantidad y bytes', () => {
    expect(summarizeOrphans(items)).toEqual({ count: 3, bytes: 1750 })
    expect(summarizeOrphans([])).toEqual({ count: 0, bytes: 0 })
  })

  it('borra primero el objeto y después la fila (solo si hay media_id)', async () => {
    const calls = []
    const result = await cleanOrphans(items, {
      removeObject: async path => (calls.push(`obj:${path}`), 'removed'),
      deleteRecord: async id => calls.push(`row:${id}`),
    })
    expect(calls).toEqual(['obj:sections/a/1.webp', 'row:m1', 'obj:sections/a/2.webp', 'obj:sections/a/3.webp', 'row:m3'])
    expect(result).toEqual({ deleted: 3, freedBytes: 1750, failed: [] })
  })

  it('fallos parciales: no corta el resto y NO borra la fila si el objeto falló', async () => {
    const deleteRecord = vi.fn()
    const onProgress = vi.fn()
    const result = await cleanOrphans(items, {
      removeObject: async path => {
        if (path.endsWith('1.webp')) return 'blocked' // RLS devolvió []
        if (path.endsWith('2.webp')) throw new Error('red')
        return 'removed'
      },
      deleteRecord,
      onProgress,
    })
    expect(deleteRecord).toHaveBeenCalledTimes(1)
    expect(deleteRecord).toHaveBeenCalledWith('m3')
    expect(result.deleted).toBe(1)
    expect(result.freedBytes).toBe(250)
    expect(result.failed.map(f => [f.item.path, f.step])).toEqual([
      ['sections/a/1.webp', 'storage'],
      ['sections/a/2.webp', 'storage'],
    ])
    expect(onProgress).toHaveBeenLastCalledWith({ done: 3, total: 3 })
  })

  it('si falla la fila tras borrar el objeto, cuenta como fallida (paso record)', async () => {
    const result = await cleanOrphans([items[0]], {
      removeObject: async () => 'removed',
      deleteRecord: async () => {
        throw new Error('forbidden')
      },
    })
    expect(result).toMatchObject({ deleted: 0, failed: [{ step: 'record', message: 'forbidden' }] })
  })

  it('objeto que ya no existe ("missing") permite limpiar la fila', async () => {
    const deleteRecord = vi.fn()
    const result = await cleanOrphans([items[0]], { removeObject: async () => 'missing', deleteRecord })
    expect(deleteRecord).toHaveBeenCalledWith('m1')
    expect(result.deleted).toBe(1)
  })
})
