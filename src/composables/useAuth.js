import { ref } from 'vue'
import { supabase } from '../lib/supabase'

// Singleton — satu ref untuk seluruh app, tidak perlu onMounted per komponen
const user = ref(null)
const loading = ref(true)

// Inisialisasi satu kali saat modul pertama kali di-import
supabase.auth.getSession().then(({ data }) => {
  user.value = data.session?.user ?? null
  loading.value = false
})

supabase.auth.onAuthStateChange((_event, session) => {
  user.value = session?.user ?? null
  loading.value = false
})

const REDIRECT_KEY = 'ceritakita_post_login_redirect'

export function useAuth() {
  async function signInWithGoogle(redirectPath) {
    if (redirectPath) localStorage.setItem(REDIRECT_KEY, redirectPath)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  function consumePostLoginRedirect() {
    const path = localStorage.getItem(REDIRECT_KEY)
    if (path) localStorage.removeItem(REDIRECT_KEY)
    return path ?? null
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, loading, signInWithGoogle, signOut, consumePostLoginRedirect }
}
