import { onBeforeUnmount, ref } from 'vue'

// Estado reactivo de una media query (para decisiones de layout que CSS no puede tomar solo).
export function useMediaQuery(query) {
  const mql = window.matchMedia(query)
  const matches = ref(mql.matches)
  const update = event => (matches.value = event.matches)
  mql.addEventListener('change', update)
  onBeforeUnmount(() => mql.removeEventListener('change', update))
  return matches
}
