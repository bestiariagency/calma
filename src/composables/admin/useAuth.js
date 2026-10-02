import { computed, ref, shallowRef } from 'vue'
import * as authService from '../../services/authService.js'
import { authLinkHint } from '../../lib/authLinkHint.js'
import { classifyAuthError } from '../../lib/authErrors.js'

// Estado de sesión compartido (singleton de módulo). La autorización real es RLS; esto es solo UX.
const session = shallowRef(null)
const ready = ref(false)
const recovery = ref(authLinkHint.recovery)
const sessionExpired = ref(false)

let initPromise = null
let accessLoad = null // { userId, promise }: aal + is_admin cacheados por usuario
let intentionalSignOut = false

function handleAuthEvent(event, next) {
  if (event === 'PASSWORD_RECOVERY') recovery.value = true
  const previous = session.value
  session.value = next
  if (event === 'SIGNED_OUT') {
    accessLoad = null
    // Un SIGNED_OUT que no pedimos nosotros = sesión expirada o refresh fallido.
    if (previous && !intentionalSignOut) sessionExpired.value = true
    intentionalSignOut = false
  } else if (next && accessLoad?.userId !== next.user.id) {
    accessLoad = null
  }
  if (event === 'SIGNED_IN' && next) sessionExpired.value = false
}

export function initAuth() {
  initPromise ??= (async () => {
    authService.onAuthChange(handleAuthEvent)
    session.value = await authService.getSession()
    ready.value = true
  })()
  return initPromise
}

async function loadAccess(userId) {
  if (await authService.isMfaPending()) return { userId, mfaPending: true, isAdmin: false }
  const { isAdmin, error } = await authService.fetchIsAdmin()
  return { userId, mfaPending: false, isAdmin, transient: Boolean(error) }
}

function getAccess(userId) {
  if (accessLoad?.userId === userId) return accessLoad.promise
  const promise = loadAccess(userId)
  accessLoad = { userId, promise }
  // Un fallo de red no se cachea: la siguiente navegación vuelve a preguntar.
  promise.then(result => {
    if (result.transient && accessLoad?.promise === promise) accessLoad = null
  })
  return promise
}

const invalidateAccess = () => (accessLoad = null)

// { hasSession, mfaPending, isAdmin } para el guard del router.
export async function resolveAccess() {
  await initAuth()
  const current = session.value
  if (!current) return { hasSession: false, mfaPending: false, isAdmin: false }
  const { mfaPending, isAdmin } = await getAccess(current.user.id)
  return { hasSession: true, mfaPending, isAdmin }
}

export async function signIn(email, password) {
  const { session: next, error } = await authService.signInWithPassword(email, password)
  if (error) return { error: classifyAuthError(error) }
  session.value = next
  invalidateAccess()
  const access = await resolveAccess()
  return { mfaPending: access.mfaPending }
}

export async function verifyMfa(code) {
  const { error } = await authService.verifyTotp(code)
  if (error) return { error: classifyAuthError(error) }
  invalidateAccess()
  return { ok: true }
}

export async function signOut() {
  intentionalSignOut = true
  try {
    await authService.signOut()
  } finally {
    intentionalSignOut = false
    session.value = null
    invalidateAccess()
    sessionExpired.value = false
  }
}

export async function requestPasswordReset(email) {
  const redirectTo = `${location.origin}/administrador/restablecer`
  const { error } = await authService.requestPasswordReset(email, redirectTo)
  return { error: classifyAuthError(error) }
}

export async function updatePassword(password) {
  const { error } = await authService.updatePassword(password)
  if (error) return { error: classifyAuthError(error) }
  recovery.value = false
  return { ok: true }
}

export const dismissExpired = () => (sessionExpired.value = false)

export function useAuth() {
  return {
    session,
    ready,
    recovery,
    sessionExpired,
    email: computed(() => session.value?.user?.email ?? ''),
    linkError: authLinkHint.linkError,
    initAuth,
    resolveAccess,
    signIn,
    verifyMfa,
    signOut,
    requestPasswordReset,
    updatePassword,
    dismissExpired,
  }
}
