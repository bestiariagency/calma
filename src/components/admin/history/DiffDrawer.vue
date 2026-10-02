<script setup>
import { computed } from 'vue'
import { CircleCheck, Undo2 } from 'lucide-vue-next'
import { adminHistoryText as t } from '../../../data/adminEditorText.js'
import { formatAbsolute } from '../../../lib/historyFormat.js'
import Alert from '../ui/Alert.vue'
import Button from '../ui/Button.vue'
import Drawer from '../ui/Drawer.vue'
import EmptyState from '../ui/EmptyState.vue'
import DiffField from './DiffField.vue'

// Panel derecho con las diferencias entre una versión del historial y lo publicado ahora (spec 3.31 / 4.5).
const props = defineProps({
  row: { type: Object, default: null },
  changes: { type: Array, required: true },
  media: { type: Object, default: () => ({}) },
  phase: { type: String, default: 'idle' }, // idle | loading | ready | error
})
const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['restore', 'retry'])

const date = computed(() => (props.row ? formatAbsolute(props.row.changedAt) : ''))
</script>

<template>
  <Drawer v-model="open" side="right" :label="t.drawerTitle">
    <template #header>
      <div class="flex min-w-0 flex-col">
        <h2 class="truncate font-mono text-sm/5 font-bold text-text">{{ row?.sectionLabel }}</h2>
        <p class="font-mono text-xs text-text-2">{{ t.changedFields(changes.length) }}</p>
      </div>
    </template>

    <div v-if="row" class="flex flex-col px-4 py-3">
      <p class="font-sans text-sm text-text-2">{{ t.drawerLead(date) }}</p>
      <Alert v-if="phase === 'error'" variant="danger" :title="t.diffErrorTitle" class="my-4">
        {{ t.diffErrorBody }}
        <template #action><Button variant="secondary" size="sm" @click="emit('retry')">{{ t.retry }}</Button></template>
      </Alert>
      <EmptyState v-else-if="!changes.length" :icon="CircleCheck" :title="t.noDifferences" :body="t.noDifferencesBody" />
      <ul v-else :aria-busy="phase === 'loading'">
        <DiffField v-for="change in changes" :key="change.path + change.kind" :change="change" :media="media" :loading-media="phase === 'loading'" />
      </ul>
    </div>

    <template #footer>
      <Button variant="ghost" @click="open = false">{{ t.close }}</Button>
      <Button variant="secondary" :disabled="!changes.length" @click="emit('restore', row)">
        <Undo2 :size="16" aria-hidden="true" />
        {{ t.restore }}
      </Button>
    </template>
  </Drawer>
</template>
