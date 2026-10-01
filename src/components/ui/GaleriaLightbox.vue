<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: { type: Array,  required: true },
  index:  { type: Number, default: null  },
})
const emit = defineEmits(['close', 'update:index'])

const isOpen = computed(() => props.index !== null)

function prev() {
  emit('update:index', (props.index - 1 + props.images.length) % props.images.length)
}
function next() {
  emit('update:index', (props.index + 1) % props.images.length)
}

function onKey(e) {
  if (!isOpen.value) return
  if (e.key === 'ArrowLeft')  prev()
  if (e.key === 'ArrowRight') next()
  if (e.key === 'Escape')     emit('close')
}

let touchStartX = 0
function onTouchStart(e) { touchStartX = e.changedTouches[0].clientX }
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) > 50) dx < 0 ? next() : prev()
}

watch(isOpen, val => { document.body.style.overflow = val ? 'hidden' : '' })
onMounted(()   => window.addEventListener('keydown', onKey))
onUnmounted(() => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' })

const NAV_BTN = 'absolute top-1/2 -translate-y-1/2 px-4 pt-5 pb-6 text-text opacity-50 transition-opacity duration-200 ease-[ease] hover:opacity-100'
</script>

<template>
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[300] flex items-center justify-center bg-black/93"
        @click.self="$emit('close')"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- Close -->
        <button class="absolute top-5 right-5 px-2 pt-2 pb-3 text-text opacity-60 transition-opacity duration-200 ease-[ease] hover:opacity-100" @click="$emit('close')" aria-label="Cerrar">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6"  x2="6"  y2="18"/>
            <line x1="6"  y1="6"  x2="18" y2="18"/>
          </svg>
        </button>

        <!-- Image -->
        <Transition name="lb-img" mode="out-in">
          <img
            :key="index"
            :src="images[index].src"
            :alt="images[index].alt"
            class="h-auto max-h-[82vh] w-auto max-w-[min(90vw,1200px)] rounded-[3px] object-contain select-none"
          />
        </Transition>

        <!-- Prev -->
        <button :class="[NAV_BTN, 'left-2']" @click="prev" aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <!-- Next -->
        <button :class="[NAV_BTN, 'right-2']" @click="next" aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <!-- Counter -->
        <span class="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] tracking-[3px] text-muted">{{ index + 1 }} / {{ images.length }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* CSS fallback: clases de <Transition> de Vue (lb-fade / lb-img) para el fundido de entrada/salida */
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.25s; }
.lb-fade-enter-from,  .lb-fade-leave-to      { opacity: 0; }

.lb-img-enter-active, .lb-img-leave-active { transition: opacity 0.15s; }
.lb-img-enter-from,  .lb-img-leave-to      { opacity: 0; }
</style>
