# Especificación de diseño — Panel /administrador (Etapa 5)

Autor: Búho-Pixel. Implementa: Coneja-Lucky (Tailwind v4, `lucide-vue-next`). Alcance v1: oscuro único,
sin preview en vivo, listas de tamaño fijo, guardar = publicar, MFA opcional. Fuentes: Mono (títulos,
labels, datos) + Inter (cuerpo, formularios). Los campos salen de `src/data/contentSchema.js`.

Reglas: solo tokens de `@theme` (nada de hex ni px sueltos); escala de 4 px; cobre SOLO en acción
primaria, foco y elemento activo; sombras solo en overlays.

---

## 1. Tokens nuevos para `@theme`

Los tokens de marca existentes se mantienen (`darkest`, `mid`, `b-deep`, `b-dark`, `text`, `accent`).
El panel usa prefijo semántico para no tocar la landing. Añadir en `@theme` de `src/style.css`:

```css
/* Superficies (cálidas, de más oscuro a más elevado) */
--color-app-bg:        #0E0C09; /* = darkest: fondo de la página */
--color-surface-1:     #15120E; /* sidebar, header */
--color-surface-2:     #1B1712; /* cards, tabla */
--color-surface-3:     #221D17; /* inputs, hover de filas/ítems */
--color-surface-4:     #2A251E; /* popovers, toast, tooltip, dialog */
--color-overlay:       rgb(14 12 9 / 0.72); /* fondo de Dialog y drawer */

/* Bordes */
--color-line:          #2A2520; /* separadores y bordes de card (decorativo) */
--color-line-strong:   #3A3530; /* borde hover de card, divisores marcados */
--color-line-input:    #7C766F; /* borde de controles: 3:1 mínimo (WCAG 1.4.11) */

/* Texto */
--color-text-2:        #B8B1A8; /* secundario: ayudas, metadatos */
--color-text-3:        #948D84; /* terciario: placeholder, contadores */
--color-text-disabled: #6E6962; /* solo deshabilitado (exento de AA) */

/* Acento cobre (el existente --color-accent #C17F4A es la base) */
--color-accent-hover:  #CF8E58;
--color-accent-press:  #B26F3C;
--color-accent-soft:   #32261A; /* fondo de ítem activo / chip (14% sobre surface-2) */
--color-accent-line:   #5D4128; /* borde de elemento activo suave */
--color-accent-text:   #D4955F; /* cobre como TEXTO/enlace sobre superficies */
--color-on-accent:     #14100B; /* texto sobre botón cobre */

/* Estados: texto/icono, fondo soft, borde */
--color-success:       #6FCF97;  --color-success-soft: #252D22;  --color-success-line: #385741;
--color-warning:       #E5B454;  --color-warning-soft: #332A1A;  --color-warning-line: #624E29;
--color-danger:        #EF7B72;  --color-danger-soft:  #34231E;  --color-danger-line:  #653A34;
--color-info:          #7BB2E6;  --color-info-soft:    #272A2B;  --color-info-line:    #3D4D5C;
--color-danger-solid:  #B8433C;  /* fondo botón destructivo */
--color-danger-solid-hover: #A63A34;
--color-danger-solid-press: #92312C;

/* Foco */
--color-ring:          #C17F4A;  /* = accent */
--ring-width:          2px;
--ring-offset:         2px;      /* offset en color app-bg o la superficie contigua */

/* Radios */
--radius-sm: 6px;   /* badges, chips, tooltip */
--radius-md: 8px;   /* botones, inputs, items */
--radius-lg: 12px;  /* cards, dialog, toast */

/* Sombras (solo overlays) */
--shadow-popover: 0 8px 24px rgb(0 0 0 / 0.45), 0 0 0 1px var(--color-line);
--shadow-dialog:  0 24px 64px rgb(0 0 0 / 0.6), 0 0 0 1px var(--color-line);
--shadow-bar:     0 -8px 24px rgb(0 0 0 / 0.4); /* UnsavedBar */

/* Fuente */
--font-sans: 'Inter', system-ui, sans-serif;  /* --font-mono ya existe */

/* Layout */
--spacing-sidebar: 248px;   --spacing-sidebar-collapsed: 64px;
--spacing-header: 56px;     --spacing-content-max: 880px;  /* ancho del editor */
/* Tamaños de overlays y tarjetas (prohibido px sueltos fuera de @theme) */
--size-drawer: 288px;       /* drawer móvil de navegación */
--size-diff-drawer: 480px;  /* drawer derecho del diff (Historial) */
--size-dialog: 480px;       /* panel de Dialog */
--size-toast: 380px;        /* ancho de Toast */
--size-unsaved-bar: 640px;  /* UnsavedBar en desktop/tablet */
--size-login-card: 400px;   /* card de login */

/* Tracking (letter-spacing) con nombre; nada de tracking-[…] */
--tracking-title: -0.01em;  /* h1 → tracking-title */
--tracking-eyebrow: 0.12em; /* eyebrow, Badge, cabecera de tabla → tracking-eyebrow */
--tracking-code: 0.3em;     /* input de código MFA → tracking-code */

/* Motion del panel (no reutilizar los de la landing) */
--motion-fast: 120ms;  --motion-base: 160ms;  --motion-slow: 200ms;
--ease-panel: cubic-bezier(0.2, 0, 0, 1);
```

Inter: cargar solo pesos 400/500/600 (`@fontsource-variable/inter` o `<link>` con `display=swap`),
únicamente en la ruta del panel (no penalizar el LCP de la landing).

### 1.1 Contraste AA (ratios calculados, WCAG 2.x)

Texto normal ≥ 4.5; texto grande y UI/bordes de control ≥ 3.

| Par (texto sobre fondo) | Ratio | Uso | AA |
|---|---|---|---|
| text `#F0EDE8` / app-bg | 16.7 | cuerpo | OK |
| text / surface-2 | 15.3 | cards | OK |
| text / surface-3 | 14.3 | inputs | OK |
| text / surface-4 | 13.0 | toast, dialog | OK |
| text-2 `#B8B1A8` / surface-2 | 8.4 | ayuda | OK |
| text-2 / surface-3 | 7.9 | | OK |
| text-3 `#948D84` / surface-2 | 5.4 | contador, meta | OK |
| text-3 / surface-3 | 5.1 | placeholder | OK |
| text-3 / surface-4 | 4.6 | tooltip meta | OK |
| `muted #7A7570` / surface-2 | 3.9 | NO usar para texto | Falla |
| text-disabled `#6E6962` / surface-3 | ~3.0 | deshabilitado | Exento |
| on-accent `#14100B` / accent `#C17F4A` | 5.77 | botón primary | OK |
| on-accent / accent-hover `#CF8E58` | 6.91 | hover | OK |
| on-accent / accent-press `#B26F3C` | 4.72 | active | OK |
| accent-text `#D4955F` / surface-2 | 7.0 | enlaces | OK |
| accent-text / accent-soft `#32261A` | 5.8 | SidebarItem activo | OK |
| text / accent-soft | 12.6 | | OK |
| accent `#C17F4A` / surface-2 (anillo, UI) | 5.4 | foco, icono activo | OK (≥3) |
| ring / app-bg | 5.95 | foco | OK |
| line-input `#7C766F` / surface-3 | 3.72 | borde input | OK (≥3) |
| line-input / surface-2 | 3.97 | | OK |
| line `#2A2520` / surface-2 | 1.17 | separador decorativo | N/A (nunca único identificador de control) |
| success `#6FCF97` / success-soft | 7.5 · /surface-2 9.4 | | OK |
| warning `#E5B454` / warning-soft | 7.4 · /surface-2 9.3 | | OK |
| danger `#EF7B72` / danger-soft | 5.5 · /surface-2 6.6 | | OK |
| info `#7BB2E6` / info-soft | 6.4 · /surface-2 7.9 | | OK |
| text / danger-solid `#B8433C` | 4.6 | botón danger | OK |
| text / danger-solid-hover `#A63A34` | 5.5 | | OK |
| text / bordes de estado | n/a | los bordes son decorativos; el estado lo da icono+texto | OK |

Regla: texto de estado SIEMPRE junto a icono (no solo color). Texto de cuerpo nunca en `muted`.

---

## 2. Tipografía, espaciado y densidad

| Rol | Familia | Tamaño / line-height | Peso | Notas |
|---|---|---|---|---|
| Título de página (h1) | Mono | 20 / 28 (móvil 18 / 24) | 700 | `tracking-title` |
| Título de card / grupo (h2) | Mono | 14 / 20 | 700 | |
| Eyebrow / grupo del sidebar | Mono | 11 / 16 | 700 | MAYÚSCULAS, `tracking-eyebrow`, text-3 |
| Label de campo | Inter | 13 / 20 | 600 | text |
| Input / textarea / cuerpo | Inter | 14 / 20 (textarea 22) | 400 | móvil 16 px en inputs (evita zoom iOS) |
| Ayuda / error | Inter | 12 / 16 | 400 | text-2 / danger |
| Contador, peso, dimensiones, rutas, timestamps, atajos (⌘S) | Mono | 12 / 16 | 400 | tabular-nums |
| Botón | Inter | 14 / 20 | 600 | sm: 13 |
| Badge | Mono | 11 / 16 | 700 | MAYÚSCULAS |
| Tabla: cabecera | Mono | 11 / 16 | 700 | MAYÚSCULAS, text-3 |
| Tabla: celda | Inter 14 / Mono para fechas y IDs | | | |

Mono = identidad, estructura y datos técnicos. Inter = todo lo que se lee o escribe. Nunca Mono en
párrafos ni en el texto que el dueño escribe dentro de inputs.

Espaciado (múltiplos de 4; única excepción permitida: `gap-1.5` = 6 px en label→control y control→ayuda). Entre
campos 20, padding de card 20 (móvil 16), entre cards 16, padding de contenido 32 desktop / 24 tablet /
16 móvil. Densidad: control 40 px alto (desktop puntero fino), 44 px en puntero grueso (`pointer-coarse:`);
fila de tabla 48; ítem de sidebar 40 (44 en drawer).

---

## 3. Componentes

Convenciones comunes: radio `rounded-md` (8) en controles, `rounded-lg` (12) en cards/overlays; transición
`transition-colors duration-(--motion-fast) ease-(--ease-panel) motion-reduce:transition-none`; foco
`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring` (nunca `outline-none` sin
sustituto); alto de control `h-10 pointer-coarse:h-11`; iconos Lucide 16 (20 en icon-button táctil), `aria-hidden`.
Disabled: `disabled:cursor-not-allowed disabled:text-text-disabled`, sin hover. Loading: spinner Lucide `LoaderCircle`
`animate-spin motion-reduce:animate-none`, `aria-busy`, el ancho del botón no cambia, texto se mantiene.

### 3.1 Button

Base: `inline-flex items-center justify-center gap-2 px-4 font-sans text-sm font-semibold rounded-md`. sm: `h-8 px-3 text-[13px]` (solo desktop, no táctil).

| Variante | default | hover | active | disabled | Uso |
|---|---|---|---|---|---|
| primary | `bg-accent text-on-accent` | `bg-accent-hover` | `bg-accent-press` | `bg-surface-3 text-text-disabled` | Guardar; **1 visible por contexto** (vista o Dialog) |
| secondary | `bg-surface-3 text-text border border-line-input` | `bg-surface-4 border-line-strong` | `bg-surface-2` | borde `line`, texto disabled | Descartar, Ver sitio |
| ghost | `bg-transparent text-text-2` | `bg-surface-3 text-text` | `bg-surface-4` | texto disabled | Acciones terciarias, cancelar subida, Reintentar, limpiar búsqueda |
| danger | `bg-danger-solid text-text` | `bg-danger-solid-hover` | `bg-danger-solid-press` | como primary disabled | Solo en Dialog destructivo |
| icon | `size-10 pointer-coarse:size-11 p-0 text-text-2`, como ghost | idem ghost | idem ghost | idem | Requiere `aria-label` + Tooltip |

- Foco: anillo `ring` 2 px offset 2 (offset sobre `app-bg`/superficie contigua). Error: n/a (los errores van en Field/Toast).
- **Cuál es primary (Guardar):** mientras la UnsavedBar está visible (hay cambios), el primary es el "Guardar" de la barra y el "Guardar" del header pasa a `secondary` (mantiene ⌘S). Sin cambios no hay barra: el "Guardar" del header es `primary` en estado disabled. En móvil el header no tiene Guardar (solo la barra). No existe `ghost-danger`: las salidas con pérdida usan `secondary` (ver §3.13).
- Atajo en botón: `<kbd>` Mono 12 `text-on-accent/70` (⌘S), oculto en móvil.

### 3.2 Input y Textarea

Anatomía: `w-full rounded-md bg-surface-3 text-text border border-line-input px-3 font-sans placeholder:text-text-3`. Input `h-10 pointer-coarse:h-11 text-sm max-md:text-base`.

| Estado | Clases |
|---|---|
| default | `border-line-input` |
| hover | `hover:border-text-3` |
| focus-visible | `focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring` |
| disabled | `bg-surface-2 border-line text-text-disabled cursor-not-allowed` |
| error | `border-danger` + `aria-invalid="true"` + `aria-describedby` al error (el icono+texto está en Field) |
| readonly | `bg-surface-2 border-line`, texto `text-2` |
| loading (carga inicial) | reemplazar por Skeleton 3.14 con la misma altura |

Textarea: `min-h-24 py-2.5 text-sm leading-[22px] resize-none` con **autosize** (altura = scrollHeight, `max-h-80 overflow-y-auto`,
recalcular en `input`; sin handle de resize). Respeta saltos de línea (`whitespace-pre-wrap`; el dato guarda `\n`; ayuda
`LINE_BREAK_HELP` del schema cuando exista). Móvil: `text-base`. El contador no vive en el control sino en Field.

### 3.3 Field

Estructura vertical: `flex flex-col gap-1.5` → label, control, fila inferior (`flex justify-between gap-3 min-h-4`).

| Parte | Clases / regla |
|---|---|
| label | `font-sans text-[13px]/5 font-semibold text-text`, `<label for>` siempre visible (sin placeholder como label); obligatorio: sufijo "(obligatorio)" en `text-2`, no solo asterisco |
| help | `text-xs/4 text-text-2`, enlazada por `aria-describedby`, a la izquierda de la fila inferior |
| error | `text-xs/4 text-danger flex gap-1.5`, icono `CircleAlert` 14 + texto; `role="alert"` al aparecer; sustituye a help |
| contador | `font-mono text-xs/4 tabular-nums text-text-3 ml-auto`, formato `124 / 370` |
| contador warning | desde 90 % de `maxLength`: `text-warning` + icono `TriangleAlert` 12 |
| contador danger | > 100 %: `text-danger` + icono `CircleAlert`, mensaje "Superaste el límite en N caracteres"; el input NO trunca; Guardar sigue HABILITADO: al pulsarlo valida, enfoca el primer inválido y muestra toast "Revisa N campos" (§4.3) |

El contador anuncia por `aria-live="polite"` solo al cruzar 90 % y 100 % (no en cada tecla).

### 3.4 ImageField

Card `bg-surface-2 border border-line rounded-lg p-5 max-md:p-4 flex flex-col gap-4`. Contiene: Field label, preview, fila de metadatos, acciones, Field de `alt`.

| Parte | Medidas / clases |
|---|---|
| preview | contenedor con **aspect real de la imagen** (`style aspect-ratio` = ancho/alto naturales; fallback `aspect-video` si aún no se conocen), `max-h-80 w-full rounded-md bg-surface-3 border border-line overflow-hidden`, `<img class="size-full object-contain">`; `alt` real |
| meta | `font-mono text-xs text-text-3 tabular-nums`: `1920 × 1080 · 177 KB · WEBP`; recomendado en `text-2` bajo la fila |
| acciones | `Button secondary` "Reemplazar imagen" (icono `ImageUp`); abre `<input type=file accept="image/webp,image/avif,image/jpeg,image/png" class="sr-only">`; teclado: Enter/Espacio |
| dropzone (**solo sin imagen o durante un arrastre**; con imagen, el preview es el destino de soltar y no hay dropzone fija) | `border-2 border-dashed border-line-input rounded-md h-40 grid place-items-center text-text-2`; dragover: `border-accent bg-accent-soft text-accent-text`; también clic/teclado |
| progreso | barra `h-1 rounded-full bg-surface-4` + relleno `bg-accent`, `role="progressbar" aria-valuenow`, texto Mono "Subiendo 64 %"; preview a `opacity-60`; botones disabled; cancelar = ghost |
| éxito | tras subir: preview nueva + `Badge success` "Imagen lista" (vuelve a normal a los 3 s); el alt se conserva |
| error | `border-danger` en dropzone/card + Field error (icono + texto + `role="alert"`) |
| validación | tipo fuera de webp/avif/jpeg/png: "Formato no admitido. Usa WEBP, AVIF, JPEG o PNG."; > 5 MB: "Pesa 7,2 MB. El máximo es 5 MB."; se valida antes de subir, el archivo previo se mantiene |
| alt | Field + Input, **obligatorio**: vacío bloquea Guardar y muestra "Describe la imagen para accesibilidad"; contador con `altMaxLength`; `altLabel`/`altHelp` del schema |

Estados: hover de acción = Button; focus-visible en dropzone `outline-ring`; disabled (guardando) `opacity-60 pointer-events-none`; loading de carga: Skeleton con el mismo aspect.

### 3.5 FixedListItem

Card numerada de lista de tamaño fijo. **Sin handle de drag, sin "Añadir", sin "Eliminar"**; ninguna acción de estructura.

| Parte | Medidas / clases |
|---|---|
| contenedor | `bg-surface-2 border border-line rounded-lg p-5 max-md:p-4 flex gap-4`; hover `hover:border-line-strong`; `focus-within:border-accent-line` |
| número | `size-8 shrink-0 grid place-items-center rounded-md bg-surface-3 font-mono text-xs font-bold text-text-2 tabular-nums` ("01"); no activo → sin cobre |
| contenido | `flex-1 min-w-0 flex flex-col gap-5` con Fields del schema |
| header opcional | título Mono 14 "Paso 2"; en móvil el número pasa arriba (`max-sm:flex-col`) |
| semántica | `<ol>` con `<li>`; `aria-label="Elemento 2 de 4"`; el grupo lleva `h2` + ayuda "Puedes cambiar el contenido, no el número de elementos." |
| estados | error: `border-danger-line` si algún campo interno inválido + icono `CircleAlert` en el número; loading: Skeleton de la misma altura; disabled: `opacity-60` |

### 3.6 Toggle

> **No se usa en v1** (MFA se activa con Button + Dialog). Se mantiene la definición como referencia; no implementar.

Switch `role="switch" aria-checked`, `<button>` con label visible a la derecha (`text-sm text-text`).

| Parte | Clases |
|---|---|
| pista | `h-6 w-11 rounded-full border border-line-input bg-surface-3`; on: `bg-accent border-accent` |
| pulgar | `size-4 m-0.5 rounded-full bg-text-2 transition-transform duration-(--motion-fast)`; on: `translate-x-5 bg-on-accent` |
| área táctil | contenedor `min-h-10 pointer-coarse:min-h-11` con label clicable |
| hover | pista `border-text-3` (off) / `bg-accent-hover` (on) |
| focus-visible | anillo ring 2/2 en la pista |
| disabled | `opacity-50 cursor-not-allowed`; loading: spinner 14 en lugar del pulgar |

### 3.7 Badge

`inline-flex items-center gap-1 h-5 px-2 rounded-sm font-mono text-[11px]/4 font-bold uppercase tracking-eyebrow border`. Siempre icono 12 + texto (nunca solo color).

| Variante | Clases | Icono |
|---|---|---|
| neutral | `bg-surface-3 text-text-2 border-line` | `Circle` |
| accent (activo) | `bg-accent-soft text-accent-text border-accent-line` | `Dot` |
| success | `bg-success-soft text-success border-success-line` | `CircleCheck` |
| warning | `bg-warning-soft text-warning border-warning-line` | `TriangleAlert` |
| danger | `bg-danger-soft text-danger border-danger-line` | `CircleAlert` |
| info | `bg-info-soft text-info border-info-line` | `Info` |

No interactivo (sin hover/foco); si es clicable, usar Button ghost sm.

### 3.8 SidebarItem

`<a>`/`<RouterLink>` `relative flex items-center gap-3 h-10 max-md:h-11 px-3 rounded-md font-sans text-sm font-semibold text-text-2`; icono Lucide 16 `shrink-0`; ancho 248 (colapsado 64: solo icono centrado + Tooltip a la derecha, retardo 400 ms como todo Tooltip; foco inmediato).

| Estado | Clases |
|---|---|
| hover | `hover:bg-surface-3 hover:text-text` |
| active (ruta actual) | `bg-accent-soft text-accent-text` + barra `before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-accent` (requiere `relative` en el ítem); `aria-current="page"` |
| focus-visible | anillo ring 2 px, `outline-offset-[-2px]` (no se recorta por el overflow del sidebar) |
| disabled / próximamente | `text-text-disabled`, `aria-disabled`, sin hover, Badge neutral "Pronto" |
| badge numérico | `ml-auto` Badge warning (p. ej. secciones con errores) |

Grupos: eyebrow Mono 11 `text-text-3` con `px-3 pt-4 pb-1`, `<nav aria-label>` + `<ul>`; colapso con `transition-[width] duration-(--motion-slow)`. Drawer móvil: `w-[min(var(--size-drawer),85vw)] bg-surface-1`, overlay `bg-overlay`, focus trap, Esc cierra, items 44 px.

### 3.9 Breadcrumb

`<nav aria-label="Migas de pan"><ol class="flex items-center gap-2 min-w-0 font-mono text-xs/4">` (12 px en todos los viewports; 13 no existe en la escala). Separador `ChevronRight` 14 `text-text-3` (`aria-hidden`).

| Parte | Clases |
|---|---|
| ancestro (enlace) | `text-text-2 hover:text-text hover:underline underline-offset-4 rounded-sm`, focus ring 2 px; área `py-2` para táctil |
| actual | `text-text font-bold truncate`, `aria-current="page"` |
| móvil | solo "‹ Padre" (`ChevronLeft`) + actual truncado; intermedios ocultos (`max-md:hidden`) |

### 3.10 SaveStatus

Texto en header: `inline-flex items-center gap-1.5 font-mono text-xs tabular-nums`; contenedor `role="status" aria-live="polite"`. Siempre icono + texto.

| Estado | Icono / texto | Color |
|---|---|---|
| guardado | `CircleCheck` "Guardado hace 2 min" (relativo, actualiza cada 60 s) | `text-text-3` (icono `text-success`) |
| sin guardar | `Circle` con `fill-current` (punto relleno) "Cambios sin guardar" | `text-warning` |
| guardando | `LoaderCircle animate-spin` "Guardando…" | `text-text-2` |
| error | `CircleAlert` "No se pudo guardar" + botón ghost "Reintentar" | `text-danger` |
| sin conexión | `WifiOff` "Sin conexión" | `text-warning` |

Móvil (< md): el header muestra solo el icono + texto `sr-only`; es la **única** región `aria-live` (la UnsavedBar no anuncia, ver §3.11). Cambio de estado sin animación brusca (fade 120 ms).

### 3.11 UnsavedBar

Barra flotante: `fixed inset-x-0 bottom-4 mx-auto w-[min(var(--size-unsaved-bar),calc(100%-2rem))] z-40 flex items-center gap-3 px-4 h-14 rounded-lg bg-surface-4 border border-line-strong shadow-bar`. Móvil: `bottom-0 w-full rounded-b-none pb-[env(safe-area-inset-bottom)]`, botones `h-11`.

- Contenido: `Circle` relleno (`fill-current`) warning + "Tienes cambios sin guardar" (Inter 14, `text-text`; sin `aria-live`) · `ml-auto` Button secondary "Descartar" (icono `Undo2` 16) + **primary "Guardar"** (⌘S; es el primary de la vista mientras la barra existe, el Guardar del header baja a secondary, ver §3.1). Ancho 640 en desktop y tablet (`--size-unsaved-bar`); sin Kbd dentro de la barra (⌘S vive en el botón del header). El texto nunca se trunca (hasta 2 líneas). < md: mensaje arriba y botones abajo a ancho completo. Mientras exista, los toasts de escritorio se desplazan por encima de ella; el error de guardado NO genera toast (SaveStatus + Alert inline).
- Entrada: `translate-y-4 opacity-0` → 0 en 160 ms; `motion-reduce` solo fade. `role="region" aria-label="Cambios sin guardar"`, no roba foco.
- Guardando: botones disabled, Guardar en loading. Error: texto danger + "Reintentar" en lugar de Guardar.
- Descartar abre Dialog de confirmación si hay más de 1 campo modificado.
- Contenido principal con `pb-24` para que la barra no tape campos.

### 3.12 Toast

Contenedor `fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-[min(var(--size-toast),calc(100vw-2rem))]` (móvil: arriba `top-3 inset-x-4`, para no chocar con UnsavedBar). Toast: `flex items-start gap-3 p-3 pr-2 rounded-lg bg-surface-4 border shadow-popover`, borde por tipo (`success-line`, `danger-line`, `warning-line`, `info-line`).

| Parte | Regla |
|---|---|
| icono | 20, color de estado (success `CircleCheck`, error `CircleAlert`, warning `TriangleAlert`, info `Info`) |
| texto | título Inter 14/600 `text-text` + detalle 13 `text-text-2`; máx. 2 líneas |
| cerrar | icon button `size-8` (`size-11` área táctil), `aria-label="Cerrar"` |
| acción | opcional, enlace `text-accent-text` ("Deshacer", "Reintentar") |
| duración | éxito/info 4 s; warning 6 s; error persistente hasta cerrar; pausa en hover/foco |
| a11y | `role="status"` (éxito/info) o `role="alert"` (error); no mover foco; máx. 3 visibles |
| motion | entra `translate-y-2 opacity-0` → 0 en 160 ms; salida 120 ms; `motion-reduce` solo fade |

### 3.13 Dialog

Usar `<dialog>` nativo o `role="dialog" aria-modal="true" aria-labelledby aria-describedby`. Overlay `fixed inset-0 bg-overlay` (clic fuera y Esc cierran, salvo operación en curso).

| Parte | Clases |
|---|---|
| panel | `w-[min(var(--size-dialog),calc(100vw-2rem))] rounded-lg bg-surface-4 shadow-dialog p-6 max-md:p-5 flex flex-col gap-4`; móvil: bottom-sheet opcional `max-md:fixed max-md:bottom-0 max-md:w-full max-md:rounded-b-none` |
| título | Mono 16/24 700 `text-text` con icono de contexto 20 (warning/danger) |
| cuerpo | Inter 14/20 `text-text-2` (sin prosa larga) |
| footer | `flex justify-end gap-2 max-sm:flex-col-reverse`; cancelar = **secondary** siempre (foco inicial en acciones destructivas), confirmar = primary o danger; "Salir sin guardar": Seguir editando = primary, Salir = secondary |
| a11y | focus trap, foco inicial en el botón seguro, devuelve el foco al disparador, `inert` en el fondo, bloquear scroll |
| loading | confirmar en loading, ambos botones disabled, sin cierre por Esc/overlay |
| motion | fade + `scale-[.98]` → 100 en 160 ms; `motion-reduce` solo fade |

Casos: "¿Descartar los cambios?" (danger), "¿Salir sin guardar?" (warning, Seguir editando / Salir), "Sesión por expirar" (info).

### 3.14 Skeleton

`bg-surface-3 rounded-md` con **shimmer 1,2 s linear infinito** (gradiente `surface-3 → surface-4 → surface-3` animando solo `background-position`; `/* CSS fallback: keyframes de shimmer */` en `@theme`/utilidad `animate-shimmer`), `motion-reduce:animate-none` (queda estático). **Misma geometría** que el componente real: label `h-4 w-32`, input `h-10`, textarea `h-24`, preview con el aspect real, card con el mismo padding. Contenedor `aria-busy="true"` y `sr-only` "Cargando…"; no se anuncia cada bloque. Si carga > 10 s, mostrar error con "Reintentar". Transición skeleton → contenido: fade 120 ms.

### 3.15 Tooltip

`role="tooltip"` enlazado por `aria-describedby`; `px-2 py-1 rounded-sm bg-surface-4 text-text font-sans text-xs/4 shadow-popover max-w-60 z-50`; atajo en `font-mono text-text-3`. Se abre con hover (retraso 400 ms, también en el sidebar colapsado) **y** foco de teclado (inmediato); Esc cierra; el puntero puede entrar al tooltip (WCAG 1.4.13). Offset 6 px, flecha opcional. No en táctil: ahí el `aria-label`/texto visible lo cubre. Nunca contenido esencial ni interactivo dentro. Motion: fade 120 ms.

### 3.16 Table (historial)

Contenedor `bg-surface-2 border border-line rounded-lg overflow-hidden`, con `overflow-x-auto` interno (nunca scroll horizontal de página); `<table class="w-full">` con `<caption class="sr-only">`.

| Parte | Clases |
|---|---|
| cabecera | `sticky top-(--spacing-header) bg-surface-1 h-10 px-4 text-left font-mono text-[11px]/4 font-bold uppercase tracking-eyebrow text-text-3 border-b border-line`; orden: botón con `aria-sort` + icono `ArrowUpDown` 14 |
| fila | `h-12 px-4 border-b border-line last:border-0 text-sm text-text`; hover `hover:bg-surface-3`; seleccionada/activa `bg-accent-soft` |
| celdas | fecha/ID `font-mono text-xs tabular-nums text-text-2`; usuario Inter; sección Badge neutral; cambio truncado `max-w-80 truncate` con Tooltip |
| acciones | icon button `⋯` (`Ellipsis`) por fila, menú `bg-surface-4 shadow-popover`, items 40/44 px |
| búsqueda | Input con icono `Search` a la izquierda, `w-full sm:w-72`; `type="search"`; limpiar con icon button |
| paginación | pie `h-14 px-4 border-t border-line flex justify-between`: "1–25 de 134" Mono 12 + botones icon `ChevronLeft/Right` (disabled en extremos), `aria-label` "Página anterior/siguiente" |
| vacío | centrado `py-12`: icono 32 `text-text-3`, "Aún no hay cambios" 14/600, ayuda `text-text-2`; búsqueda sin resultados: "Sin resultados" + "Limpiar búsqueda" ghost |
| loading | 5 filas Skeleton `h-12`; error: fila-aviso danger con "Reintentar" |
| móvil (< 768) | las filas pasan a cards apiladas (`max-md:block`): fecha + Badge arriba, descripción, acciones; sin columnas ocultas que pierdan información |

### 3.17 Alert (inline)

Aviso persistente en el flujo (no flotante; para efímeros usar Toast 3.12). `flex items-start gap-3 p-3 rounded-lg border font-sans text-sm`; icono 20 `shrink-0 mt-0.5` + cuerpo `flex-1 min-w-0` (título opc. `font-semibold text-text`, detalle `text-text-2`) + acción opc. a la derecha (Button ghost sm / enlace `text-accent-text`; en móvil debajo, `max-sm:flex-col`).

| Variante | Clases | Icono | role |
|---|---|---|---|
| info | `bg-info-soft border-info-line` icono `text-info` | `Info` | `status` |
| success | `bg-success-soft border-success-line` icono `text-success` | `CircleCheck` | `status` |
| warning | `bg-warning-soft border-warning-line` icono `text-warning` | `TriangleAlert` | `status` (rate limit: `alert`) |
| danger | `bg-danger-soft border-danger-line` icono `text-danger` | `CircleAlert` | `alert` |

- El texto SIEMPRE en `text-text`/`text-2` (contraste ≥ 13), solo el icono y el borde llevan color de estado. Nunca solo color.
- Login: danger sobre el form, `tabindex="-1"` y foco programático al aparecer (mensaje genérico). Error de carga: ancho de contenido, acción "Reintentar" (Button secondary sm).
- Descartable opcional: icon button `size-8` (`size-11` táctil) `X`, `aria-label="Cerrar"`; danger de carga y login no se descartan.
- Estados: la acción hereda 3.1; loading de la acción = Spinner 3.18. Entrada fade 120 ms (`motion-reduce` igual, sin transform).

### 3.18 Spinner

Icono `LoaderCircle` `animate-spin motion-reduce:animate-none`, `aria-hidden`.

| Tamaño | Clase | Uso |
|---|---|---|
| 14 | `size-3.5` | Toggle, SaveStatus |
| 16 | `size-4` | botón (`text-current`), login "Entrando…" |
| 24 | `size-6 text-text-2` | arranque de sesión (único spinner a pantalla completa, centrado en `app-bg`) |

- Siempre acompañado de texto (visible o `sr-only` "Cargando…") dentro de región `role="status"`/`aria-busy`; solo, no se anuncia.
- `motion-reduce`: sin giro; mostrar el texto "Cargando…" visible o `animate-pulse` de opacidad (§5.1).
- Contenido de bloques usa Skeleton 3.14, no Spinner.

### 3.19 Card

Contenedor de grupo de campos (editor, Datos de la empresa). Base compartida con ImageField (3.4) y FixedListItem (3.5).

| Parte | Clases |
|---|---|
| contenedor | `bg-surface-2 border border-line rounded-lg p-5 max-md:p-4 flex flex-col gap-5`; hover `hover:border-line-strong`; `focus-within:border-accent-line` |
| encabezado (opc.) | `<h2>` Mono 14/20 700 `text-text` + ayuda `text-xs/4 text-text-2` debajo (gap 4); separado del cuerpo por gap 20 |
| cuerpo | Fields con `gap-5`; en Datos de la empresa `grid grid-cols-2 gap-5 max-md:grid-cols-1` (campos largos `col-span-2`) |
| `<section>` | `aria-labelledby` al h2; sin h2 = sin landmark |

- Sin sombra, sin cobre (salvo `focus-within`). Estados: error `border-danger-line` si hay campo inválido; loading = Skeleton con mismo padding; disabled (guardando) `opacity-60 pointer-events-none`.
- Cards no clicables ni anidables más de 1 nivel (la lista fija = Card contenedor + FixedListItem).

### 3.20 Drawer

Panel lateral modal. Dos usos: sidebar móvil (izquierda) y diff del historial (derecha, ver 3.31).

| Parte | Clases |
|---|---|
| overlay | `fixed inset-0 z-40 bg-overlay` (clic cierra) |
| panel nav | `fixed inset-y-0 left-0 z-50 w-(--size-drawer) max-w-[85vw] bg-surface-1 border-r border-line shadow-dialog flex flex-col` |
| panel diff | `right-0 w-[480px] bg-surface-2 border-l border-line`; móvil `max-md:w-full max-md:border-0` |
| header | `h-(--spacing-header) px-4 flex items-center justify-between border-b border-line` + icon button `X` |
| cuerpo | `flex-1 overflow-y-auto overscroll-contain`, pie fijo con `pb-[env(safe-area-inset-bottom)]` |

- a11y: `role="dialog" aria-modal="true" aria-label`, focus trap, foco inicial al botón cerrar (nav: al ítem activo), Esc y clic fuera cierran, `inert` fuera, bloquea scroll del body, devuelve foco al disparador (hamburguesa). Cierra al navegar (nav) y al pasar a ≥ 768.
- Motion: entra `-translate-x-4 opacity-0` a 0 en 200 ms (derecho `translate-x-4`); salida 120 ms; `motion-reduce` solo fade.
- Disparador: icon button `Menu` 44 con `aria-expanded` + `aria-controls`.

### 3.21 EmptyState

`flex flex-col items-center text-center gap-2 py-12 px-6 max-w-sm mx-auto`.

| Parte | Clases |
|---|---|
| icono | Lucide 32 `text-text-3` (`History`, `SearchX`, `FileQuestion`, `ShieldAlert`), `aria-hidden` |
| título | Mono 14/20 700 `text-text` |
| ayuda | Inter 14 `text-text-2`, 1–2 líneas |
| acción | opc. Button secondary ("Limpiar filtros") o primary "Volver al inicio del panel" (404/sin permiso); mt-2 |

- Sin ilustraciones ni cobre. Dentro de Table/Card va sin borde propio; a página completa centra en el área de contenido (`min-h-[50vh]`). Búsqueda sin resultados: `role="status"`. Error ≠ vacío: errores usan Alert 3.17.

### 3.22 OfflineBanner

Alert warning especializado, sticky bajo el header: `sticky top-(--spacing-header) z-30 flex items-center gap-2 min-h-10 px-8 max-md:px-4 bg-warning-soft border-b border-warning-line text-sm text-text`; icono `WifiOff` 16 `text-warning`; texto "Sin conexión. Tus cambios se guardarán cuando vuelva".

- `role="status"`; no roba foco; entra con fade 120 ms; al volver: se retira y Toast success "Conexión recuperada". "Guardar" y UnsavedBar-Guardar `disabled`; SaveStatus pasa a `WifiOff`. Móvil: texto en 2 líneas permitido (`py-2`), sin truncar.

### 3.23 Menu / Popover (menú ⋯ de fila)

Disparador: icon button 3.1 con `Ellipsis` 20, `aria-label="Acciones de la fila {fecha}"`, `aria-haspopup="menu" aria-expanded`, `size-10 pointer-coarse:size-11`.

| Parte | Clases |
|---|---|
| panel | `min-w-48 p-1 rounded-lg bg-surface-4 shadow-popover z-50`; ancla bottom-end, offset 4; invierte arriba si no cabe |
| ítem | `role="menuitem" flex items-center gap-2 h-10 pointer-coarse:h-11 px-3 rounded-md text-sm text-text`; icono 16 `text-text-2`; hover/foco `bg-surface-3`; destructivo `text-danger`; disabled `text-text-disabled aria-disabled` |
| separador | `my-1 h-px bg-line` |

- Teclado: Enter/Espacio/↓ abre y enfoca el 1.º ítem; ↑↓ navega (circular), Home/End, tecla de letra salta, Esc cierra y devuelve foco al disparador, Tab cierra. Clic fuera cierra. `role="menu"` + roving tabindex.
- Motion: 120 ms fade + `scale-98`; `motion-reduce` solo fade. Móvil: mismos ítems en 44 px; si > 5 ítems, bottom-sheet (patrón Dialog).
- Popover genérico (no menú): `bg-surface-4 shadow-popover rounded-lg p-3`, `role="dialog"`, sin focus trap salvo que tenga formularios.

### 3.24 Select (filtro de sección del historial)

`<select>` nativo estilizado (mejor a11y y táctil; sin listbox propio). `appearance-none` + icono `ChevronDown` 16 `text-text-2` absoluto `right-3 pointer-events-none`.

- Clases: como Input 3.2 (`h-10 pointer-coarse:h-11 w-full rounded-md bg-surface-3 border border-line-input pl-3 pr-9 text-sm max-md:text-base`); mismos estados hover/focus/disabled/error. `sm:w-56` en la barra de filtros; ancho completo en móvil.
- Label visible o `aria-label="Filtrar por sección"`; primera opción "Todas las secciones"; opciones desde el schema. `option` hereda `bg-surface-3 text-text`. Cambia = filtra al instante, `aria-live` "N resultados" en el pie de tabla.

### 3.25 Checkbox

`<input type=checkbox class="peer sr-only">` + caja visual `size-5 rounded-sm border border-line-input bg-surface-3`; checked `bg-accent border-accent` + `Check` 14 `text-on-accent`; indeterminate `Minus`. Hover `border-text-3`; focus-visible anillo ring 2/2 sobre la caja; disabled `opacity-50`; error `border-danger`.

- Label a la derecha `text-sm text-text` (gap 8), toda la fila clicable, `min-h-10 pointer-coarse:min-h-11` (área 44, no el glifo). Ayuda bajo el label con `aria-describedby`.
- Uso v1: ninguno confirmado en layouts; reservado para "Mantener sesión" (login) y selección de filas si se añade. No implementar hasta que un layout lo cite.

### 3.26 Avatar

Iniciales del usuario (pie del sidebar). `size-8 shrink-0 grid place-items-center rounded-full bg-surface-3 border border-line font-mono text-xs font-bold text-text-2 uppercase`; 2 letras (nombre) o la 1.ª del correo.

- Decorativo (`aria-hidden`); el correo al lado en `text-sm text-text-2 truncate` es el nombre accesible. Sin cobre, sin imagen. Colapsada (64): solo avatar con Tooltip del correo. Fila de perfil `h-14 px-3`, enlace a Perfil: hover `bg-surface-3`, foco 3.1.

### 3.27 SkipLink

Primer elemento del shell y del login: `sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:px-4 focus:h-10 focus:inline-flex focus:items-center focus:rounded-md focus:bg-accent focus:text-on-accent focus:font-semibold focus:text-sm`, foco 2/2 con `outline-offset-2` visible sobre app-bg. Texto "Saltar al contenido"; `href="#contenido"` apunta a `<main id="contenido" tabindex="-1">`. Sin transición.

### 3.28 Logo

| Contexto | Archivo | Medida |
|---|---|---|
| Login (sobre h1) | `logo-blanco-calma.svg` | `h-8` ancho auto (24 de alto de caja en 4.1; mantener proporción), centrado |
| Sidebar expandida | `logo-blanco-calma.svg` | `h-6`, en fila `h-(--spacing-header) px-4` |
| Sidebar colapsada / tablet | `iso-calma.svg` | `size-8` centrado en 64 |

- `<img alt="CALMA">` en login (único); en sidebar dentro de `<a href="/administrador" aria-label="CALMA, inicio del panel">` con `alt=""`. Sin tinte ni filtros; sin animación al colapsar (cambio por fade 120 ms). Área clicable ≥ 44 de alto. Mantener margen de seguridad igual a la altura de la "C".

### 3.29 Kbd

`<kbd class="inline-flex items-center h-5 min-w-5 px-1.5 rounded-sm border border-line-strong bg-surface-3 font-mono text-xs/4 text-text-2 tabular-nums">`. Dentro de Button primary: sin caja, `text-on-accent/70` (3.1). Dentro de Tooltip: `text-text-3` sin borde. Símbolo por plataforma (`⌘S` / `Ctrl S`, separados por espacio fino); `aria-hidden` si el botón ya tiene `aria-keyshortcuts="Control+S Meta+S"`. Oculto en táctil (`pointer-coarse:hidden`) y < 768.

### 3.30 Dropzone

Es PARTE de ImageField (3.4), no un componente aparte; 3.4 ya define reposo/progreso/error. Solo se añade el estado drag-over: `border-accent bg-accent-soft text-accent-text` + icono `ImageUp` 24 y texto "Suelta para reemplazar"; `dragenter/leave` con contador para evitar parpadeo; `role="button" tabindex="0"` (Enter/Espacio abre selector); `aria-label="Reemplazar imagen: arrastra un archivo o pulsa"`; anuncio `aria-live` "Archivo recibido" al soltar. Táctil: el drop no aplica, queda el botón "Reemplazar imagen". Varios archivos: se usa el primero y avisa en Alert warning.

### 3.31 DiffView (historial)

Contenido del Drawer derecho (3.20). Lista de campos modificados, uno por bloque `flex flex-col gap-2 py-4 border-b border-line`: label `font-mono text-xs font-bold text-text-2` (nombre del campo del schema) + ruta Mono 12 `text-text-3`.

| Tipo | Anterior | Nuevo |
|---|---|---|
| texto | `bg-danger-soft border border-danger-line rounded-md p-3 text-sm text-text whitespace-pre-wrap break-words` + prefijo `Minus` 14 `text-danger` + `sr-only` "Antes" | igual con `bg-success-soft border-success-line`, `Plus` `text-success`, `sr-only` "Después" |
| imagen | miniatura `rounded-md border border-line aspect-video object-contain bg-surface-3` con `Minus`+"Antes" | ídem con `Plus`+"Después"; lado a lado en ≥ 480, apiladas en móvil; `alt` = alt del dato; si cambió solo el alt, diff de texto |

- Texto largo: bloque `max-h-48 overflow-y-auto`; resalte de palabras cambiadas opcional con `underline decoration-2` (nunca solo color). Campo vacío ⇄ valor: muestra "(vacío)" `text-text-3 italic`. Contador "N campos modificados" en el header del Drawer.
- Pie fijo: Button secondary "Restaurar esta versión" (abre Dialog 3.13) + ghost "Cerrar". Loading: Skeleton de 2 bloques por campo. Error: Alert danger con "Reintentar".

### Toggle (3.6): decisión

Sin uso en layouts v1 (MFA en Perfil se activa con "Configurar" → enrolar → "Desactivar" como Button + Dialog, acciones de seguridad no deben ser un switch inmediato). Recomendación: ELIMINAR 3.6 del spec y no implementarlo; recuperarlo solo si aparece un ajuste booleano de efecto inmediato y reversible. Si se elimina, quitar la mención de Toggle/spinner 14 en 3.6 (Spinner 14 sigue vigente por SaveStatus).

## 4. Layouts

Breakpoints del panel: desktop `lg:` ≥ 1024 (sidebar fija), tablet `md:` 768–1023 (sidebar colapsada 64), móvil `max-md:` < 768 (drawer). Usar siempre `lg:`/`md:` explícitos; el token `desktop` (75rem) es solo de la landing y NO se usa en el panel.
Se verifica en 1440 / 768 / 390. Contenido: padding 32 / 24 / 16; ancho máx. editor `--spacing-content-max` 880, centrado.

### 4.1 Login (`/administrador/login`)

| Elemento | 1440 | 768 | 390 |
|---|---|---|---|
| Fondo | app-bg, card centrada vertical y horizontal | igual | sin card visual: contenido a ancho completo, padding 16, alineado arriba (pt 48) |
| Card | surface-2, borde line, radius-lg, ancho `--size-login-card` (400), padding 32 | 400 / 32 | 100 % / 0 (sin borde ni fondo) |
| Cabecera | logotipo CALMA (Mono 700) 24 + h1 "Acceso al panel" (20) + ayuda text-2 | igual | h1 18 |
| Campos | Correo (autocomplete=username), Contraseña (autocomplete=current-password, botón ojo `Eye/EyeOff` icon button `size-10 pointer-coarse:size-11`, pegado al borde derecho y de la misma altura que el input (`h-10 pointer-coarse:h-11`), input con `pr-10 pointer-coarse:pr-11`) | igual | input 16 px, alto 44 |
| Acción | Botón primary "Entrar" ancho completo, alto 40 (44 táctil); enlace "¿Olvidaste tu contraseña?" accent-text 13, debajo | igual | igual |
| Error | Alert danger sobre el formulario (icono `CircleAlert` + texto + `role="alert"`); mensaje genérico, nunca revela si el correo existe; foco al alert | igual | igual |
| Cargando | botón disabled + Spinner 16 + "Entrando…", `aria-busy` | igual | igual |

- Restablecer: misma card. Paso 1 "Recuperar contraseña" (correo + "Enviar enlace"); éxito = Alert success `CircleCheck` "Si el correo existe, recibirás un enlace" (siempre el mismo texto). Paso 2 (llegada por enlace): "Nueva contraseña" + "Repetir contraseña", ayuda de reglas visible (no solo al fallar), "Guardar contraseña"; enlace caducado = Alert danger + "Pedir otro enlace".
- MFA TOTP (opcional, D7): tras credenciales, si el usuario tiene factor, paso "Código de verificación": 6 dígitos, un solo input `inputmode=numeric autocomplete=one-time-code` Mono 20, `tracking-code`, centrado, auto-envío al 6.º dígito; "Verificar" + enlace "Volver". Enrolar (en Perfil, no en login): QR 160 en surface-3 con borde, clave manual Mono con botón Copiar, input de confirmación.
- Rate limit / bloqueo: Alert warning `TriangleAlert` con segundos restantes (mono) y botón disabled.

### 4.2 Shell

| Pieza | 1440 | 768 | 390 |
|---|---|---|---|
| Sidebar | fija, 248, surface-1, borde derecho line; expandible/colapsable a 64 (persistir en localStorage) | colapsada 64 (iconos + Tooltip, retardo 400 ms) | oculta; Drawer `--size-drawer` (288) desde la izquierda con overlay |
| Estructura sidebar | logo (alto 56, alinea con header) · grupo "LANDING" (eyebrow) con 1 ítem por sección · grupo "EMPRESA" (Datos de la empresa, Historial) · abajo: perfil (avatar 32 + correo truncado) y "Cerrar sesión" | igual, solo iconos | igual que desktop, ítems de 44 |
| Ítem | alto 40, px 12, radius-md, icono 16 + texto 14/600 (`font-semibold`); hover surface-3; activo accent-soft + texto accent-text + icono accent + barra izq. 2 px accent; `aria-current="page"` | 40×40 centrado | 44 |
| Header | sticky top, alto 56, surface-1, borde inferior line, px 32 | px 24 | px 16 |
| Header izq. | botón colapsar (`PanelLeft`, 40) / hamburguesa (`Menu`, 44, solo < 768) + Breadcrumb "Landing › Portada" (Mono 12, último segmento text; `aria-label="Migas de pan"`) | igual | solo título de la sección actual (Mono 14, truncado), sin breadcrumb |
| Header der. | SaveStatus · "Ver sitio" (Button ghost + `ExternalLink`, `target=_blank rel=noopener`) · "Guardar" (primary disabled sin cambios; `secondary` mientras la UnsavedBar está visible, ver §3.1; kbd `⌘S` Mono 12) | SaveStatus solo icono + texto corto; "Guardar" sin kbd | SaveStatus solo icono + `sr-only` (única región `aria-live`); "Ver sitio" solo icono 44; sin "Guardar" en el header (vive en la UnsavedBar) |
| SaveStatus | `aria-live="polite"`: Guardado hace 2 min (`CircleCheck`, text-3, icono success) · Guardando… (`LoaderCircle`) · Cambios sin guardar (`Circle` relleno, warning) · Error al guardar (`CircleAlert` danger, clic = reintentar) | | |
| UnsavedBar | flotante inferior centrada, ancho `--size-unsaved-bar` (640), surface-4, radius-lg, shadow-bar, "Cambios sin guardar" + Descartar (secondary, `Undo2`) + Guardar (primary); aparece solo con cambios | ancho 640 | pegada abajo a ancho completo, safe-area, botones 44; sin `aria-live` | pegada abajo a ancho completo, safe-area, botones 44 |

Windows: ⌘S en macOS, Ctrl+S en el resto; el kbd muestra el que corresponda.

### 4.3 Editor de sección (`/administrador/seccion/:id`)

- Cabecera de página: h1 = nombre del schema (p. ej. "Portada") + ayuda de una línea text-2 + enlace "Ver en el sitio" (anclas de la landing). Margen inferior 24.
- Un Card por campo simple o por grupo: padding 20 (16 móvil), gap entre cards 16, radius-lg, borde line, hover borde line-strong. Dentro: label, control, ayuda, contador (derecha, Mono 12; warning ≥ 90 %, danger y `CircleAlert` al exceder; `aria-describedby`).
- ImageField: según §3.4: preview con el aspect real de la imagen (`max-h-80`, 100 % de ancho en móvil) + metadatos Mono (peso, W×H) + botón "Reemplazar imagen" (secondary, `ImageUp`); la dropzone dashed solo aparece sin imagen o durante un arrastre; progreso en barra `h-1` accent; después el campo "Texto alternativo" obligatorio (error si vacío al guardar).
- Listas fijas: Card contenedor con título del campo y subcards numeradas (badge Mono "01", "02"…), sin handle, sin eliminar, sin "Añadir". Desktop: subcards en 1 columna, o 2 columnas si el ítem tiene un único campo corto (menú, pie). Móvil: 1 columna.
- Validación: al blur y al guardar; error bajo el campo (`CircleAlert` + texto 12, `aria-invalid`, `aria-describedby`); al guardar con errores, foco al primer inválido y toast danger "Revisa N campos".
- Orden de campos = orden del schema; sin paginar. Un h2 solo si hay ≥ 2 grupos.

### 4.4 Datos de la empresa

Misma plantilla del editor. Un Card por grupo (h2 Mono 14) con grid de 2 columnas en 1440 y 768 (gap 20), 1 columna en 390; campos largos (`textarea`, URLs, dirección) ocupan 2 columnas.

| Grupo | Campos (schema) |
|---|---|
| Identidad | name, tagline |
| Contacto | email, phone |
| WhatsApp | e164, whatsapp_message (+ vista del enlace `wa.me/…` en Mono, solo lectura) |
| Ubicación | address, city, region, maps_url (botón `ExternalLink` "Probar enlace") |
| Horario | opening_hours |
| Redes | social.instagram / facebook / tiktok / youtube (icono de red a la izquierda del label; vacío permitido = no se muestra en el sitio) |

Iconos de campo por tipo: `email` `Mail`, `phone` `Phone`, `e164` `MessageCircle`, `url` `Link`. Validación de formato al blur (email, E.164, URL https).

### 4.5 Historial

- Tabla (desktop): columnas Fecha (Mono), Sección, Autor, Resumen del cambio, acciones; cabecera sticky 40, filas 48, hover surface-3; buscador + filtro de sección arriba; paginación abajo (25 por página, botones icon `ChevronLeft/Right` 40, "1–25 de N" Mono).
- Tablet: oculta "Autor". Móvil: filas como cards apiladas (fecha Mono, sección badge, resumen 2 líneas), acción en menú ⋯ de 44.
- Clic en fila o "Ver cambios" abre panel de diff: Drawer derecho `--size-diff-drawer` (480; desktop/tablet), pantalla completa en móvil. Diff por campo: label, valor anterior sobre danger-soft (con `Minus`) y nuevo sobre success-soft (con `Plus`), texto Inter 14; imágenes lado a lado (anterior/nueva). Nunca solo color: prefijo icono + sr-only "Antes"/"Después".
- Restaurar: botón secondary "Restaurar esta versión" → Dialog de confirmación ("Se publicará de inmediato y quedará registrado en el historial"; Cancelar / Restaurar primary). Éxito: toast success y vuelta al editor.

### 4.6 Estados transversales

| Estado | Diseño |
|---|---|
| Cargando | Skeleton con la geometría exacta de cards/filas (surface-3, shimmer 1,2 s, ver §3.14; estático con reduced-motion); `aria-busy="true"` en la región; no spinner a pantalla completa salvo arranque de sesión |
| Vacío (historial sin cambios, búsqueda sin resultados) | EmptyState centrado: icono 32 text-3 (`History` / `SearchX`), título Mono 14, ayuda text-2, acción secundaria ("Limpiar filtros") |
| Error de carga | Alert danger a ancho de contenido (`CircleAlert`, texto, botón "Reintentar"), el resto del shell sigue usable |
| Error de guardado | SaveStatus danger + toast danger persistente con "Reintentar"; los cambios locales NO se pierden |
| Sesión expirada | Dialog modal no descartable (sin Esc ni clic fuera): `LogOut` "Tu sesión expiró", "Inicia sesión de nuevo"; el botón lleva a login conservando la ruta de retorno; los cambios sin guardar se mantienen en memoria/localStorage y se avisa si se recuperan |
| Offline | Banner sticky bajo el header, warning, `WifiOff` "Sin conexión. Tus cambios se guardarán cuando vuelva"; "Guardar" disabled; `role="status"`; desaparece con toast success "Conexión recuperada" |
| Conflicto (otra pestaña guardó antes) | Dialog "Esta sección cambió" con Ver cambios / Sobrescribir (danger) / Recargar |
| 404 / sin permiso | EmptyState con `FileQuestion` / `ShieldAlert` + "Volver al inicio del panel" |

---

## 5. Microinteracciones y accesibilidad

### 5.1 Movimiento

| Interacción | Duración | Easing | Propiedades |
|---|---|---|---|
| Hover/active de botón, ítem, fila | `--motion-fast` 120 | `--ease-panel` | background-color, border-color, color |
| Foco (anillo) | 0 (inmediato) | — | sin transición, nunca retrasar |
| Collapse sidebar | `--motion-slow` 200 | ease-panel | width; contenido con opacity 120 |
| Drawer / Dialog / Popover entrada | 200 / 160 / 120 | ease-panel | opacity + translateX(-16)/scale(.98)/scale(.98); salida 120 |
| Toast | 160 entrada, 120 salida | ease-panel | translateY(8) + opacity; auto-cierra éxito/info 4 s, warning 6 s, error persistente (§3.12) |
| UnsavedBar | 160 | ease-panel | translateY(16) + opacity |
| Contador / barra de progreso | 120 / 160 | linear | color / width |
| Skeleton shimmer | 1200 loop | linear | solo background-position |

- Solo animar `opacity`, `transform`, `color`, `background-color`, `border-color`. Nada de layout (width solo en sidebar).
- `prefers-reduced-motion: reduce` (`motion-reduce:`): sin transform ni shimmer; solo fundidos de opacity ≤ 120 ms o cambio instantáneo; spinners pasan a texto "Cargando…" visible o pulso de opacity.
- Botón primary: `active:` escala 1 (sin rebote); feedback = color. Sin animaciones decorativas.

### 5.2 Foco, teclado y ARIA

| Tema | Regla |
|---|---|
| Anillo de foco | `focus-visible:` 2 px `--color-ring` + offset 2 px, en TODO elemento interactivo; nunca `outline-none` sin sustituto; en inputs el anillo reemplaza el borde line-input |
| Skip link | "Saltar al contenido" primer elemento del shell, visible al foco |
| Targets | ≥ 44×44 en táctil (`pointer-coarse:`): botones, ítems, iconos-botón, checkboxes (área, no el glifo); en puntero fino mín. 32 con ≥ 8 de separación |
| ⌘S / Ctrl+S | `preventDefault`, guarda; sin cambios = no-op con toast info "No hay cambios"; funciona con foco dentro de inputs |
| Esc | cierra Dialog/Drawer/Popover/Tooltip y devuelve foco al disparador; en Dialog con cambios sin guardar pide confirmación; NO cierra el Dialog de sesión expirada |
| Tab / Shift+Tab | orden visual = DOM; sidebar → header → contenido; sin tabindex > 0 |
| Atajos | `⌘\` colapsa sidebar (opcional); mostrar kbd solo donde exista |
| Focus trap | Dialog, Drawer móvil y diff-drawer: foco inicial al primer control útil (en confirmaciones destructivas, a "Cancelar"), trap Tab, `inert` en el resto, `aria-modal="true"`, restaurar foco al cerrar |
| Aria-live | SaveStatus `polite`; toasts `role="status"` (error: `role="alert"`); Alert de login `role="alert"`; contador solo anuncia al cruzar 90 % y 100 % (no por tecla); offline `role="status"` |
| Formularios | label visible `for`/`id`; requeridos con "(obligatorio)" en texto, no solo `*`; errores `aria-invalid` + `aria-describedby` (ayuda + error); `autocomplete` correcto |
| Navegación | `<nav aria-label>`, ítem activo `aria-current="page"`, tabla con `<caption class="sr-only">` y `scope`, botón icono con `aria-label`; tooltip del sidebar también como `aria-label` |
| Color | estado nunca solo por color (icono + texto); enlaces con subrayado o icono, no solo color |
| Zoom | usable a 200 % y reflow a 320 px de ancho sin scroll horizontal; inputs 16 px en móvil |
| Aviso al salir | `beforeunload` + guard de ruta con Dialog "Salir sin guardar" (Seguir editando primary / Salir secondary) |

---

## 6. Iconografía

`lucide-vue-next`, import nominal (tree-shaking). `stroke-width` 2 (1.75 en 20+), `aria-hidden="true"` salvo botón solo icono (entonces `aria-label`). Color por herencia (`currentColor`).

| Icono | Uso | Tamaño |
|---|---|---|
| `LayoutDashboard` | Inicio del panel | 16 |
| `Layers` / `FileText` | Grupo y secciones de la landing (usar `FileText` por ítem) | 16 |
| `Building2` | Datos de la empresa | 16 |
| `History` | Historial (ítem y EmptyState) | 16 / 32 |
| `PanelLeft` | Colapsar/expandir sidebar | 20 |
| `Menu` / `X` | Abrir/cerrar drawer móvil; cerrar Dialog/Drawer/Toast | 20 / 16 |
| `ChevronRight` | Separador de breadcrumb | 14 |
| `ChevronDown` / `ChevronUp` | Selects, acordeones, orden de tabla | 16 |
| `ExternalLink` | "Ver sitio", "Probar enlace" | 16 |
| `LogOut` | Cerrar sesión, sesión expirada | 16 / 32 |
| `User` | Avatar sin foto, Perfil | 16 |
| `ShieldCheck` | MFA activo / enrolar | 16 |
| `Save` | Guardar (solo botón compacto en móvil) | 16 |
| `Check` | Checkbox (no SaveStatus) | 14 |
| `CircleCheck` | Alert/toast éxito | 16 |
| `CircleAlert` | Error de campo, Alert/toast error | 16 (campo 14) |
| `TriangleAlert` | Warning (bloqueo, contador ≥ 90 %) | 16 |
| `Info` | Alert/toast info, ayuda extendida | 16 |
| `Circle` (`fill-current` = punto relleno) | Sin guardar (SaveStatus, UnsavedBar); Badge neutral (12) | 14 / 12 |
| `Dot` | Badge accent (activo) | 12 |
| `LoaderCircle` (spin) | Spinner en botones y guardando (`Loader`/`Loader2` no usar) | 16 |
| `ArrowUpDown` | Orden de columna de tabla | 14 |
| `ChevronLeft` / `ChevronRight` | Migas móvil "‹ Padre" (14) · paginación (16); `ChevronRight` también separador | 14 / 16 |
| `Eye` / `EyeOff` | Mostrar/ocultar contraseña | 20 |
| `Mail` · `Phone` · `MessageCircle` · `Link` | Campos email · teléfono · WhatsApp · URL | 16 |
| `Instagram` · `Facebook` · `Youtube` | Redes (TikTok: `Music2` como sustituto, lucide no trae marca) | 16 |
| `MapPin` / `Clock` | Grupos Ubicación / Horario | 16 |
| `ImagePlus` / `ImageUp` | Dropzone / "Reemplazar imagen" | 24 / 16 |
| `Image` | Placeholder sin preview | 24 |
| `Trash2` | No usar en listas (D2); solo "Quitar imagen" si se permite | 16 |
| `Copy` | Copiar clave MFA | 16 |
| `Undo2` | Descartar (UnsavedBar) / Restaurar versión | 16 |
| `Plus` / `Minus` | Diff: añadido / quitado | 14 |
| `Search` / `SearchX` | Buscador / sin resultados | 16 / 32 |
| `Ellipsis` | Menú ⋯ de fila | 16 (target 44 en táctil) |
| `WifiOff` | Banner offline | 16 |
| `FileQuestion` / `ShieldAlert` | 404 / sin permiso | 32 |
| `KeyRound` | Restablecer contraseña | 16 |

Usar los nombres actuales de lucide (`Ellipsis`, `LoaderCircle`, `CircleCheck`, `CircleAlert`, `TriangleAlert`); los alias antiguos (`MoreHorizontal`, `Loader2`, `CheckCircle`, `AlertCircle`) están deprecados.

Nota: las marcas (Instagram, Facebook, Youtube) están deprecadas en lucide recientes; si no existen en la versión instalada, usar `Link` con el nombre en texto. Ningún icono sustituye a texto salvo en botones con `aria-label` + Tooltip.

---

## 7. Checklist de revisión (Etapas 7–9)

Búho-Pixel revisa a 1440 / 768 / 390. Veredicto APROBADO solo si todo lo crítico/alto pasa.

**Tokens y estilo**
- [ ] Sin hex, px ni sombras sueltos: todo sale de `@theme` (§1); escala de 4 px.
- [ ] Cobre solo en primary, foco y activo; sombras solo en overlays; radios 6/8/12.
- [ ] Mono para títulos/labels/datos; Inter para lo que se lee o escribe; Inter solo cargada en el panel.

**Contraste y foco**
- [ ] Texto ≥ 4.5:1, UI/bordes de control ≥ 3:1 (§1.1); nada de `muted` en texto.
- [ ] Anillo de foco visible en todo control, también sobre surface-3/4 y en tema oscuro.
- [ ] Estados con icono + texto, no solo color.

**Estados por componente** (hover, focus, active, disabled, loading, error, éxito, vacío)
- [ ] Button, Input, Textarea, ImageField, SidebarItem, Dialog, Toast, tabla: los 8 estados presentes.
- [ ] Skeleton con la geometría del contenido final (sin salto de layout).
- [ ] Contador: neutral → warning 90 % → danger al exceder, `maxLength` del schema aplicado.

**Responsive**
- [ ] 1440: sidebar 248, header 56, contenido ≤ 880 centrado.
- [ ] 768: sidebar 64 con tooltips, grid 2 col → conforme §4.4.
- [ ] 390: drawer, sin scroll horizontal, inputs 16 px, targets ≥ 44, UnsavedBar a ancho completo con safe-area.
- [ ] Reflow a 200 % de zoom y 320 px.

**Flujos**
- [ ] Login: error genérico, MFA opcional, reset con mensaje constante, foco gestionado.
- [ ] ⌘S/Ctrl+S guarda; Esc cierra; aviso al salir con cambios; guard de ruta.
- [ ] Listas fijas: sin añadir/eliminar/reordenar (D2). Hrefs y ordinales no editables (schema).
- [ ] Guardar publica (D6): copy lo deja claro; error de guardado conserva cambios.
- [ ] Sesión expirada, offline, conflicto y error de carga implementados (§4.6).

**Accesibilidad**
- [ ] Teclado completo sin trampas; focus trap y retorno de foco en overlays; skip link.
- [ ] `aria-live`, `aria-invalid`, `aria-describedby`, `aria-current`, labels visibles.
- [ ] `prefers-reduced-motion` respetado (shimmer, transforms, spinner).
- [ ] Lighthouse a11y ≥ 95 en login, editor y Datos de la empresa; axe sin críticos.

**Severidad:** crítica = bloquea uso o falla AA/teclado; alta = estado faltante o desviación de medidas; media = token suelto/inconsistencia; baja = pulido. Formato de hallazgo: elemento, viewport, esperado, actual, severidad.

---

## Decisiones resueltas

- Logotipo en login y sidebar: se usan los SVG existentes en `public/images/logos/`:
  `logo-blanco-calma.svg` (login y sidebar expandida) e `iso-calma.svg` (sidebar colapsada y favicon).

---

## Cambios de tokens tras revisión

Coneja: trasladar a `@theme` (todos nuevos salvo el cambio de shadow):

| Token | Valor |
|---|---|
| `--size-drawer` | 288px |
| `--size-diff-drawer` | 480px |
| `--size-dialog` | 480px |
| `--size-toast` | 380px |
| `--size-unsaved-bar` | 640px |
| `--size-login-card` | 400px |
| `--tracking-title` | -0.01em |
| `--tracking-eyebrow` | 0.12em |
| `--tracking-code` | 0.3em |
| `--shadow-popover` (cambiado) | `0 8px 24px rgb(0 0 0 / 0.45), 0 0 0 1px var(--color-line)` |
| `--shadow-dialog` (cambiado) | `0 24px 64px rgb(0 0 0 / 0.6), 0 0 0 1px var(--color-line)` |
| `animate-shimmer` (keyframes, CSS fallback) | 1.2s linear infinite, solo `background-position`, `surface-3 → surface-4 → surface-3` |

Uso: `tracking-title`, `tracking-eyebrow`, `tracking-code`; `w-[min(var(--size-drawer),85vw)]`, etc. Retirar `tracking-wider` y px sueltos (320/380/480/288).
