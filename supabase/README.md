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

Tipos de referencia: `supabase/types/database.ts`. Se regeneran con
`generate_typescript_types` después de cada cambio de esquema.

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
