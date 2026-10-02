<script setup>
import { computed, ref, useId, watch } from 'vue'
import { CircleAlert, ImageUp } from 'lucide-vue-next'
import { adminEditorText as t, adminImageText as ti } from '../../../data/adminEditorText.js'
import { useFileDrop } from '../../../composables/admin/useFileDrop.js'
import { ACCEPTED_TYPES } from '../../../lib/imageProcessing.js'
import { charLength, formatImageMeta } from '../../../lib/sectionEditor.js'
import Alert from './Alert.vue'
import Badge from './Badge.vue'
import Button from './Button.vue'
import Field from './Field.vue'
import Input from './Input.vue'

// Imagen (spec 3.4 y 3.30): preview, metadatos, cambiar (botón, arrastrar o teclado) y alt obligatorio.
// La subida la hace quien lo usa: aquí solo se emite `pick(File[])` y se muestra el estado recibido.
const props = defineProps({
  label: { type: String, required: true },
  url: { type: String, default: null },
  width: { type: Number, default: null },
  height: { type: Number, default: null },
  bytes: { type: Number, default: null },
  mime: { type: String, default: null },
  altLabel: { type: String, required: true },
  altHelp: { type: String, default: '' },
  altMaxLength: { type: Number, default: 0 },
  altError: { type: String, default: '' },
  // Estado de la subida: phase = idle | processing | uploading | saving | done | error.
  phase: { type: String, default: 'idle' },
  progress: { type: Number, default: 0 },
  previewUrl: { type: String, default: null }, // object URL local mientras se sube
  uploadError: { type: String, default: '' },
  uploadWarning: { type: String, default: '' },
})
const alt = defineModel('alt', { type: String, default: '' })
const emit = defineEmits(['blur-alt', 'pick', 'cancel'])

const titleId = useId()
const input = ref(null)
const failed = ref(false)
const received = ref('')
const busy = computed(() => ['processing', 'uploading', 'saving'].includes(props.phase))
const shownUrl = computed(() => props.previewUrl ?? props.url)
// Una URL nueva (p. ej. tras un intento fallido con un archivo ilegible) vuelve a intentar pintar la imagen.
watch(shownUrl, () => (failed.value = false))
const hasImage = computed(() => Boolean(shownUrl.value) && !failed.value)
const ratio = computed(() => (props.width && props.height ? `${props.width} / ${props.height}` : null))
const meta = computed(() => formatImageMeta(props))
const accept = ACCEPTED_TYPES.join(',')

function pick(files) {
  if (!files.length) return
  received.value = ti.received
  emit('pick', files)
}
const { dragging, handlers } = useFileDrop(pick, () => !busy.value)
const openPicker = () => input.value?.click()
function onChoose(event) {
  pick([...event.target.files])
  event.target.value = '' // permite volver a elegir el mismo archivo
}
</script>

<template>
  <section
    :aria-labelledby="titleId"
    :aria-busy="busy || undefined"
    :class="[
      'flex flex-col gap-4 rounded-lg border bg-surface-2 p-5 max-md:p-4',
      'transition-colors duration-(--motion-fast) ease-(--ease-panel) motion-reduce:transition-none',
      'hover:border-line-strong focus-within:border-accent-line',
      altError || uploadError ? 'border-danger-line' : 'border-line',
    ]"
  >
    <h3 :id="titleId" class="font-sans text-[13px]/5 font-semibold text-text">{{ label }}</h3>

    <!-- Con imagen, el preview es el destino de soltar; sin imagen es la dropzone (role=button). -->
    <div
      :role="hasImage ? undefined : 'button'"
      :tabindex="hasImage || busy ? undefined : 0"
      :aria-label="hasImage ? undefined : ti.dropLabel"
      :class="[
        'relative w-full overflow-hidden rounded-md border bg-surface-3',
        hasImage ? 'max-h-80 border-line' : 'grid h-40 place-items-center border-2 border-dashed border-line-input text-text-2',
        !hasImage && 'cursor-pointer focus-visible:outline-2 focus-visible:outline-ring',
        !ratio && hasImage && 'aspect-video',
        dragging && 'border-accent! bg-accent-soft! text-accent-text',
      ]"
      :style="ratio && hasImage ? { aspectRatio: ratio } : undefined"
      @click="!hasImage && !busy && openPicker()"
      @keydown.enter.prevent="!hasImage && !busy && openPicker()"
      @keydown.space.prevent="!hasImage && !busy && openPicker()"
      v-on="handlers"
    >
      <img
        v-if="hasImage"
        :src="shownUrl"
        :alt="alt"
        :width="width || undefined"
        :height="height || undefined"
        loading="lazy"
        decoding="async"
        :class="['size-full object-contain transition-opacity motion-reduce:transition-none', busy && 'opacity-60']"
        @error="failed = true"
      />
      <p v-else class="px-4 text-center font-sans text-sm">{{ ti.dropEmpty }}</p>
      <div
        v-if="dragging"
        class="absolute inset-0 grid place-items-center border-2 border-dashed border-accent bg-accent-soft text-accent-text"
      >
        <span class="flex items-center gap-2 font-sans text-sm font-semibold"><ImageUp :size="24" aria-hidden="true" />{{ ti.dropHere }}</span>
      </div>
    </div>
    <p class="sr-only" aria-live="polite">{{ received }}</p>

    <div v-if="busy" class="flex flex-col gap-2">
      <div class="h-1 overflow-hidden rounded-full bg-surface-4">
        <div
          role="progressbar"
          :aria-valuenow="progress"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-label="ti[phase]"
          class="h-full bg-accent transition-[width] duration-(--motion-base) ease-linear motion-reduce:transition-none"
          :style="{ width: `${progress}%` }"
        />
      </div>
      <div class="flex items-center justify-between gap-3">
        <p class="font-mono text-xs tabular-nums text-text-2">{{ ti[phase] }} {{ progress }} %</p>
        <Button variant="ghost" size="sm" @click="$emit('cancel')">{{ ti.cancel }}</Button>
      </div>
    </div>

    <div v-else class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <p class="font-mono text-xs tabular-nums text-text-3">{{ meta }}</p>
        <Badge v-if="phase === 'done'" variant="success">{{ ti.ready }}</Badge>
      </div>
      <Button variant="secondary" @click="openPicker">
        <ImageUp :size="16" aria-hidden="true" />
        {{ t.replaceImage }}
      </Button>
    </div>
    <p v-if="!busy && phase === 'done'" class="text-xs/4 text-text-2">{{ ti.readyHelp }}</p>
    <input ref="input" type="file" :accept="accept" class="sr-only" tabindex="-1" aria-hidden="true" @change="onChoose" />

    <p v-if="uploadError" role="alert" class="flex gap-1.5 text-xs/4 text-danger">
      <CircleAlert :size="14" class="mt-px shrink-0" aria-hidden="true" />{{ uploadError }}
    </p>
    <Alert v-if="uploadWarning" variant="warning">{{ uploadWarning }}</Alert>

    <Field
      v-slot="{ controlProps }"
      :label="altLabel"
      required
      :help="altHelp"
      :error="altError"
      :count="charLength(alt)"
      :max-length="altMaxLength"
    >
      <Input v-model="alt" v-bind="controlProps" @blur="$emit('blur-alt')" />
    </Field>
  </section>
</template>
