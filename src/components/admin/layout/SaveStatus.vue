<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { Circle, CircleAlert, CircleCheck, LoaderCircle, WifiOff } from 'lucide-vue-next'
import { adminShellText } from '../../../data/adminShellText.js'
import { savedAgoLabel } from '../../../lib/savedAgo.js'

// Spec 3.10: siempre icono + texto; región aria-live "polite" (única en el header). En móvil el texto queda sr-only.
const t = adminShellText.saveStatus
const props = defineProps({
  status: { type: String, default: 'saved', validator: v => ['idle', 'saved', 'dirty', 'saving', 'error', 'offline'].includes(v) },
  savedAt: { type: Number, default: null },
})

const VIEWS = {
  idle: null, // cargando: neutro, sin texto
  saved: { icon: CircleCheck, iconClass: 'text-success', textClass: 'text-text-3' },
  dirty: { icon: Circle, iconClass: 'fill-current', textClass: 'text-warning' },
  saving: { icon: LoaderCircle, iconClass: 'animate-spin motion-reduce:animate-pulse', textClass: 'text-text-2' },
  error: { icon: CircleAlert, iconClass: '', textClass: 'text-danger' },
  offline: { icon: WifiOff, iconClass: '', textClass: 'text-warning' },
}

const now = ref(Date.now())
const timer = setInterval(() => (now.value = Date.now()), 60_000)
onBeforeUnmount(() => clearInterval(timer))

const view = computed(() => VIEWS[props.status])
const label = computed(() => (props.status === 'saved' ? savedAgoLabel(props.savedAt, now.value, t) : t[props.status]))
</script>

<template>
  <div role="status" aria-live="polite" :class="['inline-flex items-center gap-1.5 font-mono text-xs tabular-nums', view?.textClass]">
    <template v-if="view">
      <component :is="view.icon" :size="14" :class="['shrink-0', view.iconClass]" aria-hidden="true" />
      <!-- < lg solo icono (el breadcrumb tiene prioridad); el texto sigue disponible para lectores. -->
      <span class="max-lg:sr-only">{{ label }}</span>
    </template>
  </div>
</template>
