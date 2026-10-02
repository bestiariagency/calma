-- Etapa 11 · D16-B — Policies explícitas de denegación en private.site_build_state.
-- Tabla interna: anon/authenticated no tienen GRANTs ni acceso; sólo la usan las funciones
-- SECURITY DEFINER del build y el job de pg_cron (postgres, que omite RLS como propietario).
-- Una policy por operación, denegando, para dejarlo explícito (lint 0008).

drop policy if exists site_build_state_select_deny on private.site_build_state;
create policy site_build_state_select_deny on private.site_build_state
  for select to anon, authenticated using (false);

drop policy if exists site_build_state_insert_deny on private.site_build_state;
create policy site_build_state_insert_deny on private.site_build_state
  for insert to anon, authenticated with check (false);

drop policy if exists site_build_state_update_deny on private.site_build_state;
create policy site_build_state_update_deny on private.site_build_state
  for update to anon, authenticated using (false) with check (false);

drop policy if exists site_build_state_delete_deny on private.site_build_state;
create policy site_build_state_delete_deny on private.site_build_state
  for delete to anon, authenticated using (false);
