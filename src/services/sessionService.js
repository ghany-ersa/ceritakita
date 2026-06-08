export const DARE_DURATION = 30

export function storageKey(themeId, mood) {
  return `session_state_${themeId}_${mood ?? 'semua'}`
}

export function loadState(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveState(key, state) {
  try {
    localStorage.setItem(key, JSON.stringify(state))
  } catch {}
}

export function clearState(key) {
  try {
    localStorage.removeItem(key)
  } catch {}
}

export function buildShuffledCards(cards, savedOrder) {
  if (savedOrder) {
    const cardMap = Object.fromEntries(cards.map(c => [c.id, c]))
    const ordered = savedOrder.map(id => cardMap[id]).filter(Boolean)
    const savedSet = new Set(savedOrder)
    const newCards = cards.filter(c => !savedSet.has(c.id))
    return [...ordered, ...newCards]
  }
  return [...cards].sort(() => Math.random() - 0.5)
}

export function pickRandomDare(dares) {
  return dares[Math.floor(Math.random() * dares.length)]
}
