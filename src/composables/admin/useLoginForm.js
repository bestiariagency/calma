import { computed, reactive, ref } from 'vue'
import { useAuth } from './useAuth.js'
import { useCooldown } from './useCooldown.js'

const KNOWN_ERRORS = ['invalid', 'network', 'rate_limit']

// Lógica del acceso: credenciales → (opcional) código MFA → onDone(). Mensajes genéricos: nunca revelan si el correo existe.
export function useLoginForm({ onDone }) {
  const auth = useAuth()
  const form = reactive({ email: '', password: '' })
  const step = ref('credentials') // credentials | mfa
  const loading = ref(false)
  const error = ref('') // '' | invalid | network | unknown | rate_limit
  const mfaFailed = ref(false)
  const fieldErrors = reactive({ email: false, password: false })
  const cooldown = useCooldown()

  const blocked = computed(() => cooldown.active.value)

  function fail(kind) {
    error.value = KNOWN_ERRORS.includes(kind) ? kind : 'unknown'
    if (kind === 'rate_limit') cooldown.start()
  }

  async function submitCredentials() {
    fieldErrors.email = !form.email.trim()
    fieldErrors.password = !form.password
    if (fieldErrors.email || fieldErrors.password || loading.value || blocked.value) return
    loading.value = true
    error.value = ''
    const result = await auth.signIn(form.email.trim(), form.password)
    loading.value = false
    if (result.error) return fail(result.error)
    if (result.mfaPending) step.value = 'mfa'
    else onDone()
  }

  async function submitCode(code) {
    if (loading.value) return
    loading.value = true
    mfaFailed.value = false
    const result = await auth.verifyMfa(code)
    loading.value = false
    if (result.error === 'rate_limit') cooldown.start()
    if (result.error) return (mfaFailed.value = true)
    onDone()
  }

  // Si la sesión ya existe pero falta el segundo factor (redirigido por el guard), se abre directo el paso MFA.
  async function resumeMfaIfPending() {
    const access = await auth.resolveAccess()
    if (access.hasSession && access.mfaPending) step.value = 'mfa'
  }

  async function backToCredentials() {
    await auth.signOut()
    step.value = 'credentials'
    form.password = ''
    mfaFailed.value = false
  }

  return {
    form, step, loading, error, mfaFailed, fieldErrors, blocked,
    secondsLeft: cooldown.remaining,
    submitCredentials, submitCode, resumeMfaIfPending, backToCredentials,
  }
}
