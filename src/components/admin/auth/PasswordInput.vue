<script setup>
import { ref } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'
import { adminAuthText } from '../../../data/adminShellText.js'
import Input from '../ui/Input.vue'

// Input de contraseña con botón ojo (spec 4.1). Los atributos (id, aria-*, autocomplete) van al <input>.
defineOptions({ inheritAttrs: false })
const model = defineModel({ type: String, default: '' })
const shown = ref(false)
</script>

<template>
  <div class="relative">
    <Input v-model="model" :type="shown ? 'text' : 'password'" v-bind="$attrs" class="pr-10! pointer-coarse:pr-11!" />
    <button
      type="button"
      :aria-label="shown ? adminAuthText.hidePassword : adminAuthText.showPassword"
      class="absolute inset-y-0 right-0 grid size-10 place-items-center rounded-md text-text-2 transition-colors duration-(--motion-fast) hover:text-text focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring pointer-coarse:size-11 motion-reduce:transition-none"
      @click="shown = !shown"
    >
      <EyeOff v-if="shown" :size="20" aria-hidden="true" />
      <Eye v-else :size="20" aria-hidden="true" />
    </button>
  </div>
</template>
