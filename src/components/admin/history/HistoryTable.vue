<script setup>
import { computed } from 'vue'
import { ArrowUpDown, ChevronLeft, ChevronRight, History, SearchX } from 'lucide-vue-next'
import { adminHistoryText as t } from '../../../data/adminEditorText.js'
import Alert from '../ui/Alert.vue'
import Button from '../ui/Button.vue'
import EmptyState from '../ui/EmptyState.vue'
import Skeleton from '../ui/Skeleton.vue'
import HistoryRow from './HistoryRow.vue'

// Tabla del historial (spec 3.16): carga, error, vacío, filas y paginación. Sin lógica: todo llega por props.
const props = defineProps({
  phase: { type: String, required: true }, // loading | ready | error
  view: { type: Object, required: true }, // { items, page, pages, from, to, total }
  userId: { type: String, default: '' },
  newestFirst: { type: Boolean, default: true },
  filtered: { type: Boolean, default: false }, // hay un filtro de sección activo
})
const emit = defineEmits(['open', 'restore', 'sort', 'page', 'retry', 'clear-filter'])

const now = computed(() => (props.view.items, Date.now())) // se refresca al cambiar la página/lista
const th = 'h-10 bg-surface-1 px-4 text-left font-mono text-[11px]/4 font-bold uppercase tracking-eyebrow text-text-3 border-b border-line'
</script>

<template>
  <div class="overflow-hidden rounded-lg border border-line bg-surface-2">
    <Alert v-if="phase === 'error'" variant="danger" :title="t.loadErrorTitle" class="m-4">
      {{ t.loadErrorBody }}
      <template #action>
        <Button variant="secondary" size="sm" @click="emit('retry')">{{ t.retry }}</Button>
      </template>
    </Alert>

    <div v-else-if="phase === 'loading'" class="flex flex-col gap-2 p-4" aria-busy="true">
      <Skeleton announce class="h-12" />
      <Skeleton v-for="n in 4" :key="n" class="h-12" />
    </div>

    <EmptyState v-else-if="!view.total" :icon="filtered ? SearchX : History" :title="filtered ? t.emptyFilterTitle : t.emptyTitle" :body="filtered ? t.emptyFilterBody : t.emptyBody">
      <Button v-if="filtered" variant="secondary" @click="emit('clear-filter')">{{ t.clearFilter }}</Button>
    </EmptyState>

    <template v-else>
      <div class="overflow-x-auto">
        <table class="w-full max-md:block">
          <caption class="sr-only">{{ t.tableCaption }}</caption>
          <thead class="max-md:hidden">
            <tr>
              <th scope="col" :class="th" :aria-sort="newestFirst ? 'descending' : 'ascending'">
                <button type="button" class="inline-flex h-10 items-center gap-1 rounded-sm uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" :aria-label="t.sortLabel(newestFirst)" @click="emit('sort')">
                  {{ t.columns.date }}
                  <ArrowUpDown :size="14" aria-hidden="true" />
                </button>
              </th>
              <th scope="col" :class="th">{{ t.columns.section }}</th>
              <th scope="col" :class="[th, 'md:max-lg:hidden']">{{ t.columns.author }}</th>
              <th scope="col" :class="th">{{ t.columns.summary }}</th>
              <th scope="col" :class="th"><span class="sr-only">{{ t.columns.actions }}</span></th>
            </tr>
          </thead>
          <tbody class="max-md:block">
            <HistoryRow v-for="row in view.items" :key="row.id" :row="row" :user-id="userId" :now="now" @open="emit('open', $event)" @restore="emit('restore', $event)" />
          </tbody>
        </table>
      </div>
      <div class="flex h-14 items-center justify-between border-t border-line px-4">
        <p class="font-mono text-xs tabular-nums text-text-2" aria-live="polite">
          {{ t.range(view.from, view.to, view.total) }}<span class="sr-only"> · {{ t.resultsCount(view.total) }}</span>
        </p>
        <div class="flex gap-1">
          <Button variant="icon" :aria-label="t.prevPage" :disabled="view.page <= 1" @click="emit('page', view.page - 1)"><ChevronLeft :size="16" aria-hidden="true" /></Button>
          <Button variant="icon" :aria-label="t.nextPage" :disabled="view.page >= view.pages" @click="emit('page', view.page + 1)"><ChevronRight :size="16" aria-hidden="true" /></Button>
        </div>
      </div>
    </template>
  </div>
</template>
