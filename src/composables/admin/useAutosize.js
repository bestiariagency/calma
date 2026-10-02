import { nextTick, onMounted, toValue, watch } from 'vue'

// Ajusta la altura del textarea a su contenido (el tope lo pone `max-h-*` en CSS).
export function useAutosize(elRef, valueRef) {
  function resize() {
    const el = toValue(elRef)
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }
  onMounted(resize)
  watch(() => toValue(valueRef), () => nextTick(resize))
  return { resize }
}
