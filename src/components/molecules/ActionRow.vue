<template>
  <div class="action-row" :class="{ 'action-row--stacked': stacked }">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  stacked: { type: Boolean, default: false },
})
</script>

<style scoped>
.action-row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

@media (min-width: 480px) {
  .action-row:not(.action-row--stacked) {
    flex-direction: row;
  }
}
</style>
