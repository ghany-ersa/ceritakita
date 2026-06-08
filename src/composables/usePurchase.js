import { ref, watch } from 'vue'
import { useAuth } from './useAuth'
import * as purchaseService from '../services/purchaseService'

const purchases = ref(purchaseService.loadLocalPurchases())
const syncedFromServer = ref(false)
const hasUnlockAll = ref(purchaseService.TESTING_UNLOCK || purchases.value['unlock_all'] === true)

export function usePurchase() {
  const { user } = useAuth()

  watch(user, async (u) => {
    if (u) {
      purchases.value = await purchaseService.syncFromServer(u.id)
      hasUnlockAll.value = purchaseService.TESTING_UNLOCK || purchases.value['unlock_all'] === true
      syncedFromServer.value = true
    } else {
      syncedFromServer.value = false
    }
  }, { immediate: true })

  watch(purchases, (val) => {
    hasUnlockAll.value = purchaseService.TESTING_UNLOCK || val['unlock_all'] === true
  }, { deep: true })

  function hasAccess(themeId, isFree) {
    return purchaseService.hasAccess(purchases.value, themeId, isFree)
  }

  function isTrialAccess(themeId, isFree) {
    return purchaseService.isTrialAccess(purchases.value, themeId, isFree)
  }

  function unlockTheme(themeId) {
    purchases.value = purchaseService.unlockTheme(purchases.value, themeId)
  }

  function unlockAll() {
    purchases.value = purchaseService.unlockAll(purchases.value)
    hasUnlockAll.value = true
  }

  return { hasAccess, hasUnlockAll, isTrialAccess, unlockTheme, unlockAll, syncedFromServer }
}
