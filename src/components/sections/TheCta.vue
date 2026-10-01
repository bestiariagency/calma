<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import AppButton    from '../ui/AppButton.vue'
import { CTA, WHATSAPP_URL } from '../../data/content.js'

const titleHtml = CTA.title.replace(/\n/g, '<br>')
</script>

<template>
  <section id="contacto" v-reveal class="relative min-h-screen overflow-hidden bg-darkest">
    <img data-reveal="zoom" class="absolute inset-0" src="/images/parcela.png" alt="Jardín con tinaja instalada" />
    <div class="absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-darkest)_0%,rgba(0,0,0,0.53)_51%,#000_92%)]" />

    <!-- ─── Mobile ──────────────────────────────────── -->
    <div v-reveal.each class="relative z-1 flex min-h-screen flex-col items-center justify-center gap-[28px] px-[28px] py-[60px] text-center md:hidden">
      <SectionLabel data-reveal="text" :text="CTA.label" />
      <h2 data-reveal="text" class="text-[54px] font-black text-text leading-[0.95]" v-html="titleHtml" />
      <p data-reveal="text" class="text-[15px] text-muted leading-[1.5] max-w-[320px]">{{ CTA.subtitle }}</p>
      <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" data-reveal="text" class="w-full max-w-[334px]">
        <AppButton :label="CTA.cta" size="sm" wa class="w-full" />
      </a>
      <p data-reveal="text" class="text-[12px] text-b-dark">{{ CTA.email }}  ·  {{ CTA.phone }}</p>
    </div>

    <!-- ─── Desktop ─────────────────────────────────── -->
    <div v-reveal.each class="relative z-1 mx-auto hidden min-h-screen max-w-[1440px] md:block">
      <!-- Contact sidebar -->
      <div class="absolute top-0 left-[325px] flex h-[670px] w-[329px] flex-col justify-center gap-[28px]">
        <div data-reveal="bar" class="w-8 h-[2px] bg-accent" />
        <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" data-reveal="text" class="text-[15px] text-white hover:text-accent">{{ CTA.email }}</a>
        <a :href="`tel:${CTA.phone.replace(/\s/g, '')}`" data-reveal="text" class="text-[15px] text-white hover:text-accent">{{ CTA.phone }}</a>
      </div>

      <!-- Main CTA content -->
      <div class="absolute top-0 left-[657px] flex h-[659px] w-[697px] flex-col justify-center gap-8">
        <SectionLabel data-reveal="text" :text="CTA.label" />
        <h2 data-reveal="text" class="text-[80px] font-black text-text leading-[0.95] max-w-[600px]" v-html="titleHtml" />
        <p data-reveal="text" class="text-[18px] text-white leading-[1.5] max-w-[520px]">{{ CTA.subtitle }}</p>
        <a :href="WHATSAPP_URL" target="_blank" rel="noopener noreferrer" data-reveal="text">
          <AppButton :label="CTA.cta" size="md" wa />
        </a>
      </div>
    </div>
  </section>
</template>
