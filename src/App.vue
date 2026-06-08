<script setup>
import { watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import OnboardingModal from './components/organisms/OnboardingModal.vue'
import { useOnboarding } from './composables/useOnboarding'
import { useAuth } from './composables/useAuth'

const router = useRouter()
const { user, consumePostLoginRedirect } = useAuth()
const { showOnboarding, completeOnboarding } = useOnboarding(user)

// Setelah OAuth redirect kembali, lanjutkan ke halaman yang dituju
watch(user, (u) => {
  if (!u) return
  const path = consumePostLoginRedirect()
  if (path) router.push(path)
})

function handleOnboardingDone() {
  completeOnboarding(user.value)
}
</script>

<template>
  <div class="noise-overlay" aria-hidden="true" />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
  <OnboardingModal :visible="showOnboarding" @done="handleOnboardingDone" />
</template>
