<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import { useSiteContent } from '../../composables/useSiteContent.js'

const { proceso } = useSiteContent()

const isLastStep = i => i === proceso.value.steps.length - 1
</script>

<template>
  <section id="proceso" class="bg-darkest min-h-screen">

    <!-- ─── Mobile ────────────────────────────────────── -->
    <div v-reveal.each class="flex min-h-screen flex-col justify-center px-[28px] py-12 md:hidden">
      <SectionLabel data-reveal="text" :text="proceso.label" />
      <div class="h-[20px]" />
      <div
        v-for="(step, i) in proceso.steps"
        :key="step.title"
        data-reveal="text"
        class="flex gap-[20px]"
        :class="{ 'mb-[28px] border-b border-b-b-deep pb-[28px]': !isLastStep(i) }"
      >
        <div class="flex flex-col items-center w-6 shrink-0">
          <div class="size-[10px] rounded-[50%] bg-accent shrink-0" />
          <div v-if="!isLastStep(i)" class="mt-1 min-h-[80px] w-px flex-1 bg-b-deep" />
        </div>
        <div class="flex flex-col gap-2 flex-1">
          <span class="text-[9px] text-accent tracking-[3px]">{{ step.number }}</span>
          <h3 class="text-[24px] font-extrabold text-text">{{ step.title }}</h3>
          <p class="text-[13px] text-muted leading-[1.5] max-w-[270px]">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Desktop ───────────────────────────────────── -->
    <div v-reveal class="relative hidden min-h-screen overflow-hidden md:block">
      <!-- Right: image + overlay -->
      <div data-reveal="image" data-reveal-i="0" class="absolute inset-y-0 right-0 w-[720px] overflow-hidden reveal-from-right">
        <img data-reveal="zoom" v-bind="proceso.image" loading="lazy" decoding="async" />
        <div class="absolute inset-0 bg-[linear-gradient(to_right,var(--color-darkest)_11%,rgba(0,0,0,0.77)_50%,transparent_100%)]" />
      </div>

      <!-- Left: content -->
      <div v-reveal.each class="absolute inset-y-0 left-0 flex w-[720px] flex-col justify-center pl-[144px]">
        <span data-reveal="fade" class="absolute top-1/2 left-[44px] origin-center transform-[translateY(-50%)_rotate(-90deg)] text-[10px] font-bold tracking-[5px] whitespace-nowrap text-accent">{{ proceso.label }}</span>
        <div class="relative flex flex-col gap-[72px]">
          <div data-reveal="line" class="absolute left-[-32px] top-[26px] bottom-0 w-px bg-b-deep" />
          <div
            v-for="step in proceso.steps"
            :key="step.title"
            data-reveal="text"
            class="relative w-[520px] flex flex-col gap-[10px] [--reveal-offset:var(--motion-follow-short)]"
          >
            <div class="absolute left-[-37px] top-[26px] size-[10px] rounded-[50%] bg-accent" />
            <span class="text-[10px] font-bold text-accent tracking-[3px]">{{ step.number }}</span>
            <h3 class="text-[36px] font-extrabold text-text leading-none">{{ step.title }}</h3>
            <p class="text-[15px] text-muted leading-[1.6] max-w-[480px]">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
