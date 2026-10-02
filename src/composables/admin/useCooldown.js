import { computed, onBeforeUnmount, ref } from 'vue'

export const RATE_LIMIT_SECONDS = 30

// Cuenta atrás en segundos (bloqueo temporal tras rate limit).
export function useCooldown() {
  const remaining = ref(0)
  let timer = null

  function stop() {
    clearInterval(timer)
    timer = null
  }
  function start(seconds = RATE_LIMIT_SECONDS) {
    stop()
    remaining.value = seconds
    timer = setInterval(() => {
      remaining.value -= 1
      if (remaining.value <= 0) stop()
    }, 1000)
  }
  onBeforeUnmount(stop)

  return { remaining, active: computed(() => remaining.value > 0), start }
}
