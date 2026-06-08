import { fetchProfile, upsertProfile } from '../repositories/profileRepository'

const STORAGE_KEY = 'ceritakita_onboarded'

export function isOnboardedLocally() {
  return !!localStorage.getItem(STORAGE_KEY)
}

export function markOnboardedLocally() {
  localStorage.setItem(STORAGE_KEY, '1')
}

export async function syncOnLogin(userId) {
  const profile = await fetchProfile(userId)

  if (profile?.onboarded) {
    markOnboardedLocally()
    return true
  }

  if (isOnboardedLocally()) {
    await upsertProfile(userId, { onboarded: true })
  }

  return isOnboardedLocally()
}

export async function completeOnboarding(userId) {
  markOnboardedLocally()
  if (userId) {
    await upsertProfile(userId, { onboarded: true })
  }
}
