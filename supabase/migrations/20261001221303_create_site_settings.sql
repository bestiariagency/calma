-- Etapa 3 · 4/9 — Datos de la empresa (`COMPANY` editable). Fila única, sin INSERT/DELETE desde cliente.
-- Longitudes = maxLength de src/data/contentSchema.js (company). Vacío ('') = aún no definido.
-- El logo (SVG estático) NO está en la BD.

create table if not exists public.site_settings (
  id               boolean primary key default true check (id),
  name             text not null check (char_length(name) between 1 and 20),
  tagline          text not null default '' check (char_length(tagline) <= 60),
  email            text not null check (
                     char_length(email) <= 30
                     and email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  phone            text not null check (
                     char_length(phone) <= 30
                     and phone ~ '^\+?[0-9][0-9 ().-]*$'),
  whatsapp         text not null check (
                     char_length(whatsapp) <= 20
                     and whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  whatsapp_message text not null default '' check (char_length(whatsapp_message) <= 120),
  address          text not null default '' check (char_length(address) <= 120),
  city             text not null default '' check (char_length(city) <= 60),
  region           text not null default '' check (char_length(region) <= 60),
  maps_url         text not null default '' check (
                     maps_url = ''
                     or (char_length(maps_url) <= 300 and maps_url ~ '^https://[^\s/$.?#][^\s]*$')),
  opening_hours    text not null default '' check (char_length(opening_hours) <= 200),
  social           jsonb not null
                     default '{"instagram":"","facebook":"","tiktok":"","youtube":""}'::jsonb
                     check (extensions.jsonb_matches_schema(
                       '{
                         "type": "object",
                         "additionalProperties": false,
                         "required": ["instagram", "facebook", "tiktok", "youtube"],
                         "properties": {
                           "instagram": {"type": "string", "maxLength": 200, "pattern": "^$|^https://[^\\s/$.?#][^\\s]*$"},
                           "facebook":  {"type": "string", "maxLength": 200, "pattern": "^$|^https://[^\\s/$.?#][^\\s]*$"},
                           "tiktok":    {"type": "string", "maxLength": 200, "pattern": "^$|^https://[^\\s/$.?#][^\\s]*$"},
                           "youtube":   {"type": "string", "maxLength": 200, "pattern": "^$|^https://[^\\s/$.?#][^\\s]*$"}
                         }
                       }'::json, social)),
  updated_at       timestamptz not null default now(),
  updated_by       uuid references auth.users (id) on delete set null
);
comment on table public.site_settings is 'Datos de la empresa (fila única id = true). Guardar = publicar.';

create index if not exists site_settings_updated_by_idx on public.site_settings (updated_by);

alter table public.site_settings enable row level security;

revoke all on table public.site_settings from anon, authenticated;
grant select on table public.site_settings to anon, authenticated;
-- UPDATE sólo de columnas editables (id/updated_* los fija el servidor).
grant update (name, tagline, email, phone, whatsapp, whatsapp_message, address, city, region,
              maps_url, opening_hours, social)
  on table public.site_settings to authenticated;

drop trigger if exists site_settings_set_audit on public.site_settings;
create trigger site_settings_set_audit
  before update on public.site_settings
  for each row execute function private.set_audit_fields();

-- SELECT público documentado: son los datos de contacto que ya muestra el sitio.
drop policy if exists site_settings_select_public on public.site_settings;
create policy site_settings_select_public on public.site_settings
  for select to anon, authenticated
  using (true);

drop policy if exists site_settings_update_admin on public.site_settings;
create policy site_settings_update_admin on public.site_settings
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
