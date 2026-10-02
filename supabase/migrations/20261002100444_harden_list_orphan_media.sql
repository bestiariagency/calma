-- Etapa 10 — `list_orphan_media()` seguro para limpieza.
-- Una imagen NO es huérfana si la referencia el contenido actual (section_content) o cualquier
-- snapshot retenido en content_revisions (restaurar no debe apuntar a una foto borrada).
-- Además lista objetos de Storage bajo `sections/` sin fila en `media` (subidas canceladas).
-- Margen de 1 hora en ambos casos para no tocar subidas/ediciones en curso.
-- Cambia las columnas de salida → requiere drop + create; los GRANTs se reponen idénticos
-- a los previos (EXECUTE sólo authenticated; la función exige is_admin()).

drop function if exists public.list_orphan_media();

create function public.list_orphan_media()
returns table (media_id uuid, path text, bytes integer, created_at timestamptz, reason text)
language plpgsql
stable
security invoker
set search_path = ''
as $$
#variable_conflict use_column
declare
  v_cutoff constant timestamptz := now() - interval '1 hour';
begin
  if not (select public.is_admin()) then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  return query
  with refs as (
    select v #>> '{}' as ref
    from public.section_content sc,
         jsonb_path_query(sc.content, 'strict $.**.media_id') as v
    union
    select v #>> '{}'
    from public.content_revisions r,
         jsonb_path_query(r.snapshot, 'strict $.**.media_id') as v
  )
  select m.id, m.path, m.bytes, m.created_at, 'sin_referencia'::text
  from public.media m
  where m.created_at < v_cutoff
    and not exists (select 1 from refs where refs.ref = m.id::text)
  union all
  select null::uuid, o.name, coalesce((o.metadata ->> 'size')::integer, 0), o.created_at,
         'sin_registro'::text
  from storage.objects o
  where o.bucket_id = 'site-media'
    and o.name like 'sections/%'
    and o.created_at < v_cutoff
    and not exists (select 1 from public.media m2 where m2.path = o.name)
  order by 4;
end;
$$;
comment on function public.list_orphan_media() is
  'Sólo admin. Candidatas a limpieza (>1 h): media sin referencia en contenido ni revisiones '
  '(sin_referencia) y objetos de sections/ sin fila en media (sin_registro).';

revoke execute on function public.list_orphan_media() from public, anon, authenticated;
grant execute on function public.list_orphan_media() to authenticated;
