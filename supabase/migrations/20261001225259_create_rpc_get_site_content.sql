-- Etapa 3 · 8/9 — RPC pública `get_site_content()` (una sola llamada) + RPC de admin sobre media.
-- Imagen devuelta: {media_id, src, alt, width, height, blurhash}. Si media_id apunta a `media`,
-- src = URL pública del bucket y width/height/blurhash salen de `media`; si no, se conserva el src estático.

create or replace function private.media_public_url(p_path text)
returns text
language sql
immutable
set search_path = ''
as $$
  select 'https://lgiajkdvuftvtincbqzi.supabase.co/storage/v1/object/public/site-media/' || p_path;
$$;

-- Recorre el jsonb y resuelve cada objeto imagen (los que tienen clave media_id) con el mapa de media.
create or replace function private.resolve_images(p_value jsonb, p_media jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  v_out   jsonb;
  v_media jsonb;
begin
  case jsonb_typeof(p_value)
    when 'object' then
      if p_value ? 'media_id' then
        if jsonb_typeof(p_value -> 'media_id') = 'string' then
          v_media := p_media -> (p_value ->> 'media_id');
        end if;
        if v_media is null then
          return p_value || jsonb_build_object('blurhash', null);
        end if;
        return p_value || jsonb_build_object(
          'src',      v_media -> 'url',
          'width',    v_media -> 'width',
          'height',   v_media -> 'height',
          'blurhash', v_media -> 'blurhash'
        );
      end if;
      select coalesce(jsonb_object_agg(e.key, private.resolve_images(e.value, p_media)), '{}'::jsonb)
        into v_out
        from jsonb_each(p_value) as e;
      return v_out;
    when 'array' then
      select coalesce(jsonb_agg(private.resolve_images(a.value, p_media) order by a.ord), '[]'::jsonb)
        into v_out
        from jsonb_array_elements(p_value) with ordinality as a(value, ord);
      return v_out;
    else
      return p_value;
  end case;
end;
$$;

revoke execute on function private.media_public_url(text) from public, anon, authenticated;
revoke execute on function private.resolve_images(jsonb, jsonb) from public, anon, authenticated;
revoke execute on function private.site_settings_snapshot(public.site_settings) from public, anon, authenticated;
grant execute on function private.media_public_url(text) to anon, authenticated;
grant execute on function private.resolve_images(jsonb, jsonb) to anon, authenticated;
grant execute on function private.site_settings_snapshot(public.site_settings) to anon, authenticated;

-- SECURITY INVOKER: respeta RLS (SELECT público de site_settings, section_content y media).
create or replace function public.get_site_content()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  with used_media as (
    select coalesce(jsonb_object_agg(m.id::text, jsonb_build_object(
             'url',      private.media_public_url(m.path),
             'width',    m.width,
             'height',   m.height,
             'blurhash', m.blurhash)), '{}'::jsonb) as map
    from public.media m
    where m.id::text in (
      select v #>> '{}'
      from public.section_content sc,
           jsonb_path_query(sc.content, 'strict $.**.media_id') as v
    )
  )
  select jsonb_build_object(
    'settings', (select private.site_settings_snapshot(s) from public.site_settings s where s.id),
    'sections', (select coalesce(jsonb_object_agg(sc.key, private.resolve_images(sc.content, um.map)), '{}'::jsonb)
                 from public.section_content sc),
    'updated_at', greatest(
                    (select max(sc.updated_at) from public.section_content sc),
                    (select s.updated_at from public.site_settings s where s.id))
  )
  from used_media um;
$$;
comment on function public.get_site_content() is 'Contenido público completo: {settings, sections, updated_at}.';
revoke execute on function public.get_site_content() from public, anon, authenticated;
grant execute on function public.get_site_content() to anon, authenticated;

-- Uso de cada imagen en el contenido actual (sólo admin).
create or replace function public.media_usage()
returns table (media_id uuid, path text, used_in text[], uses integer)
language plpgsql
stable
security invoker
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select m.id, m.path,
         coalesce(array_agg(distinct u.key) filter (where u.key is not null), '{}'::text[]),
         count(u.key)::integer
  from public.media m
  left join (
    select sc.key, v #>> '{}' as ref
    from public.section_content sc,
         jsonb_path_query(sc.content, 'strict $.**.media_id') as v
  ) u on u.ref = m.id::text
  group by m.id, m.path
  order by m.created_at desc;
end;
$$;
comment on function public.media_usage() is 'Sólo admin. Secciones que usan cada imagen.';

-- Imágenes no usadas por el contenido actual (candidatas a limpieza). Sólo admin.
create or replace function public.list_orphan_media()
returns table (media_id uuid, path text, bytes integer, created_at timestamptz,
               referenced_in_revisions boolean)
language plpgsql
stable
security invoker
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  select m.id, m.path, m.bytes, m.created_at,
         exists (
           select 1 from public.content_revisions r
           where jsonb_path_exists(r.snapshot, 'strict $.**.media_id ? (@ == $id)',
                                   jsonb_build_object('id', m.id::text))
         )
  from public.media m
  where not exists (
    select 1
    from public.section_content sc
    where jsonb_path_exists(sc.content, 'strict $.**.media_id ? (@ == $id)',
                            jsonb_build_object('id', m.id::text))
  )
  order by m.created_at;
end;
$$;
comment on function public.list_orphan_media() is 'Sólo admin. Media sin uso en el contenido actual.';

revoke execute on function public.media_usage() from public, anon, authenticated;
revoke execute on function public.list_orphan_media() from public, anon, authenticated;
grant execute on function public.media_usage() to authenticated;
grant execute on function public.list_orphan_media() to authenticated;
