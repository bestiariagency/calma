// Supabase borra el hash de la URL al procesar el enlace del correo, así que se lee UNA vez al cargar
// (este módulo se importa desde el router al arrancar).
export function parseAuthHash(hash = '') {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  return { recovery: params.get('type') === 'recovery', linkError: params.get('error_code') ?? '' }
}

export const authLinkHint = parseAuthHash(globalThis.location?.hash)
