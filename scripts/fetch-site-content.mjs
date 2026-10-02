// Prebuild: descarga el contenido publicado (RPC get_site_content, anon) a src/data/siteContent.generated.json.
// Nunca rompe el build: ante cualquier fallo conserva el archivo previo (o escribe `null`) y avisa por consola.
import { existsSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'

const TIMEOUT_MS = 10_000
const OUT_FILE = fileURLToPath(new URL('../src/data/siteContent.generated.json', import.meta.url))

async function download({ url, anonKey }, fetchImpl) {
  const response = await fetchImpl(`${url}/rest/v1/rpc/get_site_content`, {
    method: 'POST',
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
    body: '{}',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  const payload = await response.json()
  if (!payload || typeof payload !== 'object' || !payload.sections) throw new Error('respuesta sin "sections"')
  return payload
}

// Devuelve true si escribió contenido fresco. Inyectable para tests: env, fetchImpl, outFile, log.
export async function fetchSiteContent({ env, fetchImpl = fetch, outFile = OUT_FILE, log = console } = {}) {
  const keepFallback = reason => {
    log.warn(`[fetch-site-content] ${reason}; el build usa el contenido semilla/previo.`)
    if (!existsSync(outFile)) writeFileSync(outFile, 'null\n')
    return false
  }
  const url = env.VITE_SUPABASE_URL
  const anonKey = env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) return keepFallback('faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY')
  try {
    const payload = await download({ url, anonKey }, fetchImpl)
    writeFileSync(outFile, `${JSON.stringify(payload)}\n`)
    log.log(`[fetch-site-content] contenido descargado (updated_at: ${payload.updated_at ?? 'n/d'}).`)
    return true
  } catch (error) {
    return keepFallback(`no se pudo descargar (${error.message})`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const env = { ...loadEnv('production', process.cwd(), 'VITE_'), ...process.env }
  await fetchSiteContent({ env })
}
