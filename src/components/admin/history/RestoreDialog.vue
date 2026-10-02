<script setup>
import { computed } from 'vue'
import { adminHistoryText as t } from '../../../data/adminEditorText.js'
import { formatAbsolute } from '../../../lib/historyFormat.js'
import Alert from '../ui/Alert.vue'
import Button from '../ui/Button.vue'
import Dialog from '../ui/Dialog.vue'

// Confirmación de "Restaurar esta versión": publica de inmediato y queda registrado en el historial.
const props = defineProps({
  row: { type: Object, default: null },
  restoring: { type: Boolean, default: false },
  error: { type: Object, default: null }, // { title, detail }
})
const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['confirm'])

const date = computed(() => (props.row ? formatAbsolute(props.row.changedAt) : ''))
</script>

<template>
  <Dialog v-model="open" :title="t.restoreTitle" :busy="restoring">
    <p>{{ t.restoreBody(date) }}</p>
    <Alert v-if="error" variant="danger" :title="error.title" class="mt-4">{{ error.detail }}</Alert>
    <template #footer="{ close }">
      <Button variant="secondary" data-autofocus :disabled="restoring" @click="close">{{ t.restoreCancel }}</Button>
      <Button :loading="restoring" :loading-label="t.restoring" @click="emit('confirm')">{{ t.restoreConfirm }}</Button>
    </template>
  </Dialog>
</template>
