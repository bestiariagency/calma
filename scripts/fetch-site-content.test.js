import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchSiteContent } from './fetch-site-content.mjs'

const env = { VITE_SUPABASE_URL: 'https://x.supabase.co', VITE_SUPABASE_ANON_KEY: 'anon' }
const payload = { updated_at: '2026-10-02T10:00:00Z', sections: { hero: {} } }
const ok = body => vi.fn().mockResolvedValue({ ok: true, json: async () => body })
let outFile, log

beforeEach(() => {
  outFile = join(mkdtempSync(join(tmpdir(), 'calma-')), 'out.json')
  log = { log: vi.fn(), warn: vi.fn() }
})

describe('fetchSiteContent (prebuild)', () => {
  it('OK: llama a la RPC con la clave anon y escribe el JSON', async () => {
    const fetchImpl = ok(payload)
    expect(await fetchSiteContent({ env, fetchImpl, outFile, log })).toBe(true)
    expect(fetchImpl.mock.calls[0][0]).toBe('https://x.supabase.co/rest/v1/rpc/get_site_content')
    expect(fetchImpl.mock.calls[0][1].headers.apikey).toBe('anon')
    expect(JSON.parse(readFileSync(outFile, 'utf8'))).toEqual(payload)
  })

  it('error de red/HTTP: no lanza, escribe null si no había archivo y avisa', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 500 })
    expect(await fetchSiteContent({ env, fetchImpl, outFile, log })).toBe(false)
    expect(readFileSync(outFile, 'utf8').trim()).toBe('null')
    expect(log.warn).toHaveBeenCalled()
  })

  it('error con archivo previo: lo conserva', async () => {
    writeFileSync(outFile, '{"prev":true}')
    const fetchImpl = vi.fn().mockRejectedValue(new Error('offline'))
    expect(await fetchSiteContent({ env, fetchImpl, outFile, log })).toBe(false)
    expect(readFileSync(outFile, 'utf8')).toBe('{"prev":true}')
  })

  it('envs ausentes: no llama a la red', async () => {
    const fetchImpl = ok(payload)
    expect(await fetchSiteContent({ env: {}, fetchImpl, outFile, log })).toBe(false)
    expect(fetchImpl).not.toHaveBeenCalled()
    expect(readFileSync(outFile, 'utf8').trim()).toBe('null')
  })

  it('respuesta inválida se trata como fallo', async () => {
    expect(await fetchSiteContent({ env, fetchImpl: ok({ foo: 1 }), outFile, log })).toBe(false)
  })
})
