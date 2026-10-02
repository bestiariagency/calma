import { classifySaveError } from './sectionEditor.js'

// Errores de restaurar/leer el historial → 'invalid' (el snapshot ya no cumple el esquema, 23514) | 'notFound' (P0002)
// | 'permission' | 'session' | 'network' | 'unknown'.
export function classifyHistoryError(error, online) {
  if (error?.code === 'P0002') return 'notFound'
  return classifySaveError(error, online)
}
