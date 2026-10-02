// Lógica pura: fusiona el contenido de la BD sobre el seed de content.js.
// Reglas: la forma la manda el seed (claves desconocidas de la BD, como media_id/blurhash, se ignoran);
// listas por índice; un valor de la BD solo se aplica si su tipo coincide con el del seed.
import { COMPANY, CTA, FOOTER, GALERIA, HERO, MOBILE_MENU_LINKS, NAV_LINKS, POR_QUE, PROCESO, QUE_ES } from '../data/content.js'
import { whatsappUrl } from './contact.js'

const isPlainObject = v => v !== null && typeof v === 'object' && !Array.isArray(v)

export function mergeDeep(seed, patch) {
  if (Array.isArray(seed)) {
    if (!Array.isArray(patch)) return seed
    return seed.map((item, i) => (i < patch.length ? mergeDeep(item, patch[i]) : item))
  }
  if (isPlainObject(seed)) {
    if (!isPlainObject(patch)) return seed
    return Object.fromEntries(Object.entries(seed).map(([key, value]) => [key, mergeDeep(value, patch[key])]))
  }
  return typeof patch === typeof seed && !Number.isNaN(patch) ? patch : seed
}

const seedSections = () => ({
  nav: { links: NAV_LINKS },
  mobile_menu: { links: MOBILE_MENU_LINKS },
  hero: HERO,
  que_es: QUE_ES,
  por_que: POR_QUE,
  proceso: PROCESO,
  galeria: GALERIA,
  cta: CTA,
  footer: FOOTER,
})

// Los hrefs de contacto no son editables: se recalculan desde los datos fusionados.
function withContactHrefs(sections, waUrl) {
  const setHref = (links, flag) => links.map(link => (link[flag] ? { ...link, href: waUrl } : link))
  return {
    ...sections,
    nav: { ...sections.nav, links: setHref(sections.nav.links, 'cta') },
    mobile_menu: { ...sections.mobile_menu, links: setHref(sections.mobile_menu.links, 'accent') },
  }
}

// payload: respuesta de get_site_content (o null/parcial/corrupta → devuelve el seed).
export function buildSiteContent(payload) {
  const data = isPlainObject(payload) ? payload : {}
  const sectionsPatch = isPlainObject(data.sections) ? data.sections : {}
  const merged = mergeDeep(seedSections(), sectionsPatch)
  const company = mergeDeep(COMPANY, data.settings)
  const waUrl = whatsappUrl(company.whatsapp, company.whatsapp_message)
  return { ...withContactHrefs(merged, waUrl), company, whatsappUrl: waUrl }
}
