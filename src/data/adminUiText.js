// Textos fijos del kit de componentes del panel (etiquetas de accesibilidad y mensajes genéricos).
export const adminUiText = {
  required: '(obligatorio)',
  loading: 'Cargando…',
  close: 'Cerrar',
  skipToContent: 'Saltar al contenido',
  overLimit: n => `Superaste el límite en ${n} ${n === 1 ? 'carácter' : 'caracteres'}`,
  nearLimit: (count, max) => `Te acercas al límite: ${count} de ${max} caracteres`,
  logoHomeLabel: 'CALMA, inicio del panel',
}
