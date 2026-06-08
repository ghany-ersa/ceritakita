<template>
  <button
    class="theme-card"
    :class="{ 'theme-card--locked': locked }"
    @click="$emit('select')"
  >
    <GrainTexture :opacity="0.03" />

    <div class="theme-card__top">
      <div class="theme-card__icon-wrap" :style="{ background: iconBg }">
        <span
          class="material-symbols-outlined"
          :style="{ color: iconColor, fontVariationSettings: `'FILL' 1` }"
        >{{ icon }}</span>
      </div>
      <BaseBadge v-if="isTrial" variant="trial">Trial</BaseBadge>
      <BaseBadge v-else-if="isFree" variant="primary">Gratis</BaseBadge>
    </div>

    <div class="theme-card__body">
      <h3 class="theme-card__name">{{ name }}</h3>
      <p class="theme-card__meta">{{ cardCount }} kartu</p>
    </div>

    <div v-if="locked" class="theme-card__lock">
      <span class="material-symbols-outlined theme-card__lock-icon">lock</span>
    </div>

    <div class="theme-card__gradient" />
  </button>
</template>

<script setup>
import GrainTexture from '../atoms/GrainTexture.vue'
import BaseBadge from '../atoms/BaseBadge.vue'

defineProps({
  name:      { type: String, required: true },
  icon:      { type: String, default: 'style' },
  iconBg:    { type: String, default: 'rgba(143,52,37,0.08)' },
  iconColor: { type: String, default: 'var(--primary)' },
  cardCount: { type: Number, required: true },
  isFree:    { type: Boolean, default: false },
  locked:    { type: Boolean, default: false },
  isTrial:   { type: Boolean, default: false },
})

defineEmits(['select'])
</script>

<style scoped>
.theme-card {
  position: relative;
  background: var(--surface-container-lowest);
  border-radius: var(--radius-xl);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1;
  border: 1px solid rgba(137, 114, 109, 0.18);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
  transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
  text-align: left;
  cursor: pointer;
}
.theme-card:hover {
  background: var(--surface-container-low);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}
.theme-card:active { transform: scale(0.97) translateY(0); }

@media (max-width: 399px) { .theme-card { padding: 14px; } }
@media (min-width: 900px) { .theme-card { padding: 24px; } }

.theme-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  position: relative;
  z-index: 1;
}

.theme-card__icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
@media (min-width: 900px) { .theme-card__icon-wrap { width: 48px; height: 48px; } }

.theme-card__body {
  position: relative;
  z-index: 1;
}

.theme-card__name {
  font-family: var(--font-headline);
  font-size: clamp(0.875rem, 1.6vw, 1.05rem);
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.25;
  margin-bottom: 3px;
}

.theme-card__meta {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  opacity: 0.75;
}

.theme-card__lock {
  position: absolute;
  inset: 0;
  background: rgba(252, 249, 243, 0.5);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 12px;
  z-index: 3;
  border-radius: inherit;
}

.theme-card__lock-icon {
  font-size: 18px;
  color: var(--on-surface-variant);
  opacity: 0.6;
}

.theme-card__gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(to top, rgba(246, 243, 237, 0.6) 0%, transparent 100%);
  pointer-events: none;
  z-index: 0;
}
</style>
