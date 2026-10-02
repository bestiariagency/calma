// Etiqueta relativa de "Guardado hace N min" (textos inyectados desde adminShellText.saveStatus).
export function savedAgoLabel(savedAt, now, text) {
  if (savedAt == null) return text.saved
  const minutes = Math.floor((now - savedAt) / 60000)
  if (minutes < 1) return text.savedNow
  if (minutes < 60) return text.savedMinutes(minutes)
  return text.savedHours(Math.floor(minutes / 60))
}
