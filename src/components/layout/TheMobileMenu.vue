<script setup>
import { useSiteContent } from '../../composables/useSiteContent.js'
import { mailtoHref, telHref } from '../../lib/contact.js'

const { company, mobileMenu } = useSiteContent()

defineProps({
  isOpen: { type: Boolean, required: true },
})
defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] flex flex-col bg-mid transition-transform duration-300 ease-[ease]" :class="isOpen ? 'translate-x-0' : 'translate-x-full'" role="dialog" aria-modal="true" aria-label="Menú de navegación">

      <!-- Header -->
      <div class="flex shrink-0 items-center justify-between px-6 py-5">
        <span class="text-[16px] font-bold tracking-[3px] text-text">{{ company.name }}</span>
        <button class="flex items-center text-accent" aria-label="Cerrar menú" @click="$emit('close')">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="18" y1="6"  x2="6"  y2="18" />
            <line x1="6"  y1="6"  x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div class="h-px shrink-0 bg-b-deep" />

      <!-- Nav items -->
      <nav class="flex flex-1 flex-col justify-center overflow-y-auto">
        <a
          v-for="link in mobileMenu.links"
          :key="link.href"
          :href="link.href"
          class="flex items-center justify-between px-[28px] py-[22px] text-[26px] font-extrabold tracking-[2px] transition-[color] duration-200 ease-[ease] active:text-accent"
          :class="link.accent ? 'text-accent' : 'text-text border-b border-b-b-deep'"
          :target="link.accent ? '_blank' : undefined"
          :rel="link.accent ? 'noopener noreferrer' : undefined"
          @click="$emit('close')"
        >
          <span>{{ link.label }}</span>
          <svg v-if="link.accent" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </nav>

      <!-- Footer info -->
      <div class="flex shrink-0 flex-col gap-1.5 border-t border-t-b-deep px-[28px] pt-[22px] pb-[32px]">
        <span class="text-[9px] tracking-[2px] text-b-dark">{{ company.tagline }}</span>
        <a :href="mailtoHref(company.email)" class="text-[13px] text-muted">{{ company.email }}</a>
        <a :href="telHref(company.phone)"    class="text-[13px] text-muted">{{ company.phone }}</a>
      </div>

    </div>
  </Teleport>
</template>
