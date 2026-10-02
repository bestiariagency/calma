<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminHistoryText as t, adminOrphanText as to } from '../../data/adminEditorText.js'
import { sectionFilterOptions } from '../../lib/historyList.js'
import { useAuth } from '../../composables/admin/useAuth.js'
import { useHistory } from '../../composables/admin/useHistory.js'
import { useMediaCleanup } from '../../composables/admin/useMediaCleanup.js'
import { useRestoreRevision } from '../../composables/admin/useRestoreRevision.js'
import { useRevisionDiff } from '../../composables/admin/useRevisionDiff.js'
import { useToast } from '../../composables/admin/useToast.js'
import { formatBytes } from '../../lib/historyFormat.js'
import CleanupDialog from '../../components/admin/history/CleanupDialog.vue'
import DiffDrawer from '../../components/admin/history/DiffDrawer.vue'
import HistoryTable from '../../components/admin/history/HistoryTable.vue'
import OrphanMediaCard from '../../components/admin/history/OrphanMediaCard.vue'
import RestoreDialog from '../../components/admin/history/RestoreDialog.vue'
import Select from '../../components/admin/ui/Select.vue'

// Historial (spec 4.5): tabla de versiones, diferencias, restaurar y limpieza de fotos sin uso.
const { session } = useAuth()
const toast = useToast()
const history = useHistory()
const cleanup = useMediaCleanup()

const userId = computed(() => session.value?.user?.id ?? '')
const filterOptions = sectionFilterOptions(t)

const selected = ref(null) // fila abierta en el panel de diferencias
const drawerOpen = computed({ get: () => Boolean(selected.value), set: open => !open && (selected.value = null) })
const diff = useRevisionDiff(selected, history.currentByKey)

const restoreTarget = ref(null)
const restoreOpen = computed({ get: () => Boolean(restoreTarget.value), set: open => !open && (restoreTarget.value = null) })
const restoration = useRestoreRevision(async () => {
  restoreTarget.value = null
  selected.value = null
  await Promise.all([history.load(), cleanup.load({ silent: true })])
})
const askRestore = row => {
  restoration.clearError()
  restoreTarget.value = row
}

const cleanupOpen = ref(false)
async function confirmCleanup() {
  cleanupOpen.value = false
  const result = await cleanup.clean()
  if (!result) return
  const size = formatBytes(result.freedBytes)
  if (!result.failed.length) toast.success(to.doneTitle, { detail: to.done(result.deleted, size) })
  else toast.warning(to.partialTitle, { detail: to.partial(result.deleted, result.failed.length, size) })
}

onMounted(() => Promise.all([history.load(), cleanup.load()]))
</script>

<template>
  <section class="flex flex-col gap-6">
    <header class="flex flex-col gap-1">
      <h1 class="font-mono text-xl/7 font-bold tracking-title text-text max-md:text-lg/6">{{ t.title }}</h1>
      <p class="font-sans text-sm/5 text-text-2">{{ t.help }}</p>
    </header>

    <div class="flex flex-col gap-3">
      <Select :model-value="history.sectionKey.value" :options="filterOptions" :label="t.filterLabel" @update:model-value="history.setSection" />
      <HistoryTable
        :phase="history.phase.value"
        :view="history.view.value"
        :user-id="userId"
        :newest-first="history.newestFirst.value"
        :filtered="Boolean(history.sectionKey.value)"
        @open="selected = $event"
        @restore="askRestore"
        @sort="history.toggleSort"
        @page="history.goToPage"
        @retry="history.load"
        @clear-filter="history.setSection('')"
      />
    </div>

    <OrphanMediaCard
      :phase="cleanup.phase.value"
      :items="cleanup.items.value"
      :totals="cleanup.totals.value"
      :running="cleanup.running.value"
      :progress="cleanup.progress.value"
      :result="cleanup.result.value"
      @clean="cleanupOpen = true"
      @retry="cleanup.load"
      @dismiss="cleanup.dismissResult"
    />
  </section>

  <DiffDrawer v-model="drawerOpen" :row="selected" :changes="diff.changes.value" :media="diff.media.value" :phase="diff.phase.value" @restore="askRestore" @retry="diff.reload" />
  <RestoreDialog v-model="restoreOpen" :row="restoreTarget" :restoring="restoration.restoring.value" :error="restoration.error.value" @confirm="restoration.restore(restoreTarget)" />
  <CleanupDialog v-model="cleanupOpen" :totals="cleanup.totals.value" @confirm="confirmCleanup" />
</template>
