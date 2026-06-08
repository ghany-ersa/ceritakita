import { ref } from 'vue'
import * as authService from '../services/authService'

const user = ref(null)
const loading = ref(true)

authService.initialize((newUser) => {
  user.value = newUser
  loading.value = false
})

export function useAuth() {
  async function signInWithGoogle(redirectPath) {
    await authService.signInWithGoogle(redirectPath)
  }

  async function signOut() {
    await authService.signOut()
    user.value = null
  }

  function consumePostLoginRedirect() {
    return authService.consumePostLoginRedirect()
  }

  return { user, loading, signInWithGoogle, signOut, consumePostLoginRedirect }
}
