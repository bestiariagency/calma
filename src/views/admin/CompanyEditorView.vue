<script setup>
import { computed, ref } from 'vue'
import { CONTENT_SCHEMA } from '../../data/contentSchema.js'
import { adminCompanyText as t } from '../../data/adminEditorText.js'
import { provideEditor } from '../../composables/admin/editorContext.js'
import { useContentEditor } from '../../composables/admin/useContentEditor.js'
import { focusFirstInvalid } from '../../composables/admin/useFocusInvalid.js'
import { companySource } from '../../services/editorSources.js'
import CompanyGroupCard from '../../components/admin/editor/CompanyGroupCard.vue'
import EditorPage from '../../components/admin/editor/EditorPage.vue'

// Datos de la empresa (spec 4.4): mismo editor que las secciones, con origen site_settings y campos agrupados.
const schema = CONTENT_SCHEMA.company
const page = ref(null)
const byPath = Object.fromEntries(schema.fields.map(field => [field.path, field]))
const groups = computed(() => t.groups.map(group => ({ ...group, fields: group.fields.map(path => byPath[path]) })))

provideEditor(useContentEditor(ref('company'), { source: companySource, onInvalid: () => focusFirstInvalid(page.value?.$el) }))
</script>

<template>
  <EditorPage ref="page" :title="schema.label" :help="t.pageHelp" :site-href="t.siteHref" :fields="schema.fields" :groups="groups">
    <CompanyGroupCard v-for="group in groups" :key="group.id" :title="group.title" :fields="group.fields" />
  </EditorPage>
</template>
