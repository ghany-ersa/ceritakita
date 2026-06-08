import { ref, watch } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

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
const syncedFromServer = ref(false)

// Sync status pembelian dari Supabase ke state lokal
async function syncFromSupabase(userId) {
  if (!userId) return

  const [profileRes, themesRes] = await Promise.all([
    supabase.from('profiles').select('unlock_all').eq('id', userId).single(),
    supabase.from('theme_purchases').select('theme_id').eq('user_id', userId),
  ])

  const updated = { ...purchases.value }

  if (profileRes.data?.unlock_all) {
    updated['unlock_all'] = true
  }

  if (themesRes.data) {
    for (const row of themesRes.data) {
      updated[row.theme_id] = true
    }
  }

  purchases.value = updated
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  syncedFromServer.value = true
}

export function usePurchase() {
  const { user } = useAuth()

  // Sync otomatis saat user login
  watch(user, (newUser) => {
    if (newUser) {
      syncFromSupabase(newUser.id)
    } else {
      syncedFromServer.value = false
    }
  }, { immediate: true })

  const hasUnlockAll = ref(TESTING_UNLOCK || purchases.value['unlock_all'] === true)

  // Re-derive hasUnlockAll saat purchases berubah (setelah sync)
  watch(purchases, (val) => {
    hasUnlockAll.value = TESTING_UNLOCK || val['unlock_all'] === true
  }, { deep: true })

  function hasAccess(themeId, isFree) {
    if (isFree) return true
    if (TESTING_UNLOCK) return true
    if (purchases.value['unlock_all']) return true
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

  function isTrialAccess(themeId, isFree) {
    if (isFree) return false
    if (!TESTING_UNLOCK) return false
    return purchases.value['unlock_all'] !== true && purchases.value[themeId] !== true
  }

  return { hasAccess, hasUnlockAll, isTrialAccess, unlockTheme, unlockAll, syncedFromServer }
}
