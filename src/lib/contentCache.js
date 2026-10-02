// Caché local del contenido (payload crudo de la RPC + updated_at). Nunca lanza.
const KEY = 'calma:site-content:v1'

export function readContentCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(KEY))
    return cached && typeof cached === 'object' && cached.payload && typeof cached.payload === 'object' ? cached : null
  } catch {
    return null
  }
}

export function writeContentCache(payload) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ updated_at: payload?.updated_at ?? null, payload }))
  } catch {
    // almacenamiento no disponible o lleno: se ignora
  }
}

// Tras publicar desde el panel: la próxima carga de la landing en este navegador parte del seed y trae lo nuevo.
export function clearContentCache() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // almacenamiento no disponible: se ignora
  }
}
