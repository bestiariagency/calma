# Plan — Panel de administración CALMA (`/administrador`)

> Documento vivo. **Se actualiza al cerrar cada etapa** (estado, fecha, verificación).
> Orquesta: SúperXavi · Elaborado con: Caballo-Bojac, Jabalí-Javi, Leona-Lia, Búho-Pixel, Osset-OP.
> Creado: 2026-10-01 · Decisiones del cliente incorporadas: 2026-10-01

## Estado general

**Estado del plan:** ✅ Aprobado · ▶️ En ejecución desde 2026-10-01 (base: commit `cba23df`).

| # | Etapa | Responsables | Estado | Cierre |
|---|---|---|---|---|
| 0 | Preparación del repo y calidad | Osset-OP | ✅ Completa | 2026-10-01 · verify verde |
| 1 | Centralizar contenido + correcciones previas | Coneja-Lucky, Loro-Lola, Búho-Pixel | ✅ Completa | 2026-10-02 · Búho APROBADO · 12 tests |
| 2 | Optimización de imágenes (LCP) | Lince-Max, Coneja-Lucky | ✅ Completa | 2026-10-02 · 18 MB → 1,6 MB · Búho APROBADO |
| 3 | Backend Supabase: esquema, RLS, Storage, RPC | Jabalí-Javi, Leona-Lia (veto) | ✅ Completa | 2026-10-02 · Leona APROBADO |
| 4 | Auth: usuario del dueño y configuración | Cliente, Jabalí-Javi, Leona-Lia | ✅ Completa* | 2026-10-02 · Leona APROBADO · *ajustes de Dashboard pendientes del cliente |
| 5 | Especificación de diseño del panel | Búho-Pixel + Coneja-Lucky | ✅ Completa | 2026-10-02 · spec + tokens en `@theme` |
| 6 | Infra frontend: router, cliente Supabase, contenido dinámico | Coneja-Lucky, Osset-OP | ✅ Completa | 2026-10-02 · Búho APROBADO · 28 tests |
| 7 | Panel: login, shell y kit de componentes | Coneja-Lucky, Búho-Pixel | ✅ Completa | 2026-10-02 · Búho APROBADO · 72 tests |
| 8 | Panel: editores de secciones (textos y fotos) | Coneja-Lucky, Loro-Lola, Búho-Pixel | ✅ Completa | 2026-10-02 · Búho APROBADO · E2E real · 106 tests |
| 9 | Panel: Datos de la empresa | Coneja-Lucky, Loro-Lola, Búho-Pixel | ✅ Completa | 2026-10-02 · Búho APROBADO · 156 tests |
| 10 | Panel: historial y restaurar | Coneja-Lucky, Jabalí-Javi | ✅ Completa | 2026-10-02 · Leona y Búho APROBADO · 178 tests |
| 11 | QA final, refactor y deploy | Leona-Lia, Búho-Pixel, Lince-Max, Zorro-Foxter, Osset-OP | ⏸️ Esperando datos del cliente | — |

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
- [x] `.gitignore`: `.env`, `.env.*`, `!.env.example`; crear `.env.example`.
- [x] ESLint + Prettier + Vitest; scripts `lint`, `lint:fix`, `format`, `format:check`, `test`, `verify`.
- [x] CI `.github/workflows/ci.yml` con `npm run verify` (remoto `bestiariagency/calma`).
- [x] `npm audit fix` (postcss/nanoid, severidad alta, sólo dependencias de desarrollo) → 0 vulnerabilidades.
- **Resultado:** `verify` verde (lint 0 errores / 10 warnings en código existente, sin tests aún, build OK).
  Los warnings `vue/no-v-html` se resuelven en la Etapa 1; el resto (orden/hyphenation de atributos)
  queda fuera de alcance. `format:check` no forma parte de `verify` para no reformatear en masa.
- **Hecho cuando:** `npm run verify` verde; sitio sin cambios visuales.

### Etapa 1 — Centralizar contenido y correcciones previas · *Coneja-Lucky → Loro-Lola → Búho-Pixel*
- [x] `COMPANY` en `content.js` como fuente única de contacto; `src/lib/contact.js` (`whatsappUrl`, `telHref`, `mailtoHref`).
- [x] Menú móvil usa `COMPANY` (teléfono `+56 9 2253 8166`; eliminado el `+34`).
- [x] CTA: email como `mailto:` con valor provisional `info@calma.es`.
- [x] Rutas y `alt` de imágenes, disclaimer de Galería y tagline movidos a `content.js`; logo en `COMPANY.logo`.
- [x] Footer links `{label, href}`; copyright con año automático; crédito Bestiari intacto y hardcodeado.
- [x] `v-html` sustituido por `whitespace-pre-line` en `TheCta.vue`.
- [x] Eliminados `GALERIA.quote`, `FOOTER.agency`, `FOOTER.logo`. Lo comentado (Hero) no se tocó.
- [x] `contentSchema.js` con labels y ayudas revisadas por Loro-Lola; listas de tamaño fijo.
- [x] `contentSchema.test.js`: esquema ↔ contenido sincronizados, límites respetados, sin rastro del crédito Bestiari.
- **Resultado:** Búho-Pixel APROBADO (sin regresión; cambios visibles sólo los 3 previstos: mailto, teléfono
  móvil, año ©). Zorro-Foxter sin cambios necesarios. `verify` verde (12 tests).
- **Sugerencias de copy de Loro-Lola para el cliente** (no aplicadas; editables desde el panel):
  frase sin verbo en el primer párrafo de "Qué es"; confirmar plazo "3 a 4 semanas"; suavizar
  "guarda el calor más que cualquier otro material" y "Durabilidad extrema"; unificar
  "hormigón"/"concreto" (coordinar keyword con Lince-Max); "Terreno" → "Visita a tu terreno";
  confirmar "pala y deck" en el disclaimer; confirmar email definitivo.
- **Observación Zorro-Foxter:** las claves comentadas de `HERO` (tag, títulos, subtítulos) siguen en
  `content.js` sólo como respaldo del código comentado; no son editables.

### Etapa 2 — Optimización de imágenes · *Lince-Max + Coneja-Lucky*
- [x] 7 PNG → WebP q82 (mismas dimensiones; `npx sharp-cli` puntual, sin dependencias). PNG eliminados (en historial git).
- [x] `width/height` en `content.js` y en todos los `<img>` (vía `v-bind` del objeto imagen).
- [x] Hero: `fetchpriority="high"` + `<link rel="preload">`; resto `loading="lazy"` + `decoding="async"`.
- [x] `preconnect` a Supabase (se aprovecha a partir de la Etapa 6).
- **Resultado:** imágenes 18 MB → 1,6 MB (hero 3,35 MB → 177 KB). Búho-Pixel APROBADO (PSNR 36–38 dB, sin
  artefactos). Lighthouse (mediana de 3): desktop 75 → 99, LCP 9,7 s → 0,9 s; CLS 0,006 → 0; peso
  17,7 MB → 1,4 MB. Móvil simulado 94 (inestable 72/94/95) → 80 (estable); el LCP observado real es
  equivalente (~170 ms). A/B: quitar el preload empeora (≈5,2 s vs 4,7 s simulado); precargar el logo
  no mejora. El cuello de botella móvil es el CSS bloqueante de Google Fonts → fase 2.
- **Fase 2 (Lince-Max):** auto-hospedar JetBrains Mono, `srcset` para el hero móvil, canonical/OG/JSON-LD,
  `robots.txt` + `sitemap.xml` (requiere dominio de producción), prerender.
- **Nota para la Etapa 6:** los `<img>` usan `v-bind` del objeto imagen; al llegar datos de la BD, mapear
  sólo `{src, alt, width, height}` (no pasar `id`, `blurhash`, etc. como atributos del DOM).

### Etapa 3 — Backend Supabase · *Jabalí-Javi, veto Leona-Lia*
Migraciones (copiadas en `supabase/migrations/`), aplicadas **sólo** con `mcp__supabase__` sobre `lgiajkdvuftvtincbqzi`:
- [x] 9 migraciones aplicadas con `mcp__supabase__` y guardadas en `supabase/migrations/` (nombres = versión
      remota; md5 idéntico a lo aplicado): `init_privileges_and_extensions` (revoca default privileges) ·
      `create_admins_and_is_admin` · `create_media` · `create_site_settings` · `create_section_content`
      (JSON Schema por clave, listas fijas, `additionalProperties: false`) · `create_content_revisions`
      (triggers, `restore_revision`, poda a 30) · `create_storage_site_media` · `create_rpc_get_site_content`
      (+ `list_orphan_media`, `media_usage`) · `seed_site_content`.
- [x] Campo imagen en BD: `{media_id, src, alt, width, height, blurhash}`; seed con `media_id = null` y `src` estático.
- [x] `get_site_content()` (anon) → `{ sections: {9 claves}, settings: {...}, updated_at }`, ~4,2 KB, sin crédito Bestiari.
- [x] Tipos de referencia en `supabase/types/database.ts`; `supabase/README.md` (orden, modelo, alta de admin).
- **Resultado:** Leona-Lia APROBADO tras batería completa (catálogo, anon, authenticated no admin, admin
  ficticio en transacción revertida): RLS en todo, FORCE en `admins`/`content_revisions`, DEFINER con
  `search_path=''`, JSON Schema y CHECKs rechazan entradas inválidas (campo extra, > maxLength, lista
  incompleta, email inválido, WhatsApp no E.164, `javascript:`), revisiones con `changed_by` del servidor.
- **Advisors aceptados:** 2 WARN por EXECUTE de `is_admin()` para anon/authenticated (necesario para las
  policies; sólo devuelve un booleano sobre `auth.uid()`). 5 INFO de índices sin uso (BD sin tráfico).
- **Pendiente para la Etapa 8:** probar end-to-end el límite de 5 MB y el filtro MIME del bucket (los aplica
  la API de Storage, no la BD).
- **Observaciones de Leona-Lia (no bloquean; requieren decisión del cliente por tocar GRANTs):**
  `media` permite al admin actualizar `created_by/created_at` (sólo auditoría; se puede restringir a
  `alt, width, height, blurhash`); la URL del proyecto está fijada en `private.media_public_url`.
- Limitación de plataforma documentada: los default privileges de `supabase_admin` no se pueden revocar;
  todos los objetos son de `postgres`, así que no aplica.

### Etapa 4 — Auth: usuario del dueño · *Cliente + Jabalí-Javi, verifica Leona-Lia*
- [x] Cliente creó el usuario del dueño en Supabase Auth (email confirmado; único usuario del proyecto).
- [x] Alta en `admins` (`insert … select id from auth.users where email = …`). Credenciales NO guardadas en el repo.
- [x] Login real probado con la clave publicable: sesión OK, `is_admin()` = true para el dueño y false para anon.
- [x] Leona-Lia APROBADO: 1 admin, sólo identidad email, grants y policies sin cambios desde la Etapa 3,
      UPDATE permitido al admin y 0 filas para un usuario cualquiera; autopromoción bloqueada.
- [x] **Cliente (Dashboard):** desactivar "Allow new users to sign up" (confirmado 2026-10-02).
- [ ] *Leaked password protection* (opcional; sólo plan Pro de Supabase): pendiente. Mitigación en plan Free:
      contraseña larga y única + MFA. Único aviso de seguridad abierto aparte de los 2 aceptados de `is_admin()`.
- [x] **Cliente (Dashboard):** Site URL + Redirect URLs (`http://localhost:5173/administrador/restablecer` y
      `https://<dominio>/administrador/restablecer`, más previews de Netlify) para el enlace de recuperación.
- [ ] **Cliente:** cambiar la contraseña por una robusta (la actual se compartió por chat) y, si quiere, activar MFA.
- Recuperación de contraseña con el email integrado de Supabase (sin SMTP externo). MFA TOTP opcional.

### Etapa 5 — Especificación de diseño del panel · *Búho-Pixel con Coneja-Lucky*
- [x] `docs/admin-design-spec.md` (~770 líneas): §1 tokens + contraste AA calculado · §2 tipografía y densidad ·
      §3 31 componentes con estados (3.1–3.16 base, 3.17–3.31 Alert, Spinner, Card, Drawer, EmptyState,
      OfflineBanner, Menu, Select, Checkbox, Avatar, SkipLink, Logo, Kbd, Dropzone, DiffView) · §4 layouts
      1440/768/390 · §5 microinteracciones y a11y · §6 iconos lucide · §7 checklist de revisión.
- [x] Revisión de implementabilidad por Coneja-Lucky: 28 incoherencias entre secciones y 15 componentes sin
      definir → resueltos por Búho-Pixel (un solo primary por contexto, toasts 4/6 s, skeleton shimmer 1,2 s,
      drawer 288 px, breakpoints `md:`/`lg:` del panel, nombres actuales de lucide, Toggle fuera de v1).
- [x] Tokens en `@theme` (`src/style.css`): 51 de §1 + `--size-*`, `--tracking-*`, `animate-shimmer`; sombras
      con `var(--color-line)`. Verificado que compilan. Landing sin cambio visual (no usa `rounded-sm/md/lg`,
      `font-sans` ni `shadow-*`; si algún día los usa, prefijar). Inter sólo se cargará en el chunk del panel.
- [x] Logos: `logo-blanco-calma.svg` (login, sidebar expandida) e `iso-calma.svg` (colapsada).
- **Resultado:** spec cerrada por Búho-Pixel e implementable; `verify` verde.

### Etapa 6 — Infra frontend · *Coneja-Lucky + Osset-OP*
- [x] `vue-router` 5 y `@supabase/supabase-js` 2 instalados; `.env.local` con la clave publicable (gitignored).
- [x] `lib/supabase.js`, `services/contentService.js` (1 RPC), `lib/mergeContent.js` (merge guiado por la forma
      del seed: ignora claves desconocidas, `media_id`/`blurhash`, tipos distintos; listas por índice),
      `lib/contentCache.js` (localStorage con `updated_at`), `composables/useSiteContent.js` (`shallowRef`,
      seed/caché → RPC en idle tras el primer paint vía import dinámico; si falla, se queda el seed).
- [x] Router: `/` → `LandingView` (eager); `/administrador/**` lazy con meta noindex; anclas con scroll suave.
- [x] Secciones y layout leen del composable; crédito Bestiari intacto.
- [x] `netlify.toml`: build, SPA fallback, headers de seguridad, CSP **Report-Only**, cache (`/assets` immutable,
      `/images` 1 semana, HTML no-cache), `X-Robots-Tag: noindex` + `no-store` en `/administrador` y subrutas.
- **Resultado:** Búho-Pixel APROBADO (0 mutaciones de DOM y 0 layout-shift al llegar la RPC, layout idéntico a
  1440/390, anclas, lightbox, menú móvil y back OK, consola limpia). Lince-Max: sin regresión (desktop 99, LCP
  0,91 s; móvil 79, ruido; CLS 0; +70 kB transferidos; supabase y RPC fuera de la ruta crítica; el panel no se
  descarga en `/`). Zorro-Foxter: arquitectura limpia, 1 simplificación + test de casos límite. `verify` verde
  (28 tests). `npm ci` instala correctamente (incl. `tslib`).
- **Pendiente de verificar en vivo (Etapa 8):** que un cambio guardado desde el panel aparece en `/`.
- **Pendiente del cliente para producción:** envs `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en Netlify
  (Production + Deploy previews; si faltan, el sitio funciona con el seed pero sin contenido de la BD); Site URL
  y Redirect URLs en Supabase Auth (`/administrador/restablecer` en producción, previews y localhost).
- **Fase 2:** pasar la CSP a enforce tras revisar la consola en producción.

### Etapa 7 — Panel: login, shell y kit · *Coneja-Lucky, revisa Búho-Pixel*
- [x] Kit (`src/components/admin/ui/`): Button (loading con `loadingLabel`), Spinner, Input, Textarea (autosize),
      Field (contador 90 %/100 %), Alert, Badge, Card, Kbd, Skeleton, Tooltip (teleportado), Dialog (focus trap,
      inert, scroll lock), Toast + `useToast`, Logo, SkipLink, Avatar, Drawer. Iconos `lucide-vue-next`; Inter
      autoalojada (`@fontsource-variable/inter`) sólo en el chunk del panel. Página `/administrador/kit` sólo en DEV.
- [x] Auth: `authService` + `useAuth` (sesión reactiva, `is_admin` cacheado, reset con `redirectTo`, nueva
      contraseña, MFA TOTP si hay factor → aal2). Rutas `/administrador/{acceso,restablecer,sin-acceso,seccion/:key,
      empresa,historial}`, guard UX con `redirect` saneado, título "Administración — CALMA", noindex.
- [x] Shell: sidebar 248/64 (colapso recordado; tablet siempre colapsada; drawer < 768) generado desde
      `CONTENT_SCHEMA`; header con breadcrumb, SaveStatus, "Ver sitio", "Guardar ⌘S"; SkipLink; ToastHost;
      Dialog de sesión expirada; 404 del panel; `scheme-dark` sólo en la raíz del panel.
- [x] Microcopy revisado por Loro-Lola (`adminShellText.js`): errores genéricos en login y "si el correo existe…".
- **Resultado:** Búho-Pixel APROBADO tras 2 rondas (kit: 5 ajustes; pantallas: tooltip recortado, foco al
  primer campo inválido, enlaces ≥ 24/44 px, etiqueta de carga, logo en sin-acceso). Zorro-Foxter: cooldown
  unificado y tablas de errores. `verify` verde (72 tests); el kit no entra en producción; la landing no carga
  nada del panel; sin secretos en el código.
- **Pendiente (Etapa 8):** revisar en vivo SaveStatus (guardando/sin guardar/error) y UnsavedBar.
- **Decisiones abiertas del cliente (Loro-Lola):** a quién debe contactar alguien en "Sin acceso".

### Etapa 8 — Panel: editores de sección · *Coneja-Lucky, microcopy Loro-Lola, revisa Búho-Pixel*
- [x] **8A — Editor de textos** (`SectionEditorView`, `useSectionEditor`, `sectionService`, `lib/sectionEditor.js`):
      generado desde `contentSchema.js`; contadores; listas fijas numeradas; alt obligatorio; guardar = publicar
      (botón, header, ⌘S); escritura condicional por `updated_at` con Dialog de conflicto; descartar; aviso al
      salir; errores 23514/red/42501/401 entendibles sin perder lo escrito; skeleton desde el esquema.
- [x] Microcopy del editor (Loro-Lola): "Guardar y publicar", conflicto que explica qué se pierde.
- [x] Búho-Pixel APROBADO tras 1 ronda (UnsavedBar 640 px sin truncar, conflicto apilado, un solo canal por error,
      skeleton fiel, SaveStatus `idle`, targets).
- [x] **D16-A:** la landing pide `get_site_content` con `fetch` directo al arrancar (sin supabase-js en la landing,
      −55 kB gzip); el contenido llega en ~0,3–0,6 s (antes hasta ~3 s). 1 petición, caché y fallback intactos.
- [x] **E2E real (SúperXavi, con la cuenta del dueño; contenido restaurado):** guardar → visible para anon al
      instante → exceso de longitud rechazado (23514) → restaurar → 2 revisiones con `changed_by` del dueño.
- [x] **E2E real de Storage** (pendiente de la Etapa 3): 6 MB → 413; SVG → 415; fuera de `sections/` → 403; anon → 403;
      webp válido del admin → OK y URL pública 200; anon no puede listar; objeto de prueba borrado (bucket vacío).
- [x] **8B — Subida/cambio de fotos:** dropzone + botón + teclado; procesado en el navegador (EXIF, lado mayor ≤ 2400 px,
      ≤ 5 MB; WebP y, si el navegador no lo genera —Safari/iPhone—, JPEG); upload a `sections/<key>/<uuid>.<webp|jpg>`;
      fila en `media`; contenido `{media_id, src: null, alt, width, height}`; progreso por fases y cancelar; errores en
      el campo; metadatos "W × H · KB · FORMATO"; aviso "Foto lista · aún no se ve en el sitio". Textos de Loro-Lola.
- [x] Búho-Pixel APROBADO 8B, incluido **WebKit real** (Safari): produce JPEG y sube correctamente.
- [x] Zorro-Foxter: `readyHelp` visible, computed en `ResetPasswordView`. **Revisión parcial** (no repasó todos los
      archivos de la etapa) → revisión completa en la Etapa 11. Candidato: componente de enlace común (estilo repetido).
- **Nota:** las imágenes reemplazadas quedan huérfanas hasta la limpieza de la Etapa 10. La precarga del hero en
  `index.html` apunta a la imagen estática hasta D16-B.

### Etapa 9 — Panel: Datos de la empresa · *Coneja-Lucky + Loro-Lola, revisa Búho-Pixel*
- [x] `/administrador/empresa` con 6 grupos (Identidad, Contacto, WhatsApp, Ubicación, Horario, Redes), reutilizando la
      infraestructura del editor mediante un adaptador de origen (`editorSources`, `settingsService`, `conditionalWrite`).
- [x] Validación cliente (`lib/fieldFormats.js`) idéntica a los CHECK de la BD (verificado por Zorro-Foxter); normalización
      del WhatsApp; enlaces de prueba (correo, llamada, mapa, redes) y vista del enlace wa.me con "Probar".
- [x] La landing toma email/teléfono/WhatsApp de `settings` en CTA, menú móvil, nav y botón flotante (test).
- [x] **D17:** bloque de contacto en el footer (dirección con Maps, horario, redes) según `docs/footer-contacto-spec.md`;
      sólo se muestra lo que tiene datos (vacío = footer idéntico al original); iconos oficiales de Simple Icons (CC0)
      en SVG inline, sin dependencias; enlaces sólo `https://`; aria-labels de Loro-Lola.
- [x] Corrección previa detectada: el botón flotante de WhatsApp tapaba el crédito de Bestiari en móvil → reserva
      `max-desktop:pb-24` en el footer (aprobado por el cliente; crédito intacto; 1440 idéntico).
- **Resultado:** Búho-Pixel APROBADO (skeleton = cargado al píxel en 1440/768; footer en 4 casos y 3 anchos; captura de
  SúperXavi a 390/768: crédito visible 16 px sobre el botón). Zorro-Foxter revisión completa: `CompanyTestLink.vue`,
  3 textos muertos eliminados. `verify` verde (156 tests).
- **Pendientes menores:** transición del nav del footer sin `motion-reduce` (previo); renombrar `useSectionEditor` →
  `useContentEditor` en la Etapa 11 si no rompe nada.

### Etapa 10 — Historial y restaurar · *Coneja-Lucky + Jabalí-Javi*
- [x] **Backend (Jabalí-Javi):** auditoría de `restore_revision` (secciones y `site_settings`; restaurar crea revisión y
      se puede deshacer; idéntico no crea revisión) y migración `20261002100444_harden_list_orphan_media`: una foto no es
      huérfana si la usa el contenido actual o cualquier revisión retenida; detecta objetos sin registro; margen de 1 h.
      Leona-Lia APROBADO (ACL idéntica, INVOKER, `search_path=''`, sólo `site-media/sections/`).
- [x] `/administrador/historial`: tabla paginada (25), filtro por sección, autor ("Tú"/"Administrador"), resumen;
      cards en móvil; panel lateral "Qué cambiaría al volver atrás" (Publicado ahora / Así quedaría, con miniaturas);
      "Volver a esta versión" con confirmación y errores mapeados (23514, P0002, permiso, sesión, red).
- [x] "Fotos sin usar": total, lista, "Liberar espacio" con confirmación, progreso y fallo parcial (Storage primero, luego
      `media`; `data` vacío tratado como bloqueo). Resuelto el TODO de la Etapa 8.
- [x] Textos de Loro-Lola. Búho-Pixel CAMBIOS (cards solapadas a 390, scroll horizontal a 768, targets, foco) →
      corregidos y verificados con capturas por SúperXavi. Zorro-Foxter revisión completa (`toError` unificado).
- [x] **E2E real (SúperXavi):** `restore_revision` OK sin cambiar el sitio; inexistente → P0002; anon → 42501;
      `list_orphan_media` responde.
- **Resultado:** `verify` verde (178 tests); chunk inicial de la landing sin cambios (HistoryView lazy, 28 kB).

### Etapa 11 — QA final, refactor y deploy
- [ ] **D16-B:** Build hook de Netlify (secreto en Supabase, nunca en el cliente) disparado tras cada guardado
      (Edge Function o webhook de BD, con debounce); el build genera el seed desde `get_site_content` y la precarga del hero.
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
| D16 | Contenido antiguo un instante antes del nuevo en la landing | **A + B** (2026-10-02): A) petición temprana y ligera sin supabase-js en la landing (Etapa 8); B) al guardar, Supabase dispara un *Build hook* de Netlify que regenera el sitio con el contenido ya incluido (sin parpadeo, precarga correcta del hero, mejor SEO; publicación en 1–2 min). Requiere que el cliente cree el Build hook en Netlify (Etapa 11). |
| D17 | Dirección, horario y redes en el sitio público | **En el footer** (2026-10-02): bloque discreto (dirección con enlace a Maps, horario, iconos de redes) diseñado por Búho-Pixel; sólo se muestra lo que tenga datos. |
| D18 | Permisos de `media` (restringir UPDATE de `created_by/created_at`) | **No se cambia** (2026-10-02): sólo el dueño y el developer administran; se mantienen los permisos aprobados en la Etapa 3. |
| D19 | Producción | Netlify conectado al repo; dominio `https://tinajas-calma.netlify.app`; envs `VITE_SUPABASE_*` cargadas por el cliente (2026-10-02). |
| D20 | Permisos por defecto de `pg_net` (no revocables por `postgres`) | **Riesgo aceptado y documentado** (2026-10-02): `net` no está expuesto en la API (PGRST106 verificado); reglas en `supabase/README.md`: nunca exponer `net` ni crear funciones en `public` que lo usen. |

## 7. Registro de cambios

| Fecha | Etapa | Cambio |
|---|---|---|
| 2026-10-01 | — | Plan creado con los informes de los agentes |
| 2026-10-01 | — | Incorporadas las decisiones D1–D13 del cliente; Etapa 5 pasa a especificación de diseño (sin Pencil) |
| 2026-10-01 | 0 | Etapa 0 completada: tooling de calidad, CI, `.env.example`, audit fix |
| 2026-10-02 | 1 | Etapa 1 completada: contenido centralizado, bugs de contacto corregidos, `v-html` eliminado, esquema + test |
| 2026-10-02 | 2 | Etapa 2 completada: imágenes WebP, dimensiones, preload del hero; medición Lighthouse |
| 2026-10-02 | 3 | Etapa 3 completada: esquema, RLS, Storage y RPC en Supabase; veto de Leona-Lia superado |
| 2026-10-02 | 5 | Etapa 5 completada: especificación de diseño del panel + tokens en `@theme` |
| 2026-10-02 | 6 | Etapa 6 completada: router, contenido dinámico desde Supabase, `netlify.toml` |
| 2026-10-02 | 4 | Etapa 4: dueño dado de alta como admin; login real verificado; ajustes de Dashboard pendientes del cliente |
| 2026-10-02 | 7 | Etapa 7 completada: kit, login/restablecer/MFA, guard y shell del panel |
| 2026-10-02 | 8 | 8A (editor de textos) aprobada; D16-A (petición temprana); E2E reales de guardado y Storage |
| 2026-10-02 | 8 | Etapa 8 completada: editor de textos y fotos (incl. Safari/iPhone), E2E reales |
| 2026-10-02 | 9 | Etapa 9 completada: Datos de la empresa, bloque de contacto en el footer, crédito Bestiari visible en móvil |
| 2026-10-02 | 10 | Etapa 10 completada: historial, volver a una versión, limpieza segura de fotos |
