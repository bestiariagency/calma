// Etiqueta del modificador de atajos según plataforma (⌘ en Apple, Ctrl en el resto).
export function isApplePlatform(nav = globalThis.navigator) {
  return /Mac|iPhone|iPad|iPod/i.test(nav?.platform ?? nav?.userAgent ?? '')
}

export function shortcutLabel(key, nav) {
  return isApplePlatform(nav) ? `⌘${key}` : `Ctrl ${key}`
}
