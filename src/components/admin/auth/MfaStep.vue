<script setup>
import { ref, watch } from 'vue'
import { adminAuthText as t } from '../../../data/adminShellText.js'
import Button from '../ui/Button.vue'
import Field from '../ui/Field.vue'
import Input from '../ui/Input.vue'
import AuthNotice from './AuthNotice.vue'

// Paso "Código de verificación" (spec 4.1): un input de 6 dígitos con auto-envío al completar.
const props = defineProps({
  loading: { type: Boolean, default: false },
  failed: { type: Boolean, default: false },
})
const emit = defineEmits(['submit', 'back'])
const code = ref('')

watch(code, value => {
  const digits = value.replace(/\D/g, '').slice(0, 6)
  if (digits !== value) code.value = digits
  else if (digits.length === 6 && !props.loading) emit('submit', digits)
})
watch(
  () => props.failed,
  failed => failed && (code.value = ''),
)
</script>

<template>
  <form class="flex flex-col gap-4" :aria-busy="loading || undefined" @submit.prevent="code.length === 6 && emit('submit', code)">
    <AuthNotice :show="failed">{{ t.mfaInvalid }}</AuthNotice>
    <Field :label="t.mfaLabel">
      <template #default="{ controlProps }">
        <Input
          v-model="code"
          v-bind="controlProps"
          inputmode="numeric"
          autocomplete="one-time-code"
          maxlength="6"
          autofocus
          class="text-center font-mono text-xl! tracking-code"
        />
      </template>
    </Field>
    <Button type="submit" class="w-full" :loading="loading" :loading-label="t.mfaSubmitting" :disabled="code.length < 6">
      {{ loading ? t.mfaSubmitting : t.mfaSubmit }}
    </Button>
    <Button variant="ghost" class="w-full" :disabled="loading" @click="emit('back')">{{ t.mfaBack }}</Button>
  </form>
</template>
