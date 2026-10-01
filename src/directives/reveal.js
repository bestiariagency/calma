// v-reveal: aparición al hacer scroll (spec de motion de Búho-Pixel).
//
// Grupo  = elemento con `v-reveal`; se observa él y, al entrar, se revelan sus ítems en stagger.
// Ítems  = descendientes con `data-reveal="<variante>"` (y el propio grupo si lo lleva).
//          Variantes y estilos en src/style.css; aquí solo se decide CUÁNDO y con qué índice.
// `data-reveal="zoom"` no cuenta para el stagger: hereda el retardo de su máscara.
// `data-reveal-i="n"` fija el índice a mano (no consume índice automático).
// Modificadores: `.each` → cada ítem dispara por sí mismo (los que entran juntos, en stagger);
//                `.edge` → sin margen inferior (footer, para que dispare al final de la página).
//
// Progressive enhancement: el estado oculto solo existe bajo `html.motion-ok`, que se pone aquí
// si hay IntersectionObserver y no hay prefers-reduced-motion. Sin eso, todo visible y estático.

const MOTION_CLASS = 'motion-ok'
const ITEM = '[data-reveal]'
const GROUP_ATTR = 'data-reveal-group'
const ROOT_MARGIN = { default: '0px 0px -12% 0px', edge: '0px' }

const observers = new Map() // rootMargin → IntersectionObserver compartido
const targets = new Map()   // elemento observado → { group, each, observer }
let scrollFrame = 0

const isRendered = el => el.getClientRects().length > 0
const isAboveViewport = el => el.getBoundingClientRect().bottom <= 0
const isZoom = el => el.dataset.reveal === 'zoom'

function isMotionEnabled() {
  return document.documentElement.classList.contains(MOTION_CLASS)
}

function enableMotion() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canObserve = 'IntersectionObserver' in window
  document.documentElement.classList.toggle(MOTION_CLASS, canObserve && !reduced)
}

/** Ítems del grupo, excluyendo los que pertenecen a un grupo anidado. */
function ownItems(group) {
  const nested = [...group.querySelectorAll(ITEM)].filter(el => el.closest(`[${GROUP_ATTR}]`) === group)
  return group.matches(ITEM) ? [group, ...nested] : nested
}

/** Modo `.each`: ítems que no están dentro de otro ítem del grupo (estos se revelan con su padre;
 *  así un zoom dentro de una máscara no se registra aparte, pero uno suelto no queda huérfano). */
function topLevelItems(group) {
  return ownItems(group).filter(el => {
    const parentItem = el.parentElement?.closest(ITEM)
    return el !== group && !(parentItem && parentItem !== group && group.contains(parentItem))
  })
}

/** Índice de stagger en orden DOM, solo entre ítems pintados (ignora los del otro breakpoint). */
function assignStagger(items) {
  let next = 0
  for (const el of items) {
    if (isZoom(el)) continue
    if (el.dataset.revealI !== undefined) {
      el.style.setProperty('--reveal-i', el.dataset.revealI)
      continue
    }
    if (isRendered(el)) el.style.setProperty('--reveal-i', next++)
  }
}

function markRevealed(elements, instant) {
  if (instant) elements.forEach(el => { el.style.transition = 'none' })
  elements.forEach(el => el.setAttribute('data-revealed', ''))
  if (!instant) return
  void document.body.offsetWidth // aplica el estado final sin transición antes de restaurarla
  elements.forEach(el => { el.style.transition = '' })
}

function forget(target) {
  targets.get(target)?.observer.unobserve(target)
  targets.delete(target)
  if (!targets.size) window.removeEventListener('scroll', onScroll)
}

function reveal(target, { instant = false, index = 0 } = {}) {
  const { each } = targets.get(target)
  forget(target)
  if (each) {
    target.style.setProperty('--reveal-i', index)
    markRevealed([target, ...target.querySelectorAll(ITEM)], instant)
    return
  }
  const items = ownItems(target)
  assignStagger(items)
  markRevealed(items, instant)
}

/** Agrupa por contenedor los que entran en el mismo frame (para el stagger de `.each`). */
function onIntersect(entries) {
  const entering = new Map()
  for (const { target, isIntersecting, boundingClientRect } of entries) {
    if (!targets.has(target) || !isRendered(target)) continue
    if (isIntersecting) {
      const { group } = targets.get(target)
      entering.set(group, [...(entering.get(group) ?? []), { target, top: boundingClientRect.top }])
    } else if (boundingClientRect.bottom <= 0) {
      reveal(target, { instant: true })
    }
  }
  for (const batch of entering.values()) {
    batch.sort((a, b) => a.top - b.top).forEach(({ target }, index) => reveal(target, { index }))
  }
}

/** Red de seguridad: lo que queda por encima del viewport (scroll restaurado, ancla, scroll muy
 *  rápido) se muestra al instante para que nunca quede contenido invisible. */
function onScroll() {
  if (scrollFrame) return
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0
    const passed = [...targets.keys()].filter(t => isRendered(t) && isAboveViewport(t))
    passed.forEach(t => reveal(t, { instant: true }))
  })
}

function observerFor(rootMargin) {
  if (!observers.has(rootMargin)) {
    observers.set(rootMargin, new IntersectionObserver(onIntersect, { threshold: 0, rootMargin }))
  }
  return observers.get(rootMargin)
}

const vReveal = {
  mounted(group, { modifiers }) {
    if (!isMotionEnabled()) return
    group.setAttribute(GROUP_ATTR, '')
    const observer = observerFor(modifiers.edge ? ROOT_MARGIN.edge : ROOT_MARGIN.default)
    const watched = modifiers.each ? topLevelItems(group) : [group]
    for (const target of watched) {
      targets.set(target, { group, each: Boolean(modifiers.each), observer })
      observer.observe(target)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
  },
  unmounted(group) {
    for (const [target, info] of targets) if (info.group === group) forget(target)
  },
}

export default {
  install(app) {
    enableMotion()
    app.directive('reveal', vReveal)
  },
}
