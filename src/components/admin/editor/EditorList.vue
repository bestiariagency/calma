<script setup>
import { computed } from 'vue'
import { adminEditorText as t } from '../../../data/adminEditorText.js'
import { useEditor } from '../../../composables/admin/editorContext.js'
import { joinPath } from '../../../lib/sectionEditor.js'
import Card from '../ui/Card.vue'
import FixedListItem from '../ui/FixedListItem.vue'
import EditorField from './EditorField.vue'

// Lista de tamaño fijo: ítems numerados, sin añadir/eliminar/reordenar (spec 3.5 y 4.3).
const props = defineProps({ field: { type: Object, required: true } })
const editor = useEditor()

const count = computed(() => props.field.maxItems)
// Un único campo corto por ítem (menús, pie): 2 columnas en escritorio.
const twoColumns = computed(() => props.field.fields.length === 1 && props.field.fields[0].type === 'text')
const itemInvalid = index => Object.keys(editor.errors.value).some(path => path.startsWith(`${joinPath(props.field.path, index)}.`))
</script>

<template>
  <Card :title="field.label" :help="t.listHelp">
    <ol :class="['grid gap-4', twoColumns && 'md:grid-cols-2']">
      <FixedListItem v-for="index in count" :key="index" :index="index - 1" :total="count" :invalid="itemInvalid(index - 1)">
        <EditorField
          v-for="sub in field.fields"
          :key="sub.path"
          :field="sub"
          :prefix="joinPath(field.path, index - 1)"
          bare
        />
      </FixedListItem>
    </ol>
  </Card>
</template>
