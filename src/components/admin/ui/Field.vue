<script setup>
import { computed, useId } from 'vue'
import { CircleAlert, TriangleAlert } from 'lucide-vue-next'
import { adminUiText } from '../../../data/adminUiText.js'
import { useCharCounter } from '../../../composables/admin/useCharCounter.js'

const props = defineProps({
  label: { type: String, required: true },
  required: { type: Boolean, default: false },
  icon: { type: [Object, Function], default: null }, // icono decorativo a la izquierda del label
  help: { type: String, default: '' },
  error: { type: String, default: '' },
  // Contador "124 / 370": pasar la longitud actual y el máximo.
  count: { type: Number, default: null },
  maxLength: { type: Number, default: 0 },
})

const uid = useId()
const controlId = `${uid}-control`
const helpId = `${uid}-help`
const errorId = `${uid}-error`

const counted = computed(() => props.count !== null && props.maxLength > 0)
const { level, over, announcement } = useCharCounter(
  () => props.count ?? 0,
  () => props.maxLength,
  adminUiText,
)
const overMessage = computed(() => (level.value === 'danger' ? adminUiText.overLimit(over.value) : ''))
const shownError = computed(() => props.error || overMessage.value)
const describedBy = computed(() => {
  if (shownError.value) return errorId
  return props.help ? helpId : undefined
})
const invalid = computed(() => Boolean(shownError.value))

const COUNTER_COLOR = { ok: 'text-text-3', warning: 'text-warning', danger: 'text-danger' }

// Props para el control: <Field v-slot="{ controlProps }"><Input v-bind="controlProps" /></Field>
const controlProps = computed(() => ({
  id: controlId,
  'aria-describedby': describedBy.value,
  'aria-invalid': invalid.value ? 'true' : undefined,
}))
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="controlId" class="flex items-center gap-2 font-sans text-[13px]/5 font-semibold text-text">
      <component :is="icon" v-if="icon" :size="16" class="shrink-0 text-text-2" aria-hidden="true" />
      <span>
        {{ label }}
        <span v-if="required" class="font-normal text-text-2">{{ adminUiText.required }}</span>
      </span>
    </label>

    <slot :control-props="controlProps" />

    <div class="flex min-h-4 flex-wrap items-start justify-between gap-x-3 gap-y-1">
      <p v-if="shownError" :id="errorId" role="alert" class="flex max-w-full min-w-0 gap-1.5 text-xs/4 text-danger">
        <CircleAlert :size="14" class="mt-px shrink-0" aria-hidden="true" />
        <span>{{ shownError }}</span>
      </p>
      <p v-else-if="help" :id="helpId" class="min-w-0 flex-1 text-xs/4 text-text-2">{{ help }}</p>

      <p
        v-if="counted"
        :class="[
          'ml-auto flex shrink-0 items-center gap-1 font-mono text-xs/4 tabular-nums transition-colors duration-(--motion-fast) motion-reduce:transition-none',
          COUNTER_COLOR[level],
        ]"
      >
        <TriangleAlert v-if="level === 'warning'" :size="12" aria-hidden="true" />
        <CircleAlert v-else-if="level === 'danger'" :size="12" aria-hidden="true" />
        {{ count }} / {{ maxLength }}
      </p>
      <!-- Anuncia solo al cruzar 90 % y 100 %, no en cada tecla. -->
      <span class="sr-only" aria-live="polite">{{ announcement }}</span>
    </div>
  </div>
</template>
