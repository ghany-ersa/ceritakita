<template>
  <header class="page-header" :class="{ 'page-header--sticky': sticky, 'page-header--transparent': transparent }">
    <div class="page-header__inner">
      <div class="page-header__slot-left">
        <slot name="left" />
      </div>

      <div class="page-header__center">
        <slot name="center">
          <AppLogo :size="logoSize" />
        </slot>
      </div>

      <div class="page-header__slot-right">
        <slot name="right">
          <div class="page-header__spacer" />
        </slot>
      </div>
    </div>
  </header>
</template>

<script setup>
import AppLogo from '../atoms/AppLogo.vue'

defineProps({
  sticky:      { type: Boolean, default: false },
  transparent: { type: Boolean, default: false },
  logoSize:    { type: String,  default: 'md' },
})
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  padding-top: env(safe-area-inset-top, 0px);
  min-height: calc(64px + env(safe-area-inset-top, 0px));
  position: relative;
  z-index: 20;
}

.page-header--sticky {
  position: sticky;
  top: 0;
  background: rgba(252, 249, 243, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(137, 114, 109, 0.12);
}

.page-header--transparent { background: transparent; }

.page-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
}

.page-header__center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
}

.page-header__slot-left,
.page-header__slot-right { flex-shrink: 0; }

.page-header__spacer { width: 40px; }
</style>
