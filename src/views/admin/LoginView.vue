<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminAuthText as t } from '../../data/adminShellText.js'
import { ADMIN_HOME, safeRedirect } from '../../lib/adminGuard.js'
import { focusFirstInvalid } from '../../composables/admin/useFocusInvalid.js'
import { useLoginForm } from '../../composables/admin/useLoginForm.js'
import AuthCard from '../../components/admin/auth/AuthCard.vue'
import AuthNotice from '../../components/admin/auth/AuthNotice.vue'
import MfaStep from '../../components/admin/auth/MfaStep.vue'
import PasswordInput from '../../components/admin/auth/PasswordInput.vue'
import Button from '../../components/admin/ui/Button.vue'
import Field from '../../components/admin/ui/Field.vue'
import Input from '../../components/admin/ui/Input.vue'

const route = useRoute()
const router = useRouter()
const login = useLoginForm({ onDone: () => router.replace(safeRedirect(route.query.redirect) ?? ADMIN_HOME) })
const { form, fieldErrors, step, loading, error, mfaFailed, blocked, secondsLeft } = login

const formEl = ref(null)
const onSubmit = async () => {
  await login.submitCredentials()
  focusFirstInvalid(formEl.value)
}

onMounted(login.resumeMfaIfPending)
</script>

<template>
  <AuthCard :title="step === 'mfa' ? t.mfaTitle : t.loginTitle" :help="step === 'mfa' ? t.mfaHelp : t.loginHelp">
    <MfaStep
      v-if="step === 'mfa'"
      :loading="loading"
      :failed="mfaFailed"
      @submit="login.submitCode"
      @back="login.backToCredentials"
    />
    <form v-else ref="formEl" class="flex flex-col gap-4" novalidate :aria-busy="loading || undefined" @submit.prevent="onSubmit">
      <AuthNotice :show="error === 'rate_limit'" variant="warning" role="alert">
        {{ t.errors.rateLimit }}
        <span v-if="blocked" class="font-mono tabular-nums">{{ t.rateLimitWait(secondsLeft) }}</span>
      </AuthNotice>
      <AuthNotice :show="Boolean(error) && error !== 'rate_limit'">
        {{ t.errors[error] }}
      </AuthNotice>

      <Field :label="t.email" :error="fieldErrors.email ? t.emailRequired : ''">
        <template #default="{ controlProps }">
          <Input v-model="form.email" v-bind="controlProps" type="email" autocomplete="username" autocapitalize="none" spellcheck="false" />
        </template>
      </Field>
      <Field :label="t.password" :error="fieldErrors.password ? t.passwordRequired : ''">
        <template #default="{ controlProps }">
          <PasswordInput v-model="form.password" v-bind="controlProps" autocomplete="current-password" />
        </template>
      </Field>

      <Button type="submit" class="w-full" :loading="loading" :loading-label="t.submittingLogin" :disabled="blocked">
        {{ loading ? t.submittingLogin : t.submitLogin }}
      </Button>
      <RouterLink
        :to="{ name: 'admin-reset' }"
        class="self-center inline-flex min-h-6 items-center rounded-sm px-2 pointer-coarse:min-h-11 text-[13px] text-accent-text underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {{ t.forgot }}
      </RouterLink>
    </form>
  </AuthCard>
</template>
