// Decisión pura de redirección del panel. El guard es solo UX: la autorización real es RLS.
export const ADMIN_HOME = '/administrador'
const LOGIN = 'admin-login'
const NO_ACCESS = 'admin-no-access'

// Evita open-redirect: solo rutas internas del panel.
export function safeRedirect(target) {
  if (typeof target !== 'string') return null
  const inPanel = target === ADMIN_HOME || target.startsWith(`${ADMIN_HOME}/`) || target.startsWith(`${ADMIN_HOME}?`)
  return inPanel && !target.startsWith('//') ? target : null
}

const toLogin = fullPath => ({ name: LOGIN, query: { redirect: fullPath } })

/**
 * access: 'public' (sin comprobar) | 'guest' (acceso) | 'session' (sin-acceso) | 'admin' (panel)
 * snapshot: { hasSession, mfaPending, isAdmin }
 * Devuelve null (permitir) o el destino de la redirección.
 */
export function decideAdminRoute({ access, hasSession, mfaPending, isAdmin, fullPath, redirect }) {
  if (access === 'public') return null
  const authenticated = hasSession && !mfaPending
  if (access === 'guest') {
    if (!authenticated) return null
    return isAdmin ? { path: safeRedirect(redirect) ?? ADMIN_HOME } : { name: NO_ACCESS }
  }
  if (!authenticated) return toLogin(fullPath)
  if (access === 'session') return isAdmin ? { path: ADMIN_HOME } : null
  return isAdmin ? null : { name: NO_ACCESS }
}
