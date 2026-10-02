<script setup>
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import { adminUiText } from '../../../data/adminUiText.js'
import { useFocusTrap } from '../../../composables/admin/useFocusTrap.js'
import { useScrollLock } from '../../../composables/admin/useScrollLock.js'
import Button from './Button.vue'

// Panel lateral modal (spec 3.20): izquierdo = sidebar móvil; derecho = diff del historial (3.31).
// Foco inicial: [data-autofocus] o primer control. `footer` = pie fijo (acciones).
const props = defineProps({
  label: { type: String, required: true },
  id: { type: String, default: undefined },
  side: { type: String, default: 'left', validator: v => ['left', 'right'].includes(v) },
})
const right = props.side === 'right'
const open = defineModel({ type: Boolean, default: false })
const panel = ref(null)

useFocusTrap(panel, open)
useScrollLock(open)
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-(--motion-slow) ease-(--ease-panel)"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-(--motion-fast) ease-(--ease-panel)"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-40 bg-overlay" aria-hidden="true" @click="open = false" />
    </Transition>
    <Transition
      enter-active-class="transition duration-(--motion-slow) ease-(--ease-panel)"
      :enter-from-class="right ? 'translate-x-4 opacity-0 motion-reduce:translate-x-0' : '-translate-x-4 opacity-0 motion-reduce:translate-x-0'"
      leave-active-class="transition duration-(--motion-fast) ease-(--ease-panel)"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        :id="id"
        ref="panel"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        tabindex="-1"
        :class="[
          'fixed inset-y-0 z-50 flex flex-col shadow-dialog',
          right
            ? 'right-0 w-(--size-diff-drawer) border-l border-line bg-surface-2 max-md:w-full max-md:border-0'
            : 'left-0 w-(--size-drawer) max-w-[85vw] border-r border-line bg-surface-1',
        ]"
        @keydown.esc.stop="open = false"
      >
        <div class="flex h-(--spacing-header) shrink-0 items-center justify-between border-b border-line pr-2 pl-4">
          <slot name="header" />
          <Button variant="icon" class="focus-visible:-outline-offset-2!" :aria-label="adminUiText.close" @click="open = false">
            <X :size="16" aria-hidden="true" />
          </Button>
        </div>
        <div :class="['flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain', !$slots.footer && 'pb-[env(safe-area-inset-bottom)]']">
          <slot />
        </div>
        <div
          v-if="$slots.footer"
          class="flex shrink-0 items-center justify-end gap-2 border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))] max-sm:flex-col-reverse max-sm:*:w-full"
        >
          <slot name="footer" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
