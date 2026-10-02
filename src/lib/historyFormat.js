// Formato del historial: fechas (relativa y absoluta), autor y tamaños. Los textos se inyectan.
const LOCALE = 'es-CL'
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const MAX_RELATIVE_DAYS = 30

export function formatAbsolute(iso, timeZone) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(LOCALE, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone }).format(date)
}

// "hace 5 min", "hace 3 h", "ayer", "hace 12 días"; pasados 30 días devuelve '' (basta la fecha absoluta).
export function formatRelative(iso, now, text) {
  const elapsed = now - new Date(iso).getTime()
  if (Number.isNaN(elapsed)) return ''
  if (elapsed < MINUTE) return text.justNow
  if (elapsed < HOUR) return text.minutesAgo(Math.floor(elapsed / MINUTE))
  if (elapsed < DAY) return text.hoursAgo(Math.floor(elapsed / HOUR))
  const days = Math.floor(elapsed / DAY)
  if (days === 1) return text.yesterday
  return days <= MAX_RELATIVE_DAYS ? text.daysAgo(days) : ''
}

// Hay un único rol admin: al usuario actual se le dice "Tú"; al resto (o a un usuario ya borrado) "Administrador".
export const authorLabel = (changedBy, currentUserId, text) =>
  changedBy && changedBy === currentUserId ? text.authorYou : text.authorAdmin

export function formatBytes(bytes) {
  const value = Number(bytes) || 0
  const number = (n, digits) => new Intl.NumberFormat(LOCALE, { maximumFractionDigits: digits }).format(n)
  if (value < 1024 * 1024) return `${number(Math.max(1, Math.round(value / 1024)), 0)} KB`
  return `${number(value / (1024 * 1024), 1)} MB`
}
