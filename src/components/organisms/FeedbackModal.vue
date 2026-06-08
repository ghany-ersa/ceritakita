<script setup>
import { ref } from 'vue'
import BaseButton from '../atoms/BaseButton.vue'
import GrainTexture from '../atoms/GrainTexture.vue'

const props = defineProps({
  questions:  { type: Array,   required: true },  // [{ id, question }]
  trigger:    { type: String,  required: true },   // 'interval_10' | 'session_end'
  isPremium:  { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'skip'])

const rating  = ref(0)
const comment = ref('')
const hovered = ref(0)

const STARS = [1, 2, 3, 4, 5]

const LABELS = {
  1: 'Kurang menarik',
  2: 'Biasa saja',
  3: 'Cukup bagus',
  4: 'Bagus!',
  5: 'Luar biasa!',
}

function submit() {
  if (rating.value === 0) return
  emit('submit', { rating: rating.value, comment: comment.value })
}
</script>

<template>
  <div class="feedback-backdrop" @click.self="emit('skip')">
    <div class="feedback-sheet">
      <GrainTexture :opacity="0.03" />

      <!-- Handle -->
      <div class="feedback-sheet__handle" />

      <!-- Header -->
      <div class="feedback-sheet__header">
        <div class="feedback-sheet__icon-wrap">
          <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;font-size:22px;color:var(--primary);">rate_review</span>
        </div>
        <div>
          <p class="feedback-sheet__label">{{ trigger === 'session_end' ? 'Sesi Selesai' : 'Setiap 10 Kartu' }}</p>
          <h3 class="feedback-sheet__title">Bagaimana pertanyaannya?</h3>
        </div>
        <button class="feedback-sheet__close" aria-label="Lewati" @click="emit('skip')">
          <span class="material-symbols-outlined" style="font-size:18px;">close</span>
        </button>
      </div>

      <!-- Pertanyaan yang sudah ditampilkan -->
      <div class="feedback-questions">
        <p class="feedback-questions__label">Pertanyaan dalam sesi ini:</p>
        <ul class="feedback-questions__list">
          <li v-for="q in questions" :key="q.id" class="feedback-questions__item">
            {{ q.question }}
          </li>
        </ul>
      </div>

      <!-- Rating bintang -->
      <div class="feedback-stars">
        <div class="feedback-stars__row">
          <button
            v-for="s in STARS"
            :key="s"
            class="feedback-stars__star"
            :class="{
              'feedback-stars__star--filled': s <= (hovered || rating),
              'feedback-stars__star--active': s <= rating,
            }"
            @mouseenter="hovered = s"
            @mouseleave="hovered = 0"
            @click="rating = s"
            :aria-label="`Beri ${s} bintang`"
          >
            <span class="material-symbols-outlined" style="font-size:32px;font-variation-settings:'FILL' 1;">star</span>
          </button>
        </div>
        <p v-if="hovered || rating" class="feedback-stars__label">
          {{ LABELS[hovered || rating] }}
        </p>
      </div>

      <!-- Komentar opsional -->
      <div class="feedback-comment">
        <textarea
          v-model="comment"
          class="feedback-comment__input"
          placeholder="Ada pertanyaan yang terasa kurang pas? (opsional)"
          rows="3"
          maxlength="500"
        />
        <p class="feedback-comment__count">{{ comment.length }}/500</p>
      </div>

      <!-- Actions -->
      <div class="feedback-actions">
        <BaseButton
          variant="primary"
          :pill="true"
          :disabled="rating === 0"
          @click="submit"
        >
          <span class="material-symbols-outlined" style="font-size:18px;">send</span>
          Kirim Feedback
        </BaseButton>
        <button class="feedback-skip" @click="emit('skip')">Lewati</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.feedback-backdrop {
  position: fixed;
  inset: 0;
  z-index: 210;
  background: rgba(28, 24, 20, 0.5);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.feedback-sheet {
  position: relative;
  width: 100%;
  max-width: 520px;
  background: var(--surface-container-lowest);
  border-radius: 28px 28px 0 0;
  padding: 12px 24px 40px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 -8px 40px rgba(143, 52, 37, 0.1);
  border: 1px solid rgba(137, 114, 109, 0.12);
  border-bottom: none;
  max-height: 92dvh;
  overflow-y: auto;

  @media (min-width: 560px) {
    border-radius: 28px;
    margin-bottom: 32px;
    padding: 16px 32px 36px;
  }
}

/* Handle */
.feedback-sheet__handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--outline-variant);
  margin: 0 auto 4px;
  flex-shrink: 0;
}

/* Header */
.feedback-sheet__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.feedback-sheet__icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(143, 52, 37, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.feedback-sheet__label {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--primary);
  opacity: 0.8;
  margin-bottom: 2px;
}

.feedback-sheet__title {
  font-family: var(--font-headline);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--on-surface);
  line-height: 1.3;
}

.feedback-sheet__close {
  margin-left: auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--surface-container-high);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--on-surface-variant);
  cursor: pointer;
  flex-shrink: 0;
  transition: background var(--transition);
}
.feedback-sheet__close:hover { background: var(--surface-container-highest); }

/* Questions list */
.feedback-questions {
  background: var(--surface-container-low);
  border-radius: var(--radius-lg);
  padding: 14px 16px;
  border: 1px solid rgba(137, 114, 109, 0.12);
}

.feedback-questions__label {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--on-surface-variant);
  opacity: 0.65;
  margin-bottom: 10px;
}

.feedback-questions__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-questions__item {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: var(--on-surface);
  line-height: 1.5;
  padding-left: 14px;
  position: relative;
}

.feedback-questions__item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--primary);
  opacity: 0.4;
}

/* Stars */
.feedback-stars {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feedback-stars__row {
  display: flex;
  gap: 4px;
}

.feedback-stars__star {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--surface-container-highest);
  transition: color 0.15s ease, transform 0.15s ease;
  line-height: 1;
}

.feedback-stars__star--filled {
  color: #f5a623;
}

.feedback-stars__star:hover,
.feedback-stars__star--active {
  transform: scale(1.15);
}

.feedback-stars__label {
  font-family: var(--font-label);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  min-height: 1.2em;
  transition: opacity 0.15s ease;
}

/* Comment */
.feedback-comment { position: relative; }

.feedback-comment__input {
  width: 100%;
  background: var(--surface-container-low);
  border: 1px solid rgba(137, 114, 109, 0.2);
  border-radius: var(--radius-lg);
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--on-surface);
  resize: none;
  outline: none;
  transition: border-color var(--transition);
  line-height: 1.5;
}

.feedback-comment__input::placeholder { color: var(--on-surface-variant); opacity: 0.5; }
.feedback-comment__input:focus { border-color: var(--primary); }

.feedback-comment__count {
  position: absolute;
  bottom: 8px;
  right: 12px;
  font-family: var(--font-label);
  font-size: 0.65rem;
  color: var(--on-surface-variant);
  opacity: 0.4;
  pointer-events: none;
}

/* Actions */
.feedback-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feedback-skip {
  background: none;
  border: none;
  font-family: var(--font-label);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--on-surface-variant);
  opacity: 0.5;
  cursor: pointer;
  padding: 8px;
  text-align: center;
  transition: opacity var(--transition);
}
.feedback-skip:hover { opacity: 0.8; }
</style>
