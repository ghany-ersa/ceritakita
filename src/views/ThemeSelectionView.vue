<script setup>
import { useRouter } from 'vue-router'
import { themes } from '../data/themes'
import { usePurchase } from '../composables/usePurchase'
import { useAuth } from '../composables/useAuth'
import PageHeader from '../components/molecules/PageHeader.vue'
import IconButton from '../components/atoms/IconButton.vue'
import ThemeGrid from '../components/organisms/ThemeGrid.vue'
import GrainTexture from '../components/atoms/GrainTexture.vue'
import UserMenu from '../components/molecules/UserMenu.vue'

const router = useRouter()
const { hasAccess, hasUnlockAll, isTrialAccess } = usePurchase()
const { user, signInWithGoogle } = useAuth()

function requireAuthThen(path) {
  if (user.value) {
    router.push(path)
  } else {
    signInWithGoogle(path)
  }
}

function selectTheme(theme) {
  if (hasAccess(theme.id, theme.isFree)) {
    requireAuthThen(`/mood/${theme.id}`)
  } else {
    router.push(`/paywall/${theme.id}`)
  }
}

function selectMix() {
  if (hasUnlockAll.value) {
    requireAuthThen('/mood/mix')
  } else {
    router.push('/paywall/mix')
  }
}
</script>

<template>
  <div class="theme-page">
    <PageHeader sticky>
      <template #left>
        <IconButton icon="arrow_back" :weight="400" aria-label="Kembali" @click="router.push('/')" />
      </template>
      <template #right>
        <UserMenu />
      </template>
    </PageHeader>

    <main class="theme-main">
      <div class="content-wrap">

        <div class="page-title-area">
          <h2 class="page-title">Pilih Topik</h2>
          <p class="page-subtitle">Pilih tema obrolan untuk malam ini.</p>
        </div>

        <button class="mix-btn" :class="{ 'mix-btn--locked': !hasUnlockAll }" @click="selectMix">
          <GrainTexture :opacity="0.04" />
          <div class="mix-btn__icon-wrap">
            <span
              class="material-symbols-outlined"
              style="font-variation-settings:'FILL' 1;"
            >{{ hasUnlockAll ? 'casino' : 'lock' }}</span>
          </div>
          <div class="mix-btn__text">
            <h3 class="mix-btn__title">🎲 Campurkan Tema</h3>
            <p class="mix-btn__desc">{{ hasUnlockAll ? 'Pertanyaan acak dari tema' : 'Butuh Unlock All untuk mengakses' }}</p>
          </div>
          <span v-if="!hasUnlockAll" class="mix-btn__badge">Premium</span>
        </button>

        <ThemeGrid :themes="themes" :has-access="hasAccess" :is-trial-access="isTrialAccess" @select="selectTheme" />

      </div>
    </main>
  </div>
</template>

<style scoped>
.theme-page {
  min-height: 100dvh;
  background: var(--surface-dim);
  display: flex;
  flex-direction: column;
}

.theme-main {
  flex: 1;
  overflow-y: auto;
  padding: 32px 24px 48px;
}

.content-wrap {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.page-title-area { text-align: center; }

.page-title {
  font-family: var(--font-headline);
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 600;
  color: var(--on-surface);
  margin-bottom: 6px;
}

.page-subtitle {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--on-surface-variant);
  opacity: 0.8;
}

/* Mix button */
.mix-btn {
  position: relative;
  width: 100%;
  background: var(--primary);
  border-radius: var(--radius-xl);
  padding: 20px 28px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: opacity var(--transition), transform var(--transition), box-shadow var(--transition);
  text-align: left;
  cursor: pointer;
  border: none;
}
.mix-btn:hover { opacity: 0.92; box-shadow: 0 14px 44px rgba(143, 52, 37, 0.22); }
.mix-btn:active { transform: scale(0.985); }

.mix-btn__icon-wrap {
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-primary);
  font-size: 28px;
  position: relative;
  z-index: 1;
}

.mix-btn__text {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mix-btn__title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--on-primary);
  line-height: 1.3;
}

.mix-btn__desc {
  font-family: var(--font-label);
  font-size: 0.8rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
}

.mix-btn--locked {
  opacity: 0.72;
  background: var(--surface-container-high);
  box-shadow: var(--shadow-sm);
}

.mix-btn--locked .mix-btn__icon-wrap {
  background: rgba(137, 114, 109, 0.15);
  color: var(--on-surface-variant);
}

.mix-btn--locked .mix-btn__title {
  color: var(--on-surface);
}

.mix-btn--locked .mix-btn__desc {
  color: var(--on-surface-variant);
}

.mix-btn__badge {
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary);
  background: rgba(143, 52, 37, 0.1);
  border: 1px solid rgba(143, 52, 37, 0.2);
  border-radius: var(--radius-full);
  padding: 4px 10px;
}

@media (min-width: 1024px) {
  .theme-main    { padding: 40px 32px 64px; }
  .content-wrap  { gap: 32px; }
  .mix-btn       { padding: 24px 32px; gap: 24px; }
}
</style>
