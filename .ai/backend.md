# Backend — estándar (Jabalí-Javi)

## Proyecto
**Único proyecto:** `lgiajkdvuftvtincbqzi` (`https://lgiajkdvuftvtincbqzi.supabase.co`), región
eu-west-1, solo vía MCP `mcp__supabase__`. Prohibido cualquier otro servidor MCP de Supabase.

## Dominio de datos (previsto)
Tres áreas, por orden probable de construcción:

1. **Leads / contacto** — solicitudes del formulario público (nombre, contacto, mensaje,
   modelo de interés, origen/UTM, estado interno). `anon` solo INSERT; admin todo.
2. **Catálogo / CMS** — productos/modelos, imágenes (Storage), galería, textos editables.
   `anon` solo SELECT de filas publicadas (`is_published = true`); admin todo.
3. **Panel admin del negocio** — clientes, presupuestos, pedidos, producción. Solo admin.

## Roles y autorización
- `anon`: público del sitio. `authenticated` NO implica admin.
- **`admin`**: rol único. Fuente de verdad: tabla `public.admins (user_id uuid pk references auth.users)`
  consultada por `public.is_admin()` — `SECURITY DEFINER`, `STABLE`, `set search_path = ''`,
  sin recursión. Todas las policies de admin usan `(select public.is_admin())`.
- Los permisos existentes son **intocables** salvo petición explícita.

## Migraciones
- Inspecciona antes: `list_tables`, `list_migrations`.
- Aplicar con `apply_migration` (DDL) y guardar copia en `supabase/migrations/<timestamp>_<nombre>.sql`.
- Idempotentes (`if not exists`, `create or replace`, `drop policy if exists` antes de recrear).
- Nombres en snake_case; tablas en plural; `id uuid default gen_random_uuid()` o identity;
  `created_at`/`updated_at timestamptz` con trigger de `updated_at`.
- Datos de prueba en migraciones separadas y nunca en producción sin aprobación.

## RLS
- `enable row level security` en **toda** tabla nueva, en la misma migración.
- Una policy por operación (`select`/`insert`/`update`/`delete`) y rol (`to anon`, `to authenticated`).
- Nada de `using (true)` salvo SELECT público de contenido publicado, documentado.
- INSERT público (leads) con `with check` que fuerce valores por defecto en campos internos
  (estado, notas) — mejor aún: GRANT de columnas o RPC.
- Revoca GRANTs innecesarios a `anon` en tablas internas.

## Edge Functions y RPC
- Lógica con secretos o privilegios → Edge Function (secrets vía `supabase secrets`).
- Anti-spam en leads (rate limit / honeypot / captcha) en Edge Function si hace falta.
- RPC `SECURITY DEFINER` solo cuando sea imprescindible, con validación interna de `is_admin()`.

## Después de cada cambio
`get_advisors` (security + performance), regenerar tipos si se usan, y pasar a Leona-Lia.
