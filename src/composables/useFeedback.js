import { useAuth } from './useAuth'
import * as feedbackService from '../services/feedbackService'

export function useFeedback() {
  const { user } = useAuth()

  function shouldShowFeedback(params) {
    return feedbackService.shouldShowFeedback(params)
  }

  async function saveFeedback(params) {
    await feedbackService.saveFeedback({ ...params, userId: user.value?.id ?? null })
  }

  function getAllFeedback() {
    return feedbackService.getAllFeedback()
  }

  return { shouldShowFeedback, saveFeedback, getAllFeedback, FREE_INTERVAL: feedbackService.FREE_INTERVAL }
}
