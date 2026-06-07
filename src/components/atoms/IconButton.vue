<template>
  <button
    class="icon-btn"
    :class="{ 'icon-btn--glass': glass, 'icon-btn--disabled': disabled }"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <span
      class="material-symbols-outlined"
      :style="{ fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}` }"
    >{{ icon }}</span>
  </button>
</template>

<script setup>
const props = defineProps({
  icon:     { type: String, required: true },
  glass:    { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  fill:     { type: Number, default: 0 },
  weight:   { type: Number, default: 400 },
})
</script>

<style scoped>
.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant);
  flex-shrink: 0;
  transition: opacity var(--transition), transform var(--transition);
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
}
.icon-btn:hover  { opacity: 0.7; }
.icon-btn:active { transform: scale(0.92); }

.icon-btn--glass {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: var(--on-secondary-container);
  box-shadow: 0 2px 8px rgba(123, 81, 72, 0.1);
}
.icon-btn--glass:not(.icon-btn--disabled):hover {
  background: rgba(255, 255, 255, 0.5);
}

.icon-btn--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
