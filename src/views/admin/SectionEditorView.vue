<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { CONTENT_SCHEMA } from '../../data/contentSchema.js'
import { SECTION_ANCHORS, adminEditorText as t } from '../../data/adminEditorText.js'
import { provideEditor } from '../../composables/admin/editorContext.js'
import { useSectionEditor } from '../../composables/admin/useSectionEditor.js'
import { focusFirstInvalid } from '../../composables/admin/useFocusInvalid.js'
import EditorField from '../../components/admin/editor/EditorField.vue'
import EditorList from '../../components/admin/editor/EditorList.vue'
import EditorPage from '../../components/admin/editor/EditorPage.vue'

// Editor genérico de secciones (spec 4.3): se genera desde CONTENT_SCHEMA[key]; textos + alt de imágenes.
const route = useRoute()
const key = computed(() => route.params.key)
const schema = computed(() => CONTENT_SCHEMA[key.value])
const page = ref(null)

provideEditor(useSectionEditor(key, { onInvalid: () => focusFirstInvalid(page.value?.$el) }))
const siteHref = computed(() => `/${SECTION_ANCHORS[key.value] ?? ''}`)
</script>

<template>
  <EditorPage ref="page" :title="schema.label" :help="t.pageHelp" :site-href="siteHref" :fields="schema.fields">
    <template v-for="field in schema.fields" :key="field.path">
      <EditorList v-if="field.type === 'list'" :field="field" />
      <EditorField v-else :field="field" />
    </template>
  </EditorPage>
</template>
