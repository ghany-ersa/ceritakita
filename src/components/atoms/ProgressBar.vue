<template>
  <div class="progress-track">
    <div class="progress-fill" :style="{ width: `${percentage}%` }" />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: { type: Number, required: true },
  total:   { type: Number, required: true },
})

const percentage = computed(() => (props.current / props.total) * 100)
</script>

<style scoped>
.progress-track {
  position: absolute;
  top: 64px;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--surface-variant);
  z-index: 10;
}

.progress-fill {
  height: 100%;
  background: var(--primary);
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
