<script setup>
import { computed } from 'vue'
import { useEditor } from '../../../composables/admin/editorContext.js'
import Card from '../ui/Card.vue'
import CompanyFieldExtra from './CompanyFieldExtra.vue'
import EditorField from './EditorField.vue'
import CompanyWhatsappPreview from './CompanyWhatsappPreview.vue'
import { companyIcon } from './companyIcons.js'
import { isWide } from './fieldWidth.js'

// Un grupo de "Datos de la empresa" (spec 4.4): Card con grid de 2 columnas; los campos largos ocupan las 2.
const props = defineProps({
  title: { type: String, required: true },
  fields: { type: Array, required: true },
})
const editor = useEditor()

const invalid = computed(() => props.fields.some(field => editor.errors.value[field.path]))
</script>

<template>
  <Card :title="title" :invalid="invalid">
    <div class="grid gap-5 md:grid-cols-2">
      <template v-for="field in fields" :key="field.path">
        <EditorField :field="field" :icon="companyIcon(field)" bare :class="isWide(field) && 'md:col-span-2'">
          <template #extra="{ value }">
            <CompanyFieldExtra :field="field" :value="value" />
          </template>
        </EditorField>
        <!-- Vista del enlace de WhatsApp: 2ª columna junto al número (≥ md). -->
        <CompanyWhatsappPreview v-if="field.type === 'e164'" :value="editor.working.value?.[field.path] ?? ''" />
      </template>
    </div>
  </Card>
</template>
