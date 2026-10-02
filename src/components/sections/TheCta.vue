<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import AppButton    from '../ui/AppButton.vue'
import { useSiteContent } from '../../composables/useSiteContent.js'
import { mailtoHref, telHref } from '../../lib/contact.js'

const { cta, company, whatsappUrl } = useSiteContent()
</script>

<template>
  <section id="contacto" v-reveal class="relative min-h-screen overflow-hidden bg-darkest">
    <img data-reveal="zoom" class="absolute inset-0" v-bind="cta.image" loading="lazy" decoding="async" />
    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-darkest)_0%,rgba(0,0,0,0.53)_51%,#000_92%)]" />

    <!-- ─── Mobile ──────────────────────────────────── -->
    <div v-reveal.each class="relative z-1 flex min-h-screen flex-col items-center justify-center gap-[28px] px-[28px] py-[60px] text-center md:hidden">
      <SectionLabel data-reveal="text" :text="cta.label" />
      <h2 data-reveal="text" class="text-[54px] font-black text-text leading-[0.95] whitespace-pre-line">{{ cta.title }}</h2>
      <p data-reveal="text" class="text-[15px] text-muted leading-[1.5] max-w-[320px]">{{ cta.subtitle }}</p>
      <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" data-reveal="text" class="w-full max-w-[334px]">
        <AppButton :label="cta.cta" size="sm" wa class="w-full" />
      </a>
      <p data-reveal="text" class="text-[12px] text-b-dark">{{ company.email }}  ·  {{ company.phone }}</p>
    </div>

    <!-- ─── Desktop ─────────────────────────────────── -->
    <div v-reveal.each class="relative z-1 mx-auto hidden min-h-screen max-w-[1440px] md:block">
      <!-- Contact sidebar -->
      <div class="absolute top-0 left-[325px] flex h-[670px] w-[329px] flex-col justify-center gap-[28px]">
        <div data-reveal="bar" class="w-8 h-[2px] bg-accent" />
        <a :href="mailtoHref(company.email)" data-reveal="text" class="text-[15px] text-white hover:text-accent">{{ company.email }}</a>
        <a :href="telHref(company.phone)" data-reveal="text" class="text-[15px] text-white hover:text-accent">{{ company.phone }}</a>
      </div>

      <!-- Main CTA content -->
      <div class="absolute top-0 left-[657px] flex h-[659px] w-[697px] flex-col justify-center gap-8">
        <SectionLabel data-reveal="text" :text="cta.label" />
        <h2 data-reveal="text" class="text-[80px] font-black text-text leading-[0.95] max-w-[600px] whitespace-pre-line">{{ cta.title }}</h2>
        <p data-reveal="text" class="text-[18px] text-white leading-[1.5] max-w-[520px]">{{ cta.subtitle }}</p>
        <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" data-reveal="text">
          <AppButton :label="cta.cta" size="md" wa />
        </a>
      </div>
    </div>
  </section>
</template>
