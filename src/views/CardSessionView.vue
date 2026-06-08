<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getThemeById, themes } from '../data/themes'
import { useCardSession } from '../composables/useCardSession'
import { useSwipeCard } from '../composables/useSwipeCard'
import AmbientBackground from '../components/organisms/AmbientBackground.vue'
import PageHeader from '../components/molecules/PageHeader.vue'
import IconButton from '../components/atoms/IconButton.vue'
import ProgressBar from '../components/atoms/ProgressBar.vue'
import SessionCard from '../components/organisms/SessionCard.vue'
import SessionFinished from '../components/organisms/SessionFinished.vue'
import DareCard from '../components/organisms/DareCard.vue'

const route   = useRoute()
const router  = useRouter()
const themeId = route.params.themeId
const mood    = route.query.mood ?? 'semua'

const allCards = computed(() => {
  const cards = themeId === 'mix'
    ? themes.flatMap(t => t.cards)
    : getThemeById(themeId)?.cards ?? []

  if (mood === 'semua') return cards
  return cards.filter(c => c.mood === mood)
})

const theme = computed(() => {
  if (themeId === 'mix') return { name: 'Campur Semua Tema', label: 'Campuran' }
  const t = getThemeById(themeId)
  return t ? { name: t.name, label: t.name } : null
})

if (allCards.value.length === 0) router.replace('/themes')

const session = useCardSession(themeId, mood, allCards.value)
const {
  currentCard, progress, showDare,
  currentDare, dareTimeLeft, dareDone, sessionFinished,
  triggerDare, tickDare, completeDare, nextCard, DARE_DURATION,
} = session

const swipe = useSwipeCard({
  onSwipeRight: () => nextCard(),
  onSwipeLeft:  () => triggerDare(),
})

const {
  cardStyle, showAnswerHint, showDareHint,
  isDragging, isFlying,
  onPointerDown, onPointerMove, onPointerUp,
  triggerSwipe,
} = swipe

const cardKey     = ref(0)
const cardVisible = ref(true)

// skip trigger pertama saat mount — currentCard sudah sesuai, tidak perlu animasi masuk
const cardWatchReady = ref(false)
watch(currentCard, () => {
  if (!cardWatchReady.value) {
    cardWatchReady.value = true
    return
  }
  cardVisible.value = false
  setTimeout(() => {
    cardKey.value++
    cardVisible.value = true
  }, 30)
})

function handleAnswer() { triggerSwipe(1) }
function handleDare()   { triggerSwipe(-1) }
function handleDareTick() { tickDare() }
</script>

<template>
  <div class="session-page">
    <AmbientBackground type="session" />

    <PageHeader transparent>
      <template #left>
        <IconButton icon="close" aria-label="Akhiri Sesi" @click="router.push('/themes')" />
      </template>
      <template #right>
        <IconButton icon="help_outline" aria-label="Bantuan" :disabled="true" style="opacity:0.5;" />
      </template>
    </PageHeader>

    <ProgressBar :current="progress.current" :total="progress.total" />

    <main class="session-main container-wide">

      <!-- ── SELESAI ── -->
      <div v-if="sessionFinished" class="finished-wrap">
        <SessionFinished
          @pick-theme="router.push('/themes')"
          @replay="router.go(0)"
        />
      </div>

      <!-- ── KARTU AKTIF ── -->
      <template v-else>
        <div class="card-stage">

          <!-- Desktop: tombol Dare di kiri kartu -->
          <button class="side-btn side-btn--dare desktop-only" @click="handleDare">
            <span class="material-symbols-outlined side-btn__icon" style="font-variation-settings:'FILL' 1;">local_fire_department</span>
            <span class="side-btn__label">Dare!</span>
          </button>

          <!-- Kartu -->
          <div class="card-zone">
            <Transition name="card-in">
              <SessionCard
                v-if="cardVisible"
                :key="cardKey"
                :question="currentCard?.question"
                :label="theme?.label"
                :card-style="cardStyle"
                :is-dragging="isDragging"
                :is-flying="isFlying"
                :show-answer-hint="showAnswerHint"
                :show-dare-hint="showDareHint"
                @pointerdown="onPointerDown"
                @pointermove="onPointerMove"
                @pointerup="onPointerUp"
              />
            </Transition>
          </div>

          <!-- Desktop: tombol Jawab di kanan kartu -->
          <button class="side-btn side-btn--answer desktop-only" @click="handleAnswer">
            <span class="material-symbols-outlined side-btn__icon" style="font-variation-settings:'FILL' 1;">check_circle</span>
            <span class="side-btn__label">Jawab</span>
          </button>

        </div>

        <!-- Mobile gesture hint -->
        <div class="gesture-hint mobile-only">
          <span class="gesture-hint__item">
            <span class="material-symbols-outlined" style="font-size:14px;">arrow_back</span>
            Dare
          </span>
          <span class="gesture-hint__dot" />
          <span class="gesture-hint__item">
            Jawab
            <span class="material-symbols-outlined" style="font-size:14px;">arrow_forward</span>
          </span>
        </div>
      </template>

    </main>

    <Transition name="dare-slide">
      <DareCard
        v-if="showDare"
        :dare="currentDare"
        :time-left="dareTimeLeft"
        :timer-done="dareDone"
        :total-duration="DARE_DURATION"
        @tick="handleDareTick"
        @done="completeDare"
      />
    </Transition>
  </div>
</template>

<style scoped>
.session-page {
  min-height: 100dvh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.session-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-top: var(--stack-gap);
  padding-bottom: var(--safe-area-bottom);
  position: relative;
  z-index: 1;
}

/* ── Card stage: kartu + side buttons ── */
.card-stage {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  padding: 16px 0 8px;
  overflow: hidden;
}

.card-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Side buttons (desktop only) ── */
.desktop-only { display: none; }

@media (min-width: 760px) {
  .desktop-only { display: flex; }
  .mobile-only  { display: none !important; }
}

.side-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.18s ease,
              background 0.15s ease;
}

.side-btn:hover  { transform: scale(1.08); }
.side-btn:active { transform: scale(0.94); }

.side-btn--answer {
  background: var(--primary);
  color: var(--on-primary);
  box-shadow: 0 6px 24px -4px rgba(143, 52, 37, 0.35);
}
.side-btn--answer:hover {
  background: var(--surface-tint);
  box-shadow: 0 10px 32px -4px rgba(143, 52, 37, 0.45);
}

.side-btn--dare {
  background: var(--surface-container);
  color: var(--on-surface-variant);
  border: 1.5px solid rgba(137, 114, 109, 0.25);
  box-shadow: var(--shadow-sm);
}
.side-btn--dare:hover {
  background: var(--surface-container-high);
  box-shadow: var(--shadow-md);
}

.side-btn__icon { font-size: 28px; }

.side-btn__label {
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  line-height: 1;
}

/* ── Card enter animation ── */
.card-in-enter-active {
  animation: cardEnter 0.44s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(52px) scale(0.92) rotate(-1.5deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1) rotate(0deg);
  }
}

/* ── Mobile gesture hint ── */
.gesture-hint {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 0 20px;
  opacity: 0.35;
}

.gesture-hint__item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--on-surface-variant);
  text-transform: uppercase;
}

.gesture-hint__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--on-surface-variant);
}

/* ── Finished ── */
.finished-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
}

/* ── Dare slide-up ── */
.dare-slide-enter-active {
  animation: dareSlideIn 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.dare-slide-leave-active {
  animation: dareSlideOut 0.28s cubic-bezier(0.4, 0, 1, 1) both;
}
@keyframes dareSlideIn {
  from { opacity: 0; transform: translateY(100%); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes dareSlideOut {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(100%); }
}
</style>
