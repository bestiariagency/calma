<script setup>
import { nextTick, onBeforeUnmount, ref, useId } from 'vue'
import { Ellipsis } from 'lucide-vue-next'
import Button from './Button.vue'

// Menú ⋯ de fila (spec 3.23). Panel teleportado con position: fixed (no lo recorta el overflow de la tabla).
// Teclado: Enter/Espacio/↓ abren y enfocan el 1.º; ↑↓ circular, Home/End, Esc cierra y devuelve el foco, Tab cierra.
// items: [{ id, label, icon?, danger? }] → emite `select(id)`.
defineProps({
  label: { type: String, required: true },
  items: { type: Array, required: true },
})
const emit = defineEmits(['select'])

const uid = useId()
const open = ref(false)
const trigger = ref(null)
const panel = ref(null)
const position = ref({ top: '0px', left: '0px' })
const PANEL_WIDTH = 192 // = min-w-48
const OFFSET = 4

const menuItems = () => [...(panel.value?.querySelectorAll('[role="menuitem"]') ?? [])]

async function show(focusLast = false) {
  const rect = trigger.value.$el.getBoundingClientRect()
  const left = Math.max(8, Math.min(rect.right - PANEL_WIDTH, window.innerWidth - PANEL_WIDTH - 8))
  position.value = { top: `${rect.bottom + OFFSET}px`, left: `${left}px` }
  open.value = true
  await nextTick()
  const items = menuItems()
  const [first, last] = [items[0], items.at(-1)]
  if (rect.bottom + OFFSET + panel.value.offsetHeight > window.innerHeight) {
    position.value = { ...position.value, top: `${rect.top - OFFSET - panel.value.offsetHeight}px` }
  }
  ;(focusLast ? last : first)?.focus()
  document.addEventListener('pointerdown', onOutside, true)
}

function close(returnFocus = true) {
  if (!open.value) return
  open.value = false
  document.removeEventListener('pointerdown', onOutside, true)
  if (returnFocus) trigger.value.$el.focus()
}

function onOutside(event) {
  if (!panel.value?.contains(event.target) && !trigger.value.$el.contains(event.target)) close(false)
}

function onTriggerKey(event) {
  if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return
  event.preventDefault()
  show(event.key === 'ArrowUp')
}

function onPanelKey(event) {
  const items = menuItems()
  const index = items.indexOf(document.activeElement)
  const move = target => (event.preventDefault(), items[(target + items.length) % items.length]?.focus())
  if (event.key === 'ArrowDown') move(index + 1)
  else if (event.key === 'ArrowUp') move(index - 1)
  else if (event.key === 'Home') move(0)
  else if (event.key === 'End') move(items.length - 1)
  else if (event.key === 'Escape') (event.stopPropagation(), close())
  else if (event.key === 'Tab') close(false)
}

function choose(id) {
  close()
  emit('select', id)
}

onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside, true))
</script>

<template>
  <Button
    ref="trigger"
    variant="icon"
    class="max-md:size-11!"
    :aria-label="label"
    aria-haspopup="menu"
    :aria-expanded="open"
    :aria-controls="open ? uid : undefined"
    @click.stop="open ? close() : show()"
    @keydown="onTriggerKey"
  >
    <Ellipsis :size="20" aria-hidden="true" />
  </Button>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-(--motion-fast) ease-(--ease-panel)"
      enter-from-class="opacity-0 scale-98 motion-reduce:scale-100"
      leave-active-class="transition duration-(--motion-fast) ease-(--ease-panel)"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        :id="uid"
        ref="panel"
        role="menu"
        :aria-label="label"
        :style="position"
        class="fixed z-50 min-w-48 rounded-lg bg-surface-4 p-1 shadow-popover"
        @keydown="onPanelKey"
      >
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          role="menuitem"
          tabindex="-1"
          :class="[
            'flex h-10 w-full items-center gap-2 rounded-md px-3 text-left font-sans text-sm pointer-coarse:h-11',
            'hover:bg-surface-3 focus-visible:bg-surface-3 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
            item.danger ? 'text-danger' : 'text-text',
          ]"
          @click.stop="choose(item.id)"
        >
          <component :is="item.icon" v-if="item.icon" :size="16" class="shrink-0 text-text-2" aria-hidden="true" />
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
