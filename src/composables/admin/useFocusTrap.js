import { nextTick, onBeforeUnmount, toValue, watch } from 'vue'

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])', 'select:not([disabled])',
  'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])',
].join(',')
const EXEMPT = '[data-inert-exempt]'

// Función pura: índice destino al pulsar Tab dentro de `count` elementos enfocables (circular).
export function nextTabIndex(count, current, backwards) {
  if (count === 0) return -1
  if (current < 0) return backwards ? count - 1 : 0
  return (current + (backwards ? -1 : 1) + count) % count
}

function getFocusable(container) {
  return [...container.querySelectorAll(FOCUSABLE)].filter(el => !el.closest('[inert]') && el.offsetParent !== null)
}

// Hermanos de <body> que quedan inertes mientras el overlay (teletransportado) está abierto.
function inertBackground(container) {
  const inerted = [...document.body.children].filter(
    el => !el.contains(container) && !el.matches(EXEMPT) && !el.hasAttribute('inert') && el.tagName !== 'SCRIPT',
  )
  inerted.forEach(el => el.setAttribute('inert', ''))
  return () => inerted.forEach(el => el.removeAttribute('inert'))
}

/**
 * Focus trap + `inert` en el fondo + retorno de foco al disparador.
 * Foco inicial: `[data-autofocus]` dentro del contenedor, o el primer control enfocable.
 */
export function useFocusTrap(containerRef, active) {
  let previous = null
  let releaseInert = null

  function onKeydown(event) {
    const container = toValue(containerRef)
    if (event.key !== 'Tab' || !container) return
    const items = getFocusable(container)
    if (items.length === 0) return event.preventDefault()
    const target = nextTabIndex(items.length, items.indexOf(document.activeElement), event.shiftKey)
    const first = items[0], last = items[items.length - 1]
    const wraps = event.shiftKey ? document.activeElement === first : document.activeElement === last
    if (!container.contains(document.activeElement) || wraps) {
      event.preventDefault()
      items[target].focus()
    }
  }

  async function activate() {
    previous = document.activeElement
    await nextTick()
    const container = toValue(containerRef)
    if (!container) return
    releaseInert = inertBackground(container)
    document.addEventListener('keydown', onKeydown)
    const initial = container.querySelector('[data-autofocus]') ?? getFocusable(container)[0] ?? container
    initial.focus({ preventScroll: true })
  }

  function deactivate() {
    document.removeEventListener('keydown', onKeydown)
    releaseInert?.()
    releaseInert = null
    if (previous?.isConnected) previous.focus({ preventScroll: true })
    previous = null
  }

  watch(() => toValue(active), on => (on ? activate() : deactivate()), { immediate: true, flush: 'post' })
  onBeforeUnmount(deactivate)
}
