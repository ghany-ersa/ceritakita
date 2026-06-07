<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="noise-overlay" aria-hidden="true" />
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>
