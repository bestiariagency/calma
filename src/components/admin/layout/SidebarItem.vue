<script setup>
import { computed } from 'vue'
import { Building2, FileText, History } from 'lucide-vue-next'
import Tooltip from '../ui/Tooltip.vue'

// Spec 3.8. Colapsado: solo icono 40×40 + Tooltip a la derecha (y aria-label).
const ICONS = { FileText, Building2, History }
const props = defineProps({
  to: { type: String, required: true },
  label: { type: String, required: true },
  icon: { type: String, default: 'FileText' },
  collapsed: { type: Boolean, default: false },
})
defineEmits(['navigate'])

const wrapper = computed(() => (props.collapsed ? Tooltip : 'div'))
const wrapperProps = computed(() =>
  props.collapsed ? { text: props.label, placement: 'right', class: 'flex! w-full justify-center' } : {},
)
</script>

<template>
  <li>
    <RouterLink v-slot="{ href, navigate, isExactActive }" :to="to" custom>
      <component :is="wrapper" v-bind="wrapperProps">
        <a
          :href="href"
          :aria-label="collapsed ? label : undefined"
          :aria-current="isExactActive ? 'page' : undefined"
          :data-autofocus="isExactActive || undefined"
          :class="[
            'relative flex h-10 items-center gap-3 rounded-md font-sans text-sm font-semibold max-md:h-11',
            'transition-colors duration-(--motion-fast) ease-(--ease-panel) motion-reduce:transition-none',
            'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring',
            collapsed ? 'size-10 justify-center' : 'px-3',
            isExactActive
              ? 'bg-accent-soft text-accent-text before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-accent'
              : 'text-text-2 hover:bg-surface-3 hover:text-text',
          ]"
          @click="e => { navigate(e); $emit('navigate') }"
        >
          <component :is="ICONS[icon]" :size="16" class="shrink-0" aria-hidden="true" />
          <span v-if="!collapsed" class="truncate">{{ label }}</span>
        </a>
      </component>
    </RouterLink>
  </li>
</template>
