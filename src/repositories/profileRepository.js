import { supabase } from '../lib/supabase'

export async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('onboarded, unlock_all')
    .eq('id', userId)
    .single()
  return data ?? null
}

export async function upsertProfile(userId, fields) {
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...fields }, { onConflict: 'id' })
  if (error) throw error
}
