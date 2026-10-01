# Convenciones (transversal)

## Naming
- Componentes Vue: `PascalCase.vue`. `App*` primitivas ui, `The*` instancias únicas de layout/secciones.
- Composables: `useAlgo.js` (camelCase). Servicios: `algoService.js` o `algo.js` en `services/`.
- Constantes: `UPPER_SNAKE_CASE` (como en `content.js`). Variables/funciones: `camelCase`.
- BD: `snake_case`, tablas en plural, funciones verbales (`is_admin`).

## Imports
- Orden: vue/librerías → `@/lib` y `@/services` → composables → componentes → datos/estilos.
- Sin imports sin uso. Rutas relativas cortas o alias `@/` (si se configura en Vite).

## Commits
- **Conventional Commits** en español o inglés, consistente: `feat:`, `fix:`, `refactor:`,
  `style:`, `docs:`, `chore:`, `perf:`. Ámbito opcional: `feat(catalogo): …`.
- Atómicos por bloque lógico (BD, UI, copy por separado si es posible). Sin secretos.

## PRs
- Rama por feature desde `main` (`feat/…`, `fix/…`).
- Descripción: qué, por qué, agentes involucrados, verificación (build, veredictos de Leona-Lia /
  Búho-Pixel), capturas si hay cambios visuales.
