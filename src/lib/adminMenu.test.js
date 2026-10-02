import { describe, expect, it } from 'vitest'
import { CONTENT_SCHEMA } from '../data/contentSchema.js'
import { adminShellText } from '../data/adminShellText.js'
import { buildAdminMenu, buildBreadcrumb, firstSectionPath, isLandingSection } from './adminMenu.js'

const menu = buildAdminMenu(CONTENT_SCHEMA, adminShellText)

describe('buildAdminMenu', () => {
  it('genera el grupo Landing desde el esquema, sin company', () => {
    const landing = menu.find(g => g.id === 'landing')
    expect(landing.items.map(i => i.key)).toEqual(Object.keys(CONTENT_SCHEMA).filter(k => k !== 'company'))
    expect(landing.items[0]).toMatchObject({ label: CONTENT_SCHEMA.nav.label, to: '/administrador/seccion/nav' })
  })
  it('el grupo Empresa trae Datos de la empresa e Historial', () => {
    const company = menu.find(g => g.id === 'company')
    expect(company.items.map(i => [i.label, i.to])).toEqual([
      ['Datos de la empresa', '/administrador/empresa'],
      ['Historial', '/administrador/historial'],
    ])
  })
  it('home apunta a la primera sección y valida claves', () => {
    expect(firstSectionPath()).toBe('/administrador/seccion/nav')
    expect(isLandingSection('hero')).toBe(true)
    expect(isLandingSection('company')).toBe(false)
    expect(isLandingSection('zzz')).toBe(false)
  })
})

describe('buildBreadcrumb', () => {
  it('compone las migas por ruta', () => {
    const crumb = (name, params) => buildBreadcrumb({ name, params }, CONTENT_SCHEMA, adminShellText).map(c => c.label)
    expect(crumb('admin-section', { key: 'hero' })).toEqual(['Landing', 'Portada'])
    expect(crumb('admin-company')).toEqual(['Empresa', 'Datos de la empresa'])
    expect(crumb('admin-history')).toEqual(['Empresa', 'Historial'])
    expect(crumb('admin-not-found')).toEqual(['Panel'])
  })
})
