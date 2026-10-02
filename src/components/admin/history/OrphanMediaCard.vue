<script setup>
import { computed } from 'vue'
import { ImageOff } from 'lucide-vue-next'
import { adminOrphanText as t } from '../../../data/adminEditorText.js'
import { formatAbsolute, formatBytes } from '../../../lib/historyFormat.js'
import Alert from '../ui/Alert.vue'
import Button from '../ui/Button.vue'
import Card from '../ui/Card.vue'
import EmptyState from '../ui/EmptyState.vue'
import Skeleton from '../ui/Skeleton.vue'

// Tarjeta "Fotos sin usar": total, lista (miniatura, fecha, tamaño, motivo) y acción "Liberar espacio".
const props = defineProps({
  phase: { type: String, required: true }, // loading | ready | error
  items: { type: Array, required: true },
  totals: { type: Object, required: true }, // { count, bytes }
  running: { type: Boolean, default: false },
  progress: { type: Object, default: () => ({ done: 0, total: 0 }) },
  result: { type: Object, default: null }, // { deleted, freedBytes, failed }
})
const emit = defineEmits(['clean', 'retry', 'dismiss'])

// Resumen tras borrar: todo bien / parcial / nada se pudo borrar.
const summary = computed(() => {
  if (!props.result) return null
  const { deleted, failed, freedBytes } = props.result
  const size = formatBytes(freedBytes)
  if (!failed.length) return { variant: 'success', title: t.doneTitle, text: t.done(deleted, size) }
  if (!deleted) return { variant: 'danger', title: t.failedTitle, text: t.failedBody }
  return { variant: 'warning', title: t.partialTitle, text: t.partial(deleted, failed.length, size) }
})
</script>

<template>
  <Card :title="t.title" :help="t.help">
    <Alert v-if="summary" :variant="summary.variant" :title="summary.title" dismissible @dismiss="emit('dismiss')">{{ summary.text }}</Alert>

    <Alert v-if="phase === 'error'" variant="danger" :title="t.loadErrorTitle">
      {{ t.loadErrorBody }}
      <template #action><Button variant="secondary" size="sm" @click="emit('retry')">{{ t.retry }}</Button></template>
    </Alert>
    <div v-else-if="phase === 'loading'" class="flex flex-col gap-2" aria-busy="true">
      <Skeleton announce class="h-14" />
      <Skeleton class="h-14" />
    </div>
    <EmptyState v-else-if="!items.length" :icon="ImageOff" :title="t.emptyTitle" :body="t.emptyBody" />
    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="font-mono text-sm font-bold text-text">{{ t.total(totals.count, formatBytes(totals.bytes)) }}</p>
        <Button variant="secondary" :loading="running" :loading-label="t.progress(progress.done, progress.total)" @click="emit('clean')">{{ t.clean }}</Button>
      </div>
      <p v-if="running" class="font-sans text-sm text-text-2" role="status">{{ t.progress(progress.done, progress.total) }}</p>
      <ul :aria-label="t.listLabel" class="flex max-h-96 flex-col overflow-y-auto rounded-md border border-line">
        <li v-for="item in items" :key="item.path" class="flex items-center gap-3 border-b border-line p-3 last:border-0">
          <img :src="item.url" :alt="t.thumbAlt" loading="lazy" width="64" height="48" class="h-12 w-16 shrink-0 rounded-sm border border-line bg-surface-3 object-cover" />
          <div class="flex min-w-0 flex-col">
            <p class="font-sans text-sm text-text">{{ t.reasons[item.reason] ?? item.reason }}</p>
            <p class="font-mono text-xs tabular-nums text-text-2">{{ t.uploadedOn(formatAbsolute(item.created_at)) }} · {{ formatBytes(item.bytes) }}</p>
          </div>
        </li>
      </ul>
    </template>
  </Card>
</template>
