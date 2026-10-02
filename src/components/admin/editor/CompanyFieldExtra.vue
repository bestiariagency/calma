<script setup>
import { computed } from 'vue'
import { adminCompanyText as t } from '../../../data/adminEditorText.js'
import { isValidFormat, normalizeValue } from '../../../lib/fieldFormats.js'
import { mailtoHref, telHref } from '../../../lib/contact.js'
import CompanyTestLink from './CompanyTestLink.vue'

// Ayuda bajo el campo: enlace de prueba (mailto:/tel:/https) (la vista de WhatsApp es CompanyWhatsappPreview).
// Solo aparece con un valor válido, ya normalizado como se guardaría.
const props = defineProps({ field: { type: Object, required: true }, value: { type: String, default: '' } })

const value = computed(() => normalizeValue(props.field.type, props.value))
const valid = computed(() => value.value !== '' && isValidFormat(props.field.type, value.value))
const link = computed(() => {
  if (!valid.value) return null
  const { type } = props.field
  if (type === 'email') return { href: mailtoHref(value.value), label: t.testEmail }
  if (type === 'phone') return { href: telHref(value.value), label: t.testPhone }
  if (type === 'url') return { href: value.value, label: t.testLink }
  return null
})
const external = computed(() => props.field.type === 'url')
</script>

<template>
  <div v-if="link" class="flex flex-col gap-1">
    <CompanyTestLink :href="link.href" :external="external">{{ link.label }}</CompanyTestLink>
  </div>
</template>
