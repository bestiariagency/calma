<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { adminAuthText as t } from '../../data/adminShellText.js'
import { MIN_PASSWORD_LENGTH } from '../../lib/passwordRules.js'
import { useAuth } from '../../composables/admin/useAuth.js'
import { focusFirstInvalid } from '../../composables/admin/useFocusInvalid.js'
import { useResetPassword } from '../../composables/admin/useResetPassword.js'
import { useToast } from '../../composables/admin/useToast.js'
import AuthCard from '../../components/admin/auth/AuthCard.vue'
import AuthLink from '../../components/admin/auth/AuthLink.vue'
import AuthNotice from '../../components/admin/auth/AuthNotice.vue'
import PasswordInput from '../../components/admin/auth/PasswordInput.vue'
import Button from '../../components/admin/ui/Button.vue'
import Field from '../../components/admin/ui/Field.vue'
import Input from '../../components/admin/ui/Input.vue'

const passwordForm = ref(null)
const requestForm = ref(null)
const router = useRouter()
const toast = useToast()
const { recovery, session, linkError } = useAuth()
const reset = useResetPassword({
  onUpdated: () => {
    toast.success(t.passwordSaved)
    router.replace({ name: 'admin-home' })
  },
})
const { email, emailMissing, sent, requestError, loading, form, passwordError, blocked, secondsLeft } = reset

async function onSavePassword() {
  await reset.savePassword()
  focusFirstInvalid(passwordForm.value)
}
async function onRequestLink() {
  await reset.requestLink()
  focusFirstInvalid(requestForm.value)
}

// Paso 2 solo si se llegó por el enlace del correo y hay sesión de recuperación.
const choosingPassword = computed(() => recovery.value && Boolean(session.value))
const linkExpired = computed(() => !choosingPassword.value && !sent.value && Boolean(linkError))
const passwordMessage = computed(() => {
  const key = passwordError.value
  if (!key) return ''
  if (key === 'tooShort') return t.passwordErrors.tooShort(MIN_PASSWORD_LENGTH)
  return t.passwordErrors[key] ?? t.errors[key] ?? t.errors.unknown
})
const NEW_PASSWORD_ERRORS = ['tooShort', 'weak', 'same', 'network', 'unknown']
const newPasswordError = computed(() => (NEW_PASSWORD_ERRORS.includes(passwordError.value) ? passwordMessage.value : ''))
const requestMessage = computed(() => (requestError.value === 'rateLimit' ? t.errors.rateLimit : t.errors[requestError.value]))
</script>

<template>
  <AuthCard :title="choosingPassword ? t.newPasswordTitle : t.resetTitle" :help="choosingPassword ? t.newPasswordHelp : t.resetHelp">
    <form v-if="choosingPassword" ref="passwordForm" class="flex flex-col gap-4" novalidate :aria-busy="loading || undefined" @submit.prevent="onSavePassword">
      <AuthNotice :show="passwordError === 'link'">
        {{ t.linkExpired }}
        <RouterLink :to="{ name: 'admin-reset' }" class="underline underline-offset-4">{{ t.requestAnotherLink }}</RouterLink>
      </AuthNotice>
      <Field :label="t.newPassword" :help="t.passwordRules(MIN_PASSWORD_LENGTH)" :error="newPasswordError">
        <template #default="{ controlProps }">
          <PasswordInput v-model="form.password" v-bind="controlProps" autocomplete="new-password" />
        </template>
      </Field>
      <Field :label="t.repeatPassword" :error="passwordError === 'mismatch' ? passwordMessage : ''">
        <template #default="{ controlProps }">
          <PasswordInput v-model="form.repeat" v-bind="controlProps" autocomplete="new-password" />
        </template>
      </Field>
      <Button type="submit" class="w-full" :loading="loading" :loading-label="t.savingPassword">{{ loading ? t.savingPassword : t.savePassword }}</Button>
    </form>

    <form v-else ref="requestForm" class="flex flex-col gap-4" novalidate :aria-busy="loading || undefined" @submit.prevent="onRequestLink">
      <AuthNotice :show="linkExpired">{{ t.linkExpired }}</AuthNotice>
      <AuthNotice :show="Boolean(requestError)" :variant="requestError === 'rateLimit' ? 'warning' : 'danger'">
        {{ requestMessage }}
        <span v-if="blocked" class="font-mono tabular-nums">{{ t.rateLimitWait(secondsLeft) }}</span>
      </AuthNotice>
      <AuthNotice :show="sent" variant="success">{{ t.resetSent }}</AuthNotice>
      <Field :label="t.email" :error="emailMissing ? t.emailRequired : ''">
        <template #default="{ controlProps }">
          <Input v-model="email" v-bind="controlProps" type="email" autocomplete="username" autocapitalize="none" spellcheck="false" />
        </template>
      </Field>
      <Button type="submit" class="w-full" :loading="loading" :loading-label="t.resetSubmitting" :disabled="blocked">{{ loading ? t.resetSubmitting : t.resetSubmit }}</Button>
      <AuthLink :to="{ name: 'admin-login' }">
        {{ t.backToLogin }}
      </AuthLink>
    </form>
  </AuthCard>
</template>
