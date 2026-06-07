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

const allCards = computed(() => {
  if (themeId === 'mix') return themes.flatMap(t => t.cards)
  return getThemeById(themeId)?.cards ?? []
})

const theme = computed(() => {
  if (themeId === 'mix') return { name: 'Campur Semua Tema', label: 'Campuran' }
  const t = getThemeById(themeId)
  return t ? { name: t.name, label: t.name } : null
})

if (allCards.value.length === 0) router.replace('/themes')

const session = useCardSession(themeId, allCards.value)
const {
  currentCard, progress, showDare,
  currentDare, sessionFinished, triggerDare, completeDare, nextCard,
} = session

// ── Swipe ─────────────────────────────────────────────────────────────
const swipe = useSwipeCard({
  onSwipeRight: () => nextCard(),
  onSwipeLeft:  () => triggerDare(),
})

const {
  cardStyle, showAnswerHint, showDareHint,
  isDragging, isFlying,
  onPointerDown, onPointerMove, onPointerUp,
} = swipe

// cardKey hanya naik saat card baru benar-benar perlu di-mount
// — dipicu setelah fly-out selesai (nextCard() sudah dipanggil)
const cardKey      = ref(0)
const cardVisible  = ref(true)  // kontrol masuk/keluar kartu baru

watch(currentCard, () => {
  // Saat currentCard berubah (dipicu oleh nextCard/completeDare),
  // isFlying masih true. Kita mount kartu baru setelah reset (50ms setelah 380ms).
  // Beri jeda kecil supaya kartu lama sudah invisible sebelum baru masuk.
  cardVisible.value = false
  setTimeout(() => {
    cardKey.value++
    cardVisible.value = true
  }, 30)
})
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

        <!-- Gesture hint — permanent, soft -->
        <div class="gesture-hint">
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

    <!-- Dare modal -->
    <Transition name="dare-slide">
      <DareCard v-if="showDare" :dare="currentDare" @done="completeDare" />
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

/* ── Card zone ── */
.card-zone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0 8px;
  /* overflow hidden agar kartu terbang tidak bikin scrollbar */
  overflow: hidden;
}

/* Kartu baru masuk dari bawah, sedikit kecil & miring */
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

/* ── Gesture hint ── */
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

/* ── Dare slide-up transition ── */
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
