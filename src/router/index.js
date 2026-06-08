import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'
import ThemeSelectionView from '../views/ThemeSelectionView.vue'
import MoodSelectionView from '../views/MoodSelectionView.vue'
import CardSessionView from '../views/CardSessionView.vue'
import PaywallView from '../views/PaywallView.vue'

const routes = [
  { path: '/',                    component: LandingView },
  { path: '/themes',              component: ThemeSelectionView },
  { path: '/mood/:themeId',       component: MoodSelectionView },
  { path: '/session/:themeId',    component: CardSessionView },
  { path: '/paywall/:themeId',    component: PaywallView },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
