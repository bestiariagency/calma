import { supabase } from '../lib/supabase.js'

// Postgrest trae el status aparte; Storage lo trae en el error (`status` / `statusCode`).
export const toError = (error, fallbackStatus) =>
  Object.assign(new Error(error.message), {
    code: error.code,
    status: error.status ?? (Number(error.statusCode) || fallbackStatus),
  })

// UPDATE condicional por `updated_at` (compartido por section_content y site_settings).
// Con `expectedUpdatedAt` no escribe si otra pestaña guardó antes y devuelve { conflict: true }; con `overwrite` lo omite.
// Cero filas sin conflicto = RLS bloqueó la escritura (no es admin) → error 42501.
export async function writeConditional(table, match, values, { expectedUpdatedAt = null, overwrite = false } = {}) {
  let query = supabase.from(table).update(values).match(match)
  if (!overwrite && expectedUpdatedAt) query = query.eq('updated_at', expectedUpdatedAt)
  const { data, error, status } = await query.select('updated_at')
  if (error) throw toError(error, status)
  if (data?.length) return { updated_at: data[0].updated_at }

  const remote = await fetchUpdatedAt(table, match)
  if (remote && remote !== expectedUpdatedAt) return { conflict: true, remoteUpdatedAt: remote }
  throw Object.assign(new Error('forbidden'), { code: '42501', status: 403 })
}

async function fetchUpdatedAt(table, match) {
  const { data, error, status } = await supabase.from(table).select('updated_at').match(match).maybeSingle()
  if (error) throw toError(error, status)
  return data?.updated_at ?? null
}
