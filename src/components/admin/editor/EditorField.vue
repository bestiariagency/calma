<script setup>
import { computed } from 'vue'
import { useEditor } from '../../../composables/admin/editorContext.js'
import { useImageUpload } from '../../../composables/admin/useImageUpload.js'
import { normalizeValue } from '../../../lib/fieldFormats.js'
import { charLength, getAt, joinPath, resolveImagePreview, setAt } from '../../../lib/sectionEditor.js'
import Card from '../ui/Card.vue'
import Field from '../ui/Field.vue'
import ImageField from '../ui/ImageField.vue'
import Input from '../ui/Input.vue'
import Textarea from '../ui/Textarea.vue'

// Un campo del esquema (text | textarea | email | phone | url | e164 | image) en `prefix + field.path`.
const props = defineProps({
  field: { type: Object, required: true },
  prefix: { type: String, default: '' },
  bare: { type: Boolean, default: false }, // sin Card propio (dentro de un FixedListItem)
  icon: { type: [Object, Function], default: null }, // icono a la izquierda del label (Datos de la empresa)
})
const READY_BADGE_MS = 3000 // "Imagen lista" vuelve a lo normal a los 3 s (spec 3.4)
const editor = useEditor()

const INPUT_TYPES = { email: 'email', phone: 'tel', e164: 'tel', url: 'url' }
const path = computed(() => joinPath(props.prefix, props.field.path))
const altPath = computed(() => joinPath(path.value, 'alt'))
const value = computed({
  get: () => getAt(editor.working.value, path.value) ?? '',
  set: next => setAt(editor.working.value, path.value, next),
})
const alt = computed({
  get: () => getAt(editor.working.value, altPath.value) ?? '',
  set: next => setAt(editor.working.value, altPath.value, next),
})
// Al salir del campo se deja el valor como se guardará (sin espacios sobrantes; WhatsApp sin separadores).
function onBlur() {
  value.value = normalizeValue(props.field.type, value.value)
  editor.touch(path.value)
}
const upload = useImageUpload(() => editor.sectionKey.value)

// Al terminar la subida la imagen del campo apunta al archivo nuevo (alt intacto); se publica con Guardar.
async function replaceImage(files) {
  const result = await upload.start(files, alt.value)
  if (!result) return
  editor.registerMedia(result.media_id, result)
  const current = getAt(editor.working.value, path.value)
  setAt(editor.working.value, path.value, { ...current, media_id: result.media_id, src: null, width: result.width, height: result.height })
  setTimeout(upload.reset, READY_BADGE_MS)
}
const preview = computed(() => resolveImagePreview(getAt(editor.working.value, path.value), editor.media.value))
</script>

<template>
  <ImageField
    v-if="field.type === 'image'"
    v-model:alt="alt"
    :label="field.label"
    :url="preview.url"
    :width="preview.width"
    :height="preview.height"
    :alt-label="field.altLabel"
    :alt-help="field.altHelp"
    :alt-max-length="field.altMaxLength"
    :bytes="preview.bytes"
    :mime="preview.mime"
    :phase="upload.phase.value"
    :progress="upload.progress.value"
    :preview-url="upload.previewUrl.value"
    :upload-error="upload.error.value"
    :upload-warning="upload.warning.value"
    :alt-error="editor.errors.value[altPath]"
    @pick="replaceImage"
    @cancel="upload.cancel"
    @blur-alt="editor.touch(altPath)"
  />
  <component :is="bare ? 'div' : Card" v-else :invalid="bare ? undefined : Boolean(editor.errors.value[path])">
    <div class="flex flex-col gap-2">
      <Field
        v-slot="{ controlProps }"
        :label="field.label"
        :icon="icon"
        :required="field.required"
        :help="field.help"
        :error="editor.errors.value[path]"
        :count="charLength(value)"
        :max-length="field.maxLength"
      >
        <Textarea v-if="field.type === 'textarea'" v-model="value" v-bind="controlProps" @blur="onBlur" />
        <Input v-else v-model="value" v-bind="controlProps" :type="INPUT_TYPES[field.type]" @blur="onBlur" />
      </Field>
      <!-- Ayudas del campo (enlaces de prueba, vista previa); el valor ya viene normalizado. -->
      <slot name="extra" :value="value" :error="editor.errors.value[path]" />
    </div>
  </component>
</template>
