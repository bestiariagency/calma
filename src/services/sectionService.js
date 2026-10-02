import { supabase } from '../lib/supabase.js'
import { collectMediaIds } from '../lib/sectionEditor.js'
import { toError, writeConditional } from './conditionalWrite.js'
import { fetchMediaByIds } from './mediaService.js'

// Imágenes del bucket usadas por la sección: { [media_id]: { url, width, height } } (solo para el preview).
const fetchMediaMap = content => fetchMediaByIds(collectMediaIds(content))

// Lee la sección (admin o público: el SELECT es público) → { content, updated_at, media }.
export async function fetchSection(key) {
  const { data, error, status } = await supabase
    .from('section_content')
    .select('key, content, updated_at')
    .eq('key', key)
    .maybeSingle()
  if (error) throw toError(error, status)
  if (!data) throw Object.assign(new Error('section_not_found'), { code: 'NOT_FOUND', status: 404 })
  return { content: data.content, updated_at: data.updated_at, media: await fetchMediaMap(data.content) }
}

// Guardar = publicar. Solo escribe `content` (escritura condicional, ver writeConditional).
export const saveSection = (key, content, options) => writeConditional('section_content', { key }, { content }, options)
