import { describe, expect, it } from 'vitest'
import { decideAdminRoute, safeRedirect } from './adminGuard.js'

const base = { fullPath: '/administrador/historial', redirect: undefined }
const none = { hasSession: false, mfaPending: false, isAdmin: false }
const admin = { hasSession: true, mfaPending: false, isAdmin: true }
const plain = { hasSession: true, mfaPending: false, isAdmin: false }
const aal1 = { hasSession: true, mfaPending: true, isAdmin: false }
const decide = (access, state, extra) => decideAdminRoute({ ...base, ...extra, access, ...state })

describe('decideAdminRoute', () => {
  it('permite siempre las rutas públicas (restablecer)', () => {
    expect(decide('public', none)).toBeNull()
    expect(decide('public', admin)).toBeNull()
  })
  it('sin sesión manda al acceso conservando la ruta', () => {
    expect(decide('admin', none)).toEqual({ name: 'admin-login', query: { redirect: '/administrador/historial' } })
  })
  it('con contraseña ok pero MFA pendiente vuelve al acceso', () => {
    expect(decide('admin', aal1)).toMatchObject({ name: 'admin-login' })
    expect(decide('guest', aal1)).toBeNull()
  })
  it('sesión sin rol admin va a "Sin acceso"', () => {
    expect(decide('admin', plain)).toEqual({ name: 'admin-no-access' })
    expect(decide('guest', plain)).toEqual({ name: 'admin-no-access' })
    expect(decide('session', plain)).toBeNull()
  })
  it('admin entra al panel y no ve el acceso', () => {
    expect(decide('admin', admin)).toBeNull()
    expect(decide('guest', admin)).toEqual({ path: '/administrador' })
    expect(decide('guest', admin, { redirect: '/administrador/empresa' })).toEqual({ path: '/administrador/empresa' })
    expect(decide('session', admin)).toEqual({ path: '/administrador' })
  })
  it('"Sin acceso" exige sesión', () => {
    expect(decide('session', none)).toMatchObject({ name: 'admin-login' })
  })
})

describe('safeRedirect', () => {
  it('acepta solo rutas internas del panel', () => {
    expect(safeRedirect('/administrador/seccion/hero')).toBe('/administrador/seccion/hero')
    expect(safeRedirect('/administrador?x=1')).toBe('/administrador?x=1')
    expect(safeRedirect('https://evil.com')).toBeNull()
    expect(safeRedirect('//evil.com')).toBeNull()
    expect(safeRedirect('/administradorx')).toBeNull()
    expect(safeRedirect('/')).toBeNull()
    expect(safeRedirect(undefined)).toBeNull()
    expect(safeRedirect(['/administrador'])).toBeNull()
  })
})
