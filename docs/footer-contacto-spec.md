# Footer: bloque de contacto (D17)

Alcance: `src/components/sections/TheFooter.vue`. Solo tokens de la landing (`@theme`). El crédito
"Sitio desarrollado por Bestiari · www.bestiari.es" NO se toca ni se mueve de su línea.

## Regla de render
- Cada pieza solo existe si tiene dato (`address`/`city`/`region`, `maps_url`, `opening_hours`, cada `social.*`).
- Sin ningún dato, no se renderiza ni el contenedor ni su `gap`: el footer queda idéntico al actual.
- Hay bloque si existe al menos una pieza. Usar `v-if` sobre el contenedor (computed `hasContact`).

## Posición
Nuevo hijo del wrapper `flex-col gap-8`, ENTRE la fila logo+nav y la fila copyright/crédito.
- Contenedor: `flex flex-col gap-6 border-t border-b-deep pt-8 md:flex-row md:items-start md:justify-between`.
- Desktop (>= md, 768 px): izquierda columna de texto (dirección + horario, `flex gap-12`, dos
  columnas con `max-w-[320px]` cada una); derecha fila de iconos de redes alineada a la derecha
  (`md:justify-end`, `items-start`).
- Tablet 768: igual que desktop; si no cabe, las columnas de texto hacen `flex-wrap gap-x-10 gap-y-6`.
- Móvil: apilado en este orden: dirección, horario, redes. Redes alineadas a la izquierda.
- Reveal: `data-reveal="text-soft"` como las otras filas.

## Jerarquía y tipografía (JetBrains Mono, tamaños del footer)
- Etiqueta de bloque ("Dirección", "Horario"): `text-[11px] uppercase tracking-[0.12em] text-muted`.
  (Los textos viven en `content.js`: `footer.labels`; los redacta Loro-Lola.)
- Valor (dirección/horario): `text-[12px] leading-[1.7] text-text`.
- Horario con saltos de línea: `whitespace-pre-line` (no usar `<br>` ni v-html).
- Dirección: `address, city, region` unidos con ", " omitiendo vacíos. Con `maps_url`, toda la
  dirección es un enlace (ver estados); sin él, texto plano.
- Separación etiqueta-valor: `gap-1.5` (6 px). Gap entre columnas: 48 px. Alturas de línea múltiplos de 4.

## Iconos de redes
- SVG inline monocromos, `fill="currentColor"`, `viewBox="0 0 24 24"`, render a `size-[18px]`
  (`aria-hidden="true"`, `focusable="false"`). NO lucide en la landing.
- Fuente: Simple Icons (CC0), trazados oficiales simplificados de instagram, facebook, tiktok, youtube.
  Guardarlos en un único `src/components/ui/SocialIcon.vue` (prop `network`, mapa de paths); sin
  dependencia nueva, solo copiar los `d`.
- Cada icono es un `<a>` con área táctil `size-11` (44 px) centrada sobre el icono de 18 px
  (`inline-flex items-center justify-center`); gap entre enlaces `gap-1` (compensa el área).
  Para alinear el borde izquierdo en móvil: `-ml-3` al contenedor de iconos; en ≥ md, `md:ml-0 md:-mr-3` para que
  el glifo del último icono quede exactamente en el borde derecho del nav (aprobado en la revisión de la Etapa 9).
- Orden fijo: instagram, facebook, tiktok, youtube. Solo los que tengan URL.

## Colores y estados
- Reposo: iconos y enlaces `text-faint`/`text-muted` (iconos `text-muted`).
- Hover: `hover:text-text`, `transition-[color] duration-200 ease-[ease]` (igual que el nav del footer).
  El enlace de dirección ademas `underline underline-offset-3` en hover.
- Focus-visible: `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent rounded-sm`.
- Active: `active:text-accent`. El cobre solo en foco/active (el acento es acción).
- `motion-reduce:transition-none`.
- Contraste (sobre `darkest`): `text-faint` ~2.6:1 y `text-muted` ~4:1 no llegan a AA en texto de 11-12 px.
  Por tanto: valor (dirección/horario) en `text-text`; etiquetas en `text-muted` (no `faint`, ajustar la
  línea de Tipografía); iconos `text-muted` (UI 3:1 cumple). El copyright/crédito existentes no se tocan.

## Accesibilidad
- Contenedor: `<div role="group" aria-label="Contacto y redes">` solo con redes; redes en `<ul>` con `<li>`.
- Cada red: `<a :href target="_blank" rel="noopener noreferrer" aria-label="Instagram de CALMA">`
  (patrón "{Red} de {nombre}"; nombre desde `company.name`). Sin `title`.
- Enlace de dirección: `target="_blank" rel="noopener noreferrer"` y `aria-label="Ver {dirección} en Google Maps (se abre en otra pestaña)"`.
- Dirección en `<address>` (estilo `not-italic`). Etiquetas como `<h3>`/`<span>` no necesarias: usar `<dl>`
  (`dt` etiqueta, `dd` valor) para asociar.
- Validar en origen que `maps_url` y redes son `https://` (ya lo hace el panel).

## Campos parciales
- Solo dirección: una columna de texto, sin redes; en desktop alineada a la izquierda.
- Solo horario: igual. Solo redes: iconos alineados a la derecha en desktop (`md:ml-auto`), izquierda en móvil.
- Dirección sin `maps_url`: texto sin subrayado ni hover. `maps_url` sin dirección: no se muestra enlace.
- Solo ciudad/región: se muestra "Ciudad, Región" como dirección.
- La `border-t` del bloque aparece siempre que el bloque exista.

## Ejemplo (datos ficticios)
address "Camino Los Robles 123", city "Pucón", region "Araucanía", maps_url https://maps.google.com/?q=ejemplo,
opening_hours "Lun a Vie 9:00 a 18:00\nSáb 10:00 a 14:00", instagram/facebook/tiktok/youtube con https://...
Desktop: DIRECCIÓN / Camino Los Robles 123, Pucón, Araucanía | HORARIO / dos líneas | [ig][fb][tt][yt] a la derecha.
