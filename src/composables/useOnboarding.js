import { ref, watch } from 'vue'
import { supabase } from '../lib/supabase'

const STORAGE_KEY = 'ceritakita_onboarded'

// Singleton agar tidak double-fetch
const showOnboarding = ref(false)
let initialized = false

export function useOnboarding(user) {
  if (!initialized) {
    initialized = true
    // Tampilkan dulu berdasarkan localStorage (sebelum auth resolved)
    showOnboarding.value = !localStorage.getItem(STORAGE_KEY)
  }

  // Saat user login, sync ke/dari Supabase
  if (user) {
    watch(user, async (u) => {
      if (!u) return

      const { data } = await supabase
        .from('profiles')
        .select('onboarded')
        .eq('id', u.id)
        .single()

      if (data?.onboarded) {
        // Sudah onboarding di device lain — skip dan simpan lokal
        localStorage.setItem(STORAGE_KEY, '1')
        showOnboarding.value = false
      } else if (localStorage.getItem(STORAGE_KEY)) {
        // Sudah onboarding di device ini tapi belum tersimpan di Supabase — sync
        await supabase
          .from('profiles')
          .upsert({ id: u.id, onboarded: true }, { onConflict: 'id' })
      }
    }, { immediate: true })
  }

  async function completeOnboarding(u) {
    localStorage.setItem(STORAGE_KEY, '1')
    showOnboarding.value = false

    if (u?.id) {
      await supabase
        .from('profiles')
        .upsert({ id: u.id, onboarded: true }, { onConflict: 'id' })
    }
  }

  return { showOnboarding, completeOnboarding }
}
