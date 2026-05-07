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
</script>

<template>
  <Teleport to="body">
    <Transition name="lb-fade">
      <div
        v-if="isOpen"
        class="lb"
        @click.self="$emit('close')"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <!-- Close -->
        <button class="lb__close" @click="$emit('close')" aria-label="Cerrar">
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
            class="lb__img"
          />
        </Transition>

        <!-- Prev -->
        <button class="lb__nav lb__nav--prev" @click="prev" aria-label="Anterior">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        <!-- Next -->
        <button class="lb__nav lb__nav--next" @click="next" aria-label="Siguiente">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>

        <!-- Counter -->
        <span class="lb__counter">{{ index + 1 }} / {{ images.length }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lb {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: rgba(0, 0, 0, 0.93);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lb__img {
  display: block;
  width: auto;
  height: auto;
  max-width: min(90vw, 1200px);
  max-height: 82vh;
  object-fit: contain;
  border-radius: 3px;
  user-select: none;
}

.lb__close {
  position: absolute;
  top: 20px; right: 20px;
  color: var(--c-text);
  opacity: 0.6;
  transition: opacity 0.2s;
  padding: 8px;
}
.lb__close:hover { opacity: 1; }

.lb__nav {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  color: var(--c-text);
  opacity: 0.5;
  padding: 20px 16px;
  transition: opacity 0.2s;
}
.lb__nav:hover  { opacity: 1; }
.lb__nav--prev  { left: 8px; }
.lb__nav--next  { right: 8px; }

.lb__counter {
  position: absolute;
  bottom: 20px; left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--c-muted);
}

/* Transitions */
.lb-fade-enter-active, .lb-fade-leave-active { transition: opacity 0.25s; }
.lb-fade-enter-from,  .lb-fade-leave-to      { opacity: 0; }

.lb-img-enter-active, .lb-img-leave-active { transition: opacity 0.15s; }
.lb-img-enter-from,  .lb-img-leave-to      { opacity: 0; }
</style>
