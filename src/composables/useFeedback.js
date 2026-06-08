const STORAGE_KEY = 'ck_feedback_log'
const FREE_INTERVAL = 10  // tampilkan form tiap 10 kartu untuk free user

function loadLog() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveLog(log) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log))
  } catch {}
}

export function useFeedback() {
  // Cek apakah perlu tampilkan form (free: tiap 10 kartu, premium: setelah tema selesai)
  function shouldShowFeedback({ cardsSinceLastFeedback, isPremium, isSessionEnd }) {
    if (isPremium) return isSessionEnd
    return cardsSinceLastFeedback > 0 && cardsSinceLastFeedback % FREE_INTERVAL === 0
  }

  // Simpan satu entri feedback ke log
  function saveFeedback({ rating, comment, questions, themeId, mood, isPremium, trigger }) {
    const log = loadLog()
    log.push({
      id:        crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      themeId,
      mood,
      isPremium,
      trigger,     // 'interval_10' | 'session_end'
      rating,      // 1-5
      comment,
      questions,   // array { id, question } kartu yang sudah ditampilkan
    })
    saveLog(log)
  }

  function getAllFeedback() {
    return loadLog()
  }

  return { shouldShowFeedback, saveFeedback, getAllFeedback, FREE_INTERVAL }
}
