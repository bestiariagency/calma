# Diseño — estándar (Búho-Pixel)

## Fuente de verdad
`/Users/macbook/Desktop/bestiari-pencil/calma.pen`. Los `.pen` están cifrados: solo herramientas
`mcp__pencil__*` (nunca Read/Grep). Imágenes de referencia en `/Users/macbook/Desktop/bestiari-pencil/`.

## Identidad CALMA
- Oscuro cálido (marrones casi negros), acento **cobre `#C17F4A`**, texto off-white `#F0EDE8`.
- Tipografía única **JetBrains Mono** (400/700/800/900), etiquetas en mayúsculas con tracking.
- Estética sobria, artesanal, material (hormigón, agua, naturaleza). Mucho aire, fotografía protagonista.
- Tokens: ver tabla en `.ai/frontend.md`; las variables del `.pen` y el `@theme` deben coincidir.

## Diseño de pantallas nuevas
- Reutilizar componentes y tokens existentes antes de crear nuevos.
- Diseñar desktop (1440) y móvil (390), breakpoint de implementación 768px.
- Panel admin: misma identidad pero priorizando legibilidad y densidad de datos (tablas, formularios, estados).
- Entregar specs: medidas, espaciados, tokens, estados (hover/focus/disabled/error) y responsive.

## Validación (veto visual)
Comparar diseño vs implementación por sección en desktop y móvil.
Veredicto: **APROBADO**, o **CAMBIOS** con lista (elemento · esperado · actual).
