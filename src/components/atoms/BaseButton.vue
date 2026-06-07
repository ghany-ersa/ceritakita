<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, { 'btn--pill': pill, 'btn--sm': size === 'sm' }]"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  variant:  { type: String, default: 'primary' }, // primary | surface | ghost | danger
  pill:     { type: Boolean, default: false },
  size:     { type: String, default: 'md' },       // sm | md
  disabled: { type: Boolean, default: false },
})
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-label);
  font-weight: 600;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  width: 100%;
  height: 56px;
  border: none;
  cursor: pointer;
  transition: all var(--transition);
  border-radius: var(--radius-xl);
}
.btn:active  { transform: translateY(2px) scale(0.98); }
.btn:disabled { opacity: 0.45; pointer-events: none; }

.btn--pill { border-radius: var(--radius-full); }
.btn--sm   { height: 48px; font-size: 0.8rem; }

/* Variants */
.btn--primary {
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: var(--shadow-btn);
}
.btn--primary:hover { background: var(--surface-tint); box-shadow: var(--shadow-md); }

.btn--surface {
  background: var(--surface-container);
  color: var(--on-surface-variant);
  border: 1px solid rgba(137, 114, 109, 0.2);
}
.btn--surface:hover { background: var(--surface-container-high); }

.btn--ghost {
  background: transparent;
  color: var(--on-surface-variant);
  width: auto;
}
.btn--ghost:hover { background: rgba(137, 114, 109, 0.06); }
</style>
