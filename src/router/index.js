import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import ThemeSelectionView from '../views/ThemeSelectionView.vue'
import MoodSelectionView from '../views/MoodSelectionView.vue'
import CardSessionView from '../views/CardSessionView.vue'
import PaywallView from '../views/PaywallView.vue'
import { supabase } from '../lib/supabase'

const routes = [
  { path: '/',                    component: LandingView },
  { path: '/themes',              component: ThemeSelectionView },
  { path: '/mood/:themeId',       component: MoodSelectionView,    meta: { requiresAuth: true } },
  { path: '/session/:themeId',    component: CardSessionView,      meta: { requiresAuth: true } },
  { path: '/paywall/:themeId',    component: PaywallView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { data } = await supabase.auth.getSession()
  if (data.session) return true

  return { path: '/', query: { redirect: to.fullPath } }
})
