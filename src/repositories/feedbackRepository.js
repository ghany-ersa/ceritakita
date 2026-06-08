import { supabase } from '../lib/supabase'

export async function insertFeedback({ userId, themeId, mood, rating, comment, trigger, isPremium, questions }) {
  const { error } = await supabase.from('feedbacks').insert({
    user_id:    userId ?? null,
    theme_id:   themeId,
    mood,
    rating,
    comment:    comment || null,
    trigger,
    is_premium: isPremium,
    questions,
  })
  if (error) throw error
}
