<script setup>
import { Minus, Plus } from 'lucide-vue-next'
import { adminHistoryText as t } from '../../../data/adminEditorText.js'
import { resolveImagePreview } from '../../../lib/sectionEditor.js'
import Skeleton from '../ui/Skeleton.vue'

// Un campo distinto (spec 3.31): rojo = lo publicado ahora (se reemplaza), verde = lo de esta versión.
// Nunca solo color: prefijo con icono + texto sr-only. `media` = { [media_id]: { url, width, height } }.
defineProps({
  change: { type: Object, required: true },
  media: { type: Object, default: () => ({}) },
  loadingMedia: { type: Boolean, default: false },
})

const SIDES = [
  { key: 'before', icon: Minus, label: t.before, tone: 'border-danger-line bg-danger-soft', iconTone: 'text-danger' },
  { key: 'after', icon: Plus, label: t.after, tone: 'border-success-line bg-success-soft', iconTone: 'text-success' },
]
</script>

<template>
  <li class="flex flex-col gap-2 border-b border-line py-4">
    <h3 class="font-mono text-xs font-bold text-text-2">{{ change.label }}</h3>
    <div :class="['flex gap-2', change.kind === 'image' ? 'flex-col min-[480px]:flex-row' : 'flex-col']">
      <div
        v-for="side in SIDES"
        :key="side.key"
        :class="['flex min-w-0 flex-1 gap-2 rounded-md border p-3 text-sm text-text', side.tone]"
      >
        <component :is="side.icon" :size="14" :class="['mt-1 shrink-0', side.iconTone]" aria-hidden="true" />
        <div class="min-w-0 flex-1">
          <span class="sr-only">{{ side.label }}: </span>
          <template v-if="change.kind === 'image'">
            <Skeleton v-if="loadingMedia" class="aspect-video w-full" />
            <template v-else>
              <img
                v-if="resolveImagePreview(change[side.key], media).url"
                :src="resolveImagePreview(change[side.key], media).url"
                :alt="change[side.key]?.alt || change.label"
                loading="lazy"
                :width="resolveImagePreview(change[side.key], media).width || undefined"
                :height="resolveImagePreview(change[side.key], media).height || undefined"
                class="aspect-video w-full rounded-md border border-line bg-surface-3 object-contain"
              />
              <p v-else class="font-sans text-text-3 italic">{{ t.noImage }}</p>
            </template>
          </template>
          <p v-else-if="!change[side.key]" class="font-sans text-text-3 italic">{{ t.empty }}</p>
          <p v-else class="max-h-48 overflow-y-auto font-sans break-words whitespace-pre-wrap">{{ change[side.key] }}</p>
        </div>
      </div>
    </div>
  </li>
</template>
