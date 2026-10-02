// Lógica pura: decide qué payload de get_site_content manda según su `updated_at`.
const toTime = payload => {
  const time = Date.parse(payload?.updated_at)
  return Number.isNaN(time) ? null : time
}

// ¿candidate es estrictamente más nuevo que current? Sin fecha en current, cualquier payload con fecha gana.
export function isNewer(candidate, current) {
  const candidateTime = toTime(candidate)
  if (candidateTime === null) return false
  const currentTime = toTime(current)
  return currentTime === null || candidateTime > currentTime
}

// Devuelve el payload más reciente de la lista (ignora null/no-objetos); en empate gana el primero.
export function pickFreshest(...payloads) {
  const valid = payloads.filter(p => p && typeof p === 'object')
  return valid.reduce((best, p) => (best === null || isNewer(p, best) ? p : best), null)
}
