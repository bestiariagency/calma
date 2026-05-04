<script setup>
defineProps({
  total:   { type: Number, required: true },
  current: { type: Number, required: true },
})
defineEmits(['go'])
</script>

<template>
  <div class="dots">
    <button
      v-for="i in total"
      :key="i - 1"
      class="dots__dot"
      :class="{ 'dots__dot--active': current === i - 1 }"
      :aria-label="`Ir a diapositiva ${i}`"
      @click="$emit('go', i - 1)"
    />
  </div>
</template>

<style scoped>
.dots {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
}
.dots__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--c-b-dark);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: width 0.25s, background 0.25s;
}
.dots__dot--active {
  width: 20px;
  height: 6px;
  border-radius: 3px;
  background: var(--c-accent);
}
</style>
