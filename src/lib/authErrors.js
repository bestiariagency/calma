// Clasifica errores de Supabase Auth en categorías que la UI sabe explicar (sin revelar si el correo existe).
export function classifyAuthError(error) {
  if (!error) return null
  const { status, code, name } = error
  if (status === 429 || code === 'over_request_rate_limit' || code === 'over_email_send_rate_limit') return 'rate_limit'
  if (name === 'AuthSessionMissingError') return 'no_session'
  if (code === 'weak_password') return 'weak_password'
  if (code === 'same_password') return 'same_password'
  if (status === 400 || status === 401 || status === 422) return 'invalid'
  if (!status || name === 'AuthRetryableFetchError') return 'network'
  return 'unknown'
}
