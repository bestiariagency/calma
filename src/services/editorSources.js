import { fetchSection, saveSection } from './sectionService.js'
import { fetchSettings, saveSettings } from './settingsService.js'

// Adaptadores de origen de datos del editor (useSectionEditor): misma forma, distinta tabla.
//   fetch(key) → { content, updated_at, media };  save(key, content, { expectedUpdatedAt, overwrite }) → { updated_at } | { conflict }
export const sectionSource = { fetch: fetchSection, save: saveSection }
export const companySource = { fetch: () => fetchSettings(), save: (_key, content, options) => saveSettings(content, options) }
