<script setup>
import { computed } from 'vue'
import './adminStyles.js'
import { adminErrorText as t } from '../../data/adminShellText.js'
import { classifyPanelError, panelErrorDetail } from '../../lib/panelError.js'
import AuthCard from '../../components/admin/auth/AuthCard.vue'
import Alert from '../../components/admin/ui/Alert.vue'
import Button from '../../components/admin/ui/Button.vue'

// Pantalla de error del panel dentro del layout de acceso: envs ausentes, chunk caducado o fallo inesperado.
const props = defineProps({ error: { type: [Error, Object, String], required: true } })

const kind = computed(() => classifyPanelError(props.error))
const copy = computed(() => t[kind.value])
const detail = computed(() => (import.meta.env.DEV ? panelErrorDetail(props.error) : ''))
const reload = () => window.location.reload()
</script>

<template>
  <div class="min-h-screen bg-app-bg font-sans text-text scheme-dark">
    <AuthCard :title="copy.title">
      <Alert variant="danger">
        {{ copy.help }}
        <code v-if="detail" class="mt-2 block font-mono text-xs break-words text-text-3">{{ detail }}</code>
        <template v-if="copy.retry" #action>
          <Button variant="secondary" size="sm" data-autofocus @click="reload">{{ t.reload }}</Button>
        </template>
      </Alert>
    </AuthCard>
  </div>
</template>
