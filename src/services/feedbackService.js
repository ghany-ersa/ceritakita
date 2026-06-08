import { insertFeedback } from '../repositories/feedbackRepository'

const STORAGE_KEY = 'ck_feedback_log'
export const FREE_INTERVAL = 10

export function shouldShowFeedback({ cardsSinceLastFeedback, isPremium, isSessionEnd }) {
  if (isSessionEnd) return true
  if (isPremium) return false
  return cardsSinceLastFeedback > 0 && cardsSinceLastFeedback % FREE_INTERVAL === 0
}

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

export async function saveFeedback({ userId, rating, comment, questions, themeId, mood, isPremium, trigger }) {
  const entry = {
    id:        crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    themeId, mood, isPremium, trigger, rating, comment, questions,
  }

  const log = loadLog()
  log.push(entry)
  saveLog(log)

  try {
    await insertFeedback({ userId, themeId, mood, rating, comment, trigger, isPremium, questions })
  } catch {
    // Gagal kirim tidak apa-apa — data sudah tersimpan lokal
  }
}

export function getAllFeedback() {
  return loadLog()
}
