import { ref, computed, watch } from 'vue'
import { getThemeById } from '../data/themes'

const DEFAULT_DARES = [
  'Bisikkan satu rahasia kecil di telinga pasanganmu.',
  'Tirukan suara hewan favoritmu.',
  'Beri pasanganmu pelukan selama 10 detik.',
  'Ceritakan hal paling lucu yang pernah terjadi padamu.',
  'Tatap mata pasanganmu tanpa berkedip selama 30 detik.',
]

const DARE_DURATION = 30

function storageKey(themeId, mood) {
  return `session_state_${themeId}_${mood ?? 'semua'}`
}

function loadState(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveState(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}
}

function clearState(key) {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export function useCardSession(themeId, mood, cards) {
  const key = storageKey(themeId, mood)
  const saved = loadState(key)

  // Shuffle dengan seed deterministik berdasarkan urutan ID kartu
  // supaya urutan bisa direproduksi setelah refresh
  function buildShuffled(savedOrder) {
    if (savedOrder) {
      // Urutkan kartu sesuai urutan yang sudah tersimpan
      const cardMap = Object.fromEntries(cards.map(c => [c.id, c]))
      const ordered = savedOrder.map(id => cardMap[id]).filter(Boolean)
      // Tambahkan kartu baru yang mungkin belum ada di savedOrder
      const savedSet = new Set(savedOrder)
      const newCards = cards.filter(c => !savedSet.has(c.id))
      return [...ordered, ...newCards]
    }
    return [...cards].sort(() => Math.random() - 0.5)
  }

  const shuffled = buildShuffled(saved?.cardOrder ?? null)
  const cardOrder = shuffled.map(c => c.id)

  // Jika sesi baru, langsung simpan urutan kartu supaya refresh sebelum action apapun
  // tetap bisa merestorasi posisi yang benar
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

  // Kartu yang sudah ditampilkan sejak feedback terakhir (untuk dicatat di feedback)
  const shownSinceFeedback = ref(saved?.shownSinceFeedback ?? [])

  const currentCard = computed(() => shuffled[currentIndex.value] ?? null)

  const progress = computed(() => ({
    current: currentIndex.value,
    total: shuffled.length,
  }))

  // Persist setiap kali state berubah
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

  // Dipanggil dari view saat kartu pertama kali ditampilkan
  function recordShownCard(card) {
    if (!card) return
    const alreadyRecorded = shownSinceFeedback.value.some(c => c.id === card.id)
    if (!alreadyRecorded) {
      shownSinceFeedback.value.push({ id: card.id, question: card.question })
    }
  }

  // Dipanggil setelah feedback dikirim atau dilewati, reset buffer
  function resetShownSinceFeedback() {
    shownSinceFeedback.value = []
  }

  function getDares() {
    return getThemeById(themeId)?.dares ?? DEFAULT_DARES
  }

  function triggerDare() {
    const dares = getDares()
    currentDare.value  = dares[Math.floor(Math.random() * dares.length)]
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
