<script setup>
import { CONTENT_SCHEMA } from '../../../data/contentSchema.js'
import { adminShellText } from '../../../data/adminShellText.js'
import { buildAdminMenu } from '../../../lib/adminMenu.js'
import SidebarFooter from './SidebarFooter.vue'
import SidebarItem from './SidebarItem.vue'

// Menú (grupos Landing y Empresa, generados desde el esquema) + pie. Sirve a la sidebar fija y al drawer.
defineProps({
  collapsed: { type: Boolean, default: false },
  email: { type: String, default: '' },
})
defineEmits(['navigate', 'sign-out'])

const groups = buildAdminMenu(CONTENT_SCHEMA, adminShellText)
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex-1 overflow-y-auto overscroll-contain px-3 pb-3">
      <nav v-for="group in groups" :key="group.id" :aria-label="group.label">
        <p v-if="!collapsed" class="px-3 pt-4 pb-1 font-mono text-[11px] tracking-eyebrow text-text-3 uppercase" aria-hidden="true">
          {{ group.label }}
        </p>
        <div v-else class="mx-2 mt-3 mb-2 border-t border-line" />
        <ul class="flex flex-col gap-0.5">
          <SidebarItem v-for="item in group.items" :key="item.key" v-bind="{ to: item.to, label: item.label, icon: item.icon, collapsed }" @navigate="$emit('navigate')" />
        </ul>
      </nav>
    </div>
    <SidebarFooter :email="email" :collapsed="collapsed" @sign-out="$emit('sign-out')" />
  </div>
</template>
