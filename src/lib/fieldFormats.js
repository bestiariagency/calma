// Normalización y formato de los campos tipados (email, phone, e164, url). Espejo de los CHECK de
// supabase/migrations/*_create_site_settings.sql: si cambian allí, cambian aquí (la BD sigue siendo la red de seguridad).

const EMAIL = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
const PHONE = /^\+?[0-9][0-9 ().-]*$/
const E164 = /^\+[1-9][0-9]{7,14}$/
const HTTPS_URL = /^https:\/\/[^\s/$.?#][^\s]*$/

const trim = value => value.trim()
// WhatsApp: se aceptan espacios, guiones, puntos y paréntesis al escribir; se guarda solo "+" y dígitos.
export const normalizeE164 = value => value.replace(/[\s\-().]/g, '')

const NORMALIZERS = { email: trim, phone: trim, url: trim, e164: normalizeE164 }
const PATTERNS = { email: EMAIL, phone: PHONE, e164: E164, url: HTTPS_URL }
const MESSAGE_KEYS = { email: 'invalidEmail', phone: 'invalidPhone', e164: 'invalidE164', url: 'invalidUrl' }

export const hasNormalizer = type => type in NORMALIZERS

// Valor tal como se guarda: sin espacios sobrantes (y, en WhatsApp, sin separadores).
export const normalizeValue = (type, value) => (typeof value === 'string' && NORMALIZERS[type] ? NORMALIZERS[type](value) : value)

// Un valor vacío no se valida aquí (lo decide `required`). Con valor, debe cumplir el patrón del tipo.
export const isValidFormat = (type, value) => !PATTERNS[type] || value === '' || PATTERNS[type].test(value)

// Mensaje de error de formato ('' = válido). `value` ya normalizado; `text` aporta los mensajes.
export const formatError = (type, value, text) => (isValidFormat(type, value) ? '' : text[MESSAGE_KEYS[type]])
