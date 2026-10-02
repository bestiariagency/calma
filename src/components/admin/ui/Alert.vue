<script setup>
import { X } from 'lucide-vue-next'
import { adminUiText } from '../../../data/adminUiText.js'
import { ALERT_STYLES, STATUS_ICONS } from './statusStyles.js'
import Button from './Button.vue'

defineProps({
  variant: { type: String, default: 'info', validator: v => v in ALERT_STYLES },
  title: { type: String, default: '' },
  dismissible: { type: Boolean, default: false },
  // Sobrescribe el role por defecto (p. ej. rate limit: warning con role="alert").
  role: { type: String, default: '' },
})
defineEmits(['dismiss'])
</script>

<template>
  <!-- Entrada: fade 120 ms (también con reduced-motion: no hay transform). -->
  <Transition appear enter-active-class="transition-opacity duration-(--motion-fast)" enter-from-class="opacity-0">
    <div
      :role="role || ALERT_STYLES[variant].role"
      :class="['flex items-start gap-3 rounded-lg border p-3 font-sans text-sm max-sm:flex-wrap', ALERT_STYLES[variant].box]"
    >
      <component :is="STATUS_ICONS[variant]" :size="20" :class="['mt-0.5 shrink-0', ALERT_STYLES[variant].icon]" aria-hidden="true" />
      <div class="min-w-0 flex-1 text-text-2">
        <p v-if="title" class="font-semibold text-text">{{ title }}</p>
        <slot />
      </div>
      <!-- Móvil: la acción baja alineada con el texto (icono 20 + gap 12 = pl-8). -->
      <div v-if="$slots.action" class="max-sm:w-full max-sm:pl-8"><slot name="action" /></div>
      <Button v-if="dismissible" variant="icon" class="-my-1.5 -mr-1.5 size-8! pointer-coarse:size-11!" :aria-label="adminUiText.close" @click="$emit('dismiss')">
        <X :size="16" aria-hidden="true" />
      </Button>
    </div>
  </Transition>
</template>
