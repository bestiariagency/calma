import { computed, ref } from 'vue'

// Arrastrar y soltar archivos sobre un elemento. El contador evita el parpadeo de dragenter/dragleave
// al pasar por hijos. `onFiles(File[])` recibe lo soltado. `enabled` (ref/getter) desactiva el destino.
export function useFileDrop(onFiles, enabled = () => true) {
  const depth = ref(0)
  const dragging = computed(() => depth.value > 0)
  const hasFiles = event => [...(event.dataTransfer?.types ?? [])].includes('Files')

  const handlers = {
    dragenter(event) {
      if (!enabled() || !hasFiles(event)) return
      event.preventDefault()
      depth.value++
    },
    dragover(event) {
      if (!enabled() || !hasFiles(event)) return
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'
    },
    dragleave() {
      depth.value = Math.max(0, depth.value - 1)
    },
    drop(event) {
      depth.value = 0
      if (!enabled() || !hasFiles(event)) return
      event.preventDefault()
      onFiles([...event.dataTransfer.files])
    },
  }
  return { dragging, handlers }
}
