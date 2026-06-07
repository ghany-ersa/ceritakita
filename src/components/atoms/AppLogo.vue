<template>
  <span class="app-logo" :class="`app-logo--${size}`">CeritaKita</span>
</template>

<script setup>
defineProps({
  size: { type: String, default: 'md' }, // sm | md | lg
})
</script>

<style scoped>
.app-logo {
  font-family: var(--font-headline);
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  white-space: nowrap;
}

.app-logo--sm  { font-size: 1rem; }
.app-logo--md  { font-size: 1.1rem; }
.app-logo--lg  { font-size: clamp(2.5rem, 10vw, 3.5rem); letter-spacing: -0.5px; }
</style>
