<script setup>
import { Circle, CircleAlert, Undo2 } from 'lucide-vue-next'
import { adminEditorText as t } from '../../../data/adminEditorText.js'
import { useRaiseToasts } from '../../../composables/admin/useToastOffset.js'
import Button from './Button.vue'

// Barra flotante de cambios sin guardar (spec 3.11). Sin aria-live: anuncia SaveStatus del header.
// Texto sin truncar (hasta 2 líneas); < md: mensaje arriba y botones abajo a ancho completo.
defineProps({
  saving: { type: Boolean, default: false },
  failed: { type: Boolean, default: false },
})
defineEmits(['discard', 'save'])
useRaiseToasts()
</script>

<template>
  <Transition
    appear
    enter-active-class="transition duration-(--motion-base) ease-(--ease-panel)"
    enter-from-class="translate-y-4 opacity-0 motion-reduce:translate-y-0"
  >
    <div
      role="region"
      :aria-label="t.unsavedRegion"
      class="fixed inset-x-0 bottom-4 z-40 mx-auto flex min-h-14 w-[min(var(--size-unsaved-bar),calc(100%-2rem))] items-center gap-3 rounded-lg border border-line-strong bg-surface-4 px-4 py-2 shadow-bar max-md:bottom-0 max-md:w-full max-md:flex-col max-md:items-stretch max-md:rounded-b-none max-md:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
    >
      <div class="flex min-w-0 flex-1 items-center gap-3">
        <component
          :is="failed ? CircleAlert : Circle"
          :size="14"
          :class="['shrink-0', failed ? 'text-danger' : 'fill-current text-warning']"
          aria-hidden="true"
        />
        <p :class="['line-clamp-2 min-w-0 font-sans text-sm', failed ? 'text-danger' : 'text-text']">
          {{ failed ? t.saveErrorMessage : t.unsavedMessage }}
        </p>
      </div>
      <div class="flex shrink-0 gap-2 max-md:w-full">
        <Button variant="secondary" :disabled="saving" class="max-md:h-11 max-md:flex-1" @click="$emit('discard')">
          <Undo2 :size="16" aria-hidden="true" />
          {{ t.discard }}
        </Button>
        <Button :loading="saving" :loading-label="t.saving" class="max-md:h-11 max-md:flex-1" @click="$emit('save')">
          {{ failed ? t.retry : t.save }}
        </Button>
      </div>
    </div>
  </Transition>
</template>
