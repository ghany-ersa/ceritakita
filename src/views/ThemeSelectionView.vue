<script setup>
import { useRouter } from 'vue-router'
import { themes } from '../data/themes'
import { usePurchase } from '../composables/usePurchase'
import PageHeader from '../components/molecules/PageHeader.vue'
import IconButton from '../components/atoms/IconButton.vue'
import ThemeGrid from '../components/organisms/ThemeGrid.vue'
import GrainTexture from '../components/atoms/GrainTexture.vue'

const router = useRouter()
const { hasAccess } = usePurchase()

function selectTheme(theme) {
  if (hasAccess(theme.id, theme.isFree)) {
    router.push(`/mood/${theme.id}`)
  } else {
    router.push(`/paywall/${theme.id}`)
  }
}
</script>

<template>
  <div class="theme-page">
    <PageHeader sticky>
      <template #left>
        <IconButton icon="arrow_back" :weight="400" aria-label="Kembali" @click="router.push('/')" />
      </template>
    </PageHeader>

    <main class="theme-main">
      <div class="content-wrap">

        <div class="page-title-area">
          <h2 class="page-title">Pilih Topik</h2>
          <p class="page-subtitle">Pilih tema obrolan untuk malam ini.</p>
        </div>

        <button class="mix-btn" @click="router.push('/mood/mix')">
          <GrainTexture :opacity="0.04" />
          <div class="mix-btn__icon-wrap">
            <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">casino</span>
          </div>
          <div class="mix-btn__text">
            <h3 class="mix-btn__title">🎲 Campur Semua Tema</h3>
            <p class="mix-btn__desc">Pertanyaan acak dari semua tema</p>
          </div>
        </button>

        <ThemeGrid :themes="themes" :has-access="hasAccess" @select="selectTheme" />

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

@media (min-width: 1024px) {
  .theme-main    { padding: 40px 32px 64px; }
  .content-wrap  { gap: 32px; }
  .mix-btn       { padding: 24px 32px; gap: 24px; }
}
</style>
