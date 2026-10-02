# Supabase — Calma

Proyecto único: `lgiajkdvuftvtincbqzi` (`https://lgiajkdvuftvtincbqzi.supabase.co`).
Los cambios se aplican vía MCP `mcp__supabase__` (`apply_migration`) y se copian aquí con el
**mismo número de versión** que tienen en remoto (`supabase_migrations.schema_migrations`).
Las migraciones ya aplicadas no se editan: cualquier corrección va en una migración nueva.

## Orden de migraciones (Etapa 3)

| Versión | Nombre | Qué hace |
|---|---|---|
| 20261001221152 | init_privileges_and_extensions | Privilegios mínimos por defecto (sin GRANT implícito a anon/authenticated), extensiones y helpers |
| 20261001221211 | create_admins_and_is_admin | Tabla `admins` + `is_admin()` (SECURITY DEFINER, sin recursión) |
| 20261001221229 | create_media | Registro de imágenes del bucket `site-media` |
| 20261001221303 | create_site_settings | Datos de la empresa (una sola fila) |
| 20261001221426 | create_section_content | Contenido por sección (jsonb validado con JSON Schema) |
| 20261001222011 | create_content_revisions | Historial append-only por trigger (30 por clave) + `restore_revision()` |
| 20261001222025 | create_storage_site_media | Bucket público `site-media` (5 MB, webp/avif/jpeg/png) + policies |
| 20261001225259 | create_rpc_get_site_content | RPC pública `get_site_content()` + RPC de admin `media_usage()` y `list_orphan_media()` |
| 20261001225326 | seed_site_content | Seed inicial desde `src/data/content.js` (idempotente) |
| 20261002100444 | harden_list_orphan_media | `list_orphan_media()` protege imágenes referenciadas en revisiones y lista objetos de Storage sin fila en `media` (margen 1 h) |
| 20261002112519 | site_build_trigger | D16-B: `pg_net` + `pg_cron`; triggers que marcan build pendiente y job `site-build-flush` que dispara el Build hook de Netlify |
| 20261002112621 | site_build_state_deny_policies | Policies explícitas de denegación (anon/authenticated) en `private.site_build_state` |

## Modelo de permisos

Hay dos roles: **público (`anon`)** y un único rol **admin**, que es un usuario `authenticated`
presente en `public.admins` (`is_admin()`). Ningún cambio debe alterar esto sin pedirlo
explícitamente, y toda modificación pasa por Leona-Lia.

| Recurso | anon | admin |
|---|---|---|
| `get_site_content()` | EXECUTE | EXECUTE |
| `site_settings` | SELECT | SELECT, UPDATE (columnas editables) |
| `section_content` | SELECT | SELECT, UPDATE (`content`) |
| `media` | SELECT | SELECT, INSERT, UPDATE, DELETE |
| `content_revisions` | — | SELECT + `restore_revision()` (las escribe solo el trigger) |
| `admins` | — | Solo por SQL |
| Storage `site-media` | Lectura por URL pública, sin listado | Escritura bajo `sections/<key>/...` |

`get_site_content()` devuelve `{ sections: { <key>: {...} }, settings: {...}, updated_at }`.
Para las imágenes devuelve `{ media_id, src, alt, width, height, blurhash }`.

## Historial y limpieza de imágenes (admin)

- `content_revisions.key`: clave de sección o `'site_settings'`. Snapshot = estado ANTERIOR al
  guardado. Se conservan las 30 más recientes por clave (poda en el trigger).
- `restore_revision(p_revision_id bigint) → jsonb { key, restored_revision }`: sirve para secciones
  y para `site_settings`; restaurar genera a su vez una revisión (se puede deshacer).
- `media_usage() → { media_id, path, used_in text[], uses }` (uso en el contenido actual).
- `list_orphan_media() → { media_id uuid|null, path, bytes, created_at, reason }`, solo filas con más
  de 1 h de antigüedad:
  - `sin_referencia`: fila en `media` no usada por `section_content` ni por ninguna revisión retenida.
  - `sin_registro`: objeto de `site-media/sections/` sin fila en `media` (`media_id = null`).
- Borrado desde el panel: primero `storage.from('site-media').remove([path])` (comprobar que
  devuelve el objeto), luego, si hay `media_id`, `delete from media where id = media_id`.

## Regenerar el sitio al guardar (Build hook de Netlify, D16-B)

Guardar en `section_content` o `site_settings` (incluido `restore_revision`) regenera el sitio en
Netlify sin intervención:

1. Un trigger `AFTER UPDATE` por fila marca `private.site_build_state.pending = true`. No hace HTTP
   y captura cualquier error: el guardado del admin nunca falla por esto.
2. El job de pg_cron `site-build-flush` (cada minuto) ejecuta `private.flush_site_build()`: si hay
   cambios pendientes y han pasado ≥ 30 s desde el último guardado (o ≥ 5 min desde el primero
   pendiente), llama a `private.request_site_build()`, que hace `POST` al Build hook vía `pg_net`.
   Varios guardados seguidos producen un solo build; el sitio se publica en ~1–3 min.

La URL del Build hook es un **secreto**: vive solo en Supabase Vault con el nombre
`netlify_build_hook_url` (nunca en el repo ni en el cliente). Sin secreto, no se dispara nada.
Nada de esto es accesible para `anon`/`authenticated` (schema `private`, sin GRANTs).

Operación (SQL Editor):

```sql
-- Rotar el hook (tras crear uno nuevo en Netlify > Build & deploy > Build hooks)
select vault.update_secret(
  (select id from vault.secrets where name = 'netlify_build_hook_url'),
  '<nueva URL>'
);

-- Borrar el hook (desactiva los builds; el resto sigue funcionando)
delete from vault.secrets where name = 'netlify_build_hook_url';

-- Pausar / reanudar el disparo automático
select cron.alter_job((select jobid from cron.job where jobname = 'site-build-flush'), active := false);
select cron.alter_job((select jobid from cron.job where jobname = 'site-build-flush'), active := true);

-- Lanzar un build a mano / ver estado y respuestas de Netlify (se guardan ~6 h)
select private.request_site_build();
select * from private.site_build_state;
select id, status_code, error_msg, created from net._http_response order by created desc limit 5;
select status, return_message, start_time from cron.job_run_details
  where jobid = (select jobid from cron.job where jobname = 'site-build-flush')
  order by start_time desc limit 5;
```

Si se borra el secreto con cambios pendientes, quedan en `pending` y se publicarán al volver a
crearlo (`vault.create_secret('<URL>', 'netlify_build_hook_url')`). Si Netlify responde con error
no hay reintento automático: basta con volver a guardar o lanzar el build a mano.

Tipos de referencia: `supabase/types/database.ts`. Se regeneran con
`generate_typescript_types` después de cada cambio de esquema.

### Riesgo aceptado: permisos por defecto de `pg_net` (D20)

Al instalar `pg_net`, Supabase concede (vía el event trigger `issue_pg_net_access` → `grant_pg_net_access`)
USAGE en el schema `net` y EXECUTE en `net.http_*` a PUBLIC/anon/authenticated, y lectura de
`net.http_request_queue` / `net._http_response` (donde queda la URL del hook mientras está pendiente).
Todo `net` es propiedad de `supabase_admin`: el rol `postgres` **no puede revocarlo** (los `revoke` son no-op).

**Hoy no es explotable:** anon/authenticated sólo llegan a la BD por PostgREST, que expone únicamente
`public` y `graphql_public` (verificado: `Accept-Profile: net` → `PGRST106`). Riesgo aceptado por el cliente
(2026-10-02). **Reglas obligatorias:**
- NUNCA añadir `net` a los *Exposed schemas* de la API (Dashboard → API settings).
- NUNCA crear funciones en `public` (ni SECURITY DEFINER expuestas) que llamen a `net.*`.
- Si se recrea o altera `pg_net`, volver a revisar estos permisos con Leona-Lia.
- Alternativa futura si el riesgo cambia: pedir a Supabase Support la revocación como `supabase_admin`, o
  sustituir `pg_net` por una Edge Function.

## Alta del admin

1. Crea el usuario en Dashboard > Authentication > Users (invitación o contraseña).
2. Ejecuta en el SQL Editor:

```sql
insert into public.admins (user_id) select id from auth.users where email = '<email>';
```

Para dar de baja al admin: `delete from public.admins where user_id = '<uuid>';`

## Recordatorio

**Desactiva los signups públicos** en Dashboard > Authentication > Sign In / Providers
("Allow new users to sign up" = off). El panel no tiene registro: solo entra el admin dado de alta
por SQL.
