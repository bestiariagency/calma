export const MIN_PASSWORD_LENGTH = 8

// Devuelve la clave del error ('tooShort' | 'mismatch') o '' si es válida.
export function validateNewPassword(password, repeat) {
  if (password.length < MIN_PASSWORD_LENGTH) return 'tooShort'
  return password === repeat ? '' : 'mismatch'
}
