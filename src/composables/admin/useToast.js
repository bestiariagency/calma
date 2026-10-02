import { computed, shallowRef } from 'vue'

export const MAX_VISIBLE = 3
export const DURATIONS = { success: 4000, info: 4000, warning: 6000, error: null } // null = persistente

const toasts = shallowRef([])
const timers = new Map() // id → { handle, remaining, startedAt }
let nextId = 1

const visible = computed(() => toasts.value.slice(0, MAX_VISIBLE))

function clearTimer(id) {
  const entry = timers.get(id)
  if (entry) clearTimeout(entry.handle)
  return entry
}

function startTimer(id, remaining) {
  clearTimer(id)
  const handle = setTimeout(() => dismiss(id), remaining)
  timers.set(id, { handle, remaining, startedAt: Date.now() })
}

// Solo corre el temporizador de los toasts visibles (el resto espera en cola).
function syncTimers() {
  for (const toast of visible.value) {
    if (toast.duration == null || timers.has(toast.id)) continue
    startTimer(toast.id, toast.duration)
  }
}

export function dismiss(id) {
  clearTimer(id)
  timers.delete(id)
  toasts.value = toasts.value.filter(t => t.id !== id)
  syncTimers()
}

// Pausa en hover/foco: conserva el tiempo restante.
export function pause(id) {
  const entry = clearTimer(id)
  if (!entry) return
  entry.remaining -= Date.now() - entry.startedAt
  entry.handle = null
}

export function resume(id) {
  const entry = timers.get(id)
  if (!entry || entry.handle) return
  startTimer(id, Math.max(entry.remaining, 1000))
}

export function push({ type = 'info', title, detail = '', action = null, duration }) {
  const id = nextId++
  const resolved = duration === undefined ? DURATIONS[type] : duration
  toasts.value = [...toasts.value, { id, type, title, detail, action, duration: resolved }]
  syncTimers()
  return id
}

export function resetToasts() {
  timers.forEach(entry => clearTimeout(entry.handle))
  timers.clear()
  toasts.value = []
}

export function useToast() {
  const shortcut = type => (title, options = {}) => push({ ...options, type, title })
  return {
    toasts: visible,
    queued: computed(() => Math.max(0, toasts.value.length - MAX_VISIBLE)),
    push, dismiss, pause, resume,
    success: shortcut('success'),
    info: shortcut('info'),
    warning: shortcut('warning'),
    error: shortcut('error'),
  }
}
