import * as authRepo from '../repositories/authRepository'

const REDIRECT_KEY = 'ceritakita_post_login_redirect'

export async function initialize(onUserChange) {
  const session = await authRepo.getSession()
  onUserChange(session?.user ?? null)
  authRepo.onAuthStateChange(onUserChange)
}

export async function signInWithGoogle(redirectPath) {
  if (redirectPath) localStorage.setItem(REDIRECT_KEY, redirectPath)
  await authRepo.signInWithGoogle(window.location.origin)
}

export async function signOut() {
  await authRepo.signOut()
}

export function consumePostLoginRedirect() {
  const path = localStorage.getItem(REDIRECT_KEY)
  if (path) localStorage.removeItem(REDIRECT_KEY)
  return path ?? null
}
