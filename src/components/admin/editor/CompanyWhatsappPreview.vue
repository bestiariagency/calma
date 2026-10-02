<script setup>
import { computed } from 'vue'
import { adminCompanyText as t } from '../../../data/adminEditorText.js'
import { useEditor } from '../../../composables/admin/editorContext.js'
import { isValidFormat, normalizeValue } from '../../../lib/fieldFormats.js'
import { whatsappUrl } from '../../../lib/contact.js'
import CompanyTestLink from './CompanyTestLink.vue'

// Vista del enlace wa.me resultante (solo lectura, Mono) con "Probar". Solo con un número válido.
const props = defineProps({ value: { type: String, default: '' } })
const editor = useEditor()

const number = computed(() => normalizeValue('e164', props.value))
const href = computed(() =>
  number.value && isValidFormat('e164', number.value) ? whatsappUrl(number.value, editor.working.value?.whatsapp_message ?? '') : '',
)
</script>

<template>
  <div v-if="href" class="flex min-w-0 flex-col gap-1.5">
    <p class="font-sans text-[13px]/5 font-semibold text-text">{{ t.whatsappPreview }}</p>
    <code class="font-mono text-xs/4 break-all text-text-2">{{ href }}</code>
    <CompanyTestLink :href="href">{{ t.testWhatsapp }}</CompanyTestLink>
  </div>
</template>
