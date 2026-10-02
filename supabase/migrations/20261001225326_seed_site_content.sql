-- Etapa 3 · 9/9 — Seed inicial desde src/data/content.js (sólo campos editables del esquema).
-- Sin el crédito Bestiari ni lo comentado en código (tag/títulos/subtítulos del Hero).
-- Idempotente: no sobrescribe ediciones posteriores (on conflict do nothing).
-- Cada fila de section_content pasa por el CHECK section_content_matches_schema (JSON Schema).

insert into public.site_settings (
  id, name, tagline, email, phone, whatsapp, whatsapp_message,
  address, city, region, maps_url, opening_hours, social
) values (
  true, 'CALMA', 'TINAJAS DE CONCRETO ARTESANAL', 'info@calma.es', '+56 9 2253 8166', '+56922538166',
  'Hola, me interesa una tinaja CALMA',
  '', '', '', '', '', '{"instagram":"","facebook":"","tiktok":"","youtube":""}'::jsonb
)
on conflict (id) do nothing;

insert into public.section_content (key, content) values
  ('nav', '{"links":[{"label":"Inicio"},{"label":"Producto"},{"label":"Galería"},{"label":"Contacto"}]}'::jsonb),
  ('mobile_menu', '{"links":[{"label":"INICIO"},{"label":"QUÉ ES"},{"label":"POR QUÉ HORMIGÓN"},{"label":"PROCESO"},{"label":"GALERÍA"},{"label":"HABLEMOS"}]}'::jsonb),
  ('hero', '{"image":{"media_id":null,"src":"/images/hero-dia.webp","alt":"Tinaja artesanal de hormigón en jardín","width":1853,"height":1034},"cta":"Consulta por tu tinaja"}'::jsonb),
  ('que_es', '{"label":"QUÉ ES","title":"Una tinaja es más que un baño","paragraphs":["Nuestras tinajas artesanales de hormigón de alta resistencia, diseñadas para durar y adaptarse naturalmente a cualquier entorno. Cada pieza es única y combina robustez con una estética moderna e industrial.","A diferencia de la madera, requieren mínima mantención y no se deterioran con el tiempo. Funcionan a leña, ofreciendo una experiencia auténtica conectada con los elementos naturales."],"image":{"media_id":null,"src":"/images/drones.webp","alt":"Vista aérea de tinaja de hormigón","width":1449,"height":1086}}'::jsonb),
  ('por_que', '{"label":"POR QUÉ HORMIGÓN","title":"Material que\nmejora con\nel tiempo.","imageTop":{"media_id":null,"src":"/images/hormigon.webp","alt":"Textura de hormigón artesanal","width":1408,"height":768},"imageBottom":{"media_id":null,"src":"/images/hormigon.webp","alt":"Textura de hormigón","width":1408,"height":768},"features":[{"title":"Retención de calor","description":"El hormigón guarda el calor más que cualquier otro material."},{"title":"Durabilidad extrema","description":"Construida para resistir la intemperie y el tiempo sin deteriorarse."},{"title":"Material natural","description":"Sin plásticos ni químicos. Concreto, agua y manos artesanas."},{"title":"Mantención mínima","description":"Sin barniz, sin tratamientos. Solo agua y uso. El concreto no se pudre ni se astilla."}]}'::jsonb),
  ('proceso', '{"label":"PROCESO","image":{"media_id":null,"src":"/images/derecha.webp","alt":"Tinaja de hormigón instalada","width":1536,"height":1024},"steps":[{"number":"01  —  VISITAMOS","title":"Terreno","description":"Generamos una visita para asegurar que las condiciones sean las óptimas."},{"number":"02  —  FABRICAMOS","title":"A mano, en nuestro taller","description":"Proceso artesanal de 3 a 4 semanas con seguimiento."},{"number":"03  —  INSTALAMOS","title":"Enciendes el fuego","description":"Nuestro equipo instala y pone en marcha. Solo disfrutas."}]}'::jsonb),
  ('galeria', '{"label":"GALERÍA","title":"Cada pieza, una historia","disclaimer":"* Imágenes referenciales. Incluye escalera, banca interior y protección de cañerías. Pala y deck se venden por separado.","images":[{"media_id":null,"src":"/images/frente-gem-3.webp","alt":"Tinaja de hormigón de frente","width":1195,"height":896},{"media_id":null,"src":"/images/drones.webp","alt":"Vista aérea de la tinaja","width":1449,"height":1086},{"media_id":null,"src":"/images/close-up.webp","alt":"Detalle de hormigón","width":1536,"height":1024},{"media_id":null,"src":"/images/parcela.webp","alt":"Tinaja en parcela","width":1536,"height":1024}]}'::jsonb),
  ('cta', '{"label":"HABLEMOS","title":"Diseñada\npara ti.","subtitle":"Cuéntanos tu espacio. Nosotros hacemos el resto.","cta":"Solicitar consulta →","image":{"media_id":null,"src":"/images/parcela.webp","alt":"Jardín con tinaja instalada","width":1536,"height":1024}}'::jsonb),
  ('footer', '{"links":[{"label":"Producto"},{"label":"Galería"},{"label":"Contacto"}],"copyrightName":"CALMA"}'::jsonb)
on conflict (key) do nothing;

-- Verificación: las 9 secciones existen y cumplen su JSON Schema.
do $$
declare
  v_missing text;
begin
  select string_agg(k, ', ') into v_missing
  from unnest(array['nav','mobile_menu','hero','que_es','por_que','proceso','galeria','cta','footer']) as k
  where not exists (
    select 1 from public.section_content sc
    where sc.key = k and private.section_content_is_valid(sc.key, sc.content)
  );
  if v_missing is not null then
    raise exception 'Seed inválido o incompleto: %', v_missing;
  end if;
end $$;
