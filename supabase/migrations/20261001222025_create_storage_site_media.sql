-- Etapa 3 · 7/9 — Bucket público `site-media` (lectura por URL pública, sin listado para anon).
-- 5 MB, sólo webp/avif/jpeg/png (sin SVG). Escritura sólo admin bajo `sections/<key>/...`.
-- La URL pública (/storage/v1/object/public/...) no pasa por RLS: no hace falta SELECT para anon.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880,
        array['image/webp', 'image/avif', 'image/jpeg', 'image/png'])
on conflict (id) do update set
  public             = excluded.public,
  file_size_limit    = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- SELECT sólo admin: la API de Storage lo necesita para upsert/remove (RETURNING). anon no lista.
drop policy if exists site_media_select_admin on storage.objects;
create policy site_media_select_admin on storage.objects
  for select to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));

drop policy if exists site_media_insert_admin on storage.objects;
create policy site_media_insert_admin on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'site-media'
    and (storage.foldername(name))[1] = 'sections'
    and (select public.is_admin())
  );

drop policy if exists site_media_update_admin on storage.objects;
create policy site_media_update_admin on storage.objects
  for update to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()))
  with check (
    bucket_id = 'site-media'
    and (storage.foldername(name))[1] = 'sections'
    and (select public.is_admin())
  );

drop policy if exists site_media_delete_admin on storage.objects;
create policy site_media_delete_admin on storage.objects
  for delete to authenticated
  using (bucket_id = 'site-media' and (select public.is_admin()));
