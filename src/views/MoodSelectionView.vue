<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getThemeById } from '../data/themes'
import { usePurchase } from '../composables/usePurchase'
import AmbientBackground from '../components/organisms/AmbientBackground.vue'
import PageHeader from '../components/molecules/PageHeader.vue'
import IconButton from '../components/atoms/IconButton.vue'
import GrainTexture from '../components/atoms/GrainTexture.vue'

const route   = useRoute()
const router  = useRouter()
const themeId = route.params.themeId

const theme = computed(() => {
  if (themeId === 'mix') return { name: 'Campur Semua Tema' }
  return getThemeById(themeId)
})

const { hasAccess } = usePurchase()

if (!theme.value) router.replace('/themes')

function startSession(mood) {
  router.push({ path: `/session/${themeId}`, query: { mood } })
}
</script>

<template>
  <div class="mood-page">
    <AmbientBackground type="session" />

    <PageHeader transparent>
      <template #left>
        <IconButton icon="arrow_back" aria-label="Kembali" @click="router.push('/themes')" />
      </template>
    </PageHeader>

    <main class="mood-main container">
      <div class="mood-content">

        <div class="mood-header">
          <p class="mood-theme-label">{{ theme?.name }}</p>
          <h2 class="mood-title">Malam ini terasa seperti apa?</h2>
          <p class="mood-subtitle">Pilih suasana yang paling cocok sekarang.</p>
        </div>

        <div class="mood-options">

          <!-- Santai -->
          <button class="mood-card mood-card--santai" @click="startSession('santai')">
            <GrainTexture :opacity="0.04" />
            <div class="mood-card__inner">
              <div class="mood-card__emoji">☕</div>
              <div class="mood-card__text">
                <h3 class="mood-card__title">Santai</h3>
                <p class="mood-card__desc">Obrolan ringan, fun, dan tanpa tekanan.</p>
              </div>
              <span class="material-symbols-outlined mood-card__arrow">arrow_forward</span>
            </div>
          </button>

          <!-- Dalam -->
          <button class="mood-card mood-card--dalam" @click="startSession('dalam')">
            <GrainTexture :opacity="0.04" />
            <div class="mood-card__inner">
              <div class="mood-card__emoji">🕯️</div>
              <div class="mood-card__text">
                <h3 class="mood-card__title">Dalam</h3>
                <p class="mood-card__desc">Pertanyaan yang butuh keberanian untuk dijawab.</p>
              </div>
              <span class="material-symbols-outlined mood-card__arrow">arrow_forward</span>
            </div>
          </button>

          <!-- Campur -->
          <button class="mood-card mood-card--campur" @click="startSession('semua')">
            <GrainTexture :opacity="0.03" />
            <div class="mood-card__inner">
              <div class="mood-card__emoji">🎲</div>
              <div class="mood-card__text">
                <h3 class="mood-card__title">Campur</h3>
                <p class="mood-card__desc">Acak — biarkan kartu yang memutuskan.</p>
              </div>
              <span class="material-symbols-outlined mood-card__arrow">arrow_forward</span>
            </div>
          </button>

        </div>

      </div>
    </main>
  </div>
</template>

<style scoped>
.mood-page {
  min-height: 100dvh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.mood-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 16px;
  padding-bottom: var(--safe-area-bottom);
  position: relative;
  z-index: 1;
}

.mood-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Header */
.mood-header { text-align: center; }

.mood-theme-label {
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--primary);
  margin-bottom: 10px;
  opacity: 0.8;
}

.mood-title {
  font-family: var(--font-headline);
  font-size: clamp(1.4rem, 4vw, 1.75rem);
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.25;
  margin-bottom: 8px;
}

.mood-subtitle {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--on-surface-variant);
  opacity: 0.75;
}

/* Option cards */
.mood-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mood-card {
  position: relative;
  width: 100%;
  border-radius: var(--radius-xl);
  padding: 20px 24px;
  overflow: hidden;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.2s ease,
              opacity 0.15s ease;
}

.mood-card:hover  { transform: translateY(-2px); }
.mood-card:active { transform: scale(0.985); }

.mood-card--santai {
  background: var(--surface-container-low);
  border: 1.5px solid rgba(137, 114, 109, 0.18);
  box-shadow: var(--shadow-sm);
}
.mood-card--santai:hover { box-shadow: var(--shadow-md); }

.mood-card--dalam {
  background: var(--primary);
  box-shadow: 0 8px 30px rgba(143, 52, 37, 0.22);
}
.mood-card--dalam:hover { box-shadow: 0 12px 40px rgba(143, 52, 37, 0.3); }

.mood-card--campur {
  background: var(--surface-container);
  border: 1.5px solid rgba(137, 114, 109, 0.18);
  box-shadow: var(--shadow-sm);
}
.mood-card--campur:hover { box-shadow: var(--shadow-md); }

.mood-card__inner {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 16px;
}

.mood-card__emoji {
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;
}

.mood-card__text {
  flex: 1;
}

.mood-card__title {
  font-family: var(--font-headline);
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 3px;
}

.mood-card--santai  .mood-card__title,
.mood-card--campur  .mood-card__title { color: var(--on-surface); }
.mood-card--dalam   .mood-card__title { color: var(--on-primary); }

.mood-card__desc {
  font-family: var(--font-body);
  font-size: 0.82rem;
  line-height: 1.4;
}

.mood-card--santai  .mood-card__desc,
.mood-card--campur  .mood-card__desc { color: var(--on-surface-variant); }
.mood-card--dalam   .mood-card__desc { color: rgba(255, 255, 255, 0.72); }

.mood-card__arrow {
  font-size: 20px;
  flex-shrink: 0;
  opacity: 0.4;
}

.mood-card--santai  .mood-card__arrow,
.mood-card--campur  .mood-card__arrow { color: var(--on-surface-variant); }
.mood-card--dalam   .mood-card__arrow { color: var(--on-primary); }

@media (min-width: 480px) {
  .mood-card { padding: 24px 28px; }
  .mood-card__emoji { font-size: 2.25rem; }
}
</style>
