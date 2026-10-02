import { decideAdminRoute } from '../lib/adminGuard.js'

// UX únicamente: RLS impone los permisos reales. useAuth se carga bajo demanda (solo rutas del panel).
export async function adminGuard(to) {
  const access = to.meta.access
  if (!access) return true
  const { resolveAccess } = await import('../composables/admin/useAuth.js')
  const snapshot = await resolveAccess()
  return decideAdminRoute({ ...snapshot, access, fullPath: to.fullPath, redirect: to.query.redirect }) ?? true
}
