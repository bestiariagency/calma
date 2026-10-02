import { nextTick } from 'vue'

// Tras un envío inválido, lleva el foco al primer campo con aria-invalid (lo marca Field).
export async function focusFirstInvalid(form) {
  await nextTick()
  form?.querySelector('[aria-invalid="true"]')?.focus()
}
