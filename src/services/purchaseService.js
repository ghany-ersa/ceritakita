import { fetchPurchases } from '../repositories/purchaseRepository'

const STORAGE_KEY = 'ck_purchases'
const TESTING_UNLOCK = import.meta.env.VITE_UNLOCK_ALL_FOR_TESTING === 'true'

export function loadLocalPurchases() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveLocalPurchases(purchases) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases))
}

export async function syncFromServer(userId) {
  const { unlockAll, themeIds } = await fetchPurchases(userId)
  const updated = { ...loadLocalPurchases() }

  if (unlockAll) updated['unlock_all'] = true
  for (const id of themeIds) updated[id] = true

  saveLocalPurchases(updated)
  return updated
}

export function hasAccess(purchases, themeId, isFree) {
  if (isFree) return true
  if (TESTING_UNLOCK) return true
  if (purchases['unlock_all']) return true
  return purchases[themeId] === true
}

export function isTrialAccess(purchases, themeId, isFree) {
  if (isFree) return false
  if (!TESTING_UNLOCK) return false
  return purchases['unlock_all'] !== true && purchases[themeId] !== true
}

export function unlockTheme(purchases, themeId) {
  const updated = { ...purchases, [themeId]: true }
  saveLocalPurchases(updated)
  return updated
}

export function unlockAll(purchases) {
  const updated = { ...purchases, unlock_all: true }
  saveLocalPurchases(updated)
  return updated
}

export { TESTING_UNLOCK }
