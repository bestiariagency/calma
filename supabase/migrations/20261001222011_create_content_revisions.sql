-- Etapa 3 · 6/9 — Historial append-only (snapshot ANTERIOR al cambio), escrito sólo por trigger.
-- Poda a las 30 revisiones más recientes por clave. admin: S + restore_revision(). anon: nada.

create table if not exists public.content_revisions (
  id         bigint generated always as identity primary key,
  key        text not null check (key in (
               'nav', 'mobile_menu', 'hero', 'que_es', 'por_que', 'proceso', 'galeria', 'cta', 'footer',
               'site_settings')),
  snapshot   jsonb not null,
  changed_by uuid references auth.users (id) on delete set null,
  changed_at timestamptz not null default now()
);
comment on table public.content_revisions is
  'Estado previo de cada guardado (section_content por key, o site_settings). Escritura sólo por trigger.';

create index if not exists content_revisions_key_id_idx on public.content_revisions (key, id desc);
create index if not exists content_revisions_changed_by_idx on public.content_revisions (changed_by);

alter table public.content_revisions enable row level security;
alter table public.content_revisions force row level security;

revoke all on table public.content_revisions from anon, authenticated;
grant select on table public.content_revisions to authenticated;

drop policy if exists content_revisions_select_admin on public.content_revisions;
create policy content_revisions_select_admin on public.content_revisions
  for select to authenticated
  using ((select public.is_admin()));

-- Inserta la revisión y poda. SECURITY DEFINER (owner postgres, BYPASSRLS): el cliente no tiene
-- INSERT/DELETE sobre la tabla; changed_by lo fija el servidor con auth.uid().
create or replace function private.record_revision(p_key text, p_snapshot jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.content_revisions (key, snapshot, changed_by)
  values (p_key, p_snapshot, auth.uid());

  delete from public.content_revisions r
  where r.key = p_key
    and r.id not in (
      select r2.id from public.content_revisions r2
      where r2.key = p_key
      order by r2.id desc
      limit 30
    );
end;
$$;
revoke execute on function private.record_revision(text, jsonb) from public, anon, authenticated;

create or replace function private.section_content_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.content is distinct from old.content then
    perform private.record_revision(old.key, old.content);
  end if;
  return null;
end;
$$;
revoke execute on function private.section_content_revision() from public, anon, authenticated;

create or replace function private.site_settings_snapshot(p_row public.site_settings)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select to_jsonb(p_row) - 'id' - 'updated_at' - 'updated_by';
$$;
revoke execute on function private.site_settings_snapshot(public.site_settings) from public, anon, authenticated;

create or replace function private.site_settings_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_old jsonb := private.site_settings_snapshot(old);
begin
  if v_old is distinct from private.site_settings_snapshot(new) then
    perform private.record_revision('site_settings', v_old);
  end if;
  return null;
end;
$$;
revoke execute on function private.site_settings_revision() from public, anon, authenticated;

drop trigger if exists section_content_record_revision on public.section_content;
create trigger section_content_record_revision
  after update on public.section_content
  for each row execute function private.section_content_revision();

drop trigger if exists site_settings_record_revision on public.site_settings;
create trigger site_settings_record_revision
  after update on public.site_settings
  for each row execute function private.site_settings_revision();

-- Restaurar: SECURITY INVOKER → RLS/GRANTs de quien llama (sólo admin puede actualizar).
-- La restauración genera a su vez una revisión (se puede deshacer).
create or replace function public.restore_revision(p_revision_id bigint)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_rev public.content_revisions;
  v_s   public.site_settings;
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  select * into v_rev from public.content_revisions where id = p_revision_id;
  if not found then
    raise exception 'revision % not found', p_revision_id using errcode = 'P0002';
  end if;

  if v_rev.key = 'site_settings' then
    v_s := jsonb_populate_record(null::public.site_settings, v_rev.snapshot);
    update public.site_settings set
      name = v_s.name, tagline = v_s.tagline, email = v_s.email, phone = v_s.phone,
      whatsapp = v_s.whatsapp, whatsapp_message = v_s.whatsapp_message, address = v_s.address,
      city = v_s.city, region = v_s.region, maps_url = v_s.maps_url,
      opening_hours = v_s.opening_hours, social = v_s.social
    where id;
  else
    update public.section_content set content = v_rev.snapshot where key = v_rev.key;
  end if;

  return jsonb_build_object('key', v_rev.key, 'restored_revision', v_rev.id);
end;
$$;
comment on function public.restore_revision(bigint) is 'Sólo admin. Restaura el snapshot de una revisión.';
revoke execute on function public.restore_revision(bigint) from public, anon, authenticated;
grant execute on function public.restore_revision(bigint) to authenticated;
