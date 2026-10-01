# Plan — Panel de administración CALMA (`/administrador`)

> Documento vivo. **Se actualiza al cerrar cada etapa** (estado, fecha, verificación).
> Orquesta: SúperXavi · Elaborado con: Caballo-Bojac, Jabalí-Javi, Leona-Lia, Búho-Pixel, Osset-OP.
> Creado: 2026-10-01 · Decisiones del cliente incorporadas: 2026-10-01

## Estado general

**Estado del plan:** ✅ Aprobado en alcance · ⏸️ En espera de la orden de inicio del cliente.

| # | Etapa | Responsables | Estado | Cierre |
|---|---|---|---|---|
| 0 | Preparación del repo y calidad | Osset-OP | ⏳ Pendiente | — |
| 1 | Centralizar contenido + correcciones previas | Coneja-Lucky, Loro-Lola, Búho-Pixel | ⏳ Pendiente | — |
| 2 | Optimización de imágenes (LCP) | Lince-Max, Coneja-Lucky | ⏳ Pendiente | — |
| 3 | Backend Supabase: esquema, RLS, Storage, RPC | Jabalí-Javi, Leona-Lia (veto) | ⏳ Pendiente | — |
| 4 | Auth: usuario del dueño y configuración | Cliente, Jabalí-Javi, Leona-Lia | ⏳ Pendiente | — |
| 5 | Especificación de diseño del panel | Búho-Pixel + Coneja-Lucky | ⏳ Pendiente | — |
| 6 | Infra frontend: router, cliente Supabase, contenido dinámico | Coneja-Lucky, Osset-OP | ⏳ Pendiente | — |
| 7 | Panel: login, shell y kit de componentes | Coneja-Lucky, Búho-Pixel | ⏳ Pendiente | — |
| 8 | Panel: editores de secciones (textos y fotos) | Coneja-Lucky, Loro-Lola, Búho-Pixel | ⏳ Pendiente | — |
| 9 | Panel: Datos de la empresa | Coneja-Lucky, Loro-Lola, Búho-Pixel | ⏳ Pendiente | — |
| 10 | Panel: historial y restaurar | Coneja-Lucky, Jabalí-Javi | ⏳ Pendiente | — |
| 11 | QA final, refactor y deploy | Leona-Lia, Búho-Pixel, Lince-Max, Zorro-Foxter, Osset-OP | ⏳ Pendiente | — |

Leyenda: ⏳ Pendiente · 🔄 En curso · ✅ Completa · ⛔ Bloqueada

**Regla de avance:** las etapas se ejecutan **una a una**. Una etapa sólo se cierra con su
*Definición de hecho* cumplida, `npm run build` (o `npm run verify` desde la etapa 0) en verde y la
revisión del agente correspondiente (Leona-Lia en BD, Búho-Pixel en UI, Zorro-Foxter al cierre).
Al cerrar, se actualiza la tabla y el *Registro de cambios*. **Los commits los hace el cliente** al
terminar el frontend; cada etapa debe quedar estable y lista para commit.

---

## 1. Alcance

**Incluye (v1)**
- Ruta independiente `/administrador` con login (Supabase Auth, email + contraseña, sin registro público).
- Menú lateral izquierdo con las secciones de la landing (Nav/Menú, Hero, Qué es, Por qué hormigón,
  Proceso, Galería, CTA, Footer) y una sección especial **Datos de la empresa**.
- Panel derecho con **todos los textos y todas las fotos visibles** de la sección, editables,
  incluidos los textos alternativos (`alt`) de las imágenes.
- **Listas de tamaño fijo:** features (4), pasos (3), galería y enlaces se editan, pero **no se
  añaden, eliminan ni reordenan** ítems. Sólo se cambia su contenido (texto o foto).
- Datos de la empresa: nombre, email, teléfono, WhatsApp (número + mensaje predefinido), dirección,
  ciudad/región, enlace a mapa, horario y redes sociales.
- **Guardar = publicar al instante** (el sitio lee el contenido en runtime desde Supabase).
- Historial de versiones por sección y por datos de empresa, con "restaurar".

**Excluye (v1)**
- El crédito **"Sitio desarrollado por Bestiari · www.bestiari.es"**: queda fijo en `TheFooter.vue`,
  **no existe en BD ni en el esquema** (no hay forma técnica de editarlo desde el panel).
- Todo lo que está **comentado en el código** (p. ej. tag, títulos y subtítulos del Hero): es parte
  del código, no se incluye en el esquema ni en el panel.
- Anclas/`href` de navegación (son estructura; sólo se editan las etiquetas). Año del copyright (automático).
- Leads, catálogo, pedidos y usuarios o roles adicionales (el "mini CRM" es **sólo gestión de contenido**).
- Meta SEO de `index.html` (fase 2 con prerender, Lince-Max).
- Modo claro y vista previa en vivo dentro del editor (v2; en v1 hay botón "Ver sitio").

## 2. Diagnóstico del estado actual

- **Supabase** (`lgiajkdvuftvtincbqzi`): vacío. Sin tablas, funciones, policies, buckets ni usuarios.
  `is_admin()` no existe → el modelo anon/admin se crea desde cero (lo pide este encargo).
- **Riesgo de privilegios por defecto:** Supabase concede CRUD a `anon`/`authenticated` sobre toda
  tabla nueva en `public`. La primera migración **debe revocarlos** (condición de Leona-Lia).
- **Frontend:** sólo `vue`; sin `vue-router`, sin `@supabase/supabase-js`, sin `.env`, sin `netlify.toml`.
  `content.js` (86 líneas) se importa de forma estática en 9 componentes.
- **Contenido hardcodeado** fuera de `content.js`: rutas y `alt` de las imágenes de sección,
  disclaimer de Galería, tagline y contacto del menú móvil, mapa `anchors` del footer.
- **Bugs detectados:** el enlace de email del CTA apunta a WhatsApp (`TheCta.vue:28`); el menú móvil
  muestra `+34 600 000 000` en lugar del real `+56 9 2253 8166`.
- **XSS latente:** `TheCta.vue` usa `v-html` con `CTA.title`; con datos de BD sería XSS almacenado.
- **Imágenes:** 18 MB en total; 7 PNG de 0,9 a 3,4 MB; `hero-dia.png` (LCP) pesa 3,35 MB; sin
  WebP/AVIF, `width/height`, `fetchpriority` ni `loading="lazy"`.
- **Repo:** `.gitignore` no cubre `.env`; sin lint, test ni CI.

## 3. Arquitectura

### 3.1 Datos (Supabase): modelo híbrido

| Objeto | Propósito |
|---|---|
| `admins (user_id pk → auth.users)` | Quién es admin. Auditable y revocable al instante. |
| `is_admin()` | `stable security definer set search_path=''` → `exists(admins where user_id = auth.uid())`. |
| `site_settings` (fila única, `id boolean pk check(id)`) | Datos de la empresa con columnas tipadas y CHECKs (email, WhatsApp en E.164, URLs https). |
| `section_content (key pk, content jsonb, schema_version, updated_at, updated_by)` | Una fila por sección; `content` validado con `pg_jsonschema` por clave. Las listas son arrays con `minItems = maxItems` (tamaño fijo) e `id` estable por ítem. |
| `media (id, path, alt, width, height, bytes, mime, blurhash, created_*)` | Registro de imágenes; las secciones referencian `media_id`. |
| `content_revisions` | Historial append-only escrito por trigger (snapshot anterior, `changed_by` fijado por el servidor, poda a 30 por clave). |
| RPC `get_site_content()` | `security invoker`; **una sola llamada** devuelve `{settings, sections}` con imágenes resueltas `{url, alt, w, h, blurhash}`. |
| RPC `restore_revision(id)`, `list_orphan_media()`, `media_usage()` | Sólo admin. |
| Bucket `site-media` | Lectura pública por URL, 5 MB, MIME webp/avif/jpeg/png (**sin SVG**), escritura sólo admin, sin listado para anon. Paths `sections/<key>/<uuid>.webp`, inmutables, cache de 1 año. |

Sin estado borrador/publicado: cada guardado queda publicado y el historial permite deshacer.
Las filas de `section_content` se crean en el seed; nadie las inserta ni borra desde el cliente.

**Matriz de permisos (Leona-Lia)**

| Objeto | anon | authenticated (no admin) | admin |
|---|---|---|---|
| `site_settings` | S | = anon | S, U |
| `section_content` | S | = anon | S, U |
| `media` | S | = anon | S, I, U, D |
| `content_revisions` | — | — | S (I sólo por trigger) |
| `admins` | — | — | S (alta sólo por SQL) |
| `get_site_content` / `is_admin` | EXECUTE | EXECUTE | EXECUTE |
| RPC de admin | — | — | EXECUTE |
| Storage `site-media` | lectura por URL | = anon | I, U, D |

### 3.2 Frontend

```
src/lib/supabase.js                 # createClient con VITE_SUPABASE_URL + ANON KEY (nunca service_role)
src/services/contentService.js      # fetchSiteContent, saveSection, saveSettings, uploadImage, revisions
src/composables/useSiteContent.js   # seed = content.js → merge con BD → caché local (sin parpadeo)
src/composables/useAuth.js          # sesión, signIn, signOut, reset, isAdmin
src/router/index.js                 # '/' (eager) · '/administrador/**' (lazy, chunk aparte)
src/views/LandingView.vue           # composición actual de App.vue
src/views/admin/                    # Login, Restablecer, Layout, SectionEditor, CompanyEditor, History
src/components/admin/               # Field*, ImageField, FixedList, Sidebar, UnsavedBar, Toast, Dialog…
src/data/content.js                 # pasa a SEED/fallback
src/data/contentSchema.js           # secciones, campos, tipos, límites → genera el editor
```

- **Editor guiado por esquema:** `contentSchema.js` describe cada sección (campo, tipo, límite de
  caracteres, listas de tamaño fijo). El panel se genera a partir de él: sin formularios duplicados.
- **Rendimiento público:** la landing pinta al instante con el seed; supabase-js se carga con un
  import dinámico tras el primer paint; una única RPC; caché en `localStorage` con `updated_at`;
  imagen del hero precargada; `width/height` reales para CLS = 0. El panel nunca entra en el bundle de `/`.
- **Imágenes subidas:** se redimensionan en el cliente a WebP (lado mayor 2400 px, q≈0,82) con
  `width/height` y blurhash antes de subir (plan Free, sin transformaciones de Supabase).
- **Seguridad en UI:** prohibido `v-html` con contenido editable (saltos de línea con
  `whitespace-pre-line`); URLs validadas (sólo `https:`, `wa.me`, `mailto:`, `tel:`).

### 3.3 Diseño del panel (Búho-Pixel con Coneja-Lucky)

Búho-Pixel define la especificación de diseño y **evalúa la calidad de la UI implementada**:
gráfica, estándares, UX/UI, responsive, pantallas, brillo y contrastes. Trabaja junto a
Coneja-Lucky en cada etapa de UI y tiene veto visual. El diseño no depende de Pencil.

- **Estética:** oscuro cálido heredado de la marca (darkest `#0E0C09`, superficies `#15120E`→`#26211B`,
  texto `#F0EDE8`), con el cobre `#C17F4A` reservado a la acción primaria, el foco y el ítem activo.
  Referencias: Linear, Vercel, Supabase Studio, shadcn/ui.
- **Shell:** sidebar de 248 px colapsable a 64 px (iconos + tooltip), grupos "Landing" y "Empresa",
  perfil y cerrar sesión abajo; en móvil, drawer. Header sticky con breadcrumb, estado de guardado
  ("Guardado hace 2 min"), "Ver sitio" y "Guardar ⌘S".
- **Editor:** cards de campo con label, ayuda y contador de caracteres (warning al 90 %, danger al exceder);
  ImageField con dropzone, preview, reemplazar, progreso, peso/dimensiones y `alt` obligatorio;
  listas fijas como cards numeradas (sin añadir, eliminar ni arrastrar); barra flotante "Cambios sin
  guardar" (Descartar / Guardar); aviso al salir con cambios; toasts; skeletons con la misma geometría;
  diálogos de confirmación.
- **Tablas** (Historial): cabecera sticky, filas de 48 px, hover sutil, acciones ⋯, búsqueda y paginación.
- **Tokens nuevos** en `@theme`: superficies, bordes, `text-2`, estados (success/warning/danger/info),
  focus ring, radios 6/8/12 y sombras sólo en overlays.
- **Tipografía:** JetBrains Mono (títulos, labels, datos) + Inter (cuerpo y formularios).
- **Iconos:** `lucide-vue-next` (tree-shakeable). **Microinteracciones** de 120 a 200 ms, todas
  respetando `prefers-reduced-motion`. **A11y:** AA, foco visible, objetivos ≥ 44 px en táctil,
  errores con icono + texto + `aria-*`, focus trap en diálogos.

### 3.4 Infra (Osset-OP)

- `netlify.toml`: build, SPA fallback, headers de seguridad (nosniff, Referrer-Policy, HSTS,
  Permissions-Policy, `frame-ancestors 'none'`), CSP (primero Report-Only, después enforce) que
  permite sólo `self`, Google Fonts y `lgiajkdvuftvtincbqzi.supabase.co` (https + wss), cache
  inmutable de `/assets/*`.
- `/administrador/*`: `X-Robots-Tag: noindex, nofollow`, `Cache-Control: no-store`, fuera del sitemap.
- Envs `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Netlify y `.env.local`; `.env.example` versionado.
- Calidad: ESLint (flat + vue), Prettier, Vitest (composables y servicios), `npm run verify` y CI en GitHub Actions.

---

## 4. Etapas

### Etapa 0 — Preparación del repo y calidad · *Osset-OP*
- [ ] `.gitignore`: `.env`, `.env.*`, `!.env.example`; crear `.env.example`.
- [ ] ESLint + Prettier + Vitest; scripts `lint`, `format`, `test`, `verify`.
- [ ] CI `.github/workflows/ci.yml` con `npm run verify` (si hay remoto en GitHub).
- **Hecho cuando:** `npm run verify` verde; sitio sin cambios visuales.

### Etapa 1 — Centralizar contenido y correcciones previas · *Coneja-Lucky → Loro-Lola → Búho-Pixel*
- [ ] Crear `COMPANY` en `content.js` como fuente única de contacto (teléfono y WhatsApp `+56 9 2253 8166`);
      derivar `WHATSAPP_URL` del número + mensaje.
- [ ] Menú móvil: usar `COMPANY` (elimina el `+34` hardcodeado).
- [ ] CTA: el enlace de email pasa a `mailto:` con un **email provisional (dummy)**, editable luego desde el panel.
- [ ] Mover a `content.js` las rutas y `alt` de imágenes visibles, el disclaimer de Galería y el tagline del menú móvil.
- [ ] Footer links como `{label, href}` (elimina la dependencia label→ancla).
- [ ] Sustituir `v-html` por `whitespace-pre-line` (condición de Leona-Lia).
- [ ] Eliminar campos sin uso (`GALERIA.quote`, `FOOTER.agency`). Lo comentado en el código no se toca.
- [ ] Crear `contentSchema.js` (secciones, campos, límites, listas de tamaño fijo).
- **Hecho cuando:** ningún texto ni imagen editable queda hardcodeado (salvo el crédito Bestiari, los
  aria-labels y lo comentado); Búho-Pixel confirma cero regresión visual; build verde.

### Etapa 2 — Optimización de imágenes · *Lince-Max + Coneja-Lucky*
- [ ] Convertir a WebP/AVIF con dimensiones adecuadas; `width/height` en todas.
- [ ] Hero: `fetchpriority="high"` + `<link rel="preload">`; resto con `loading="lazy"`.
- [ ] `preconnect` al dominio de Supabase.
- **Hecho cuando:** el hero pesa menos de 300 KB y el peso total baja de forma drástica; LCP medido antes/después.

### Etapa 3 — Backend Supabase · *Jabalí-Javi, veto Leona-Lia*
Migraciones (copiadas en `supabase/migrations/`), aplicadas **sólo** con `mcp__supabase__` sobre `lgiajkdvuftvtincbqzi`:
- [ ] `init_privileges_and_extensions`: **revocar default privileges** de anon/authenticated en `public`; `pg_jsonschema`; `set_updated_at()`.
- [ ] `create_admins_and_is_admin`
- [ ] `create_media`
- [ ] `create_site_settings`
- [ ] `create_section_content` (+ función de validación JSON Schema por clave, listas de tamaño fijo)
- [ ] `create_content_revisions` (+ triggers + `restore_revision`)
- [ ] `create_storage_site_media` (bucket + policies)
- [ ] `create_rpc_get_site_content` (+ `list_orphan_media`, `media_usage`)
- [ ] `seed_site_content` (desde `content.js`; sin el crédito Bestiari ni lo comentado)
- [ ] Tipos generados; `get_advisors` sin avisos.
- **Hecho cuando:** Leona-Lia ejecuta su batería de pruebas (anon, authenticated no admin, admin y
  catálogo del sistema) y aprueba la matriz de permisos.

### Etapa 4 — Auth: usuario del dueño · *Cliente + Jabalí-Javi, verifica Leona-Lia*
- [ ] **Cliente:** crea el usuario del dueño en Supabase Auth y nos lo comunica.
- [ ] Cliente (Dashboard): desactivar signups públicos y proveedores sociales.
- [ ] Insertar el `user_id` del dueño en `admins` (único admin).
- [ ] Site URL y Redirect URLs (producción, localhost y deploy previews) para `/administrador/restablecer`.
- [ ] Recuperación de contraseña con el **email integrado de Supabase** (sin SMTP externo).
- [ ] MFA (TOTP) **opcional**, activable por el dueño desde el panel.
- **Hecho cuando:** el dueño inicia sesión; `is_admin()` es true para él y false para cualquier otro.

### Etapa 5 — Especificación de diseño del panel · *Búho-Pixel con Coneja-Lucky*
- [ ] `docs/admin-design-spec.md`: tokens, tipografía, componentes con variantes y estados,
      layouts (desktop, tablet, móvil), microinteracciones y criterios de contraste y accesibilidad.
- [ ] Tokens añadidos a `@theme`.
- **Hecho cuando:** la spec está aprobada por Búho-Pixel y es implementable por Coneja-Lucky.

### Etapa 6 — Infra frontend · *Coneja-Lucky + Osset-OP*
- [ ] Instalar `vue-router` y `@supabase/supabase-js`.
- [ ] `lib/supabase.js`, router (landing eager, admin lazy) y `LandingView`.
- [ ] `useSiteContent` (seed → RPC → merge → caché) y secciones leyendo del composable.
- [ ] `netlify.toml` (SPA, headers, CSP Report-Only, noindex del admin); envs en Netlify.
- **Hecho cuando:** `/` se ve idéntico, sin parpadeo, con una sola request de contenido y sin chunk
  de admin; un cambio hecho en la BD aparece en el sitio.

### Etapa 7 — Panel: login, shell y kit · *Coneja-Lucky, revisa Búho-Pixel*
- [ ] Componentes base Tailwind-first (Button, Input, Textarea, Field, Toggle, Badge, Dialog, Toast, Skeleton, Tooltip).
- [ ] Login, restablecer contraseña, guard de ruta (UX) y sesión expirada.
- [ ] Shell: sidebar colapsable o drawer, header con breadcrumb y estado de guardado.
- **Hecho cuando:** Búho-Pixel aprueba calidad visual, responsive y contraste; navegación completa por teclado.

### Etapa 8 — Panel: editores de sección · *Coneja-Lucky, microcopy Loro-Lola, revisa Búho-Pixel*
- [ ] Editor genérico guiado por `contentSchema.js` (texto, textarea, contador, validación).
- [ ] ImageField: redimensionado WebP en cliente, subida, preview, reemplazo y `alt` obligatorio.
- [ ] Listas de tamaño fijo como cards numeradas (sólo editar contenido).
- [ ] Barra "Cambios sin guardar", ⌘S, aviso al salir y toasts.
- [ ] Todas las secciones de la landing editables.
- **Hecho cuando:** cada texto y foto visible de la landing se cambia desde el panel y se refleja en `/`.

### Etapa 9 — Panel: Datos de la empresa · *Coneja-Lucky + Loro-Lola, revisa Búho-Pixel*
- [ ] Formulario tipado (email, teléfono, WhatsApp E.164 + mensaje, dirección, mapa, horario, redes).
- [ ] Validaciones inline coherentes con los CHECK de la BD; prueba del enlace de WhatsApp.
- [ ] Toda la landing (CTA, menú móvil, botón flotante, footer) consume estos datos.
- **Hecho cuando:** cambiar el teléfono en el panel lo cambia en todos los puntos del sitio.

### Etapa 10 — Historial y restaurar · *Coneja-Lucky + Jabalí-Javi*
- [ ] Tabla de revisiones por sección (fecha, autor, cambio) con diff legible.
- [ ] Restaurar versión con diálogo de confirmación.
- [ ] Limpieza de imágenes reemplazadas que ya no se usan.
- **Hecho cuando:** se puede deshacer cualquiera de las últimas 30 versiones.

### Etapa 11 — QA final, refactor y deploy
- [ ] Leona-Lia: batería completa de permisos, grep de `service_role` en `dist/` y headers en el deploy preview.
- [ ] Búho-Pixel: landing sin regresiones; panel aprobado en desktop, tablet y móvil.
- [ ] Lince-Max: LCP/CLS de `/` y bundle inicial sin el admin.
- [ ] Zorro-Foxter: deduplicación y archivos < 300 líneas.
- [ ] Osset-OP: CSP en enforce, deploy y smoke test (home, imágenes, WhatsApp, login, reset).
- [ ] Guía breve de uso para el dueño (`docs/guia-panel.md`, Loro-Lola).
- [ ] Cliente: commit del frontend.

---

## 5. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Tablas nuevas abiertas por los privilegios por defecto | Revocarlos en la primera migración; veto de Leona-Lia |
| XSS por `v-html` con datos de BD | Eliminado en la Etapa 1 |
| Regresión visual o de LCP al pasar a contenido dinámico | Seed + caché + preload del hero + `width/height`; validación de Búho-Pixel y Lince-Max |
| El dueño rompe el diseño con textos largos | Límites de caracteres en el esquema y en la BD; listas de tamaño fijo |
| Fotos pesadas subidas desde el móvil | Redimensionado WebP en el cliente + límite de 5 MB en el bucket |
| Deploy previews escriben en la BD real (proyecto único) | RLS sólo para admin; credenciales del admin no compartidas |
| Límite de envíos del email integrado de Supabase | Aceptable: un único usuario |
| Muchos cambios sin commitear durante varias etapas | Cada etapa queda estable y verificada; el cliente hace commit al cerrar el frontend |

## 6. Decisiones del cliente

| # | Decisión | Resolución (2026-10-01) |
|---|---|---|
| D1 | Alcance del "mini CRM" | Sólo gestión de contenido |
| D2 | Listas (features, pasos, galería) | Tamaño fijo: no se añaden ni eliminan ítems, sólo se cambia su contenido |
| D3 | Teléfono / WhatsApp | `+56 9 2253 8166` es el correcto; editable desde Datos de la empresa |
| D4 | Enlace de email del CTA | Debe ser `mailto:`; email provisional (dummy) hasta que se defina |
| D5 | Contenido comentado (p. ej. Hero) | No se edita: es parte del código |
| D6 | Guardar vs. borrador | Guardar publica al instante |
| D7 | MFA del admin | Opcional |
| D8 | Usuario admin | El cliente lo crea en Supabase y lo comunica |
| D9 | Recuperación de contraseña | Email integrado de Supabase, sin Resend |
| D10 | Tipografía / modo claro / preview en vivo | Mono + Inter; modo claro y preview en vivo en v2 |
| D11 | Commits | Los hace el cliente al terminar el frontend |
| D12 | Inicio de la ejecución | Cuando el cliente lo indique |
| D13 | Rol de Búho-Pixel | Evaluador experto de calidad de diseño (UI/UX, responsive, contraste), junto a frontend; no depende de Pencil |
| D14 | SEO editable (title/description/OG) | Fase 2 (recomendación, sin confirmar) |
| D15 | Plan Supabase | Free + redimensionado en el cliente (recomendación, sin confirmar) |

## 7. Registro de cambios

| Fecha | Etapa | Cambio |
|---|---|---|
| 2026-10-01 | — | Plan creado con los informes de los agentes |
| 2026-10-01 | — | Incorporadas las decisiones D1–D13 del cliente; Etapa 5 pasa a especificación de diseño (sin Pencil) |
