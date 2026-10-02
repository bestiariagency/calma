import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fetchSiteContent } from './contentService.js'

const jsonResponse = (body, init = {}) => new Response(typeof body === 'string' ? body : JSON.stringify(body), init)

beforeEach(() => {
  vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
  vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.unstubAllEnvs()
  vi.useRealTimers()
})

describe('fetchSiteContent', () => {
  it('hace POST a la RPC con apikey y devuelve el JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ updated_at: 't', sections: {} }))
    vi.stubGlobal('fetch', fetchMock)
    await expect(fetchSiteContent()).resolves.toEqual({ updated_at: 't', sections: {} })
    const [url, opts] = fetchMock.mock.calls[0]
    expect(url).toBe('https://x.supabase.co/rest/v1/rpc/get_site_content')
    expect(opts.method).toBe('POST')
    expect(opts.body).toBe('{}')
    expect(opts.headers).toMatchObject({ apikey: 'anon', Authorization: 'Bearer anon', 'Content-Type': 'application/json' })
  })

  it('lanza ante error HTTP', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({}, { status: 500 })))
    await expect(fetchSiteContent()).rejects.toThrow('HTTP 500')
  })

  it('lanza ante JSON inválido', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse('<html>', { status: 200 })))
    await expect(fetchSiteContent()).rejects.toThrow()
  })

  it('aborta al superar el timeout', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url, { signal }) =>
          new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))),
      ),
    )
    const result = expect(fetchSiteContent({ timeoutMs: 3000 })).rejects.toThrow('Aborted')
    await vi.advanceTimersByTimeAsync(3000)
    await result
  })
})
