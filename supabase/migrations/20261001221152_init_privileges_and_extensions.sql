-- Etapa 3 · 1/9 — Privilegios mínimos por defecto, extensiones y helpers comunes.
-- Condición de veto de Leona-Lia: ninguna tabla/función/secuencia nueva en `public`
-- queda abierta a anon/authenticated sin un GRANT explícito.

-- 1) Default privileges de `postgres` en public: fuera anon/authenticated.
alter default privileges for role postgres in schema public revoke all on tables    from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on functions from anon, authenticated;
-- EXECUTE a PUBLIC es un default global (no por schema): se revoca para funciones futuras de postgres.
alter default privileges for role postgres revoke execute on functions from public;

-- 2) Ídem para supabase_admin (sólo si el rol que migra tiene permiso; en la plataforma
--    gestionada `postgres` no es miembro de supabase_admin → se registra un NOTICE).
do $$
begin
  execute 'alter default privileges for role supabase_admin in schema public revoke all on tables    from anon, authenticated';
  execute 'alter default privileges for role supabase_admin in schema public revoke all on sequences from anon, authenticated';
  execute 'alter default privileges for role supabase_admin in schema public revoke all on functions from anon, authenticated';
exception when insufficient_privilege then
  raise notice 'Sin permiso para alterar default privileges de supabase_admin; se mantiene GRANT explícito por objeto.';
end $$;

-- 3) Funciones ya existentes en public: sin EXECUTE implícito.
revoke execute on all functions in schema public from public, anon, authenticated;

-- 4) Extensiones.
create extension if not exists pg_jsonschema with schema extensions;

-- 5) Schema `private` (no expuesto por PostgREST) para helpers internos.
create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to anon, authenticated;

-- 6) Helper de updated_at.
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
revoke execute on function private.set_updated_at() from public, anon, authenticated;

-- 7) Helper de auditoría de edición: updated_at + updated_by fijados por el servidor.
create or replace function private.set_audit_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.updated_by := auth.uid();
  return new;
end;
$$;
revoke execute on function private.set_audit_fields() from public, anon, authenticated;
