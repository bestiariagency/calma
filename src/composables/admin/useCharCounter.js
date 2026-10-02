import { computed, ref, toValue, watch } from 'vue'

export const WARNING_RATIO = 0.9

// Función pura: nivel del contador según longitud y máximo ('ok' | 'warning' | 'danger').
export function getCounterState(count, max) {
  if (!max || max <= 0) return { level: 'ok', over: 0 }
  if (count > max) return { level: 'danger', over: count - max }
  if (count >= max * WARNING_RATIO) return { level: 'warning', over: 0 }
  return { level: 'ok', over: 0 }
}

// Contador reactivo. `announcement` cambia solo al cruzar 90 % y 100 % (para aria-live="polite"),
// no en cada pulsación.
export function useCharCounter(count, max, messages) {
  const state = computed(() => getCounterState(toValue(count), toValue(max)))
  const announcement = ref('')

  watch(
    () => state.value.level,
    level => {
      if (level === 'ok') announcement.value = ''
      else if (level === 'warning') announcement.value = messages.nearLimit(toValue(count), toValue(max))
      else announcement.value = messages.overLimit(state.value.over)
    },
  )

  return { level: computed(() => state.value.level), over: computed(() => state.value.over), announcement }
}
