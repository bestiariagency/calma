// Validación pura de las variables de entorno de Supabase (testeable sin tocar import.meta.env).
export function missingSupabaseVars({ url, anonKey }) {
  const missing = []
  if (!url) missing.push('VITE_SUPABASE_URL')
  if (!anonKey) missing.push('VITE_SUPABASE_ANON_KEY')
  return missing
}

export class SupabaseConfigError extends Error {
  constructor(missing) {
    super(`Faltan ${missing.join(' y ')}. Copia .env.example a .env.local y complétalo.`)
    this.name = 'SupabaseConfigError'
    this.missing = missing
  }
}
