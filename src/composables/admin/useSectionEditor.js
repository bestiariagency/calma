import { computed, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import { CONTENT_SCHEMA } from '../../data/contentSchema.js'
import { adminEditorText as t } from '../../data/adminEditorText.js'
import { clearContentCache } from '../../lib/contentCache.js'
import {
  buildPayload,
  changedPaths,
  classifySaveError,
  cloneContent,
  flattenFields,
  isDirty,
  normalizeWorking,
  validateSection,
} from '../../lib/sectionEditor.js'
import { sectionSource } from '../../services/editorSources.js'
import { registerSave, resetSaveState, setSaveState } from './useSaveState.js'
import { useSaveShortcut } from './useSaveShortcut.js'
import { useToast } from './useToast.js'

// Editor de una sección: carga, copia de trabajo, dirty/validación, guardar (= publicar), descartar y conflicto.
// `keyRef`: clave del esquema (ref/getter). `onInvalid`: la vista enfoca el primer campo inválido.
// `source`: adaptador de origen de datos (sectionSource | companySource, ver services/editorSources.js).
export function useSectionEditor(keyRef, { onInvalid, source = sectionSource } = {}) {
  const toast = useToast()
  const fields = computed(() => CONTENT_SCHEMA[keyRef.value]?.fields ?? [])
  const leaves = computed(() => flattenFields(fields.value))

  const phase = ref('loading') // loading | ready | error
  const loaded = shallowRef(null)
  const working = ref(null)
  const updatedAt = ref(null)
  const media = shallowRef({})
  const touched = ref({})
  const submitted = ref(false)
  const saving = ref(false)
  const saveError = ref(null) // { title, detail } del último guardado fallido
  const conflict = ref(false)
  let loadSeq = 0

  const dirty = computed(() => isDirty(loaded.value, working.value))
  const changedCount = computed(() => (loaded.value ? changedPaths(leaves.value, loaded.value, working.value).length : 0))
  const errors = computed(() => (working.value ? validateSection(leaves.value, working.value, t) : {}))
  const visibleErrors = computed(() =>
    submitted.value ? errors.value : Object.fromEntries(Object.entries(errors.value).filter(([path]) => touched.value[path])),
  )

  const clearSaveError = () => (saveError.value = null)

  function apply(data) {
    loaded.value = data.content
    working.value = cloneContent(data.content)
    updatedAt.value = data.updated_at
    media.value = data.media
    touched.value = {}
    submitted.value = false
    conflict.value = false
    clearSaveError()
  }

  async function load() {
    const seq = ++loadSeq
    phase.value = 'loading'
    loaded.value = working.value = null
    setSaveState({ status: 'idle', savedAt: null })
    try {
      const data = await source.fetch(keyRef.value)
      if (seq !== loadSeq) return
      apply(data)
      phase.value = 'ready'
    } catch {
      if (seq === loadSeq) phase.value = 'error'
    }
  }

  const registerMedia = (id, info) => (media.value = { ...media.value, [id]: info })
  const touch = path => (touched.value = { ...touched.value, [path]: true })

  // Un error de guardado = SaveStatus del header + Alert inline (sin toast: taparía la UnsavedBar).
  const reportFailure = error => (saveError.value = t.saveErrors[classifySaveError(error)] ?? t.saveErrors.unknown)

  async function save({ overwrite = false } = {}) {
    if (saving.value || phase.value !== 'ready') return 'busy'
    normalizeWorking(leaves.value, working.value) // lo que se valida y se guarda es lo normalizado
    if (!dirty.value) {
      toast.info(t.noChanges, { detail: t.noChangesDetail })
      return 'noop'
    }
    submitted.value = true
    const invalid = Object.keys(errors.value).length
    if (invalid) {
      toast.error(t.reviewFields(invalid), { detail: t.reviewFieldsDetail })
      onInvalid?.()
      return 'invalid'
    }
    saving.value = true
    clearSaveError()
    try {
      const payload = buildPayload(loaded.value, working.value, leaves.value)
      const result = await source.save(keyRef.value, payload, { expectedUpdatedAt: updatedAt.value, overwrite })
      if (result.conflict) {
        conflict.value = true
        return 'conflict'
      }
      loaded.value = payload
      // `working` no se toca: si el usuario siguió escribiendo durante el guardado, sigue siendo "sin guardar".
      updatedAt.value = result.updated_at
      submitted.value = false
      conflict.value = false
      clearContentCache()
      setSaveState({ savedAt: Date.now() })
      toast.success(t.saved, { detail: t.savedDetail })
      return 'saved'
    } catch (error) {
      reportFailure(error)
      return 'error'
    } finally {
      saving.value = false
    }
  }

  function discard() {
    working.value = cloneContent(loaded.value)
    touched.value = {}
    submitted.value = false
    clearSaveError()
    toast.info(t.discarded)
  }

  // Estado del header (SaveStatus): guardando > error > sin guardar > guardado.
  watch(
    [saving, saveError, dirty, phase],
    () => {
      if (phase.value !== 'ready') return
      if (saving.value) setSaveState({ status: 'saving' })
      else if (saveError.value) setSaveState({ status: 'error' })
      else setSaveState({ status: dirty.value ? 'dirty' : 'saved' })
    },
    { flush: 'sync' },
  )

  const submit = () => save()
  const unregister = registerSave(submit)
  useSaveShortcut(submit)
  watch(keyRef, load, { immediate: true })

  onBeforeUnmount(() => {
    loadSeq++
    unregister()
    clearSaveError()
    resetSaveState()
  })

  return {
    sectionKey: keyRef, phase, working, media, registerMedia, leaves, errors: visibleErrors, saving, saveError, conflict, dirty, changedCount,
    touch, load, save, discard,
  }
}
