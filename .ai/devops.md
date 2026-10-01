# DevOps — estándar (Osset-OP)

## Hosting: Netlify
- Build: `npm run build`, publish `dist/`, Node LTS.
- `netlify.toml` versionado con build, redirects y headers.
- Redirect SPA `/* /index.html 200` cuando exista router (no antes, para no ocultar 404 reales).
- Headers: cache larga para `/assets/*` (hash), `X-Content-Type-Options`, `Referrer-Policy`,
  `X-Frame-Options`/CSP razonable; cache corta para `index.html`.
- `/admin` con `X-Robots-Tag: noindex`.

## Variables de entorno
| Variable | Dónde | Público |
|---|---|---|
| `VITE_SUPABASE_URL` | Netlify + `.env.local` | sí |
| `VITE_SUPABASE_ANON_KEY` | Netlify + `.env.local` | sí (protegida por RLS) |
| secretos de servidor | `supabase secrets` | **no** — solo Edge Functions |

- Nunca `service_role` ni API keys privadas como `VITE_*`. `.env*` en `.gitignore`; `.env.example` versionado.
- Supabase: solo `lgiajkdvuftvtincbqzi`.

## Emails
Aún sin proveedor. No introducir uno (Resend u otro) sin aprobación; cuando se decida, la API key
irá como secreto de Edge Function.

## Pendiente antes de CI
Añadir lint (ESLint + plugin vue), formato y, si procede, tests; luego CI que ejecute build + lint.

## Checklist de deploy
1. Build local verde y sin warnings relevantes.
2. Migraciones aplicadas y aprobadas por Leona-Lia.
3. Envs presentes en Netlify.
4. Deploy preview revisado (Búho-Pixel si hay cambios visuales).
5. **Smoke test** post-deploy: carga de home, imágenes, enlaces de WhatsApp, formulario de lead,
   login admin, consola sin errores.
