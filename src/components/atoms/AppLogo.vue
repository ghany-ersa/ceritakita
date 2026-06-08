<template>
  <img
    :src="logoSrc"
    alt="CeritaKita"
    class="app-logo"
    :class="`app-logo--${size}`"
  />
</template>

<script setup>
import logoSrc from '@/assets/logo.png'

defineProps({
  size: { type: String, default: 'md' }, // sm | md | lg
})
</script>

<style scoped>
.app-logo {
  display: block;
  object-fit: contain;
  height: auto;
  drop-shadow: drop-shadow(0 2px 8px rgba(0,0,0,0.08));
}

.app-logo--sm  { width: 120px; }
.app-logo--md  { width: 180px; }
.app-logo--lg  { width: min(320px, 80vw); }
</style>
