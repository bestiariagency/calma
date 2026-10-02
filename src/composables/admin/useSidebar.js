import { computed, ref, watch } from 'vue'
import { useMediaQuery } from './useMediaQuery.js'

const STORAGE_KEY = 'calma-admin-sidebar-collapsed'

export function readCollapsed(storage = globalThis.localStorage) {
  try {
    return storage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

export function writeCollapsed(value, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    // Storage bloqueado (modo privado, cuota): la preferencia solo dura la sesión.
  }
}

// lg ≥ 1024: sidebar fija (colapsable, recordada) · md 768–1023: siempre colapsada · < 768: drawer.
export function useSidebar() {
  const preferCollapsed = ref(readCollapsed())
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isMobile = useMediaQuery('(max-width: 767.98px)')
  const drawerOpen = ref(false)
  const collapsed = computed(() => !isMobile.value && (!isDesktop.value || preferCollapsed.value))

  watch(preferCollapsed, value => writeCollapsed(value))
  watch(isMobile, mobile => !mobile && (drawerOpen.value = false))

  return {
    collapsed,
    isMobile,
    drawerOpen,
    toggleCollapsed: () => (preferCollapsed.value = !preferCollapsed.value),
    openDrawer: () => (drawerOpen.value = true),
    closeDrawer: () => (drawerOpen.value = false),
  }
}
