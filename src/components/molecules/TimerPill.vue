<template>
  <div class="timer-pill">
    <span class="timer-pill__num">{{ seconds }}</span>
    <span class="timer-pill__suffix">detik tersisa</span>
  </div>
</template>

<script setup>
defineProps({
  seconds: { type: Number, required: true },
})
</script>

<style scoped>
.timer-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: var(--radius-full);
  padding: 8px 20px;
}

.timer-pill__num {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--primary);
}

.timer-pill__suffix {
  font-family: var(--font-label);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--on-secondary-container);
  opacity: 0.7;
}
</style>
