# Calidad y refactor — criterios (Zorro-Foxter)

Pasa al **final de cada feature**, limitado a su alcance. **Sin cambios de comportamiento ni visuales.**

## Criterios
- **Duplicación cero:** markup repetido → componente `ui/`; lógica repetida → composable/util;
  queries repetidas → servicio. Regla de tres: no abstraer por un solo uso.
- **Tamaño:** archivos < ~300 líneas, funciones < ~40 líneas. Si crece, dividir por responsabilidad.
- **Legibilidad:** early returns, ≤ 2 niveles de anidación, nombres que revelan intención.
- **Capas:** sin lógica de negocio ni llamadas a Supabase en componentes.
- **Estilos:** Tailwind-first; CSS plano solo con `/* CSS fallback: <motivo> */`. Nada de valores
  mágicos si existe token.
- **Textos:** sin copy hardcodeado en componentes (va a `content.js`/CMS).
- **Código muerto:** imports, props, variables, CSS, archivos e imágenes sin uso → fuera.
- **Rendimiento:** `computed` frente a métodos en plantilla, sin watchers redundantes, sin N+1.

## Cuándo NO tocar
- Código fuera del alcance de la feature que funciona.
- Cambios que alteren un contrato público (props/eventos/API) → márcalos, no los apliques.

## Verificación
`npm run build` verde. Resumen: qué simplificaste y qué dejaste marcado.
