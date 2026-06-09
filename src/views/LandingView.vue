<script setup>
import { useRouter } from 'vue-router'
import AppLogo from '../components/atoms/AppLogo.vue'
import BaseButton from '../components/atoms/BaseButton.vue'

const router = useRouter()

const previews = [
  { icon: 'favorite',             label: 'Cinta',    q: 'Momen apa yang membuatmu sadar bahwa kamu jatuh cinta padaku?' },
  { icon: 'local_fire_department', label: 'Dare',    q: 'Tatap mataku tanpa berkedip selama 30 detik.' },
  { icon: 'psychiatry',           label: 'Dalam',    q: 'Apa hal yang belum pernah kamu ceritakan ke siapapun?' },
]
</script>

<template>
  <div class="landing">

    <!-- Ambient blobs -->
    <div class="blob blob--a" aria-hidden="true" />
    <div class="blob blob--b" aria-hidden="true" />
    <div class="blob blob--c" aria-hidden="true" />

    <!-- Header -->
    <header class="landing-header">
      <AppLogo size="sm" />
    </header>

    <!-- Hero -->
    <main class="landing-main">
      <div class="hero">

        <!-- Pill badge -->
        <div class="hero__badge">
          <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;">favorite</span>
          Ritual Percakapan Kita
        </div>

        <!-- Headline -->
        <h1 class="hero__title">
          Percakapan yang<br>
          <span class="hero__title-accent">lebih dalam.</span>
        </h1>

        <p class="hero__desc">
          Ada banyak hal yang ingin kamu ceritakan — dan dia ingin mendengar. CeritaKita jadi jembatannya.
        </p>

        <!-- CTA -->
        <div class="hero__cta">
          <BaseButton variant="primary" :pill="true" @click="router.push('/themes')">
            <span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:'FILL' 1;">playing_cards</span>
            Mulai Sekarang
          </BaseButton>
        </div>

      </div>

      <!-- Card previews -->
      <div class="card-preview" aria-hidden="true">
        <div
          v-for="(p, i) in previews"
          :key="i"
          class="preview-card"
          :class="`preview-card--${i}`"
        >
          <div class="preview-card__tag">
            <span class="material-symbols-outlined" style="font-size:13px;font-variation-settings:'FILL' 1;">{{ p.icon }}</span>
            {{ p.label }}
          </div>
          <p class="preview-card__q">{{ p.q }}</p>
          <div class="preview-card__deco">
            <span class="material-symbols-outlined" style="font-size:20px;font-variation-settings:'FILL' 0;opacity:0.18;">auto_awesome</span>
          </div>
        </div>
      </div>

    </main>

    <!-- Footer strip -->
    <footer class="landing-footer">
      <span class="footer-item">
        <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;">lock</span>
        Aman &amp; Privat
      </span>
      <span class="footer-dot" />
      <span class="footer-item">
        <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;">style</span>
        6 Tema
      </span>
      <span class="footer-dot" />
      <span class="footer-item">
        <span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1;">local_fire_department</span>
        Dare Cards
      </span>
    </footer>

  </div>
</template>

<style scoped>
/* ── Layout ── */
.landing {
  position: relative;
  min-height: 100dvh;
  background: var(--background);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* ── Ambient blobs ── */
.blob {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(90px);
  mix-blend-mode: multiply;
}
.blob--a {
  width: 60vw; height: 60vw;
  top: -15%; right: -15%;
  background: var(--primary-fixed);
  opacity: 0.22;
}
.blob--b {
  width: 50vw; height: 50vw;
  bottom: -10%; left: -10%;
  background: var(--tertiary-fixed);
  opacity: 0.28;
}
.blob--c {
  width: 30vw; height: 30vw;
  top: 40%; left: 30%;
  background: var(--secondary-container);
  opacity: 0.18;
}

/* ── Header ── */
.landing-header {
  position: relative;
  z-index: 2;
  padding: calc(env(safe-area-inset-top, 0px) + 20px) 28px 0;
}

/* ── Main ── */
.landing-main {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  padding: 24px 28px 16px;
  max-width: 480px;
  margin: 0 auto;
  width: 100%;
}

@media (max-height: 700px) {
  .landing-main { gap: 20px; padding: 16px 28px 8px; }
  .hero { gap: 12px; }
}

/* ── Hero text ── */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 20px;
  width: 100%;
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: var(--radius-full);
  background: rgba(143, 52, 37, 0.08);
  border: 1px solid rgba(143, 52, 37, 0.18);
  font-family: var(--font-label);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--primary);
}

.hero__title {
  font-family: var(--font-headline);
  font-size: clamp(2rem, 8vw, 2.75rem);
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.18;
  letter-spacing: -0.02em;
}

.hero__title-accent {
  color: var(--primary);
}

.hero__desc {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.65;
  max-width: 320px;
  opacity: 0.85;
}

.hero__cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 320px;
  margin-top: 4px;
}

.hero__cta-note {
  font-family: var(--font-label);
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--on-surface-variant);
  opacity: 0.55;
  letter-spacing: 0.04em;
}

/* ── Card preview stack ── */
.card-preview {
  position: relative;
  width: 100%;
  max-width: 300px;
  height: 160px;
  flex-shrink: 0;
}

.preview-card {
  position: absolute;
  width: min(200px, 56vw);
  background: var(--surface-container-lowest);
  border: 1px solid rgba(137, 114, 109, 0.18);
  border-radius: 18px;
  padding: 14px 16px 12px;
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-card--0 {
  top: 0; left: 50%;
  transform: translateX(-50%) rotate(-4deg);
  z-index: 1;
}
.preview-card--1 {
  top: 14px; left: 50%;
  transform: translateX(-38%) rotate(2deg);
  z-index: 2;
  background: var(--primary);
  border-color: transparent;
}
.preview-card--2 {
  top: 5px; left: 50%;
  transform: translateX(-62%) rotate(-1deg);
  z-index: 3;
}

.preview-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-label);
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--secondary);
}

.preview-card--1 .preview-card__tag {
  color: rgba(255,255,255,0.7);
}

.preview-card__q {
  font-family: var(--font-headline);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.45;
}

.preview-card--1 .preview-card__q {
  color: var(--on-primary);
}

.preview-card__deco {
  margin-top: auto;
  display: flex;
  justify-content: flex-end;
  color: var(--primary);
}

.preview-card--1 .preview-card__deco {
  color: var(--on-primary);
}

/* ── Footer strip ── */
.landing-footer {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px 24px calc(env(safe-area-inset-bottom, 0px) + 20px);
  opacity: 0.5;
}

.footer-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: var(--on-surface-variant);
}

.footer-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--on-surface-variant);
}

/* ── Desktop ── */
@media (min-width: 640px) {
  .landing-main {
    flex-direction: row;
    justify-content: center;
    gap: 64px;
    max-width: 900px;
    padding: 48px 48px 32px;
  }

  .hero {
    align-items: flex-start;
    text-align: left;
    max-width: 400px;
  }

  .hero__desc { max-width: 360px; }

  .hero__cta { align-items: flex-start; }

  .card-preview {
    width: 300px;
    height: 220px;
    flex-shrink: 0;
  }

  .preview-card { width: 240px; }
}
</style>
