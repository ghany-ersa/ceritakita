<template>
  <div class="paywall-overlay">
    <div class="paywall-modal">

      <!-- Left column (desktop only) -->
      <div class="modal-left">
        <IconButton
          icon="close"
          class="modal-left__close"
          aria-label="Tutup"
          @click="$emit('close')"
        />
        <div class="modal-left__inner">
          <img
            class="modal-left__logo"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFE693_3u-31u_k5jiJHQffwtMujzT1XQTLj7VquKvJSw_77TM-UfR3VF_250YHv7GOQJ7qkBWnMutBsJfW6qNCnKq9gJ5Ej10C9ftTo7yu06EwNzLa-UGShJoJpoZcoyDpUsv0PGmt98j-9na7IjLUy97JjUre6QfkzMQ2T3pL_NG9r-PWTzscJpw5Vn82y9cGkpqSl_gvi80PNpQ"
            alt="CeritaKita"
          />
          <div class="modal-left__key-wrap">
            <span class="material-symbols-outlined modal-left__key-icon" style="font-variation-settings:'FILL' 1;font-size:48px;">key</span>
          </div>
        </div>
      </div>

      <!-- Right column -->
      <div class="modal-right">
        <!-- Mobile header -->
        <div class="modal-mobile-header">
          <AppLogo size="sm" />
          <IconButton icon="close" aria-label="Tutup" @click="$emit('close')" />
        </div>

        <div class="modal-content">
          <div class="modal-heading">
            <h2 class="modal-heading__title">Buka Semua Tema</h2>
            <p class="modal-heading__subtitle">Akses semua tema sekarang dan tema baru yang akan datang</p>
            <div class="price-box">
              <span class="price-box__main">Rp59.000</span>
              <span class="price-box__sub">one-time purchase</span>
            </div>
          </div>

          <ul class="benefit-list">
            <BenefitItem>Akses seumur hidup</BenefitItem>
            <BenefitItem>Semua deck percakapan premium</BenefitItem>
            <BenefitItem>Update tema gratis kedepannya</BenefitItem>
            <BenefitItem>Akses lintas perangkat</BenefitItem>
          </ul>

          <p v-if="showLoginNote" class="login-note">
            <span class="material-symbols-outlined" style="font-size:16px;vertical-align:middle;">info</span>
            Kamu akan login dengan Google sebelum pembayaran.
          </p>

          <div class="modal-actions">
            <BaseButton variant="primary" @click="$emit('purchase')">
              Beli Sekarang
            </BaseButton>
            <BaseButton variant="ghost" size="sm" @click="$emit('close')">
              Lanjut dengan tema gratis
            </BaseButton>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import AppLogo from '../atoms/AppLogo.vue'
import IconButton from '../atoms/IconButton.vue'
import BaseButton from '../atoms/BaseButton.vue'
import BenefitItem from '../molecules/BenefitItem.vue'

defineProps({
  showLoginNote: { type: Boolean, default: false },
})

defineEmits(['close', 'purchase'])
</script>

<style scoped>
.paywall-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(28, 28, 24, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.paywall-modal {
  background: var(--surface);
  width: 100%;
  max-width: 640px;
  border-radius: var(--radius-xl);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  max-height: 90dvh;
}

/* Left col — desktop only */
.modal-left {
  display: none;
  width: 42%;
  background: var(--surface-container-low);
  border-right: 1px solid rgba(137, 114, 109, 0.2);
  flex-shrink: 0;
  position: relative;
}
@media (min-width: 560px) { .modal-left { display: flex; } }

.modal-left__close {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
}

.modal-left__inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 32px;
}

.modal-left__logo { height: 48px; width: auto; object-fit: contain; }

.modal-left__key-wrap {
  width: 96px;
  height: 96px;
  background: var(--primary-container);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}
.modal-left__key-icon { color: var(--on-primary-container); }

/* Right col */
.modal-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.modal-mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}
@media (min-width: 560px) { .modal-mobile-header { display: none; } }

.modal-content {
  flex: 1;
  padding: 28px 24px 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.modal-heading { display: flex; flex-direction: column; gap: 10px; }

.modal-heading__title {
  font-family: var(--font-headline);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--on-surface);
  line-height: 1.2;
}

.modal-heading__subtitle {
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--on-surface-variant);
  line-height: 1.5;
}

.price-box {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  background: var(--surface-container);
  border: 1px solid rgba(137, 114, 109, 0.25);
  border-radius: var(--radius-lg);
  padding: 12px 18px;
  align-self: flex-start;
  margin-top: 4px;
}

.price-box__main {
  font-family: var(--font-headline);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
}

.price-box__sub {
  font-family: var(--font-label);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--on-surface-variant);
  margin-top: 2px;
}

.benefit-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-note {
  font-family: var(--font-label);
  font-size: 0.8rem;
  color: var(--on-surface-variant);
  background: var(--surface-container-low);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
}
</style>
