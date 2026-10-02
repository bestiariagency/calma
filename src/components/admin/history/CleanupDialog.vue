<script setup>
import { adminOrphanText as t } from '../../../data/adminEditorText.js'
import { formatBytes } from '../../../lib/historyFormat.js'
import Button from '../ui/Button.vue'
import Dialog from '../ui/Dialog.vue'

// Confirmación de "Liberar espacio": borrado definitivo de fotos sin uso.
defineProps({ totals: { type: Object, required: true } }) // { count, bytes }
const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['confirm'])
</script>

<template>
  <Dialog v-model="open" tone="warning" :title="t.confirmTitle" :description="t.confirmBody(totals.count, formatBytes(totals.bytes))">
    <template #footer="{ close }">
      <Button variant="secondary" data-autofocus @click="close">{{ t.confirmCancel }}</Button>
      <Button variant="danger" @click="emit('confirm')">{{ t.confirmAction }}</Button>
    </template>
  </Dialog>
</template>
