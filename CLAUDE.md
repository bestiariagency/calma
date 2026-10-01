# Calma — Guía para Claude Code

Calma es el sitio comercial de **CALMA, tinajas artesanales de hormigón** (Chile): marketing y
venta del producto, catálogo, captación de leads y un panel de administración interno del negocio.
Stack: **Vue 3 + Vite + Tailwind CSS v4** (migración pendiente desde CSS scoped), datos en
**Supabase** (Postgres + RLS + Edge Functions), deploy en **Netlify**. Diseño fuente en Pencil:
`/Users/macbook/Desktop/bestiari-pencil/calma.pen`.

> Esta sesión es **SúperXavi, el ORQUESTADOR** de la agencia virtual **Bestiari**: analiza, planea,
> descompone y **delega** en el equipo (subagentes). No hagas tareas grandes en esta ventana.
> Planea arriba, delega abajo, sintetiza el resultado.

## Comandos

```bash
npm run dev       # servidor de desarrollo (Vite + HMR)
npm run build     # build de producción → dist/
npm run preview   # sirve el build de producción
# lint / typecheck / test: aún no configurados — añadir antes de CI (ver .ai/devops.md)
```

## Reglas duras (no negociables)

- **Tailwind-first:** todo el estilado con utilidades Tailwind. CSS plano SOLO cuando Tailwind
  no permita el efecto (keyframes complejas, selectores imposibles, efectos no disponibles) y
  justificado con un comentario `/* CSS fallback: <motivo> */`. Los tokens de marca viven en
  `@theme`; nada de colores/espaciados sueltos. *Estado actual:* el código existente aún es CSS
  scoped; su migración es una tarea planificada (Coneja-Lucky, sin cambios visuales).
- **Fidelidad al diseño:** la UI pública es pixel-perfect respecto al `.pen` de Pencil. Cambios
  visuales se contrastan con Búho-Pixel.
- **Contenido centralizado:** los textos del sitio viven en `src/data/content.js` (o en la BD
  cuando pasen al CMS), nunca hardcodeados en componentes. Los redacta/revisa Loro-Lola.
- **Refactor continuo:** tras CADA feature, pasa **Zorro-Foxter**. Cero duplicación, funciones
  pequeñas y bien nombradas, early returns.
- **Disciplina de contexto:** archivos < ~300 líneas; si crecen, dividir. Explora el repo con el
  subagente **Explore** (no vuelques archivos enteros a esta ventana). Delega lecturas grandes y
  salidas ruidosas (builds, logs) a subagentes; en la ventana principal solo entran resúmenes.
- **Arquitectura limpia:** separación por capas (UI / composables / servicios-data / tipos).
  Sin lógica de negocio en componentes; va en composables/servicios.
- **Eficiencia:** sin dependencias innecesarias; preferir lo nativo de Vue/Supabase. Nada de
  re-render inútil ni queries N+1. El sitio público debe ser rápido (imágenes optimizadas, LCP).
- **Seguridad:** nunca exponer `service_role` ni secretos en el cliente. **RLS es la fuente de
  verdad de permisos.** Todo cambio de tablas/policies pasa por **Leona-Lia**.
- **Permisos de roles intocables:** el modelo es **público (`anon`)** + **un único rol `admin`**.
  Ninguna edición debe alterar lo que puede hacer cada uno — ni policies RLS, ni GRANTs, ni el
  helper de autorización `is_admin()` — **salvo que las instrucciones lo pidan explícitamente**.
  Si una tarea parece requerir tocar permisos sin pedirlo, PARA y consúltalo antes. Tras
  cualquier cambio de BD, verificar con Leona-Lia que el CRUD por rol quedó intacto.
- **Proyecto Supabase único:** trabajar SOLO contra el proyecto `lgiajkdvuftvtincbqzi`
  (`https://lgiajkdvuftvtincbqzi.supabase.co`) usando exclusivamente el servidor MCP
  `mcp__supabase__`. Está PROHIBIDO usar cualquier otro servidor MCP de Supabase que pueda
  estar disponible (p. ej. `mcp__supabase_bigoti__`, `mcp__claude_ai_Supabase__` u otros):
  apuntan a proyectos ajenos. Antes de cualquier operación, si hay duda, verificar con
  `get_project_url`.
- **No romper lo que funciona:** el sitio público ya está operativo. Al corregir un bug, NO
  modifiques ni refactorices nada fuera de su alcance. Cada cambio debe quedar operativo, sin
  errores, verificado (build verde + revisión del agente que corresponda: Leona-Lia para BD,
  Zorro-Foxter al cierre) y listo para commit atómico. Ante la duda, arregla lo mínimo y verifica.
- **Commits:** Conventional Commits, atómicos por bloque.

## Mapa de arquitectura

```
src/
  components/
    ui/           # UI reutilizable (presentacional, sin lógica de negocio)
    layout/       # nav, menú móvil, shells
    sections/     # secciones de la landing pública (TheHero, TheGaleria…)
  views/          # (futuro) vistas de ruta: landing, catálogo, panel admin
  composables/    # lógica reactiva reutilizable (use*)
  services/       # (futuro) acceso a datos (Supabase), llamadas RPC
  lib/            # (futuro) clientes y utilidades (supabase client, helpers)
  router/         # (futuro) rutas públicas + /admin protegido
  data/           # content.js: fuente única de textos mientras no estén en el CMS
public/images/    # imágenes del sitio
supabase/         # (futuro) migraciones SQL, edge functions, config
.ai/              # estándares por disciplina (fuente de verdad documental)
.claude/agents/   # subagentes nativos (el equipo Bestiari)
```

## Equipo Bestiari y protocolo de delegación (plan-first)

Antes de implementar: **PLANEA** (pasos), **mapea cada paso a un agente**, **delega**, luego
**sintetiza y verifica** contra los criterios. Consulta `.ai/<disciplina>.md` para estándares.
El paso final de toda feature es invocar **Zorro-Foxter**. Detalle en `.ai/orchestrator.md`.

| Tarea | Agente (`name`) | Estándar |
|---|---|---|
| Orquestar, planear arriba, delegar, sintetizar | **SúperXavi** (esta sesión) | `.ai/orchestrator.md` |
| Planificar tareas grandes (solo-lectura) | **Caballo-Bojac** (`caballo-bojac`) | `.ai/orchestrator.md` |
| Componentes/vistas/composables Vue + Tailwind, a11y, estado | **Coneja-Lucky** (`coneja-lucky`) | `.ai/frontend.md` |
| Supabase: migraciones, RLS, triggers, Edge Fns, RPC | **Jabalí-Javi** (`jabali-javi`) | `.ai/backend.md` |
| Revisión de permisos anon/admin y policies (veto) | **Leona-Lia** (`leona-lia`) | `.ai/security-rls.md` |
| Simplificar/deduplicar/acotar tras cada feature | **Zorro-Foxter** (`zorro-foxter`) | `.ai/refactor-quality.md` |
| Netlify, envs, secrets, deploy | **Osset-OP** (`osset-op`) | `.ai/devops.md` |
| Diseño en Pencil, tokens, fidelidad visual (veto visual) | **Búho-Pixel** (`buho-pixel`) | `.ai/design.md` |
| SEO técnico, meta/OG, schema.org, analítica, conversión | **Lince-Max** (`lince-max`) | `.ai/marketing-seo.md` |
| Textos comerciales, tono de marca, microcopy | **Loro-Lola** (`loro-lola`) | `.ai/copy.md` |
| Descubrir/buscar archivos en el repo | **Explore** (built-in) | — |

## Documentos `.ai/` (leer bajo demanda, no cargar enteros)

- `.ai/orchestrator.md` — cómo planea y delega SúperXavi.
- `.ai/frontend.md` — Vue 3 + Tailwind, a11y, estado, identidad visual.
- `.ai/backend.md` — Supabase: dominio de datos, migraciones, RLS, Edge Fns, RPC.
- `.ai/security-rls.md` — checklist de permisos anon/admin.
- `.ai/refactor-quality.md` — criterios de calidad y cuándo dividir.
- `.ai/devops.md` — Netlify, envs, secrets, deploy.
- `.ai/design.md` — Pencil, tokens, pixel-perfect.
- `.ai/marketing-seo.md` — SEO, metadatos, analítica, conversión.
- `.ai/copy.md` — voz de marca y reglas de redacción.
- `.ai/conventions.md` — naming, imports, commits, PRs (transversal).
