<template>
  <div class="session-finished">
    <div class="celebration">
      <div class="celebration__ring celebration__ring--outer" />
      <div class="celebration__ring celebration__ring--inner" />
      <div class="celebration__icon-bg">
        <span class="material-symbols-outlined celebration__heart" style="font-variation-settings:'FILL' 1;">favorite</span>
      </div>
      <span class="material-symbols-outlined celebration__sparkle celebration__sparkle--1" style="font-variation-settings:'FILL' 1;color:var(--secondary);">colors_spark</span>
      <span class="material-symbols-outlined celebration__sparkle celebration__sparkle--2" style="color:var(--primary-fixed-dim);">auto_awesome</span>
    </div>

    <div class="session-finished__text">
      <BaseBadge variant="tertiary">Pencapaian Baru</BaseBadge>
      <h2 class="session-finished__title">Tema ini sudah selesai!</h2>
      <p class="session-finished__desc">Kalian telah membagikan cerita dan kenangan yang indah. Teruslah terhubung.</p>
    </div>

    <div class="session-finished__actions">
      <BaseButton variant="primary" :pill="true" @click="$emit('pick-theme')">
        <span class="material-symbols-outlined" style="font-size:20px;">style</span>
        Pilih Tema Lain
      </BaseButton>
      <BaseButton variant="surface" :pill="true" @click="$emit('replay')">
        <span class="material-symbols-outlined" style="font-size:20px;">refresh</span>
        Ulangi Sesi
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import BaseBadge from '../atoms/BaseBadge.vue'
import BaseButton from '../atoms/BaseButton.vue'

defineEmits(['pick-theme', 'replay'])
</script>

<style scoped>
.session-finished {
  width: 100%;
  max-width: 420px;
  background: var(--surface-container-lowest);
  border-radius: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

/* Celebration */
.celebration {
  position: relative;
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: float 6s ease-in-out infinite;
}

.celebration__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px dashed;
}
.celebration__ring--outer {
  border-color: rgba(240, 186, 174, 0.4);
  animation: spin 10s linear infinite;
}
.celebration__ring--inner {
  inset: -24px;
  border-color: rgba(221, 193, 177, 0.3);
  border-width: 1px;
  border-style: solid;
  animation: spin 15s linear infinite reverse;
}

.celebration__icon-bg {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 50px rgba(143, 52, 37, 0.2);
  position: relative;
  z-index: 1;
}
.celebration__heart {
  font-size: 56px;
  color: var(--on-primary-container);
}

.celebration__sparkle {
  position: absolute;
  z-index: 2;
  animation: pulse 2s ease-in-out infinite;
}
.celebration__sparkle--1 { top: 4px;   right: 16px; font-size: 24px; }
.celebration__sparkle--2 { bottom: 12px; left: 4px; font-size: 20px; animation-delay: 1s; }

/* Text */
.session-finished__text { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }

.session-finished__title {
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-top: 8px;
}
.session-finished__desc {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.7;
  max-width: 300px;
}

/* Actions */
.session-finished__actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50%       { transform: translateY(-16px) rotate(4deg); }
}
@keyframes spin  { to { transform: rotate(360deg); } }
@keyframes pulse {
  0%, 100% { opacity: 0.35; }
  50%       { opacity: 0.7; }
}
</style>
