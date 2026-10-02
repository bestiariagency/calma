<script setup>
import { adminEditorText as t } from '../../../data/adminEditorText.js'
import Button from '../ui/Button.vue'
import Dialog from '../ui/Dialog.vue'

// Diálogos del editor (spec 3.13 y 4.6): salir sin guardar, descartar y conflicto de edición.
defineProps({ saving: { type: Boolean, default: false } })
const leaveOpen = defineModel('leave', { type: Boolean, default: false })
const discardOpen = defineModel('discard', { type: Boolean, default: false })
const conflictOpen = defineModel('conflict', { type: Boolean, default: false })
defineEmits(['leave', 'stay', 'discard', 'reload', 'overwrite'])
</script>

<template>
  <Dialog v-model="leaveOpen" tone="warning" :title="t.leaveTitle" :description="t.leaveBody">
    <template #footer>
      <Button variant="secondary" @click="$emit('leave')">{{ t.leave }}</Button>
      <Button data-autofocus @click="$emit('stay')">{{ t.keepEditing }}</Button>
    </template>
  </Dialog>

  <Dialog v-model="discardOpen" tone="danger" :title="t.discardTitle" :description="t.discardBody">
    <template #footer="{ close }">
      <Button variant="secondary" data-autofocus @click="close">{{ t.keepEditing }}</Button>
      <Button variant="danger" @click="$emit('discard')">{{ t.discardConfirm }}</Button>
    </template>
  </Dialog>

  <Dialog v-model="conflictOpen" stacked tone="warning" :busy="saving" :title="t.conflictTitle" :description="t.conflictBody">
    <template #footer="{ close }">
      <Button variant="secondary" data-autofocus :disabled="saving" @click="close">{{ t.conflictCancel }}</Button>
      <Button variant="secondary" :disabled="saving" @click="$emit('reload')">{{ t.conflictReload }}</Button>
      <Button variant="danger" :loading="saving" :loading-label="t.saving" @click="$emit('overwrite')">{{ t.conflictOverwrite }}</Button>
    </template>
  </Dialog>
</template>
