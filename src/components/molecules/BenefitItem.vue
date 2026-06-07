<template>
  <li class="benefit-item">
    <span class="material-symbols-outlined benefit-item__icon" style="font-variation-settings:'FILL' 0;">check_circle</span>
    <slot />
  </li>
</template>

<style scoped>
.benefit-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--on-surface);
}

.benefit-item__icon {
  font-size: 20px;
  color: var(--primary);
  flex-shrink: 0;
}
</style>
