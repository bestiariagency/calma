import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import { adminRoutes } from './adminRoutes.js'
import { adminGuard } from './adminGuard.js'
import '../lib/authLinkHint.js' // captura el hash del enlace de recuperación antes de que Supabase lo borre

const ROBOTS_ID = 'route-robots'

// El panel nunca debe indexarse: se añade <meta name="robots"> al entrar y se retira al salir.
function setNoindex(enabled) {
  const current = document.getElementById(ROBOTS_ID)
  if (!enabled) return current?.remove()
  if (current) return
  const meta = document.createElement('meta')
  meta.id = ROBOTS_ID
  meta.name = 'robots'
  meta.content = 'noindex,nofollow'
  document.head.appendChild(meta)
}

// Mismo comportamiento que hoy: anclas con scroll suave (CSS `scroll-behavior`), carga inicial directa.
function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) return savedPosition
  if (to.hash) return { el: to.hash, behavior: from.name || from.matched.length ? 'smooth' : 'auto' }
  return { top: 0 }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingView },
    // Solo desarrollo: Vite elimina esta rama (y el chunk del kit) del build de producción.
    ...(import.meta.env.DEV
      ? [{ path: '/administrador/kit', name: 'admin-kit', component: () => import('../views/admin/KitView.vue'), meta: { noindex: true } }]
      : []),
    ...adminRoutes,
  ],
  scrollBehavior,
})

const DEFAULT_TITLE = document.title

router.beforeEach(adminGuard)
router.afterEach(to => {
  setNoindex(Boolean(to.meta.noindex))
  document.title = to.meta.title ?? DEFAULT_TITLE
})
