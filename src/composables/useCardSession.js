import { ref, computed } from 'vue'
import { getThemeById } from '../data/themes'

const DEFAULT_DARES = [
  'Bisikkan satu rahasia kecil di telinga pasanganmu.',
  'Tirukan suara hewan favoritmu.',
  'Beri pasanganmu pelukan selama 10 detik.',
  'Ceritakan hal paling lucu yang pernah terjadi padamu.',
  'Tatap mata pasanganmu tanpa berkedip selama 30 detik.',
]

export function useCardSession(themeId, cards) {
  const shuffled = [...cards].sort(() => Math.random() - 0.5)
  const currentIndex = ref(0)
  const isFlipped = ref(false)
  const showDare = ref(false)
  const currentDare = ref('')
  const sessionFinished = ref(false)

  const currentCard = computed(() => shuffled[currentIndex.value] ?? null)

  const progress = computed(() => ({
    current: currentIndex.value,
    total: shuffled.length,
  }))

  function flipCard() {
    isFlipped.value = true
  }

  function nextCard() {
    isFlipped.value = false
    if (currentIndex.value < shuffled.length - 1) {
      currentIndex.value++
    } else {
      sessionFinished.value = true
    }
  }

  function getDares() {
    return getThemeById(themeId)?.dares ?? DEFAULT_DARES
  }

  function triggerDare() {
    const dares = getDares()
    currentDare.value = dares[Math.floor(Math.random() * dares.length)]
    showDare.value = true
  }

  function completeDare() {
    showDare.value = false
    nextCard()
  }

  return {
    currentCard,
    progress,
    isFlipped,
    showDare,
    currentDare,
    sessionFinished,
    flipCard,
    triggerDare,
    completeDare,
    nextCard,
  }
}
