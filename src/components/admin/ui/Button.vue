<script setup>
import { computed } from 'vue'
import Spinner from './Spinner.vue'

const VARIANTS = {
  primary:
    'bg-accent text-on-accent enabled:hover:bg-accent-hover enabled:active:bg-accent-press disabled:bg-surface-3 disabled:text-text-disabled',
  secondary:
    'bg-surface-3 text-text border border-line-input enabled:hover:bg-surface-4 enabled:hover:border-line-strong enabled:active:bg-surface-2 disabled:border-line disabled:text-text-disabled',
  ghost:
    'bg-transparent text-text-2 enabled:hover:bg-surface-3 enabled:hover:text-text enabled:active:bg-surface-4 disabled:text-text-disabled',
  danger:
    'bg-danger-solid text-text enabled:hover:bg-danger-solid-hover enabled:active:bg-danger-solid-press disabled:bg-surface-3 disabled:text-text-disabled',
  icon:
    'bg-transparent text-text-2 enabled:hover:bg-surface-3 enabled:hover:text-text enabled:active:bg-surface-4 disabled:text-text-disabled',
}
// `enabled:hover:` / `enabled:active:` → un botón disabled no reacciona.
const DISABLED_RESET = 'disabled:cursor-not-allowed'

const props = defineProps({
  variant: { type: String, default: 'primary', validator: v => ['primary', 'secondary', 'ghost', 'danger', 'icon'].includes(v) },
  size: { type: String, default: 'md', validator: v => ['sm', 'md'].includes(v) },
  type: { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  // Nombre accesible durante loading (el contenido va oculto): usar el texto del contexto, p. ej. "Entrando…".
  loadingLabel: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})
const emit = defineEmits(['click'])

const isIcon = computed(() => props.variant === 'icon')
const sizeClasses = computed(() => {
  if (isIcon.value) return 'size-10 pointer-coarse:size-11 p-0'
  return props.size === 'sm' ? 'h-8 px-3 text-[13px] pointer-coarse:h-11' : 'h-10 pointer-coarse:h-11 px-4 text-sm'
})

// Con loading el botón sigue en el orden de foco pero no actúa (aria-busy, sin disabled).
function onClick(event) {
  if (props.loading) return event.preventDefault()
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-busy="loading || undefined"
    :class="[
      'relative inline-flex shrink-0 items-center justify-center gap-2 rounded-md font-sans font-semibold whitespace-nowrap',
      'transition-colors duration-(--motion-fast) ease-(--ease-panel) motion-reduce:transition-none',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
      sizeClasses,
      VARIANTS[variant],
      DISABLED_RESET,
      loading && 'cursor-progress',
    ]"
    @click="onClick"
  >
    <!-- Con loading el spinner se centra sobre el contenido (que sigue ocupando su sitio): el ancho no cambia. -->
    <span v-if="loading" class="absolute inset-0 grid place-items-center">
      <Spinner :size="16" :label="loadingLabel" />
    </span>
    <span :class="['inline-flex items-center justify-center gap-2', loading && 'invisible']">
      <slot />
    </span>
  </button>
</template>
