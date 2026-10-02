import { describe, expect, it } from 'vitest'
import { classifyPanelError, isPanelPath, panelErrorDetail } from './panelError.js'
import { missingSupabaseVars, SupabaseConfigError } from './supabaseConfig.js'

describe('missingSupabaseVars', () => {
  it.each([
    [{ url: 'u', anonKey: 'k' }, []],
    [{ url: '', anonKey: 'k' }, ['VITE_SUPABASE_URL']],
    [{ url: 'u' }, ['VITE_SUPABASE_ANON_KEY']],
    [{}, ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']],
  ])('%j → %j', (env, expected) => expect(missingSupabaseVars(env)).toEqual(expected))
})

describe('classifyPanelError', () => {
  it('config', () => expect(classifyPanelError(new SupabaseConfigError(['X']))).toBe('config'))
  it.each([
    'Failed to fetch dynamically imported module: /assets/a.js',
    'error loading dynamically imported module',
    'Importing a module script failed.',
    'Unable to preload CSS for /assets/a.css',
  ])('chunk: %s', msg => expect(classifyPanelError(new TypeError(msg))).toBe('chunk'))
  it('unknown', () => {
    expect(classifyPanelError(new Error('boom'))).toBe('unknown')
    expect(classifyPanelError(null)).toBe('unknown')
  })
})

describe('isPanelPath', () => {
  it.each([
    ['/administrador', true],
    ['/administrador/acceso', true],
    ['/administradores', false],
    ['/', false],
  ])('%s → %s', (p, e) => expect(isPanelPath(p)).toBe(e))
})

describe('panelErrorDetail', () => {
  it('lista las variables que faltan', () => {
    expect(panelErrorDetail(new SupabaseConfigError(['VITE_SUPABASE_URL']))).toContain('VITE_SUPABASE_URL')
  })
  it('usa el mensaje', () => expect(panelErrorDetail(new Error('x'))).toBe('x'))
})
