import { onBeforeUnmount, toValue, watch } from 'vue'

// Bloqueo con contador: varios overlays apilados no se pisan. Funciones puras sobre el elemento
// (testeable sin DOM): compensa el ancho de la barra de scroll para evitar saltos de layout.
let locks = 0
let saved = null

// scrollY se guarda para restaurar la posición exacta al soltar (algunos móviles la desplazan con overflow:hidden).
export function lockScroll(root, scrollbarWidth = 0, scrollY = 0) {
  if (locks++ > 0) return
  saved = { overflow: root.style.overflow, paddingRight: root.style.paddingRight, scrollY }
  root.style.overflow = 'hidden'
  if (scrollbarWidth > 0) root.style.paddingRight = `${scrollbarWidth}px`
}

export function unlockScroll(root, restoreScroll) {
  if (locks === 0 || --locks > 0) return
  root.style.overflow = saved.overflow
  root.style.paddingRight = saved.paddingRight
  restoreScroll?.(saved.scrollY)
  saved = null
}

export function resetScrollLock() {
  locks = 0
  saved = null
}

export function useScrollLock(active) {
  let held = false
  const root = () => document.documentElement

  function acquire() {
    if (held) return
    held = true
    lockScroll(root(), window.innerWidth - root().clientWidth, window.scrollY)
  }
  function release() {
    if (!held) return
    held = false
    unlockScroll(root(), y => window.scrollTo({ top: y, behavior: 'instant' }))
  }

  watch(() => toValue(active), on => (on ? acquire() : release()), { immediate: true })
  onBeforeUnmount(release)
}
