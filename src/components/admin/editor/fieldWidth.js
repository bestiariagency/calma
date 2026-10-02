// Campos largos (textarea o más de 60 caracteres: dirección, URLs) ocupan las 2 columnas del grid (spec 4.4).
const WIDE_FROM = 60

export const isWide = field => field.type === 'textarea' || field.maxLength > WIDE_FROM
