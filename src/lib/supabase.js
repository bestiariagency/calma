import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY. Copia .env.example a .env.local y complétalo.')
}

// Solo clave publicable (anon): los permisos los impone RLS. Nunca service_role en el cliente.
export const supabase = createClient(url, anonKey)
