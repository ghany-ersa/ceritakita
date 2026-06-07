# CeritaKita — App

Aplikasi kartu percakapan untuk pasangan. Pilih tema, buka kartu pertanyaan, jawab bersama — atau terima tantangan *dare* kalau tidak berani menjawab.

---

## Tech Stack

| Layer | Pilihan |
|---|---|
| Framework | Vue 3 (Composition API + `<script setup>`) |
| Bundler | Vite 8 |
| Routing | Vue Router 4 |
| Backend / Auth | Supabase (PostgreSQL + Google OAuth) |
| PWA | vite-plugin-pwa + Workbox |
| Styling | CSS custom properties (design tokens), scoped per komponen |
| Font | Plus Jakarta Sans (headline/label) · Be Vietnam Pro (body) |
| Icons | Material Symbols Outlined |

---

## Struktur Direktori

```
ceritakita-app/
├── public/
│   └── favicon.svg
├── src/
│   ├── main.js                     # Entry point — mount Vue + router
│   ├── App.vue                     # Root: noise overlay + RouterView + fade transition
│   ├── style.css                   # Design tokens, base reset, utilitas global
│   │
│   ├── router/
│   │   └── index.js                # Definisi routes
│   │
│   ├── data/
│   │   └── themes.js               # Konten: 5 tema, kartu pertanyaan, dares
│   │
│   ├── lib/
│   │   └── supabase.js             # Supabase client (env-based)
│   │
│   ├── composables/
│   │   ├── useAuth.js              # Session Google OAuth via Supabase
│   │   ├── useCardSession.js       # State sesi kartu (shuffle, progress, dare)
│   │   └── usePurchase.js          # Akses tema via localStorage
│   │
│   ├── components/
│   │   ├── DareModal.vue           # Layar dare full-screen dengan countdown timer
│   │   ├── atoms/
│   │   │   ├── AppLogo.vue
│   │   │   ├── BaseBadge.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── GrainTexture.vue
│   │   │   ├── IconButton.vue
│   │   │   └── ProgressBar.vue
│   │   └── molecules/
│   │       └── PageHeader.vue
│   │
│   └── views/
│       ├── LandingView.vue         # Home — CTA "Mulai Bermain"
│       ├── ThemeSelectionView.vue  # Pilih tema — bento grid + mix button
│       ├── CardSessionView.vue     # Sesi aktif — kartu + progress + session end
│       └── PaywallView.vue         # Modal beli akses tema premium
│
├── .env.example                    # Template variabel environment
├── vite.config.js
└── package.json
```

---

## Routes

| Path | View | Keterangan |
|---|---|---|
| `/` | `LandingView` | Halaman utama |
| `/themes` | `ThemeSelectionView` | Pilih tema |
| `/session/:themeId` | `CardSessionView` | Sesi kartu aktif |
| `/paywall/:themeId` | `PaywallView` | Paywall tema premium |

`:themeId` bisa berupa slug tema (`kenalan-ulang`, dll.) atau `mix` untuk mode campur semua tema.

---

## Tema Konten

Konten dikelola statis di `src/data/themes.js`. Setiap tema punya:

```js
{
  id: 'kenalan-ulang',    // slug — dipakai di URL
  name: 'Kenalan',        // label UI
  isFree: true,           // akses gratis tanpa pembelian
  cards: [{ id, question }],
  dares: ['...'],         // pool dare yang dirandom saat trigger
}
```

| ID | Nama | Gratis | Kartu |
|---|---|---|---|
| `kenalan-ulang` | Kenalan | Ya | 20 |
| `masa-kecil` | Masa Lalu | Tidak | 12 |
| `mimpi-ambisi` | Impian | Tidak | 12 |
| `cinta-keintiman` | Romansa | Tidak | 12 |
| `ringan-seru` | Seru | Tidak | 10 |

---

## Composables

### `useCardSession(themeId, cards)`
Mengelola state satu sesi bermain.

```js
const {
  currentCard,      // computed — kartu aktif saat ini
  progress,         // computed — { current, total }
  isFlipped,        // ref — apakah kartu sudah dibuka
  showDare,         // ref — tampilkan DareModal
  currentDare,      // ref — teks dare aktif
  sessionFinished,  // ref — semua kartu selesai
  flipCard,         // buka kartu
  nextCard,         // lanjut ke kartu berikutnya
  triggerDare,      // pilih dare random & tampilkan modal
  completeDare,     // tutup modal + lanjut kartu
} = useCardSession(themeId, cards)
```

Kartu diacak (`shuffle`) saat composable diinisialisasi.

### `usePurchase()`
Cek dan simpan akses tema ke `localStorage` (`ck_purchases`).

```js
const { hasAccess, hasUnlockAll, unlockTheme, unlockAll } = usePurchase()

hasAccess('masa-kecil', false) // → boolean
```

### `useAuth()`
Autentikasi Google OAuth via Supabase. Dipakai di `PaywallView` sebelum transaksi.

```js
const { user, signInWithGoogle, signOut } = useAuth()
```

---

## Design System

Token warna, tipografi, dan spacing didefinisikan sebagai CSS custom properties di `src/style.css` dan dipakai konsisten di seluruh komponen.

**Warna utama:**
- `--primary` `#8f3425` — terracotta hangat
- `--secondary` `#7e544b`
- `--tertiary` `#634e42`
- `--background` / `--surface` `#fcf9f3` — krem lembut

**Tipografi:**
- Headline & label → `Plus Jakarta Sans`
- Body → `Be Vietnam Pro`

**Breakpoints responsif:**

| Breakpoint | Grid tema |
|---|---|
| `< 600px` | 2 kolom |
| `≥ 600px` | 3 kolom |
| `≥ 900px` | 4 kolom |

---

## Setup & Development

### 1. Clone & install

```bash
git clone <repo-url>
cd ceritakita-app
npm install
```

### 2. Konfigurasi environment

Salin `.env.example` dan isi dengan kredensial Supabase project kamu:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJ...
```

### 3. Jalankan dev server

```bash
npm run dev
```

App berjalan di `http://localhost:5173`.

### 4. Build produksi

```bash
npm run build   # output ke dist/
npm run preview # preview build lokal
```

---

## Supabase Setup

Untuk mengaktifkan waitlist, buat tabel berikut di Supabase SQL Editor:

```sql
create table waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  created_at timestamptz default now()
);
```

Untuk autentikasi Google OAuth, aktifkan provider Google di **Supabase Dashboard → Authentication → Providers**.

---

## PWA

App sudah dikonfigurasi sebagai Progressive Web App via `vite-plugin-pwa`:
- Service worker dengan strategi `generateSW`
- Manifest dengan `display: standalone` dan `orientation: portrait`
- Asset di-precache otomatis saat build

Install ke home screen di mobile/desktop untuk pengalaman native.
