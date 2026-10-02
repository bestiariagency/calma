-- Etapa 3 · 2/9 — Rol único `admin`: tabla `admins` + helper `is_admin()`.
-- Alta de admin SÓLO por SQL (ver supabase/README.md). Sin policies de escritura.

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
comment on table public.admins is 'Usuarios con rol admin. Alta/baja sólo por SQL (sin escritura desde el cliente).';

alter table public.admins enable row level security;
alter table public.admins force row level security;

revoke all on table public.admins from anon, authenticated;
grant select on table public.admins to authenticated;

-- SECURITY DEFINER (owner postgres, BYPASSRLS): consulta admins sin recursión de RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a where a.user_id = (select auth.uid())
  );
$$;
comment on function public.is_admin() is 'true si el usuario autenticado está en public.admins.';

revoke execute on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;

drop policy if exists admins_select_admin on public.admins;
create policy admins_select_admin on public.admins
  for select to authenticated
  using ((select public.is_admin()));
