<script setup>
import { ref } from 'vue'
import { ExternalLink } from 'lucide-vue-next'
import { adminEditorText as t } from '../../../data/adminEditorText.js'
import { useEditor } from '../../../composables/admin/editorContext.js'
import { useLeaveGuard } from '../../../composables/admin/useLeaveGuard.js'
import EditorDialogs from './EditorDialogs.vue'
import EditorSkeleton from './EditorSkeleton.vue'
import Alert from '../ui/Alert.vue'
import Button from '../ui/Button.vue'
import UnsavedBar from '../ui/UnsavedBar.vue'

// Carcasa común de los editores (secciones y datos de la empresa): cabecera, carga/error, barra de cambios,
// descartar, aviso al salir y conflicto. El contenido (campos) va en el slot; el editor llega por provideEditor.
defineProps({
  title: { type: String, required: true },
  help: { type: String, required: true },
  siteHref: { type: String, required: true },
  fields: { type: Array, required: true }, // para el esqueleto de carga
  groups: { type: Array, default: null }, // esqueleto agrupado (Datos de la empresa)
})
const editor = useEditor()
const { phase, saving, saveError, conflict, dirty, changedCount, load, save, discard } = editor
const { open: leaveOpen, answer: answerLeave } = useLeaveGuard(dirty)

const discardOpen = ref(false)

function requestDiscard() {
  if (changedCount.value > 1) discardOpen.value = true
  else discard()
}
function confirmDiscard() {
  discardOpen.value = false
  discard()
}
function reload() {
  conflict.value = false
  load()
}
async function overwrite() {
  if ((await save({ overwrite: true })) === 'saved') conflict.value = false
}
</script>

<template>
  <section :class="['flex flex-col gap-6', dirty && 'pb-24']">
    <header class="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
      <div class="flex min-w-0 flex-col gap-1">
        <h1 class="font-mono text-xl/7 font-bold tracking-title text-text max-md:text-lg/6">{{ title }}</h1>
        <p class="font-sans text-sm/5 text-text-2">{{ help }}</p>
      </div>
      <a
        :href="siteHref"
        target="_blank"
        rel="noopener"
        class="inline-flex min-h-6 items-center gap-2 rounded-md py-1 font-sans pointer-coarse:min-h-11 text-sm font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {{ t.viewSite }}
        <ExternalLink :size="16" aria-hidden="true" />
      </a>
    </header>

    <EditorSkeleton v-if="phase === 'loading'" :fields="fields" :groups="groups" />

    <Alert v-else-if="phase === 'error'" variant="danger" :title="t.loadErrorTitle">
      {{ t.loadErrorBody }}
      <template #action>
        <Button variant="secondary" size="sm" @click="load">{{ t.retry }}</Button>
      </template>
    </Alert>

    <div v-else :aria-busy="saving" class="flex flex-col gap-4">
      <Alert v-if="saveError" variant="danger" :title="saveError.title">{{ saveError.detail }}</Alert>
      <slot />
    </div>

    <UnsavedBar v-if="dirty" :saving="saving" :failed="Boolean(saveError)" @discard="requestDiscard" @save="save()" />

    <EditorDialogs
      v-model:leave="leaveOpen"
      v-model:discard="discardOpen"
      v-model:conflict="conflict"
      :saving="saving"
      @leave="answerLeave(true)"
      @stay="answerLeave(false)"
      @discard="confirmDiscard"
      @reload="reload"
      @overwrite="overwrite"
    />
  </section>
</template>
