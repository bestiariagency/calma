-- Etapa 3 · 3/9 — Registro de imágenes subidas al bucket `site-media`.
-- anon: S · admin: S, I, U, D. Las secciones referencian `media_id` dentro del jsonb.

create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  path       text not null unique
             check (path ~ '^sections/[a-z_]+/[A-Za-z0-9_-]{1,64}\.(webp|avif|jpg|jpeg|png)$'),
  alt        text not null default '' check (char_length(alt) <= 200),
  width      integer not null check (width  between 1 and 10000),
  height     integer not null check (height between 1 and 10000),
  bytes      integer not null check (bytes between 1 and 5242880),
  mime       text not null check (mime in ('image/webp', 'image/avif', 'image/jpeg', 'image/png')),
  blurhash   text check (char_length(blurhash) <= 100),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);
comment on table public.media is 'Imágenes del bucket site-media (path relativo al bucket).';

create index if not exists media_created_by_idx on public.media (created_by);

alter table public.media enable row level security;

revoke all on table public.media from anon, authenticated;
grant select on table public.media to anon, authenticated;
grant insert, update, delete on table public.media to authenticated;

-- created_by fijado por el servidor (no falsificable desde el cliente).
create or replace function private.set_media_created_by()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.created_by := auth.uid();
  new.created_at := now();
  return new;
end;
$$;
revoke execute on function private.set_media_created_by() from public, anon, authenticated;

drop trigger if exists media_set_created_by on public.media;
create trigger media_set_created_by
  before insert on public.media
  for each row execute function private.set_media_created_by();

drop trigger if exists media_set_updated_at on public.media;
create trigger media_set_updated_at
  before update on public.media
  for each row execute function private.set_updated_at();

-- Policies: SELECT público documentado (metadatos de imágenes publicadas, sin datos sensibles).
drop policy if exists media_select_public on public.media;
create policy media_select_public on public.media
  for select to anon, authenticated
  using (true);

drop policy if exists media_insert_admin on public.media;
create policy media_insert_admin on public.media
  for insert to authenticated
  with check ((select public.is_admin()));

drop policy if exists media_update_admin on public.media;
create policy media_update_admin on public.media
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists media_delete_admin on public.media;
create policy media_delete_admin on public.media
  for delete to authenticated
  using ((select public.is_admin()));
