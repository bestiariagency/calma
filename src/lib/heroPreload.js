// Lógica pura: atributos del <link rel="preload" as="image"> del hero según el contenido publicado.
const MIME_BY_EXT = { webp: 'image/webp', avif: 'image/avif', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' }

export function imageMimeType(src) {
  const ext = String(src).split(/[?#]/)[0].split('.').pop().toLowerCase()
  return MIME_BY_EXT[ext] ?? null
}

// Devuelve { href, type } o null si el contenido no trae una imagen de hero utilizable.
export function heroPreloadFor(siteContent) {
  const src = siteContent?.hero?.image?.src
  if (typeof src !== 'string' || !src) return null
  return { href: src, type: imageMimeType(src) }
}

const PRELOAD_LINK = /<link\b[^>]*rel="preload"[^>]*as="image"[^>]*>/

// Reescribe href/type del preload de imagen existente; sin preload o sin hero válido deja el HTML igual.
export function rewriteHeroPreload(html, preload) {
  if (!preload) return html
  return html.replace(PRELOAD_LINK, link => {
    const withHref = link.replace(/href="[^"]*"/, `href="${preload.href}"`)
    if (!preload.type) return withHref.replace(/\s+type="[^"]*"/, '')
    return /type="/.test(withHref) ? withHref.replace(/type="[^"]*"/, `type="${preload.type}"`) : withHref.replace(/\s*\/?>$/, ` type="${preload.type}" />`)
  })
}
