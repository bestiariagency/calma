<script setup>
import { computed } from 'vue'
import { Eye, Undo2 } from 'lucide-vue-next'
import { adminHistoryText as t } from '../../../data/adminEditorText.js'
import { authorLabel, formatAbsolute, formatRelative } from '../../../lib/historyFormat.js'
import Badge from '../ui/Badge.vue'
import Menu from '../ui/Menu.vue'

// Fila de la tabla (desktop/tablet) que en móvil se vuelve card (spec 3.16): grid de 2 columnas, acciones a la derecha.
const props = defineProps({
  row: { type: Object, required: true },
  userId: { type: String, default: '' },
  now: { type: Number, required: true },
})
const emit = defineEmits(['open', 'restore'])

const absolute = computed(() => formatAbsolute(props.row.changedAt))
const relative = computed(() => formatRelative(props.row.changedAt, props.now, t))
const author = computed(() => authorLabel(props.row.changedBy, props.userId, t))
const actions = [
  { id: 'view', label: t.viewChanges, icon: Eye },
  { id: 'restore', label: t.restore, icon: Undo2 },
]
const onAction = id => emit(id === 'view' ? 'open' : 'restore', props.row)
</script>

<template>
  <tr
    class="h-12 max-md:h-auto cursor-pointer border-b border-line text-sm text-text last:border-0 hover:bg-surface-3 max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-2 max-md:gap-y-1.5 max-md:py-3 max-md:px-4"
    @click="emit('open', row)"
  >
    <td class="px-4 py-2 whitespace-nowrap max-md:col-start-1 max-md:row-start-1 max-md:p-0">
      <button
        type="button"
        class="flex min-h-10 flex-col justify-center rounded-sm text-left max-md:min-h-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        @click.stop="emit('open', row)"
      >
        <span class="sr-only">{{ t.viewChanges }}:</span>
        <span v-if="relative" class="font-sans text-sm text-text">{{ relative }}</span>
        <span class="font-mono text-xs tabular-nums text-text-2">{{ absolute }}</span>
      </button>
    </td>
    <td class="px-4 py-2 whitespace-nowrap max-md:col-start-1 max-md:row-start-2 max-md:p-0">
      <Badge class="whitespace-nowrap">{{ row.sectionLabel }}</Badge>
    </td>
    <td class="px-4 py-2 font-sans text-text-2 max-md:col-start-1 max-md:row-start-4 max-md:p-0 max-md:text-xs md:max-lg:hidden">
      {{ author }}
    </td>
    <td class="w-full max-w-0 px-4 py-2 max-md:col-start-1 max-md:row-start-3 max-md:max-w-none max-md:p-0">
      <p class="truncate font-sans text-text max-md:line-clamp-2 max-md:whitespace-normal" :title="row.summary">{{ row.summary }}</p>
    </td>
    <td class="w-14 px-2 py-1 text-right max-md:col-start-2 max-md:row-span-4 max-md:row-start-1 max-md:w-auto max-md:self-start max-md:p-0">
      <Menu :label="t.rowActions(absolute)" :items="actions" @select="onAction" />
    </td>
  </tr>
</template>
