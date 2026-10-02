import { supabase } from '../lib/supabase.js'
import { toError } from './conditionalWrite.js'

const BUCKET = 'site-media'

const publicMediaUrl = path => supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl

// Imágenes del bucket por id: { [media_id]: { url, width, height, bytes, mime } }.
export async function fetchMediaByIds(ids) {
  if (!ids.length) return {}
  const { data, error, status } = await supabase.from('media').select('id, path, width, height, bytes, mime').in('id', ids)
  if (error) throw toError(error, status)
  return Object.fromEntries(
    data.map(({ id, path, width, height, bytes, mime }) => [id, { url: publicMediaUrl(path), width, height, bytes, mime }]),
  )
}

// Fotos sin uso (solo admin): [{ media_id | null, path, bytes, created_at, reason: 'sin_referencia' | 'sin_registro' }].
export async function listOrphanMedia() {
  const { data, error, status } = await supabase.rpc('list_orphan_media')
  if (error) throw toError(error, status)
  return (data ?? []).map(item => ({ ...item, url: publicMediaUrl(item.path) }))
}

// Borra el objeto de Storage → 'removed' | 'missing' (ya no existía) | 'blocked' (RLS devuelve [] sin error).
export async function removeStorageObject(path) {
  const { data, error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw toError(error)
  if (data?.some(object => object.name === path)) return 'removed'
  const { data: present } = await supabase.storage.from(BUCKET).exists(path)
  return present ? 'blocked' : 'missing'
}

// Borra la fila de `media`. Cero filas = RLS lo bloqueó (la fila existe, viene de list_orphan_media).
export async function deleteMediaRecord(id) {
  const { data, error, status } = await supabase.from('media').delete().eq('id', id).select('id')
  if (error) throw toError(error, status)
  if (!data?.length) throw Object.assign(new Error('forbidden'), { code: '42501', status: 403 })
}

// Sube la imagen ya procesada (WebP, o JPEG en Safari) a `sections/<sectionKey>/<uuid>.<webp|jpg>` y lo registra en `media`.
// supabase-js no informa progreso de subida: `onPhase('uploading' | 'saving')` marca las fases.
// Si el registro falla, borra el objeto recién subido (no queda archivo sin fila).
// Si el usuario descarta/abandona sin guardar, el archivo queda huérfano a propósito: la pantalla Historial lo
// limpia con `listOrphanMedia()` + `removeStorageObject()` + `deleteMediaRecord()`. No borrar aquí.
export async function uploadSectionImage({ sectionKey, blob, width, height, bytes, mime, extension, alt = '', onPhase }) {
  const id = crypto.randomUUID()
  const path = `sections/${sectionKey}/${id}.${extension}`

  onPhase?.('uploading')
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: mime, cacheControl: '31536000', upsert: false })
  if (uploadError) throw toError(uploadError)

  onPhase?.('saving')
  const { error: insertError, status } = await supabase
    .from('media')
    .insert({ id, path, alt: alt.slice(0, 200), width, height, bytes, mime })
  if (insertError) {
    await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
    throw toError(insertError, status)
  }
  return { media_id: id, url: publicMediaUrl(path), width, height, bytes, mime }
}
