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

export function useAuth() {
  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, loading, signInWithGoogle, signOut }
}
