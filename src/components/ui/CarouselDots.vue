<script setup>
defineProps({
  total:   { type: Number, required: true },
  current: { type: Number, required: true },
})
defineEmits(['go'])
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <button
      v-for="i in total"
      :key="i - 1"
      class="h-[6px] transition-[width,background] duration-250 ease-[ease]"
      :class="current === i - 1 ? 'w-[20px] rounded-[3px] bg-accent' : 'w-[6px] rounded-[50%] bg-b-dark'"
      :aria-label="`Ir a diapositiva ${i}`"
      @click="$emit('go', i - 1)"
    />
  </div>
</template>
