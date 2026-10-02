import { createClient } from '@supabase/supabase-js'
import { missingSupabaseVars, SupabaseConfigError } from './supabaseConfig.js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// El panel captura este error (router.onError) y muestra una pantalla de configuración en vez de quedarse en blanco.
const missing = missingSupabaseVars({ url, anonKey })
if (missing.length) throw new SupabaseConfigError(missing)

// Solo clave publicable (anon): los permisos los impone RLS. Nunca service_role en el cliente.
export const supabase = createClient(url, anonKey)
