<script setup>
import { onBeforeUnmount, ref, useId, watch } from 'vue'
import Kbd from './Kbd.vue'

// Teleportado a <body> con position: fixed calculada desde el trigger: no lo recorta ningún contenedor con overflow.
const PLACEMENTS = {
  top: { pad: 'pb-1.5', shift: '-translate-x-1/2 -translate-y-full' },
  bottom: { pad: 'pt-1.5', shift: '-translate-x-1/2' },
  right: { pad: 'pl-1.5', shift: '-translate-y-1/2' },
  left: { pad: 'pr-1.5', shift: '-translate-x-full -translate-y-1/2' },
}
const OPEN_DELAY = 400 // hover; el foco de teclado abre sin retraso
const LEAVE_GRACE = 100 // permite pasar el puntero del trigger al tooltip

const props = defineProps({
  text: { type: String, required: true },
  shortcut: { type: String, default: '' },
  placement: { type: String, default: 'top', validator: v => ['top', 'bottom', 'left', 'right'].includes(v) },
})

const id = useId()
const trigger = ref(null)
const open = ref(false)
const pos = ref({ left: '0px', top: '0px' })
let timer = null

function place() {
  const r = trigger.value.getBoundingClientRect()
  const x = props.placement === 'right' ? r.right : props.placement === 'left' ? r.left : r.left + r.width / 2
  const y = props.placement === 'bottom' ? r.bottom : props.placement === 'top' ? r.top : r.top + r.height / 2
  pos.value = { left: `${x}px`, top: `${y}px` }
}
function show(delay = 0) {
  clearTimeout(timer)
  if (delay) timer = setTimeout(() => show(), delay)
  else {
    place()
    open.value = true
  }
}
function hide(delay = 0) {
  clearTimeout(timer)
  if (delay) timer = setTimeout(() => hide(), delay)
  else open.value = false
}
// Sin tooltip en táctil: ahí el aria-label/texto visible lo cubre.
const onPointerEnter = e => e.pointerType === 'mouse' && show(OPEN_DELAY)
const onKeydown = e => e.key === 'Escape' && hide()
const close = () => hide()

// Esc cierra aunque el foco no esté dentro (WCAG 1.4.13); scroll/resize lo cierran porque la posición quedaría vieja.
watch(open, on => {
  const method = on ? 'addEventListener' : 'removeEventListener'
  document[method]('keydown', onKeydown)
  window[method]('scroll', close, true)
  window[method]('resize', close)
})
onBeforeUnmount(() => {
  hide()
  document.removeEventListener('keydown', onKeydown)
  window.removeEventListener('scroll', close, true)
  window.removeEventListener('resize', close)
})
</script>

<template>
  <span
    ref="trigger"
    class="relative inline-flex"
    @pointerenter="onPointerEnter"
    @pointerleave="hide(LEAVE_GRACE)"
    @focusin="show()"
    @focusout="hide()"
  >
    <slot :describedby="id" />
    <!-- Siempre en el DOM (para aria-describedby); fixed según el rect del trigger. -->
    <Teleport to="body">
    <span
      :id="id"
      role="tooltip"
      data-inert-exempt
      :style="pos"
      :class="[
        'fixed z-70 w-max max-w-60 transition-opacity duration-(--motion-fast) motion-reduce:transition-none',
        PLACEMENTS[placement].pad,
        PLACEMENTS[placement].shift,
        open ? 'visible opacity-100' : 'invisible opacity-0',
      ]"
      @pointerenter="show()"
      @pointerleave="hide()"
    >
      <span class="flex items-center gap-2 rounded-sm bg-surface-4 px-2 py-1 font-sans text-xs/4 text-text shadow-popover">
        {{ text }}
        <Kbd v-if="shortcut" class="h-auto min-w-0 border-0 bg-transparent p-0 text-text-3">{{ shortcut }}</Kbd>
      </span>
    </span>
    </Teleport>
  </span>
</template>
