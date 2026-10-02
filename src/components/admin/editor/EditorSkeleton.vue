<script setup>
import Skeleton from '../ui/Skeleton.vue'
import EditorSkeletonField from './EditorSkeletonField.vue'
import { isWide } from './fieldWidth.js'

// Esqueleto generado desde el esquema: mismas Cards, tipos y número de ítems que el editor real (§3.14).
// `groups` (opcional, [{ fields }]): una Card por grupo con grid de 2 columnas, como Datos de la empresa.
defineProps({ fields: { type: Array, required: true }, groups: { type: Array, default: null } })
</script>

<template>
  <div class="flex flex-col gap-4" aria-busy="true">
    <Skeleton announce class="sr-only" />
    <div
      v-for="(group, index) in groups ?? []"
      :key="index"
      class="flex flex-col gap-5 rounded-lg border border-line bg-surface-2 p-5 max-md:p-4"
    >
      <Skeleton class="h-5 w-28" />
      <div class="grid gap-5 md:grid-cols-2">
        <template v-for="field in group.fields" :key="field.path">
          <EditorSkeletonField :field="field" bare :class="isWide(field) && 'md:col-span-2'" />
          <!-- Vista wa.me del editor real (2ª columna, solo ≥ md). -->
          <div v-if="field.type === 'e164'" class="hidden min-w-0 flex-col gap-1.5 md:flex">
            <Skeleton class="h-5 w-44" /><Skeleton class="h-12 md:max-lg:h-16" /><Skeleton class="h-6 w-28" />
          </div>
        </template>
      </div>
    </div>
    <template v-for="field in groups ? [] : fields" :key="field.path">
      <div v-if="field.type === 'list'" class="flex flex-col gap-5 rounded-lg border border-line bg-surface-2 p-5 max-md:p-4">
        <div class="flex flex-col gap-1"><Skeleton class="h-5 w-40" /><Skeleton class="h-4 w-72 max-w-full" /></div>
        <div :class="['grid gap-4', field.fields.length === 1 && field.fields[0].type === 'text' && 'md:grid-cols-2']">
          <div
            v-for="n in field.maxItems"
            :key="n"
            class="flex gap-4 rounded-lg border border-line bg-surface-2 p-5 max-md:p-4 max-sm:flex-col"
          >
            <Skeleton class="size-8 shrink-0" />
            <div class="flex min-w-0 flex-1 flex-col gap-5">
              <EditorSkeletonField v-for="sub in field.fields" :key="sub.path" :field="sub" bare />
            </div>
          </div>
        </div>
      </div>
      <EditorSkeletonField v-else :field="field" />
    </template>
  </div>
</template>
