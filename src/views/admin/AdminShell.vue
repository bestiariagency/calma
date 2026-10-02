<script setup>
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CONTENT_SCHEMA } from '../../data/contentSchema.js'
import { adminShellText } from '../../data/adminShellText.js'
import { buildBreadcrumb } from '../../lib/adminMenu.js'
import { useAuth } from '../../composables/admin/useAuth.js'
import { useSidebar } from '../../composables/admin/useSidebar.js'
import AdminHeader from '../../components/admin/layout/AdminHeader.vue'
import SessionExpiredDialog from '../../components/admin/layout/SessionExpiredDialog.vue'
import SidebarLogo from '../../components/admin/layout/SidebarLogo.vue'
import SidebarPanel from '../../components/admin/layout/SidebarPanel.vue'
import Drawer from '../../components/admin/ui/Drawer.vue'
import SkipLink from '../../components/admin/ui/SkipLink.vue'

const DRAWER_ID = 'admin-drawer'
const route = useRoute()
const router = useRouter()
const { email, signOut } = useAuth()
const { collapsed, isMobile, drawerOpen, toggleCollapsed, openDrawer, closeDrawer } = useSidebar()

const crumbs = computed(() => buildBreadcrumb(route, CONTENT_SCHEMA, adminShellText))

watch(() => route.fullPath, closeDrawer)

async function leave() {
  await signOut()
  router.replace({ name: 'admin-login' })
}
</script>

<template>
  <SkipLink />
  <div class="flex min-h-screen">
    <aside
      v-if="!isMobile"
      :class="[
        'sticky top-0 flex h-dvh shrink-0 flex-col border-r border-line bg-surface-1',
        'transition-[width] duration-(--motion-slow) ease-(--ease-panel) motion-reduce:transition-none',
        collapsed ? 'w-(--spacing-sidebar-collapsed)' : 'w-(--spacing-sidebar)',
      ]"
    >
      <div class="flex h-(--spacing-header) shrink-0 items-center border-b border-line px-4">
        <SidebarLogo :collapsed="collapsed" class="flex-1" />
      </div>
      <SidebarPanel :collapsed="collapsed" :email="email" @sign-out="leave" />
    </aside>

    <Drawer v-if="isMobile" :id="DRAWER_ID" v-model="drawerOpen" :label="adminShellText.menuLabel">
      <template #header><SidebarLogo /></template>
      <SidebarPanel :email="email" @navigate="closeDrawer" @sign-out="leave" />
    </Drawer>

    <div class="flex min-w-0 flex-1 flex-col">
      <AdminHeader
        :crumbs="crumbs"
        :collapsed="collapsed"
        :drawer-id="DRAWER_ID"
        :drawer-open="drawerOpen"
        @toggle-sidebar="toggleCollapsed"
        @open-drawer="openDrawer"
      />
      <main id="contenido" tabindex="-1" class="mx-auto w-full max-w-(--spacing-content-max) flex-1 p-8 outline-none max-lg:p-6 max-md:p-4">
        <RouterView />
      </main>
    </div>
  </div>
  <SessionExpiredDialog />
</template>
