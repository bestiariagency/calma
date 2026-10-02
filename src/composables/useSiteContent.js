import { computed, shallowRef } from 'vue'
import { buildSiteContent } from '../lib/mergeContent.js'
import { fetchSiteContent } from '../services/contentService.js'
import { readContentCache, writeContentCache } from '../lib/contentCache.js'

// Estado compartido a nivel de módulo: una sola petición por carga.
// Seed (content.js) → o caché local → pinta al instante; la BD se fusiona en cuanto llega (petición lanzada desde main.js).
const cached = readContentCache()
const content = shallowRef(buildSiteContent(cached?.payload))
let refreshStarted = false

async function refresh() {
  try {
    const payload = await fetchSiteContent()
    if (!payload || typeof payload !== 'object') return
    writeContentCache(payload)
    if (!cached || payload.updated_at !== cached.updated_at) content.value = buildSiteContent(payload)
  } catch {
    // Sin errores visibles: se mantiene el seed/caché.
  }
}

// Lanza la petición ya (idempotente): main.js la llama antes de montar; no bloquea el primer paint.
export function startContentRefresh() {
  if (refreshStarted) return
  refreshStarted = true
  refresh()
}

export function useSiteContent() {
  const pick = key => computed(() => content.value[key])
  return {
    nav: pick('nav'),
    mobileMenu: pick('mobile_menu'),
    hero: pick('hero'),
    queEs: pick('que_es'),
    porQue: pick('por_que'),
    proceso: pick('proceso'),
    galeria: pick('galeria'),
    cta: pick('cta'),
    footer: pick('footer'),
    company: pick('company'),
    whatsappUrl: pick('whatsappUrl'),
    refreshAfterPaint: startContentRefresh,
  }
}
