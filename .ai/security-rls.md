# Seguridad y RLS — checklist (Leona-Lia)

Modelo: **`anon` (público)** + **`admin` (único rol privilegiado, vía `is_admin()`)**.
Asume que la anon key y la URL son públicas y que el cliente es hostil.

## Checklist por cambio
- [ ] Proyecto verificado: `lgiajkdvuftvtincbqzi`.
- [ ] RLS activado en todas las tablas de `public` (y en esquemas expuestos).
- [ ] Policy explícita por operación y rol; sin `using (true)` salvo SELECT de contenido publicado.
- [ ] `is_admin()` es `SECURITY DEFINER`, `STABLE`, `search_path` fijado, sin recursión, y no
      ha cambiado su semántica (salvo petición explícita).
- [ ] `public.admins` no es escribible por `anon` ni por `authenticated` no-admin.
- [ ] INSERT público (leads): no permite fijar campos internos (estado, notas, asignación) ni leer
      lo insertado (sin `select` para anon; `insert` sin `returning` desde el cliente).
- [ ] Catálogo: `anon` no ve borradores (`is_published = false`) ni columnas internas (costes).
- [ ] Storage: buckets públicos solo para imágenes publicadas; subidas solo admin.
- [ ] GRANTs mínimos; vistas con `security_invoker = true`.
- [ ] Ningún secreto ni `service_role` en el cliente, `VITE_*` ni repo.
- [ ] `get_advisors` (security) sin avisos nuevos.

## Pruebas de fuga (en transacción + ROLLBACK)
```sql
begin;
set local role anon;
-- debe devolver 0 filas o error:
select * from public.leads;
update public.products set price = 0;
delete from public.products;
insert into public.admins (user_id) values (gen_random_uuid());
rollback;
```
Repetir como `authenticated` no-admin (`set local request.jwt.claims = '{"sub":"<uuid>","role":"authenticated"}'`).
Como admin: CRUD completo esperado.

## Veredicto
**APROBADO**, o **VETADO** + motivo concreto + corrección sugerida. Con veto abierto no se cierra.
