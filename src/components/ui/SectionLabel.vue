<script setup>
defineProps({
  text: { type: String, required: true },
})
</script>

<template>
  <span class="block text-[9px] font-bold tracking-[4px] text-accent uppercase md:text-[10px] md:tracking-[5px]">{{ text }}</span>
</template>
