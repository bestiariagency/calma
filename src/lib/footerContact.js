// Lógica pura: qué piezas del bloque de contacto del footer se muestran (docs/footer-contacto-spec.md).
// Cada pieza existe solo con dato; los enlaces solo si son https:// (defensa en profundidad: la BD ya lo valida).
const SOCIAL_NETWORKS = [
  ['instagram', 'Instagram'],
  ['facebook', 'Facebook'],
  ['tiktok', 'TikTok'],
  ['youtube', 'YouTube'],
]

const clean = value => (typeof value === 'string' ? value.trim() : '')
const httpsOnly = url => (clean(url).startsWith('https://') ? clean(url) : '')

export function buildFooterContact(company = {}) {
  const address = [company.address, company.city, company.region].map(clean).filter(Boolean).join(', ')
  const hours = clean(company.opening_hours)
  const socials = SOCIAL_NETWORKS.map(([network, name]) => ({ network, name, href: httpsOnly(company.social?.[network]) })).filter(
    social => social.href,
  )
  return {
    address,
    mapsHref: address ? httpsOnly(company.maps_url) : '', // sin dirección no hay enlace
    hours,
    socials,
    hasText: Boolean(address || hours),
    hasContact: Boolean(address || hours || socials.length),
  }
}
