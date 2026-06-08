<template>
  <span class="base-badge" :class="`base-badge--${variant}`">
    <slot />
  </span>
</template>

<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // primary | tertiary | muted
})
</script>

<style scoped>
.base-badge {
  display: inline-block;
  font-family: var(--font-label);
  font-weight: 700;
  font-size: 0.6rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.base-badge--primary {
  background: rgba(143, 52, 37, 0.1);
  color: var(--primary);
}

.base-badge--tertiary {
  background: rgba(221, 193, 177, 0.2);
  color: var(--tertiary);
  font-size: 0.75rem;
  padding: 5px 16px;
}

.base-badge--muted {
  background: var(--surface-container-high);
  color: var(--on-surface-variant);
}

.base-badge--trial {
  background: rgba(245, 166, 35, 0.12);
  color: #7a5c00;
  border: 1px solid rgba(245, 166, 35, 0.35);
}
</style>
