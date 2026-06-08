<template>
  <Teleport to="body">
    <Transition name="onboarding-fade">
      <div v-if="visible" class="onboarding-overlay" @click.self="skip">
        <div class="onboarding-modal">

          <!-- Slides -->
          <div class="slides-wrap">
            <Transition :name="slideTransition" mode="out-in">
              <div :key="current" class="slide">
                <div class="slide__icon-wrap" :class="{ 'slide__icon-wrap--dare': slides[current].icon === 'local_fire_department' }">
                  <span
                    class="material-symbols-outlined slide__icon"
                    :class="{ 'slide__icon--dare': slides[current].icon === 'local_fire_department' }"
                    :style="`font-variation-settings:'FILL' 1;`"
                  >{{ slides[current].icon }}</span>
                </div>
                <h2 class="slide__title">{{ slides[current].title }}</h2>
                <p class="slide__desc">{{ slides[current].desc }}</p>
              </div>
            </Transition>
          </div>

          <!-- Dots -->
          <div class="dots" aria-hidden="true">
            <span
              v-for="(_, i) in slides"
              :key="i"
              class="dot"
              :class="{ 'dot--active': i === current }"
            />
          </div>

          <!-- Actions -->
          <div class="onboarding-actions">
            <BaseButton
              v-if="current < slides.length - 1"
              variant="primary"
              :pill="true"
              @click="next"
            >
              Selanjutnya
            </BaseButton>
            <BaseButton
              v-else
              variant="primary"
              :pill="true"
              @click="$emit('done')"
            >
              Mulai Bermain
            </BaseButton>
            <button
              v-if="current < slides.length - 1"
              class="skip-btn"
              @click="$emit('done')"
            >
              Lewati
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'

defineProps({
  visible: { type: Boolean, default: true },
})

defineEmits(['done'])

const slides = [
  {
    icon: 'favorite',
    title: 'Selamat datang di CeritaKita',
    desc: 'Ruang aman untuk saling bercerita, mengenal lebih dalam, dan mempererat hubungan kalian.',
  },
  {
    icon: 'style',
    title: 'Pilih Tema Percakapan',
    desc: 'Tersedia berbagai tema — dari ringan hingga penuh makna. Pilih yang paling cocok untuk momen kalian.',
  },
  {
    icon: 'swap_horiz',
    title: 'Giliran Menjawab',
    desc: 'Geser kartu, jawab jujur, dan biarkan cerita kalian mengalir secara alami.',
  },
  {
    icon: 'local_fire_department',
    title: 'Tantangan (Dare)',
    desc: 'Beberapa kartu berisi tantangan aksi — bukan pertanyaan. Kalian harus melakukannya bersama dalam waktu yang ditentukan sebelum bisa lanjut ke kartu berikutnya.',
  },
]

const current = ref(0)
const slideTransition = ref('slide-left')

function next() {
  slideTransition.value = 'slide-left'
  current.value++
}

function skip() {
  // clicking backdrop tidak menutup, harus pakai tombol
}
</script>

<style scoped>
.onboarding-overlay {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: rgba(28, 28, 24, 0.5);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 0 0 env(safe-area-inset-bottom, 0);
}

@media (min-width: 480px) {
  .onboarding-overlay {
    align-items: center;
    padding: 16px;
  }
}

.onboarding-modal {
  background: var(--surface);
  width: 100%;
  max-width: 440px;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 36px 28px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  box-shadow: 0 -4px 40px rgba(0, 0, 0, 0.12);
}

@media (min-width: 480px) {
  .onboarding-modal {
    border-radius: var(--radius-xl);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  }
}

/* Slides */
.slides-wrap {
  width: 100%;
  min-height: 220px;
  display: flex;
  align-items: center;
}

.slide {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
}

.slide__icon-wrap {
  width: 88px;
  height: 88px;
  border-radius: var(--radius-xl);
  background: var(--primary-container);
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide__icon-wrap--dare {
  background: rgba(143, 52, 37, 0.12);
}

.slide__icon {
  font-size: 40px;
  color: var(--on-primary-container);
}

.slide__icon--dare {
  color: var(--primary);
}

.slide__title {
  font-family: var(--font-headline);
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.25;
}

.slide__desc {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--on-surface-variant);
  line-height: 1.6;
  max-width: 320px;
}

/* Dots */
.dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--outline-variant, rgba(137, 114, 109, 0.3));
  transition: all 0.25s ease;
}

.dot--active {
  width: 20px;
  background: var(--primary);
}

/* Actions */
.onboarding-actions {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.skip-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  opacity: 0.7;
  padding: 4px 8px;
}
.skip-btn:hover { opacity: 1; }

/* Overlay transition */
.onboarding-fade-enter-active,
.onboarding-fade-leave-active {
  transition: opacity 0.3s ease;
}
.onboarding-fade-enter-from,
.onboarding-fade-leave-to {
  opacity: 0;
}

/* Slide transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.28s ease;
}
.slide-left-enter-from  { opacity: 0; transform: translateX(32px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-32px); }
</style>
