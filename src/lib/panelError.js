// Clasifica los errores que abortan una navegación del panel para mostrar una pantalla recuperable.
const CHUNK_PATTERNS = [
  /failed to fetch dynamically imported module/i,
  /error loading dynamically imported module/i,
  /importing a module script failed/i,
  /unable to preload css/i,
  /loading (css )?chunk [\w-]+ failed/i,
]

export function classifyPanelError(error) {
  if (error?.name === 'SupabaseConfigError') return 'config'
  const message = String(error?.message ?? error ?? '')
  if (error?.name === 'ChunkLoadError' || CHUNK_PATTERNS.some(re => re.test(message))) return 'chunk'
  return 'unknown'
}

export const isPanelPath = path => path === '/administrador' || String(path).startsWith('/administrador/')

// Detalle técnico (solo se muestra en DEV): qué variable falta o el mensaje original.
export function panelErrorDetail(error) {
  if (error?.name === 'SupabaseConfigError') return `Variables de entorno ausentes: ${error.missing.join(', ')}`
  return String(error?.message ?? error ?? '')
}
