import { supabase } from '../lib/supabase.js'
import { toError } from './conditionalWrite.js'
import { fetchSettings } from './settingsService.js'
import { SETTINGS_KEY } from '../lib/historyDiff.js'

// Todas las revisiones (máx. 30 por clave): el historial filtra, ordena y pagina en el cliente.
export async function fetchRevisions() {
  const { data, error, status } = await supabase
    .from('content_revisions')
    .select('id, key, snapshot, changed_by, changed_at')
    .order('changed_at', { ascending: false })
  if (error) throw toError(error, status)
  return data
}

// Estado publicado ahora, por clave: { nav: {...}, hero: {...}, …, site_settings: {...} }.
export async function fetchCurrentContent() {
  const [sections, settings] = await Promise.all([
    supabase.from('section_content').select('key, content'),
    fetchSettings(),
  ])
  if (sections.error) throw toError(sections.error, sections.status)
  return { ...Object.fromEntries(sections.data.map(({ key, content }) => [key, content])), [SETTINGS_KEY]: settings.content }
}

// Restaura una revisión (crea a su vez otra: se puede deshacer) → { key, restored_revision }.
export async function restoreRevision(revisionId) {
  const { data, error, status } = await supabase.rpc('restore_revision', { p_revision_id: revisionId })
  if (error) throw toError(error, status)
  return data
}
