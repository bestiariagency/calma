import { onBeforeUnmount, onMounted } from 'vue'
import { isApplePlatform } from '../../lib/platform.js'

// ⌘S (macOS) / Ctrl+S (resto): evita "Guardar página" del navegador y llama a `handler`; funciona con foco en inputs.
export function useSaveShortcut(handler) {
  const apple = isApplePlatform()
  const onKeydown = event => {
    const modifier = apple ? event.metaKey : event.ctrlKey
    if (!modifier || event.altKey || event.key.toLowerCase() !== 's') return
    event.preventDefault()
    handler()
  }
  onMounted(() => window.addEventListener('keydown', onKeydown))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
}
