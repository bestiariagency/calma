<script setup>
import { X } from 'lucide-vue-next'
import { adminUiText } from '../../../data/adminUiText.js'
import { STATUS_ICONS } from './statusStyles.js'
import Button from './Button.vue'

const STYLES = {
  success: { border: 'border-success-line', icon: 'text-success' },
  info: { border: 'border-info-line', icon: 'text-info' },
  warning: { border: 'border-warning-line', icon: 'text-warning' },
  error: { border: 'border-danger-line', icon: 'text-danger' },
}

defineProps({
  toast: { type: Object, required: true }, // { id, type, title, detail, action: { label, onClick } }
})
defineEmits(['close', 'pause', 'resume'])
</script>

<template>
  <!-- role=alert solo para error; no mueve el foco. Pausa el temporizador en hover/foco. -->
  <div
    :role="toast.type === 'error' ? 'alert' : 'status'"
    :class="['flex items-start gap-3 rounded-lg border bg-surface-4 p-3 pr-2 font-sans shadow-popover', STYLES[toast.type].border]"
    @mouseenter="$emit('pause')"
    @mouseleave="$emit('resume')"
    @focusin="$emit('pause')"
    @focusout="$emit('resume')"
  >
    <component :is="STATUS_ICONS[toast.type]" :size="20" :class="['mt-0.5 shrink-0', STYLES[toast.type].icon]" aria-hidden="true" />
    <div class="min-w-0 flex-1">
      <p class="line-clamp-2 text-sm font-semibold text-text">{{ toast.title }}</p>
      <p v-if="toast.detail" class="line-clamp-2 text-[13px] text-text-2">{{ toast.detail }}</p>
      <button
        v-if="toast.action"
        type="button"
        class="mt-1 rounded-sm text-sm font-semibold text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        @click="toast.action.onClick?.(); $emit('close')"
      >
        {{ toast.action.label }}
      </button>
    </div>
    <Button variant="icon" class="size-8! pointer-coarse:size-11!" :aria-label="adminUiText.close" @click="$emit('close')">
      <X :size="16" aria-hidden="true" />
    </Button>
  </div>
</template>
