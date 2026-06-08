<script setup>
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

const { user, loading, signInWithGoogle, signOut } = useAuth()
const open = ref(false)

function toggleMenu() { open.value = !open.value }
function closeMenu() { open.value = false }

async function handleSignOut() {
  closeMenu()
  await signOut()
}
</script>

<template>
  <!-- Belum login -->
  <button v-if="!loading && !user" class="login-btn" @click="signInWithGoogle">
    <span class="material-symbols-outlined" style="font-size:18px;">account_circle</span>
    Masuk
  </button>

  <!-- Loading session -->
  <div v-else-if="loading" class="avatar avatar--ghost" aria-hidden="true" />

  <!-- Sudah login -->
  <div v-else class="user-menu" v-click-outside="closeMenu">
    <button class="avatar" :title="user.email" @click="toggleMenu" :aria-expanded="open">
      <img v-if="user.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" :alt="user.user_metadata?.full_name ?? 'Avatar'" class="avatar__img" referrerpolicy="no-referrer" />
      <span v-else class="avatar__initial">{{ (user.email?.[0] ?? '?').toUpperCase() }}</span>
    </button>

    <Transition name="dropdown">
      <div v-if="open" class="dropdown" role="menu">
        <div class="dropdown__info">
          <p class="dropdown__name">{{ user.user_metadata?.full_name ?? 'Pengguna' }}</p>
          <p class="dropdown__email">{{ user.email }}</p>
        </div>
        <hr class="dropdown__divider" />
        <button class="dropdown__item dropdown__item--danger" role="menuitem" @click="handleSignOut">
          <span class="material-symbols-outlined" style="font-size:18px;">logout</span>
          Keluar
        </button>
      </div>
    </Transition>
  </div>
</template>

<script>
// Directive v-click-outside untuk menutup dropdown saat klik di luar
export default {
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el._clickOutside = (e) => { if (!el.contains(e.target)) binding.value() }
        document.addEventListener('pointerdown', el._clickOutside)
      },
      unmounted(el) {
        document.removeEventListener('pointerdown', el._clickOutside)
      },
    },
  },
}
</script>

<style scoped>
.login-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border-radius: var(--radius-full);
  background: var(--primary-container);
  color: var(--on-primary-container);
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  transition: background var(--transition), transform var(--transition);
  white-space: nowrap;
}
.login-btn:hover { background: var(--primary); color: var(--on-primary); }
.login-btn:active { transform: scale(0.95); }

/* Avatar button */
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--surface-container-high);
  border: 2px solid var(--outline-variant);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  transition: border-color var(--transition);
  flex-shrink: 0;
  padding: 0;
}
.avatar:hover { border-color: var(--primary); }
.avatar--ghost {
  cursor: default;
  opacity: 0.4;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.2; }
}

.avatar__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar__initial {
  font-family: var(--font-headline);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--on-surface-variant);
}

/* Dropdown */
.user-menu {
  position: relative;
}

.dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: var(--surface-container-lowest);
  border: 1px solid rgba(137, 114, 109, 0.15);
  border-radius: var(--radius-lg);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  z-index: 100;
  overflow: hidden;
}

.dropdown__info {
  padding: 14px 16px 12px;
}

.dropdown__name {
  font-family: var(--font-label);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--on-surface);
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown__email {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--on-surface-variant);
  opacity: 0.7;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown__divider {
  border: none;
  border-top: 1px solid rgba(137, 114, 109, 0.12);
  margin: 0;
}

.dropdown__item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-label);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--on-surface);
  transition: background var(--transition);
  text-align: left;
}
.dropdown__item:hover { background: var(--surface-container-low); }
.dropdown__item--danger { color: var(--error, #b3261e); }

/* Animasi dropdown */
.dropdown-enter-active { animation: dropIn 0.18s cubic-bezier(0.22, 1, 0.36, 1) both; }
.dropdown-leave-active { animation: dropIn 0.14s cubic-bezier(0.4, 0, 1, 1) reverse both; }
@keyframes dropIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
