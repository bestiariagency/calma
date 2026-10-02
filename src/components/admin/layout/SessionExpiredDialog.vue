<script setup>
import { LogOut } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { adminAuthText as t } from '../../../data/adminShellText.js'
import { useAuth } from '../../../composables/admin/useAuth.js'
import Button from '../ui/Button.vue'
import Dialog from '../ui/Dialog.vue'

// Sesión expirada (spec 4.6): modal no descartable que lleva al acceso conservando la ruta de retorno.
const route = useRoute()
const router = useRouter()
const { sessionExpired, dismissExpired } = useAuth()

async function goToLogin() {
  const redirect = route.fullPath
  dismissExpired()
  await router.replace({ name: 'admin-login', query: { redirect } })
}
</script>

<template>
  <Dialog :model-value="sessionExpired" persistent :title="t.sessionExpiredTitle" :description="t.sessionExpiredHelp" tone="info">
    <template #footer>
      <Button data-autofocus @click="goToLogin">
        <LogOut :size="16" aria-hidden="true" />
        {{ t.sessionExpiredAction }}
      </Button>
    </template>
  </Dialog>
</template>
