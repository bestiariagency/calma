import { onBeforeUnmount, ref, watch } from 'vue'
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'

// Aviso al salir con cambios sin guardar: `beforeunload` (cerrar/recargar pestaña) y guard de ruta con
// Dialog propio (salir del editor o cambiar de sección). El Dialog se enlaza con `open` y `answer(ok)`.
export function useLeaveGuard(isDirty) {
  const open = ref(false)
  let resolver = null

  const settle = ok => {
    resolver?.(ok)
    resolver = null
  }
  const ask = () => new Promise(resolve => {
    settle(false)
    resolver = resolve
    open.value = true
  })
  const answer = ok => {
    open.value = false
    settle(ok)
  }
  // Cerrar el Dialog con Esc/clic fuera = seguir editando.
  watch(open, value => value || settle(false))

  onBeforeRouteLeave(() => (isDirty.value ? ask() : true))
  onBeforeRouteUpdate((to, from) => (to.params.key !== from.params.key && isDirty.value ? ask() : true))

  const onBeforeUnload = event => {
    event.preventDefault()
    event.returnValue = ''
  }
  watch(
    isDirty,
    dirty => window[dirty ? 'addEventListener' : 'removeEventListener']('beforeunload', onBeforeUnload),
    { immediate: true },
  )
  onBeforeUnmount(() => window.removeEventListener('beforeunload', onBeforeUnload))

  return { open, answer }
}
