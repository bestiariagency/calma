<script setup>
import { useToast } from '../../../composables/admin/useToast.js'
import { useToastRaised } from '../../../composables/admin/useToastOffset.js'
import Toast from './Toast.vue'

// Montar UNA vez en el layout del panel. El resto de la app usa useToast().
const { toasts, dismiss, pause, resume } = useToast()
const raised = useToastRaised()
</script>

<template>
  <Teleport to="body">
    <!-- data-inert-exempt: sigue operativo aunque un Dialog ponga el fondo inerte. -->
    <div
      data-inert-exempt
      :class="[
        'pointer-events-none fixed inset-x-4 top-3 z-50 flex flex-col gap-2 md:inset-x-auto md:top-auto md:right-4 md:w-[min(var(--size-toast),calc(100vw-2rem))]',
        // Sobre la UnsavedBar: 1rem de margen + 3.5rem de barra + 0.5rem de aire.
        raised ? 'md:bottom-24' : 'md:bottom-4',
      ]"
    >
      <TransitionGroup
        enter-active-class="transition duration-(--motion-base) ease-(--ease-panel)"
        enter-from-class="opacity-0 translate-y-2 motion-reduce:translate-y-0"
        leave-active-class="transition duration-(--motion-fast) ease-(--ease-panel)"
        leave-to-class="opacity-0"
      >
        <Toast
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          class="pointer-events-auto"
          @close="dismiss(toast.id)"
          @pause="pause(toast.id)"
          @resume="resume(toast.id)"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>
