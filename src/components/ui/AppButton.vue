<script setup>
import IconWhatsApp from './IconWhatsApp.vue'

defineProps({
  label: { type: String, required: true },
  size:  { type: String, default: 'md' }, // 'sm' | 'md' | 'sm-md' (sm en móvil, md desde 768px)
  wa:    { type: Boolean, default: false },
})

const SIZE_CLASSES = {
  sm: 'px-[36px] py-[14px] text-[12px]',
  md: 'px-[44px] py-[16px] text-[15px]',
  'sm-md': 'px-[36px] py-[14px] text-[12px] md:px-[44px] md:py-[16px] md:text-[15px]',
}
</script>

<template>
  <button
    class="inline-flex items-center justify-center gap-2 rounded-[2px] bg-accent font-bold tracking-[1px] whitespace-nowrap text-mid transition-opacity duration-200 ease-[ease] hover:opacity-85"
    :class="SIZE_CLASSES[size]"
  >
    <IconWhatsApp v-if="wa" />
    {{ label }}
  </button>
</template>
