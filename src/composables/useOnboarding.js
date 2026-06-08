import { ref, watch } from 'vue'
import * as onboardingService from '../services/onboardingService'

const showOnboarding = ref(false)
let initialized = false

export function useOnboarding(user) {
  if (!initialized) {
    initialized = true
    showOnboarding.value = !onboardingService.isOnboardedLocally()
  }

  if (user) {
    watch(user, async (u) => {
      if (!u) return
      const onboarded = await onboardingService.syncOnLogin(u.id)
      if (onboarded) showOnboarding.value = false
    }, { immediate: true })
  }

  async function completeOnboarding(u) {
    await onboardingService.completeOnboarding(u?.id ?? null)
    showOnboarding.value = false
  }

  return { showOnboarding, completeOnboarding }
}
