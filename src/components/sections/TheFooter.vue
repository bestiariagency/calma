<script setup>
import { computed } from 'vue'
import { useSiteContent } from '../../composables/useSiteContent.js'
import { buildFooterContact } from '../../lib/footerContact.js'
import SocialIcon from '../ui/SocialIcon.vue'

const { company, footer } = useSiteContent()
const contact = computed(() => buildFooterContact(company.value))
const mapsLabel = computed(() => footer.value.labels.mapsAria.replace('{address}', contact.value.address))
const socialLabel = network => footer.value.labels.socialAria.replace('{network}', network).replace('{name}', company.value.name)

// max-desktop:pb-24 (96 px) en el wrapper: reserva el hueco del botón flotante de WhatsApp (52 px + 28 de offset + margen).
const LINK_HOVER = 'transition-[color] duration-200 ease-[ease] motion-reduce:transition-none hover:text-text'
const FOCUS = 'rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-t-b-deep bg-darkest">
    <div v-reveal.edge class="mx-auto flex max-w-[1440px] flex-col gap-8 px-[28px] py-10 max-desktop:pb-24 md:px-20">
      <div data-reveal="text-soft" class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <img v-bind="company.logo" class="h-[100px] w-auto object-contain" />
        <nav class="flex gap-8">
          <a
            v-for="link in footer.links"
            :key="link.href"
            :href="link.href"
            class="text-[12px] text-muted transition-[color] duration-200 ease-[ease] hover:text-text"
          >{{ link.label }}</a>
        </nav>
      </div>
      <div
        v-if="contact.hasContact"
        data-reveal="text-soft"
        class="flex flex-col gap-6 border-t border-b-deep pt-8 md:flex-row md:items-start md:justify-between"
      >
        <dl v-if="contact.hasText" class="flex flex-col gap-6 md:flex-row md:flex-wrap md:gap-x-12">
          <div v-if="contact.address" class="flex max-w-[320px] flex-col gap-1.5">
            <dt class="text-[11px] tracking-[0.12em] text-muted uppercase">{{ footer.labels.address }}</dt>
            <dd class="text-[12px] leading-[1.7] text-text">
              <address class="not-italic">
                <a
                  v-if="contact.mapsHref"
                  :href="contact.mapsHref"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="mapsLabel"
                  :class="[FOCUS, 'transition-[color] duration-200 ease-[ease] motion-reduce:transition-none hover:underline hover:underline-offset-3 active:text-accent']"
                >{{ contact.address }}</a>
                <template v-else>{{ contact.address }}</template>
              </address>
            </dd>
          </div>
          <div v-if="contact.hours" class="flex max-w-[320px] flex-col gap-1.5">
            <dt class="text-[11px] tracking-[0.12em] text-muted uppercase">{{ footer.labels.hours }}</dt>
            <dd class="text-[12px] leading-[1.7] whitespace-pre-line text-text">{{ contact.hours }}</dd>
          </div>
        </dl>
        <div v-if="contact.socials.length" role="group" :aria-label="footer.labels.group" class="md:ml-auto">
          <ul class="-ml-3 flex items-start gap-1 md:ml-0 md:-mr-3">
            <li v-for="social in contact.socials" :key="social.network">
              <a
                :href="social.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="socialLabel(social.name)"
                :class="[FOCUS, LINK_HOVER, 'inline-flex size-11 items-center justify-center text-muted active:text-accent']"
              ><SocialIcon :network="social.network" /></a>
            </li>
          </ul>
        </div>
      </div>
      <div data-reveal="text-soft" class="flex items-center justify-between">
        <span class="text-[11px] text-b-dark">© {{ year }} {{ footer.copyrightName }}</span>
        <span class="text-[11px] text-faint">Sitio desarrollado por Bestiari · <a href="https://www.bestiari.es" target="_blank" rel="noopener noreferrer" class="underline underline-offset-3 transition-[color] duration-200 ease-[ease] hover:text-muted">www.bestiari.es</a></span>
      </div>
    </div>
  </footer>
</template>
