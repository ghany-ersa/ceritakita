import { supabase } from '../lib/supabase'

export async function fetchPurchases(userId) {
  const [profileRes, themesRes] = await Promise.all([
    supabase.from('profiles').select('unlock_all').eq('id', userId).single(),
    supabase.from('theme_purchases').select('theme_id').eq('user_id', userId),
  ])
  return {
    unlockAll: profileRes.data?.unlock_all ?? false,
    themeIds: themesRes.data?.map(r => r.theme_id) ?? [],
  }
}
