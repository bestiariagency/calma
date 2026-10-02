-- Etapa 3 · 5/9 — Contenido editable por sección (jsonb validado con JSON Schema por clave).
-- Fuente de verdad de campos: src/data/contentSchema.js (generado desde ahí). Sólo campos editables;
-- hrefs, números ordinales y markers quedan en código (merge por path e índice en el frontend).
-- Listas de tamaño FIJO (minItems = maxItems). Imagen = {media_id, src, alt, width, height}.
-- Filas creadas sólo en el seed: sin INSERT/DELETE desde cliente. anon: S · admin: S, U(content).

create or replace function private.section_content_schema(p_key text)
returns json
language sql
immutable
set search_path = ''
as $$
  select case p_key
    when 'nav' then '{"type":"object","additionalProperties":false,"required":["links"],"properties":{"links":{"type":"array","minItems":4,"maxItems":4,"items":{"type":"object","additionalProperties":false,"required":["label"],"properties":{"label":{"type":"string","maxLength":20}}}}}}'::json
    when 'mobile_menu' then '{"type":"object","additionalProperties":false,"required":["links"],"properties":{"links":{"type":"array","minItems":6,"maxItems":6,"items":{"type":"object","additionalProperties":false,"required":["label"],"properties":{"label":{"type":"string","maxLength":30}}}}}}'::json
    when 'hero' then '{"type":"object","additionalProperties":false,"required":["image","cta"],"properties":{"image":{"type":"object","additionalProperties":false,"required":["media_id","src","alt","width","height"],"properties":{"media_id":{"type":["string","null"],"pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},"src":{"type":["string","null"],"maxLength":300,"pattern":"^/images/[A-Za-z0-9._/-]+$"},"alt":{"type":"string","minLength":1,"maxLength":70},"width":{"type":["integer","null"],"minimum":1,"maximum":10000},"height":{"type":["integer","null"],"minimum":1,"maximum":10000}},"anyOf":[{"properties":{"media_id":{"type":"string"}}},{"properties":{"src":{"type":"string"}}}]},"cta":{"type":"string","maxLength":40}}}'::json
    when 'que_es' then '{"type":"object","additionalProperties":false,"required":["label","title","paragraphs","image"],"properties":{"label":{"type":"string","maxLength":20},"title":{"type":"string","maxLength":60},"paragraphs":{"type":"array","minItems":2,"maxItems":2,"items":[{"type":"string","maxLength":370},{"type":"string","maxLength":320}],"additionalItems":false},"image":{"type":"object","additionalProperties":false,"required":["media_id","src","alt","width","height"],"properties":{"media_id":{"type":["string","null"],"pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},"src":{"type":["string","null"],"maxLength":300,"pattern":"^/images/[A-Za-z0-9._/-]+$"},"alt":{"type":"string","minLength":1,"maxLength":60},"width":{"type":["integer","null"],"minimum":1,"maximum":10000},"height":{"type":["integer","null"],"minimum":1,"maximum":10000}},"anyOf":[{"properties":{"media_id":{"type":"string"}}},{"properties":{"src":{"type":"string"}}}]}}}'::json
    when 'por_que' then '{"type":"object","additionalProperties":false,"required":["label","title","imageTop","imageBottom","features"],"properties":{"label":{"type":"string","maxLength":30},"title":{"type":"string","maxLength":60},"imageTop":{"type":"object","additionalProperties":false,"required":["media_id","src","alt","width","height"],"properties":{"media_id":{"type":["string","null"],"pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},"src":{"type":["string","null"],"maxLength":300,"pattern":"^/images/[A-Za-z0-9._/-]+$"},"alt":{"type":"string","minLength":1,"maxLength":60},"width":{"type":["integer","null"],"minimum":1,"maximum":10000},"height":{"type":["integer","null"],"minimum":1,"maximum":10000}},"anyOf":[{"properties":{"media_id":{"type":"string"}}},{"properties":{"src":{"type":"string"}}}]},"imageBottom":{"type":"object","additionalProperties":false,"required":["media_id","src","alt","width","height"],"properties":{"media_id":{"type":["string","null"],"pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},"src":{"type":["string","null"],"maxLength":300,"pattern":"^/images/[A-Za-z0-9._/-]+$"},"alt":{"type":"string","minLength":1,"maxLength":40},"width":{"type":["integer","null"],"minimum":1,"maximum":10000},"height":{"type":["integer","null"],"minimum":1,"maximum":10000}},"anyOf":[{"properties":{"media_id":{"type":"string"}}},{"properties":{"src":{"type":"string"}}}]},"features":{"type":"array","minItems":4,"maxItems":4,"items":{"type":"object","additionalProperties":false,"required":["title","description"],"properties":{"title":{"type":"string","maxLength":40},"description":{"type":"string","maxLength":150}}}}}}'::json
    when 'proceso' then '{"type":"object","additionalProperties":false,"required":["label","image","steps"],"properties":{"label":{"type":"string","maxLength":20},"image":{"type":"object","additionalProperties":false,"required":["media_id","src","alt","width","height"],"properties":{"media_id":{"type":["string","null"],"pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},"src":{"type":["string","null"],"maxLength":300,"pattern":"^/images/[A-Za-z0-9._/-]+$"},"alt":{"type":"string","minLength":1,"maxLength":50},"width":{"type":["integer","null"],"minimum":1,"maximum":10000},"height":{"type":["integer","null"],"minimum":1,"maximum":10000}},"anyOf":[{"properties":{"media_id":{"type":"string"}}},{"properties":{"src":{"type":"string"}}}]},"steps":{"type":"array","minItems":3,"maxItems":3,"items":{"type":"object","additionalProperties":false,"required":["number","title","description"],"properties":{"number":{"type":"string","maxLength":30},"title":{"type":"string","maxLength":50},"description":{"type":"string","maxLength":130}}}}}}'::json
    when 'galeria' then '{"type":"object","additionalProperties":false,"required":["label","title","disclaimer","images"],"properties":{"label":{"type":"string","maxLength":20},"title":{"type":"string","maxLength":50},"disclaimer":{"type":"string","maxLength":210},"images":{"type":"array","minItems":4,"maxItems":4,"items":{"type":"object","additionalProperties":false,"required":["media_id","src","alt","width","height"],"properties":{"media_id":{"type":["string","null"],"pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},"src":{"type":["string","null"],"maxLength":300,"pattern":"^/images/[A-Za-z0-9._/-]+$"},"alt":{"type":"string","minLength":1,"maxLength":40},"width":{"type":["integer","null"],"minimum":1,"maximum":10000},"height":{"type":["integer","null"],"minimum":1,"maximum":10000}},"anyOf":[{"properties":{"media_id":{"type":"string"}}},{"properties":{"src":{"type":"string"}}}]}}}}'::json
    when 'cta' then '{"type":"object","additionalProperties":false,"required":["label","title","subtitle","cta","image"],"properties":{"label":{"type":"string","maxLength":20},"title":{"type":"string","maxLength":30},"subtitle":{"type":"string","maxLength":90},"cta":{"type":"string","maxLength":40},"image":{"type":"object","additionalProperties":false,"required":["media_id","src","alt","width","height"],"properties":{"media_id":{"type":["string","null"],"pattern":"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"},"src":{"type":["string","null"],"maxLength":300,"pattern":"^/images/[A-Za-z0-9._/-]+$"},"alt":{"type":"string","minLength":1,"maxLength":50},"width":{"type":["integer","null"],"minimum":1,"maximum":10000},"height":{"type":["integer","null"],"minimum":1,"maximum":10000}},"anyOf":[{"properties":{"media_id":{"type":"string"}}},{"properties":{"src":{"type":"string"}}}]}}}'::json
    when 'footer' then '{"type":"object","additionalProperties":false,"required":["links","copyrightName"],"properties":{"links":{"type":"array","minItems":3,"maxItems":3,"items":{"type":"object","additionalProperties":false,"required":["label"],"properties":{"label":{"type":"string","maxLength":20}}}},"copyrightName":{"type":"string","maxLength":20}}}'::json
  end;
$$;
comment on function private.section_content_schema(text) is 'JSON Schema (draft-07) de cada sección; refleja src/data/contentSchema.js.';

create or replace function private.section_content_is_valid(p_key text, p_content jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    extensions.jsonb_matches_schema(private.section_content_schema(p_key), p_content),
    false
  );
$$;

-- El CHECK se evalúa con los privilegios de quien escribe: authenticated necesita EXECUTE.
revoke execute on function private.section_content_schema(text) from public, anon, authenticated;
revoke execute on function private.section_content_is_valid(text, jsonb) from public, anon, authenticated;
grant execute on function private.section_content_schema(text) to authenticated;
grant execute on function private.section_content_is_valid(text, jsonb) to authenticated;

create table if not exists public.section_content (
  key            text primary key check (key in (
                   'nav', 'mobile_menu', 'hero', 'que_es', 'por_que', 'proceso', 'galeria', 'cta', 'footer')),
  content        jsonb not null,
  schema_version integer not null default 1 check (schema_version >= 1),
  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users (id) on delete set null,
  constraint section_content_matches_schema check (private.section_content_is_valid(key, content))
);
comment on table public.section_content is 'Contenido editable de la landing, una fila por sección. Guardar = publicar.';

create index if not exists section_content_updated_by_idx on public.section_content (updated_by);

alter table public.section_content enable row level security;

revoke all on table public.section_content from anon, authenticated;
grant select on table public.section_content to anon, authenticated;
grant update (content) on table public.section_content to authenticated;

drop trigger if exists section_content_set_audit on public.section_content;
create trigger section_content_set_audit
  before update on public.section_content
  for each row execute function private.set_audit_fields();

-- SELECT público documentado: todo el contenido es público (sin borradores).
drop policy if exists section_content_select_public on public.section_content;
create policy section_content_select_public on public.section_content
  for select to anon, authenticated
  using (true);

drop policy if exists section_content_update_admin on public.section_content;
create policy section_content_update_admin on public.section_content
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));
