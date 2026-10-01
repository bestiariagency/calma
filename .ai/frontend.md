# Frontend — estándar (Coneja-Lucky)

## Stack
Vue 3 (`<script setup>`, Composition API) + Vite + **Tailwind CSS v4** (plugin `@tailwindcss/vite`).
JavaScript (sin TypeScript por ahora). Fuente: JetBrains Mono (Google Fonts).

## Estado actual y migración
El sitio existente usa **CSS scoped** + variables en `src/style.css`. Está planificada la
**migración a Tailwind v4** componente a componente, **sin cambios visuales** (validados por
Búho-Pixel). Hasta completarla, lo nuevo se escribe en Tailwind y lo migrado no vuelve a CSS.

## Tailwind-first
- Todo con utilidades. CSS plano solo si Tailwind no permite el efecto, con
  `/* CSS fallback: <motivo> */` y lo más acotado posible.
- Tokens de marca en `@theme` (en `src/style.css`), nunca valores mágicos:

| Token | Valor | Uso |
|---|---|---|
| `--color-darkest` | `#0E0C09` | fondo base |
| `--color-dark` | `#1E1A15` | superficies |
| `--color-mid` | `#15120E` | superficies alternas |
| `--color-b-deep` | `#2A2520` | bordes profundos |
| `--color-b-dark` | `#3A3530` | bordes |
| `--color-faint` | `#5A5550` | texto muy tenue |
| `--color-muted` | `#7A7570` | texto secundario |
| `--color-accent` | `#C17F4A` | cobre: CTAs, acentos |
| `--color-warm` | `#C4A882` | detalles cálidos |
| `--color-text` | `#F0EDE8` | texto principal |
| `--font-mono` | `'JetBrains Mono', monospace` | tipografía única |

- Breakpoint principal: **768px** (`md:`), mobile-first.
- Si un valor no existe como token, se añade al `@theme` (consultando a Búho-Pixel), no se hardcodea.

## Estructura
- `components/ui/` presentacionales y reutilizables (props in, events out). Prefijo `App*` para
  primitivas (`AppButton`).
- `components/layout/` y `components/sections/` (prefijo `The*` para instancias únicas).
- `views/` por ruta cuando exista router (landing, catálogo, `/admin/*`).
- `composables/use*.js`: lógica reactiva. `services/*.js`: único sitio que habla con Supabase.
- `data/content.js`: textos. Componentes no contienen copy.

## Panel admin
- Rutas bajo `/admin`, protegidas por guard que comprueba sesión + rol admin (la autorización
  real la impone RLS; el guard es solo UX).
- Formularios con validación en cliente + errores de servidor mostrados de forma legible.

## Calidad
- Archivos < ~300 líneas; componentes con una sola responsabilidad.
- a11y: HTML semántico, foco visible, `alt` descriptivo, contraste AA, navegación por teclado
  (menú móvil, lightbox: `Esc`, trap de foco).
- Rendimiento: `loading="lazy"` y `width/height` en imágenes, nada de librerías pesadas para
  efectos triviales, `defineAsyncComponent`/lazy routes para el admin.
- Verificar con `npm run build` antes de entregar.
