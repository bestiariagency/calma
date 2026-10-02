import { computed, shallowRef } from 'vue'
import { buildSiteContent } from '../lib/mergeContent.js'
import { fetchSiteContent } from '../services/contentService.js'
import { isNewer, pickFreshest } from '../lib/contentFreshness.js'
import { readContentCache, writeContentCache } from '../lib/contentCache.js'

// Contenido publicado incluido en el build (prebuild); ausente en dev o si el prebuild falló → null.
const generatedModules = import.meta.glob('../data/siteContent.generated.json', { eager: true, import: 'default' })
const generated = Object.values(generatedModules)[0] ?? null

// Estado compartido a nivel de módulo: una sola petición por carga.
// Parte del contenido del build (o de la caché local si es más nuevo) sobre el seed; la BD solo reemplaza si es más nueva.
const initialPayload = pickFreshest(generated, readContentCache()?.payload)
const content = shallowRef(buildSiteContent(initialPayload))
let currentPayload = initialPayload
let refreshStarted = false

async function refresh() {
  try {
    const payload = await fetchSiteContent()
    if (!payload || typeof payload !== 'object') return
    writeContentCache(payload)
    if (!isNewer(payload, currentPayload)) return
    currentPayload = payload
    content.value = buildSiteContent(payload)
  } catch {
    // Sin errores visibles: se mantiene el contenido actual.
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
