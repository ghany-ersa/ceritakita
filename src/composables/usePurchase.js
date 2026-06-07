import { ref } from 'vue'

const STORAGE_KEY = 'ck_purchases'

function getStored() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  } catch {
    return {}
  }
}

const purchases = ref(getStored())

export function usePurchase() {
  const hasUnlockAll = ref(purchases.value['unlock_all'] === true)

  function hasAccess(themeId, isFree) {
    if (isFree) return true
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

  return { hasAccess, hasUnlockAll, unlockTheme, unlockAll }
}
