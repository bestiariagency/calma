-- Etapa 11 · D16-B — Regenerar el sitio (Build hook de Netlify) tras guardar contenido.
-- La URL del Build hook es un SECRETO: vive sólo en Supabase Vault con el nombre
-- `netlify_build_hook_url` (nunca en el repo). Sin secreto, el mecanismo no hace nada.
--
-- Diseño (coalescencia con pg_cron, trailing debounce):
--   1) Triggers AFTER UPDATE por fila en section_content y site_settings (un UPDATE que RLS
--      deja en 0 filas no dispara nada) sólo marcan `pending` en private.site_build_state. Sin HTTP
--      dentro del guardado; cualquier error se captura y se emite WARNING: el UPDATE del admin nunca falla por esto.
--   2) Un job de pg_cron cada minuto llama a private.flush_site_build(): si hay cambios pendientes
--      y han pasado ≥ 30 s desde el último guardado (o ≥ 5 min desde el primero sin publicar),
--      pide UN build a Netlify vía pg_net y limpia el flag. Así N guardados seguidos = 1 build y
--      el último cambio nunca se pierde (un guardado posterior vuelve a marcar pendiente).
-- Permisos: nada nuevo para anon/authenticated (tabla y funciones en `private`, sin GRANTs).

create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

-- 1) Estado (una sola fila).
create table if not exists private.site_build_state (
  id                boolean primary key default true check (id),
  pending           boolean not null default false,
  pending_since     timestamptz,
  last_change_at    timestamptz,
  last_requested_at timestamptz,
  last_request_id   bigint
);
comment on table private.site_build_state is
  'Coalescencia de builds de Netlify (D16-B). Lo escriben los triggers de contenido y el job site-build-flush.';

alter table private.site_build_state enable row level security;
-- Sin policies a propósito: sólo la usan funciones SECURITY DEFINER y el job (postgres).
revoke all on table private.site_build_state from public, anon, authenticated;

insert into private.site_build_state (id) values (true) on conflict (id) do nothing;

-- 2) Petición del build (lee el secreto de Vault). Devuelve el id de pg_net o null si no hay secreto.
create or replace function private.request_site_build()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text;
begin
  select ds.decrypted_secret into v_url
  from vault.decrypted_secrets ds
  where ds.name = 'netlify_build_hook_url'
  limit 1;

  if v_url is null or v_url = '' then
    return null;
  end if;

  return net.http_post(url := v_url, body := '{}'::jsonb);
end;
$$;
revoke execute on function private.request_site_build() from public, anon, authenticated;

-- 3) Flush (lo llama el job cada minuto). No bloquea a un guardado en curso (skip locked).
create or replace function private.flush_site_build()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_state      private.site_build_state%rowtype;
  v_request_id bigint;
begin
  select * into v_state
  from private.site_build_state
  where id
  for update skip locked;

  if not found or not v_state.pending then
    return null;
  end if;

  if v_state.last_change_at > now() - interval '30 seconds'
     and v_state.pending_since > now() - interval '5 minutes' then
    return null; -- siguen llegando guardados: esperar al siguiente minuto
  end if;

  v_request_id := private.request_site_build();
  if v_request_id is null then
    return null; -- sin secreto en Vault: se mantiene pendiente
  end if;

  update private.site_build_state
  set pending = false,
      pending_since = null,
      last_requested_at = now(),
      last_request_id = v_request_id
  where id;

  return v_request_id;
end;
$$;
revoke execute on function private.flush_site_build() from public, anon, authenticated;

-- 4) Trigger: marcar pendiente. Nunca hace fallar el UPDATE.
create or replace function private.mark_site_build_pending()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  begin
    insert into private.site_build_state as s (id, pending, pending_since, last_change_at)
    values (true, true, now(), now())
    on conflict (id) do update
      set pending        = true,
          last_change_at = now(),
          pending_since  = case when s.pending then coalesce(s.pending_since, now()) else now() end;
  exception when others then
    raise warning 'mark_site_build_pending: % (%)', sqlerrm, sqlstate;
  end;
  return null;
end;
$$;
revoke execute on function private.mark_site_build_pending() from public, anon, authenticated;

drop trigger if exists section_content_request_site_build on public.section_content;
create trigger section_content_request_site_build
  after update on public.section_content
  for each row execute function private.mark_site_build_pending();

drop trigger if exists site_settings_request_site_build on public.site_settings;
create trigger site_settings_request_site_build
  after update on public.site_settings
  for each row execute function private.mark_site_build_pending();

-- 5) Job cada minuto (cron.schedule con nombre es idempotente: reemplaza el existente).
select cron.schedule('site-build-flush', '* * * * *', 'select private.flush_site_build()');
