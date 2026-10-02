// Rutas del panel. Todo es lazy: la landing no descarga nada de esto (ni Inter, ni lucide, ni el kit).
import { adminShellText } from '../data/adminShellText.js'
import { firstSectionPath, isLandingSection } from '../lib/adminMenu.js'

// Imports explícitos (un glob dinámico arrastraría KitView al build de producción).
const VIEWS = {
  AdminRoot: () => import('../views/admin/AdminRoot.vue'),
  AdminShell: () => import('../views/admin/AdminShell.vue'),
  LoginView: () => import('../views/admin/LoginView.vue'),
  ResetPasswordView: () => import('../views/admin/ResetPasswordView.vue'),
  NoAccessView: () => import('../views/admin/NoAccessView.vue'),
  CompanyEditorView: () => import('../views/admin/CompanyEditorView.vue'),
  SectionEditorView: () => import('../views/admin/SectionEditorView.vue'),
  HistoryView: () => import('../views/admin/HistoryView.vue'),
  PanelNotFoundView: () => import('../views/admin/PanelNotFoundView.vue'),
}
const view = name => VIEWS[name]

export const adminRoutes = [
  {
    path: '/administrador',
    component: view('AdminRoot'),
    meta: { noindex: true, title: adminShellText.pageTitle },
    children: [
      { path: 'acceso', name: 'admin-login', component: view('LoginView'), meta: { access: 'guest' } },
      { path: 'restablecer', name: 'admin-reset', component: view('ResetPasswordView'), meta: { access: 'public' } },
      { path: 'sin-acceso', name: 'admin-no-access', component: view('NoAccessView'), meta: { access: 'session' } },
      {
        path: '',
        component: view('AdminShell'),
        meta: { access: 'admin' },
        children: [
          { path: '', name: 'admin-home', redirect: () => firstSectionPath() },
          {
            path: 'seccion/:key',
            name: 'admin-section',
            component: view('SectionEditorView'),
            beforeEnter: to => isLandingSection(to.params.key) || { name: 'admin-not-found' },
          },
          { path: 'empresa', name: 'admin-company', component: view('CompanyEditorView') },
          { path: 'historial', name: 'admin-history', component: view('HistoryView') },
          { path: 'no-encontrada', name: 'admin-not-found', component: view('PanelNotFoundView') },
          { path: ':pathMatch(.*)*', component: view('PanelNotFoundView') },
        ],
      },
    ],
  },
]
