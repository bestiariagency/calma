import { computed, onBeforeUnmount, ref } from 'vue'
import { adminImageText as t } from '../../data/adminEditorText.js'
import { ImageError, processImage, validateImageFile } from '../../lib/imageProcessing.js'
import { classifySaveError } from '../../lib/sectionEditor.js'
import { uploadSectionImage } from '../../services/mediaService.js'

// Avance por fases (supabase-js no da progreso real de subida).
const PROGRESS = { processing: 25, uploading: 60, saving: 90, done: 100 }

// Subida de UNA imagen de un campo: procesa (WebP ≤ 2400 px), sube, registra. `start` devuelve el resultado
// del servicio o null (error o cancelado). El preview inmediato es un object URL local.
export function useImageUpload(sectionKey) {
  const phase = ref('idle') // idle | processing | uploading | saving | done | error
  const error = ref('')
  const warning = ref('')
  const previewUrl = ref(null)
  let token = 0

  const busy = computed(() => ['processing', 'uploading', 'saving'].includes(phase.value))
  const progress = computed(() => PROGRESS[phase.value] ?? 0)

  function setPreview(file) {
    if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = file ? URL.createObjectURL(file) : null
  }

  function fail(cause) {
    phase.value = 'error'
    setPreview(null)
    const code = cause instanceof ImageError ? cause.code : classifySaveError(cause)
    error.value = t.errors[code] ?? t.errors.unknown
    return null
  }

  async function start(files, alt = '') {
    if (busy.value) return null
    const [file] = files
    const mine = ++token
    error.value = ''
    warning.value = files.length > 1 ? t.multiple : ''
    const invalid = validateImageFile(file)
    if (invalid) return fail(new ImageError(invalid)) // el archivo previo se mantiene
    setPreview(file)
    phase.value = 'processing'
    try {
      const processed = await processImage(file)
      if (mine !== token) return null
      const result = await uploadSectionImage({
        sectionKey: sectionKey(),
        ...processed,
        alt,
        onPhase: next => mine === token && (phase.value = next),
      })
      if (mine !== token) return null // cancelado: el archivo queda huérfano (limpieza en Etapa 10)
      phase.value = 'done'
      setPreview(null)
      return result
    } catch (cause) {
      return mine === token ? fail(cause) : null
    }
  }

  function cancel() {
    token++
    phase.value = 'idle'
    setPreview(null)
  }
  const reset = () => {
    phase.value = 'idle'
    error.value = warning.value = ''
  }

  onBeforeUnmount(() => setPreview(null))
  return { phase, busy, progress, error, warning, previewUrl, start, cancel, reset }
}
