<script setup>
import { useRouter } from 'vue-router'
import { ShieldAlert } from 'lucide-vue-next'
import { adminAuthText as t } from '../../data/adminShellText.js'
import { useAuth } from '../../composables/admin/useAuth.js'
import Logo from '../../components/admin/ui/Logo.vue'
import Button from '../../components/admin/ui/Button.vue'
import SkipLink from '../../components/admin/ui/SkipLink.vue'

const router = useRouter()
const { signOut, email } = useAuth()

async function leave() {
  await signOut()
  router.replace({ name: 'admin-login' })
}
</script>

<template>
  <SkipLink />
  <main id="contenido" tabindex="-1" class="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-4 p-4 text-center">
    <Logo />
    <ShieldAlert :size="32" class="text-text-3" aria-hidden="true" />
    <h1 class="font-mono text-xl/7 font-bold tracking-title text-text max-md:text-lg/6">{{ t.noAccessTitle }}</h1>
    <p class="font-sans text-sm/5 text-text-2">{{ t.noAccessHelp }}</p>
    <p v-if="email" class="font-mono text-xs text-text-3">{{ email }}</p>
    <Button variant="secondary" data-autofocus @click="leave">{{ t.signOut }}</Button>
  </main>
</template>
