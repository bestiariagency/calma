// Contenido público del sitio: una sola RPC (anon) que devuelve { sections, settings, updated_at }.
// fetch nativo (sin supabase-js) para que la landing no cargue el SDK; supabase-js queda solo para el panel.
const TIMEOUT_MS = 3000

export async function fetchSiteContent({ timeoutMs = TIMEOUT_MS } = {}) {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) throw new Error('Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY.')

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${url}/rest/v1/rpc/get_site_content`, {
      method: 'POST',
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, 'Content-Type': 'application/json' },
      body: '{}',
      signal: controller.signal,
    })
    if (!response.ok) throw new Error(`get_site_content: HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}
