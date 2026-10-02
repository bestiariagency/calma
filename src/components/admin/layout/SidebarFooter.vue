<script setup>
import { LogOut } from 'lucide-vue-next'
import { adminAuthText } from '../../../data/adminShellText.js'
import Avatar from '../ui/Avatar.vue'
import Button from '../ui/Button.vue'
import Tooltip from '../ui/Tooltip.vue'

// Pie del sidebar: avatar + correo y "Cerrar sesión" (colapsado: solo iconos con Tooltip).
defineProps({ email: { type: String, default: '' }, collapsed: { type: Boolean, default: false } })
defineEmits(['sign-out'])
</script>

<template>
  <div class="flex flex-col gap-1 border-t border-line p-3">
    <Tooltip v-if="collapsed" :text="email" placement="right" class="flex! justify-center">
      <Avatar :email="email" />
    </Tooltip>
    <div v-else class="flex h-14 items-center gap-3 px-3">
      <Avatar :email="email" />
      <span class="min-w-0 truncate font-sans text-sm text-text-2">{{ email }}</span>
    </div>

    <Tooltip v-if="collapsed" :text="adminAuthText.signOut" placement="right" class="flex! justify-center">
      <Button variant="icon" :aria-label="adminAuthText.signOut" @click="$emit('sign-out')">
        <LogOut :size="16" aria-hidden="true" />
      </Button>
    </Tooltip>
    <Button v-else variant="ghost" class="w-full justify-start px-3" @click="$emit('sign-out')">
      <LogOut :size="16" aria-hidden="true" />
      {{ adminAuthText.signOut }}
    </Button>
  </div>
</template>
