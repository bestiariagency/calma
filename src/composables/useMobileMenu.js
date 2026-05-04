import { ref } from 'vue'

export function useMobileMenu() {
  const isOpen = ref(false)

  function open()  { isOpen.value = true;  document.body.style.overflow = 'hidden' }
  function close() { isOpen.value = false; document.body.style.overflow = '' }
  function toggle() { isOpen.value ? close() : open() }

  return { isOpen, open, close, toggle }
}
