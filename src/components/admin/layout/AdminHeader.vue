<script setup>
import { ExternalLink, Menu, PanelLeft } from 'lucide-vue-next'
import { adminShellText as t } from '../../../data/adminShellText.js'
import { shortcutLabel } from '../../../lib/platform.js'
import { useSaveState } from '../../../composables/admin/useSaveState.js'
import Button from '../ui/Button.vue'
import Kbd from '../ui/Kbd.vue'
import Tooltip from '../ui/Tooltip.vue'
import Breadcrumb from './Breadcrumb.vue'
import SaveStatus from './SaveStatus.vue'

// Header sticky (spec 4.2): colapsar/hamburguesa + migas · SaveStatus · Ver sitio · Guardar.
defineProps({
  crumbs: { type: Array, required: true },
  collapsed: { type: Boolean, default: false },
  drawerId: { type: String, required: true },
  drawerOpen: { type: Boolean, default: false },
})
defineEmits(['toggle-sidebar', 'open-drawer'])

const { status, savedAt, canSave, save } = useSaveState()
const saveShortcut = shortcutLabel('S')
</script>

<template>
  <header
    class="sticky top-0 z-20 flex h-(--spacing-header) items-center gap-3 border-b border-line bg-surface-1 px-8 max-lg:px-6 max-md:px-4"
  >
    <Button
      variant="icon"
      class="md:hidden max-md:size-11!"
      :aria-label="t.openMenu"
      aria-haspopup="dialog"
      :aria-expanded="drawerOpen"
      :aria-controls="drawerId"
      @click="$emit('open-drawer')"
    >
      <Menu :size="20" aria-hidden="true" />
    </Button>
    <Tooltip :text="collapsed ? t.expandSidebar : t.collapseSidebar" placement="bottom" class="max-lg:hidden">
      <Button variant="icon" :aria-label="collapsed ? t.expandSidebar : t.collapseSidebar" :aria-expanded="!collapsed" @click="$emit('toggle-sidebar')">
        <PanelLeft :size="20" aria-hidden="true" />
      </Button>
    </Tooltip>

    <Breadcrumb :items="crumbs" class="flex-1" />

    <SaveStatus :status="status" :saved-at="savedAt" />
    <a
      href="/"
      target="_blank"
      rel="noopener"
      class="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md px-4 font-sans text-sm font-semibold text-text-2 transition-colors duration-(--motion-fast) ease-(--ease-panel) hover:bg-surface-3 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring pointer-coarse:h-11 max-md:size-11 max-md:p-0 motion-reduce:transition-none"
    >
      <ExternalLink :size="16" aria-hidden="true" />
      <span class="max-md:sr-only">{{ t.viewSite }}</span>
      <span class="sr-only md:hidden">{{ t.viewSiteNewTab }}</span>
    </a>
    <Button :variant="canSave ? 'secondary' : 'primary'" class="max-md:hidden" :disabled="!canSave" @click="save">
      {{ t.save }}
      <Kbd inherit>{{ saveShortcut }}</Kbd>
    </Button>
  </header>
</template>
