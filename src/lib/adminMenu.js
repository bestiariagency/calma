// Menú y migas del panel, derivados del esquema de contenido (única fuente de las secciones editables).
import { CONTENT_SCHEMA } from '../data/contentSchema.js'

const BASE = '/administrador'
const COMPANY_KEY = 'company' // tiene pantalla propia (Datos de la empresa)

export const landingKeys = (schema = CONTENT_SCHEMA) => Object.keys(schema).filter(key => key !== COMPANY_KEY)
export const isLandingSection = (key, schema = CONTENT_SCHEMA) => landingKeys(schema).includes(key)
export const sectionPath = key => `${BASE}/seccion/${key}`
export const firstSectionPath = (schema = CONTENT_SCHEMA) => sectionPath(landingKeys(schema)[0])

export function buildAdminMenu(schema, text) {
  return [
    {
      id: 'landing',
      label: text.groupLanding,
      items: landingKeys(schema).map(key => ({ key, label: schema[key].label, to: sectionPath(key), icon: 'FileText' })),
    },
    {
      id: 'company',
      label: text.groupCompany,
      items: [
        { key: 'company', label: schema[COMPANY_KEY].label, to: `${BASE}/empresa`, icon: 'Building2' },
        { key: 'history', label: text.history, to: `${BASE}/historial`, icon: 'History' },
      ],
    },
  ]
}

// Migas según la ruta actual: [{ label, to? }]; el último es la página actual.
export function buildBreadcrumb(route, schema, text) {
  const landing = { label: text.groupLanding }
  switch (route.name) {
    case 'admin-section':
      return [landing, { label: schema[route.params.key]?.label ?? text.panel }]
    case 'admin-company':
      return [{ label: text.groupCompany }, { label: schema[COMPANY_KEY].label }]
    case 'admin-history':
      return [{ label: text.groupCompany }, { label: text.history }]
    default:
      return [{ label: text.panel }]
  }
}
