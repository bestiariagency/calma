import { supabase } from '../lib/supabase.js'
import { toError, writeConditional } from './conditionalWrite.js'

// Columnas editables de site_settings (fila única id = true). `updated_at/updated_by` los pone el servidor.
const COLUMNS = ['name', 'tagline', 'email', 'phone', 'whatsapp', 'whatsapp_message', 'address', 'city', 'region', 'maps_url', 'opening_hours', 'social']
const ROW = { id: true }

const pickColumns = row => Object.fromEntries(COLUMNS.map(column => [column, row[column]]))

// Mismo contrato que fetchSection → { content, updated_at, media }. No hay imágenes (el logo es estático).
export async function fetchSettings() {
  const { data, error, status } = await supabase.from('site_settings').select([...COLUMNS, 'updated_at'].join(', ')).match(ROW).maybeSingle()
  if (error) throw toError(error, status)
  if (!data) throw Object.assign(new Error('settings_not_found'), { code: 'NOT_FOUND', status: 404 })
  return { content: pickColumns(data), updated_at: data.updated_at, media: {} }
}

// Mismo contrato que saveSection. Solo envía columnas editables.
export const saveSettings = (content, options) => writeConditional('site_settings', ROW, pickColumns(content), options)
