<script setup>
import { useRouter } from 'vue-router'
import AmbientBackground from '../components/organisms/AmbientBackground.vue'
import AppLogo from '../components/atoms/AppLogo.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

const router = useRouter()
</script>

<template>
  <div class="landing">
    <AmbientBackground type="landing" />

    <main class="landing-main container">
      <div class="content-stack">
        <div class="logo-area">
          <AppLogo size="lg" />
        </div>

        <div class="tagline-area">
          <p class="tagline">ketika ceritamu dan ceritaku<br>menjadi cerita kita.</p>
        </div>

        <div class="cta-area">
          <BaseButton variant="primary" :pill="true" @click="router.push('/themes')">
            Mulai Bermain
          </BaseButton>
        </div>

        <div class="hint-area">
          <span class="material-symbols-outlined hint-icon" style="font-variation-settings:'FILL' 0;">favorite</span>
          <span class="hint-text">Ruang aman untuk Cerita Kita</span>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.landing {
  position: relative;
  min-height: 100dvh;
  background: var(--background);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.landing-main {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  padding-bottom: var(--safe-area-bottom);
}

.content-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
  width: 100%;
}

.logo-area {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.tagline-area {
  margin: 0 auto 48px;
}
.tagline {
  font-family: var(--font-body);
  font-size: 1.25rem;
  color: var(--on-surface-variant);
  opacity: 0.9;
  line-height: 1.6;
}

.cta-area {
  width: 100%;
  max-width: 400px;
  margin-bottom: 24px;
}

.hint-area {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.6;
}
.hint-icon {
  font-size: 16px;
  color: var(--on-surface-variant);
}
.hint-text {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--on-surface-variant);
}
</style>
