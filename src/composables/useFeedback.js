import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

const STORAGE_KEY = 'ck_feedback_log'
const FREE_INTERVAL = 10

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
  const { user } = useAuth()

  function shouldShowFeedback({ cardsSinceLastFeedback, isPremium, isSessionEnd }) {
    if (isPremium) return isSessionEnd
    return cardsSinceLastFeedback > 0 && cardsSinceLastFeedback % FREE_INTERVAL === 0
  }

  async function saveFeedback({ rating, comment, questions, themeId, mood, isPremium, trigger }) {
    const entry = {
      id:        crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      themeId,
      mood,
      isPremium,
      trigger,
      rating,
      comment,
      questions,
    }

    // Simpan lokal dulu (offline-first)
    const log = loadLog()
    log.push(entry)
    saveLog(log)

    // Kirim ke Supabase (best-effort, tidak blokir UI)
    try {
      await supabase.from('feedbacks').insert({
        user_id:    user.value?.id ?? null,
        theme_id:   themeId,
        mood,
        rating,
        comment:    comment || null,
        trigger,
        is_premium: isPremium,
        questions,
      })
    } catch {
      // Gagal kirim tidak apa-apa — data sudah tersimpan lokal
    }
  }

  function getAllFeedback() {
    return loadLog()
  }

  return { shouldShowFeedback, saveFeedback, getAllFeedback, FREE_INTERVAL }
}
