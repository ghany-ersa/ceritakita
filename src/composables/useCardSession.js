import { ref, computed, watch } from 'vue'
import { getThemeById } from '../data/themes'
import {
  DARE_DURATION,
  storageKey,
  loadState,
  saveState,
  clearState,
  buildShuffledCards,
  pickRandomDare,
} from '../services/sessionService'

const DEFAULT_DARES = [
  'Bisikkan satu rahasia kecil di telinga pasanganmu.',
  'Tirukan suara hewan favoritmu.',
  'Beri pasanganmu pelukan selama 10 detik.',
  'Ceritakan hal paling lucu yang pernah terjadi padamu.',
  'Tatap mata pasanganmu tanpa berkedip selama 30 detik.',
]

export function useCardSession(themeId, mood, cards) {
  const key = storageKey(themeId, mood)
  const saved = loadState(key)

  const shuffled = buildShuffledCards(cards, saved?.cardOrder ?? null)
  const cardOrder = shuffled.map(c => c.id)

  if (!saved) {
    saveState(key, {
      cardOrder,
      currentIndex:       0,
      showDare:           false,
      currentDare:        '',
      dareTimeLeft:       DARE_DURATION,
      dareDone:           false,
      sessionFinished:    false,
      shownSinceFeedback: [],
      pendingFeedback:    false,
    })
  }

  const currentIndex    = ref(saved?.currentIndex ?? 0)
  const showDare        = ref(saved?.showDare ?? false)
  const currentDare     = ref(saved?.currentDare ?? '')
  const dareTimeLeft    = ref(saved?.dareTimeLeft ?? DARE_DURATION)
  const dareDone        = ref(saved?.dareDone ?? false)
  const sessionFinished = ref(saved?.sessionFinished ?? false)
  const pendingFeedback = ref(saved?.pendingFeedback ?? false)
  const shownSinceFeedback = ref(saved?.shownSinceFeedback ?? [])

  const currentCard = computed(() => shuffled[currentIndex.value] ?? null)
  const progress = computed(() => ({ current: currentIndex.value, total: shuffled.length }))

  function persist() {
    saveState(key, {
      cardOrder,
      currentIndex:        currentIndex.value,
      showDare:            showDare.value,
      currentDare:         currentDare.value,
      dareTimeLeft:        dareTimeLeft.value,
      dareDone:            dareDone.value,
      sessionFinished:     sessionFinished.value,
      shownSinceFeedback:  shownSinceFeedback.value,
      pendingFeedback:     pendingFeedback.value,
    })
  }

  watch([currentIndex, showDare, currentDare, dareTimeLeft, dareDone, sessionFinished, shownSinceFeedback, pendingFeedback], persist)

  function nextCard() {
    if (currentIndex.value < shuffled.length - 1) {
      currentIndex.value++
    } else {
      sessionFinished.value = true
      clearState(key)
    }
  }

  function recordShownCard(card) {
    if (!card) return
    if (!shownSinceFeedback.value.some(c => c.id === card.id)) {
      shownSinceFeedback.value.push({ id: card.id, question: card.question })
    }
  }

  function resetShownSinceFeedback() {
    shownSinceFeedback.value = []
  }

  function triggerDare() {
    const dares = getThemeById(themeId)?.dares ?? DEFAULT_DARES
    currentDare.value  = pickRandomDare(dares)
    dareTimeLeft.value = DARE_DURATION
    dareDone.value     = false
    showDare.value     = true
  }

  function tickDare() {
    if (dareTimeLeft.value > 0) {
      dareTimeLeft.value--
    } else {
      dareDone.value = true
    }
  }

  function completeDare() {
    showDare.value = false
    dareDone.value = false
    nextCard()
  }

  function resetSession() {
    clearState(key)
  }

  return {
    currentCard,
    progress,
    showDare,
    currentDare,
    dareTimeLeft,
    dareDone,
    sessionFinished,
    shownSinceFeedback,
    pendingFeedback,
    triggerDare,
    tickDare,
    completeDare,
    nextCard,
    recordShownCard,
    resetShownSinceFeedback,
    resetSession,
    DARE_DURATION,
  }
}
