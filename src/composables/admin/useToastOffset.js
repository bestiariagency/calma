import { onBeforeUnmount, onMounted, ref } from 'vue'

// Mientras la UnsavedBar está visible, el ToastHost (escritorio) sube por encima de ella.
const raised = ref(false)

export const useToastRaised = () => raised

export function useRaiseToasts() {
  onMounted(() => (raised.value = true))
  onBeforeUnmount(() => (raised.value = false))
}
