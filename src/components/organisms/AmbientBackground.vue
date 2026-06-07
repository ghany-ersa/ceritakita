<template>
  <div class="ambient" aria-hidden="true">
    <div v-if="type === 'landing'" class="ambient__gradient" />
    <div v-if="type === 'landing'" class="ambient__glow ambient__glow--top" />
    <div v-if="type === 'landing'" class="ambient__glow ambient__glow--bottom" />
    <div v-if="type === 'session'" class="ambient__session-glow" />
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'landing' }, // landing | session
})
</script>

<style scoped>
.ambient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

/* Landing */
.ambient__gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--surface) 0%, var(--background) 50%, var(--secondary-container) 100%);
  opacity: 0.4;
}

.ambient__glow {
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  mix-blend-mode: multiply;
}
.ambient__glow--top {
  top: -20%; right: -20%;
  width: 70vw; height: 70vw;
  background: var(--primary-fixed);
  opacity: 0.2;
}
.ambient__glow--bottom {
  bottom: -10%; left: -10%;
  width: 60vw; height: 60vw;
  background: var(--tertiary-fixed);
  opacity: 0.3;
}

/* Session */
.ambient__session-glow::before {
  content: '';
  width: 120%;
  height: 60%;
  background: rgba(255, 180, 166, 0.15);
  filter: blur(100px);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
