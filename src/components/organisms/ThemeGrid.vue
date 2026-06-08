<template>
  <div class="theme-grid">
    <ThemeCard
      v-for="theme in themes"
      :key="theme.id"
      :name="theme.name"
      :icon="themeIcons[theme.id] || 'style'"
      :icon-bg="themeColors[theme.id]?.bg || 'rgba(143,52,37,0.08)'"
      :icon-color="themeColors[theme.id]?.icon || 'var(--primary)'"
      :card-count="theme.cards.length"
      :is-free="theme.isFree"
      :locked="!hasAccess(theme.id, theme.isFree)"
      :is-trial="isTrialAccess(theme.id, theme.isFree)"
      @select="$emit('select', theme)"
    />
  </div>
</template>

<script setup>
import ThemeCard from '../molecules/ThemeCard.vue'

defineProps({
  themes:          { type: Array,    required: true },
  hasAccess:       { type: Function, required: true },
  isTrialAccess:   { type: Function, required: true },
})

defineEmits(['select'])

const themeIcons = {
  'kenalan-ulang':   'waving_hand',
  'masa-kecil':      'history',
  'mimpi-ambisi':    'flight_takeoff',
  'cinta-keintiman': 'vpn_key',
  'ringan-seru':     'celebration',
}

const themeColors = {
  'kenalan-ulang':   { bg: 'rgba(143,52,37,0.08)', icon: 'var(--primary)' },
  'masa-kecil':      { bg: 'rgba(126,84,75,0.08)', icon: 'var(--secondary)' },
  'mimpi-ambisi':    { bg: 'rgba(99,78,66,0.08)',  icon: 'var(--tertiary)' },
  'cinta-keintiman': { bg: 'rgba(143,52,37,0.08)', icon: 'var(--primary)' },
  'ringan-seru':     { bg: 'rgba(126,84,75,0.08)', icon: 'var(--secondary)' },
}
</script>

<style scoped>
.theme-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 600px) {
  .theme-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 900px) {
  .theme-grid { grid-template-columns: repeat(4, 1fr); gap: 20px; }
}
</style>
