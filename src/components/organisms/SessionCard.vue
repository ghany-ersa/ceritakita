<template>
  <div
    class="session-card noise-bg"
    :class="{ 'session-card--dragging': isDragging, 'session-card--flying': isFlying }"
    :style="cardStyle"
    @pointerdown="$emit('pointerdown', $event)"
    @pointermove="$emit('pointermove', $event)"
    @pointerup="$emit('pointerup', $event)"
    @pointercancel="$emit('pointerup', $event)"
    @touchstart.passive="true"
  >
    <!-- Swipe hint: Jawab (left) -->
    <Transition name="hint-fade">
      <div v-if="showAnswerHint" class="swipe-hint swipe-hint--left">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">check_circle</span>
        <span>Jawab</span>
      </div>
    </Transition>

    <!-- Swipe hint: Dare (right) -->
    <Transition name="hint-fade">
      <div v-if="showDareHint" class="swipe-hint swipe-hint--right">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">local_fire_department</span>
        <span>Dare!</span>
      </div>
    </Transition>

    <div class="session-card__tag">
      <span class="material-symbols-outlined session-card__tag-icon" style="font-variation-settings:'FILL' 1;font-size:14px;">favorite</span>
      <span class="session-card__tag-text">{{ label }}</span>
    </div>

    <div class="session-card__body">
      <h2 class="session-card__question">{{ question }}</h2>
    </div>

    <div class="session-card__decoration">
      <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 0;font-size:28px;color:var(--primary);opacity:0.25;">auto_awesome</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  question:        { type: String,  required: true },
  label:           { type: String,  required: true },
  cardStyle:       { type: Object,  default: () => ({}) },
  isDragging:      { type: Boolean, default: false },
  isFlying:        { type: Boolean, default: false },
  showAnswerHint:  { type: Boolean, default: false },
  showDareHint:    { type: Boolean, default: false },
})

defineEmits(['pointerdown', 'pointermove', 'pointerup'])
</script>

<style scoped>
.session-card {
  width: 100%;
  max-width: 480px;
  aspect-ratio: 3/4;
  max-height: min(560px, 65dvh);
  border-radius: 24px;
  border: 1px solid rgba(137, 114, 109, 0.2);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  user-select: none;
  touch-action: none;
}

.session-card--dragging {
  box-shadow:
    var(--shadow-card),
    0 24px 60px rgba(143, 52, 37, 0.18);
}

.noise-bg { background: var(--surface-container-lowest); }
.noise-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
}

/* ── Swipe hint badges ─────────────────────────────────────────── */
.swipe-hint {
  position: absolute;
  top: 28px;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px 8px 14px;
  border-radius: var(--radius-full);
  font-family: var(--font-label);
  font-size: 0.95rem;
  font-weight: 700;
  border: 2.5px solid;
  backdrop-filter: blur(4px);
  pointer-events: none;
}

.swipe-hint--right {
  left: 20px;
  background: rgba(143, 52, 37, 0.1);
  border-color: rgba(143, 52, 37, 0.65);
  color: var(--primary);
  transform: rotate(-8deg);
}

.swipe-hint--left {
  right: 20px;
  background: rgba(20, 160, 80, 0.12);
  border-color: rgba(20, 160, 80, 0.7);
  color: #0f8040;
  transform: rotate(8deg);
}

.hint-fade-enter-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.hint-fade-leave-active { transition: opacity 0.1s ease; }
.hint-fade-enter-from   { opacity: 0; transform: rotate(-8deg) scale(0.85); }
.hint-fade-leave-to     { opacity: 0; }
.swipe-hint--left.hint-fade-enter-from { transform: rotate(8deg) scale(0.85); }

/* ── Card content ──────────────────────────────────────────────── */
.session-card__tag {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding-top: 28px;
  flex-shrink: 0;
}

.session-card__tag-icon { color: var(--secondary); }

.session-card__tag-text {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--secondary);
}


.session-card__body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--card-inset);
  text-align: center;
}

.session-card__question {
  font-family: var(--font-headline);
  font-size: clamp(1.15rem, 4vw, 1.625rem);
  font-weight: 600;
  line-height: 1.4;
  color: var(--on-surface);
}

.session-card__decoration {
  display: flex;
  justify-content: center;
  padding-bottom: 24px;
  flex-shrink: 0;
}
</style>
