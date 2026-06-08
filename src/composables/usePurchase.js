import { ref } from 'vue'

const STORAGE_KEY = 'ck_purchases'
const TESTING_UNLOCK = import.meta.env.VITE_UNLOCK_ALL_FOR_TESTING === 'true'

function getStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

const purchases = ref(getStored())

export function usePurchase() {
  const hasUnlockAll = ref(TESTING_UNLOCK || purchases.value['unlock_all'] === true)

  function hasAccess(themeId, isFree) {
    if (isFree) return true
    if (TESTING_UNLOCK) return true
    if (hasUnlockAll.value) return true
    return purchases.value[themeId] === true
  }

  function unlockTheme(themeId) {
    purchases.value[themeId] = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases.value))
  }

  function unlockAll() {
    purchases.value['unlock_all'] = true
    hasUnlockAll.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases.value))
  }

  // true jika akses diberikan hanya karena env testing, bukan karena sudah bayar
  function isTrialAccess(themeId, isFree) {
    if (isFree) return false
    if (!TESTING_UNLOCK) return false
    return purchases.value['unlock_all'] !== true && purchases.value[themeId] !== true
  }

  return { hasAccess, hasUnlockAll, isTrialAccess, unlockTheme, unlockAll }
}
