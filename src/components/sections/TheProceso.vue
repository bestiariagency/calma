<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
import { PROCESO }  from '../../data/content.js'
</script>

<template>
  <section id="proceso" class="proceso">

    <!-- ─── Mobile ────────────────────────────────────── -->
    <div class="proceso__m">
      <SectionLabel :text="PROCESO.label" />
      <div class="proceso__m-spacer" />
      <div
        v-for="(step, i) in PROCESO.steps"
        :key="step.title"
        class="proceso__m-step"
        :class="{ 'proceso__m-step--last': i === PROCESO.steps.length - 1 }"
      >
        <div class="proceso__m-timeline">
          <div class="proceso__m-dot" />
          <div v-if="i < PROCESO.steps.length - 1" class="proceso__m-line" />
        </div>
        <div class="proceso__m-text">
          <span class="proceso__m-num">{{ step.number }}</span>
          <h3 class="proceso__m-title">{{ step.title }}</h3>
          <p class="proceso__m-desc">{{ step.description }}</p>
        </div>
      </div>
    </div>

    <!-- ─── Desktop ───────────────────────────────────── -->
    <div class="proceso__d">
      <!-- Right: image + overlay -->
      <div class="proceso__d-img-wrap">
        <img src="/images/derecha.png" alt="Tinaja de hormigón instalada" />
        <div class="proceso__d-img-overlay" />
      </div>

      <!-- Left: content -->
      <div class="proceso__d-left">
        <span class="proceso__d-label">PROCESO</span>
        <div class="proceso__d-steps">
          <div class="proceso__d-line" />
          <div
            v-for="step in PROCESO.steps"
            :key="step.title"
            class="proceso__d-step"
          >
            <div class="proceso__d-dot" />
            <span class="proceso__d-num">{{ step.number }}</span>
            <h3 class="proceso__d-title">{{ step.title }}</h3>
            <p class="proceso__d-desc">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.proceso { background: var(--c-darkest); }

/* ─── Mobile ─────────────────────────────────────────── */
.proceso__d { display: none; }

.proceso__m {
  display: flex;
  flex-direction: column;
  padding: 48px 28px;
}
.proceso__m-spacer { height: 20px; }
.proceso__m-step {
  display: flex;
  gap: 20px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--c-b-deep);
  margin-bottom: 28px;
}
.proceso__m-step--last {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.proceso__m-timeline {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24px;
  flex-shrink: 0;
}
.proceso__m-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--c-accent);
  flex-shrink: 0;
}
.proceso__m-line {
  flex: 1;
  width: 1px;
  background: var(--c-b-deep);
  margin-top: 4px;
  min-height: 80px;
}
.proceso__m-text { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.proceso__m-num  { font-size: 9px; color: var(--c-accent); letter-spacing: 3px; }
.proceso__m-title{ font-size: 24px; font-weight: 800; color: var(--c-text); }
.proceso__m-desc { font-size: 13px; color: var(--c-muted); line-height: 1.5; max-width: 270px; }

/* ─── Desktop ────────────────────────────────────────── */
@media (min-width: 768px) {
  .proceso__m { display: none; }
  .proceso__d {
    display: block;
    position: relative;
    min-height: 100vh;
    overflow: hidden;
  }

  /* Right: image + gradient overlay */
  .proceso__d-img-wrap {
    position: absolute;
    right: 0; top: 0; bottom: 0;
    width: 720px;
    overflow: hidden;
  }
  .proceso__d-img-wrap img { object-position: center; }
  .proceso__d-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, var(--c-darkest) 11%, rgba(0,0,0,0.77) 50%, transparent 100%);
  }

  /* Left content */
  .proceso__d-left {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 720px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 144px;
  }

  /* Rotated "PROCESO" label */
  .proceso__d-label {
    position: absolute;
    left: 44px; top: 50%;
    font-size: 10px;
    font-weight: 700;
    color: var(--c-accent);
    letter-spacing: 5px;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: center center;
    white-space: nowrap;
  }

  /* Steps group — flow layout so justify-content: center works */
  .proceso__d-steps {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 72px;
  }

  /* Vertical connector line — spans from first dot to bottom of group */
  .proceso__d-line {
    position: absolute;
    left: -32px; top: 26px; bottom: 0;
    width: 1px;
    background: var(--c-b-deep);
  }

  /* Steps */
  .proceso__d-step {
    position: relative;
    width: 520px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* Dot on the timeline */
  .proceso__d-dot {
    position: absolute;
    left: -37px; top: 26px;
    width: 10px; height: 10px;
    border-radius: 50%;
    background: var(--c-accent);
  }

  .proceso__d-num  { font-size: 10px; font-weight: 700; color: var(--c-accent); letter-spacing: 3px; }
  .proceso__d-title{ font-size: 36px; font-weight: 800; color: var(--c-text); line-height: 1; }
  .proceso__d-desc { font-size: 15px; color: var(--c-muted); line-height: 1.6; max-width: 480px; }
}
</style>
