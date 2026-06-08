<template>
  <!-- Backdrop -->
  <div class="dare-backdrop" @click.self="timerDone && emit('done')">

    <!-- Sheet -->
    <div class="dare-sheet">
      <!-- Drag handle -->
      <div class="dare-sheet__handle" />

      <!-- Header row -->
      <div class="dare-sheet__header">
        <div class="dare-sheet__label">
          <div class="dare-sheet__fire-wrap">
            <span
              class="material-symbols-outlined"
              style="font-variation-settings:'FILL' 1;font-size:20px;color:var(--primary);"
            >local_fire_department</span>
          </div>
          <span class="dare-sheet__label-text">Tantangan</span>
        </div>

        <button
          class="dare-sheet__close"
          :class="{ 'dare-sheet__close--active': timerDone }"
          :disabled="!timerDone"
          aria-label="Selesai"
          @click="emit('done')"
        >
          <span class="material-symbols-outlined" style="font-size:18px;">close</span>
        </button>
      </div>

      <!-- Dare text -->
      <div class="dare-sheet__body">
        <p class="dare-sheet__text">{{ dare }}</p>
      </div>

      <!-- Timer + CTA -->
      <div class="dare-sheet__footer">
        <div class="dare-sheet__timer" :class="{ 'dare-sheet__timer--done': timerDone }">
          <!-- Circular progress -->
          <svg class="timer-ring" viewBox="0 0 44 44" aria-hidden="true">
            <circle class="timer-ring__track" cx="22" cy="22" r="18" />
            <circle
              class="timer-ring__fill"
              cx="22" cy="22" r="18"
              :style="{ strokeDashoffset: dashOffset }"
            />
          </svg>
          <span class="timer-ring__num">{{ timerDone ? '✓' : timeLeft }}</span>
        </div>

        <button
          class="dare-sheet__cta"
          :disabled="!timerDone"
          @click="emit('done')"
        >
          <span>{{ timerDone ? 'Sudah Dilakukan' : `Tunggu ${timeLeft} detik...` }}</span>
          <span
            v-if="timerDone"
            class="material-symbols-outlined"
            style="font-variation-settings:'FILL' 1;font-size:20px;"
          >check</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  dare:          { type: String,  required: true },
  timeLeft:      { type: Number,  required: true },
  timerDone:     { type: Boolean, required: true },
  totalDuration: { type: Number,  default: 30 },
})

const emit = defineEmits(['tick', 'done'])

const CIRCUMFERENCE = 2 * Math.PI * 18

let interval = null

onMounted(() => {
  if (!props.timerDone) {
    interval = setInterval(() => emit('tick'), 1000)
  }
})

onUnmounted(() => clearInterval(interval))

const dashOffset = computed(() => {
  const progress = props.timeLeft / props.totalDuration
  return CIRCUMFERENCE * (1 - progress)
})
</script>

<style scoped>
/* ── Backdrop ── */
.dare-backdrop {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(28, 24, 20, 0.55);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* ── Sheet ── */
.dare-sheet {
  width: 100%;
  max-width: 520px;
  background: var(--surface-container-lowest);
  border-radius: 28px 28px 0 0;
  padding: 12px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 -8px 40px rgba(143, 52, 37, 0.12);
  border: 1px solid rgba(137, 114, 109, 0.15);
  border-bottom: none;

  /* Match lebar area kartu di desktop */
  @media (min-width: 560px) {
    border-radius: 28px;
    margin-bottom: 32px;
    padding: 16px 32px 36px;
  }
}

/* ── Handle ── */
.dare-sheet__handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--outline-variant);
  margin: 0 auto 4px;
  flex-shrink: 0;
}

/* ── Header row ── */
.dare-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dare-sheet__label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dare-sheet__fire-wrap {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(143, 52, 37, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dare-sheet__label-text {
  font-family: var(--font-label);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--primary);
}

.dare-sheet__close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: var(--surface-container-high);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant);
  cursor: pointer;
  opacity: 0.35;
  transition: opacity var(--transition), background var(--transition);
  flex-shrink: 0;
}
.dare-sheet__close--active {
  opacity: 1;
}
.dare-sheet__close--active:hover {
  background: var(--surface-container-highest);
}

/* ── Dare text ── */
.dare-sheet__body {
  padding: 4px 0 4px;
}

.dare-sheet__text {
  font-family: var(--font-headline);
  font-size: clamp(1.25rem, 4.5vw, 1.75rem);
  font-weight: 700;
  line-height: 1.4;
  color: var(--on-surface);
  letter-spacing: -0.01em;
}

/* ── Footer: timer + CTA ── */
.dare-sheet__footer {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Circular timer */
.dare-sheet__timer {
  position: relative;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.timer-ring {
  width: 44px;
  height: 44px;
  transform: rotate(-90deg);
}

.timer-ring__track {
  fill: none;
  stroke: var(--surface-variant);
  stroke-width: 3;
}

.timer-ring__fill {
  fill: none;
  stroke: var(--primary);
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 113.1;  /* 2π × 18 */
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s linear;
}

.dare-sheet__timer--done .timer-ring__fill {
  stroke: #0f8040;
  transition: none;
}

.timer-ring__num {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-headline);
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1;
}

/* CTA button */
.dare-sheet__cta {
  flex: 1;
  height: 52px;
  border-radius: var(--radius-xl);
  background: var(--primary);
  color: var(--on-primary);
  font-family: var(--font-label);
  font-size: 1rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px -6px rgba(143, 52, 37, 0.45);
  transition: opacity var(--transition), transform var(--transition), box-shadow var(--transition);
}
.dare-sheet__cta:disabled {
  opacity: 0.55;
  pointer-events: none;
  box-shadow: none;
}
.dare-sheet__cta:not(:disabled):hover {
  background: var(--surface-tint);
  box-shadow: 0 10px 28px -6px rgba(143, 52, 37, 0.5);
  transform: translateY(-1px);
}
.dare-sheet__cta:not(:disabled):active {
  transform: translateY(0);
  box-shadow: 0 4px 12px -4px rgba(143, 52, 37, 0.35);
}
</style>
