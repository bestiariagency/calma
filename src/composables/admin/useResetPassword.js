import { reactive, ref } from 'vue'
import { useAuth } from './useAuth.js'
import { useCooldown } from './useCooldown.js'
import { validateNewPassword } from '../../lib/passwordRules.js'

const REQUEST_ERRORS = { rate_limit: 'rateLimit', network: 'network' }
const SAVE_ERRORS = { weak_password: 'weak', same_password: 'same', no_session: 'link', network: 'network' }

// Restablecer contraseña: pedir enlace (siempre el mismo aviso) y fijar la nueva (llegada por enlace, PASSWORD_RECOVERY).
export function useResetPassword({ onUpdated }) {
  const auth = useAuth()
  const email = ref('')
  const emailMissing = ref(false)
  const sent = ref(false)
  const requestError = ref('')
  const loading = ref(false)
  const form = reactive({ password: '', repeat: '' })
  const passwordError = ref('') // tooShort | mismatch | weak | same | link | network | unknown
  const cooldown = useCooldown()

  async function requestLink() {
    emailMissing.value = !email.value.trim()
    if (emailMissing.value || loading.value || cooldown.active.value) return
    loading.value = true
    requestError.value = ''
    const { error } = await auth.requestPasswordReset(email.value.trim())
    loading.value = false
    if (error === 'rate_limit') cooldown.start()
    if (error) return (requestError.value = REQUEST_ERRORS[error] ?? 'unknown')
    sent.value = true
  }

  async function savePassword() {
    passwordError.value = validateNewPassword(form.password, form.repeat)
    if (passwordError.value || loading.value) return
    loading.value = true
    const { error } = await auth.updatePassword(form.password)
    loading.value = false
    if (!error) return onUpdated()
    passwordError.value = SAVE_ERRORS[error] ?? 'unknown'
  }

  return {
    email, emailMissing, sent, requestError, loading, form, passwordError,
    blocked: cooldown.active,
    secondsLeft: cooldown.remaining,
    requestLink, savePassword,
  }
}
