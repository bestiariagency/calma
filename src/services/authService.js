// Acceso a Supabase Auth del panel. La autorización real es RLS; aquí solo hay llamadas finas.
import { supabase } from '../lib/supabase.js'

const { auth } = supabase

export async function getSession() {
  const { data } = await auth.getSession()
  return data.session
}

export function onAuthChange(callback) {
  return auth.onAuthStateChange((event, session) => callback(event, session)).data.subscription
}

export async function signInWithPassword(email, password) {
  const { data, error } = await auth.signInWithPassword({ email, password })
  return { session: data?.session ?? null, error }
}

export function signOut() {
  return auth.signOut()
}

export async function requestPasswordReset(email, redirectTo) {
  const { error } = await auth.resetPasswordForEmail(email, { redirectTo })
  return { error }
}

export async function updatePassword(password) {
  const { error } = await auth.updateUser({ password })
  return { error }
}

// true si el usuario tiene un factor TOTP verificado y la sesión aún está en aal1.
export async function isMfaPending() {
  const { data, error } = await auth.mfa.getAuthenticatorAssuranceLevel()
  if (error) return false
  return data.nextLevel === 'aal2' && data.currentLevel !== 'aal2'
}

export async function verifyTotp(code) {
  const { data: factors, error: listError } = await auth.mfa.listFactors()
  const factor = factors?.totp?.[0]
  if (listError || !factor) return { error: listError ?? { status: 400 } }
  const { error } = await auth.mfa.challengeAndVerify({ factorId: factor.id, code })
  return { error }
}

export async function fetchIsAdmin() {
  const { data, error } = await supabase.rpc('is_admin')
  return { isAdmin: data === true, error }
}
