<script setup>
import { computed, ref, useId } from 'vue'
import { CircleAlert, Info, TriangleAlert } from 'lucide-vue-next'
import { useFocusTrap } from '../../../composables/admin/useFocusTrap.js'
import { useScrollLock } from '../../../composables/admin/useScrollLock.js'

const TONES = {
  danger: { icon: CircleAlert, color: 'text-danger' },
  warning: { icon: TriangleAlert, color: 'text-warning' },
  info: { icon: Info, color: 'text-info' },
}

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  tone: { type: String, default: '', validator: v => ['', 'danger', 'warning', 'info'].includes(v) },
  // Operación en curso: Esc y clic fuera no cierran.
  busy: { type: Boolean, default: false },
  // Diálogos que NO se pueden descartar (p. ej. sesión expirada).
  persistent: { type: Boolean, default: false },
  // Footer en columna a ancho completo (diálogos con 3 acciones o etiquetas largas).
  stacked: { type: Boolean, default: false },
})
const open = defineModel({ type: Boolean, default: false })

const uid = useId()
const panel = ref(null)
const toneInfo = computed(() => TONES[props.tone])

useFocusTrap(panel, open)
useScrollLock(open)

function requestClose() {
  if (props.busy || props.persistent) return
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-(--motion-base) ease-(--ease-panel)"
      enter-from-class="opacity-0"
      leave-active-class="transition-opacity duration-(--motion-fast) ease-(--ease-panel)"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-40 bg-overlay" aria-hidden="true" @click="requestClose" />
    </Transition>
    <Transition
      enter-active-class="transition duration-(--motion-base) ease-(--ease-panel)"
      enter-from-class="opacity-0 scale-98 motion-reduce:scale-100"
      leave-active-class="transition duration-(--motion-fast) ease-(--ease-panel)"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="pointer-events-none fixed inset-0 z-50 grid place-items-center">
        <div
          ref="panel"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          :aria-labelledby="`${uid}-title`"
          :aria-describedby="description || $slots.default ? `${uid}-desc` : undefined"
          class="pointer-events-auto flex w-[min(var(--size-dialog),calc(100vw-2rem))] flex-col gap-4 rounded-lg bg-surface-4 p-6 shadow-dialog max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:w-full max-md:rounded-b-none max-md:p-5"
          @keydown.esc.stop="requestClose"
        >
          <h2 :id="`${uid}-title`" class="flex items-center gap-2 font-mono text-base/6 font-bold text-text">
            <component :is="toneInfo.icon" v-if="toneInfo" :size="20" :class="['shrink-0', toneInfo.color]" aria-hidden="true" />
            {{ title }}
          </h2>
          <div v-if="description || $slots.default" :id="`${uid}-desc`" class="font-sans text-sm/5 text-text-2">
            <slot>{{ description }}</slot>
          </div>
          <!-- Cancelar = secondary con data-autofocus (foco inicial en la opción segura). -->
          <div
            v-if="$slots.footer"
            :class="['flex gap-2', stacked ? 'flex-col-reverse *:w-full' : 'justify-end max-sm:flex-col-reverse']"
          >
            <slot name="footer" :busy="busy" :close="requestClose" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
