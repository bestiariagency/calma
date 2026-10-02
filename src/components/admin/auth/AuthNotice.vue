<script setup>
import { nextTick, ref, watch } from 'vue'
import Alert from '../ui/Alert.vue'

// Alert de acceso: al aparecer recibe el foco (tabindex -1) para que se anuncie y se vea (spec 3.17).
const props = defineProps({
  variant: { type: String, default: 'danger' },
  show: { type: Boolean, default: false },
  role: { type: String, default: '' },
})
const box = ref(null)

watch(
  () => props.show,
  async visible => {
    if (!visible) return
    await nextTick()
    box.value?.focus()
  },
  { immediate: true, flush: 'post' },
)
</script>

<template>
  <div v-if="show" ref="box" tabindex="-1" class="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
    <Alert :variant="variant" :role="role"><slot /></Alert>
  </div>
</template>
