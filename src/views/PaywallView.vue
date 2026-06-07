<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getThemeById } from '../data/themes'
import { useAuth } from '../composables/useAuth'
import PaywallModal from '../components/organisms/PaywallModal.vue'

const route = useRoute()
const router = useRouter()
const { user, signInWithGoogle } = useAuth()

const theme = computed(() => getThemeById(route.params.themeId))

function handlePurchase() {
  if (!user.value) { signInWithGoogle(); return }
  alert('Integrasi payment gateway (Midtrans/Xendit) segera hadir.')
}
</script>

<template>
  <div class="paywall-page">
    <!-- Blurred background preview -->
    <div class="page-blur" aria-hidden="true">
      <header class="blur-header container-wide">
        <div style="width:40px" />
        <span class="blur-logo">CeritaKita</span>
        <div style="width:40px" />
      </header>
      <div class="blur-content container-wide">
        <h2 class="blur-title">Pilih Tema</h2>
        <div class="blur-grid">
          <div class="blur-tile" v-for="i in 4" :key="i" />
        </div>
      </div>
    </div>

    <PaywallModal
      :show-login-note="!user"
      @close="router.push('/themes')"
      @purchase="handlePurchase"
    />
  </div>
</template>

<style scoped>
.paywall-page {
  position: relative;
  min-height: 100dvh;
  background: var(--background);
  display: flex;
  flex-direction: column;
}

.page-blur {
  position: fixed;
  inset: 0;
  filter: blur(6px);
  opacity: 0.6;
  pointer-events: none;
  overflow: hidden;
}

.blur-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blur-logo {
  font-family: var(--font-headline);
  font-weight: 700;
  color: var(--primary);
  font-size: 1rem;
}

.blur-content { padding-top: 16px; }

.blur-title {
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 16px;
}

.blur-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.blur-tile {
  aspect-ratio: 1;
  background: var(--surface-container);
  border-radius: var(--radius-xl);
  border: 1px solid rgba(137, 114, 109, 0.2);
}
</style>
