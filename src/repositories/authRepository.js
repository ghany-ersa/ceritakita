import { supabase } from '../lib/supabase'

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export function onAuthStateChange(callback) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null)
  })
}

export async function signInWithGoogle(redirectTo) {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })
}

export async function signOut() {
  await supabase.auth.signOut()
}
