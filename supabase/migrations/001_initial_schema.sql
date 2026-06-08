-- Tabel profil pengguna — menyimpan status pembelian, linked ke auth.users
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  unlock_all boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tabel pembelian per-tema (à la carte)
create table if not exists public.theme_purchases (
  id         bigserial primary key,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  theme_id   text not null,
  created_at timestamptz not null default now(),
  unique (user_id, theme_id)
);

-- Tabel feedback dari pengguna
create table if not exists public.feedbacks (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete set null,
  theme_id    text,
  mood        text,
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  trigger     text,       -- 'interval_10' | 'session_end'
  is_premium  boolean not null default false,
  questions   jsonb,      -- array { id, question } kartu yang ditampilkan
  created_at  timestamptz not null default now()
);

-- Auto-update updated_at di profiles
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- Otomatis buat profil saat user baru sign up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.theme_purchases enable row level security;
alter table public.feedbacks enable row level security;

-- profiles: user hanya bisa baca/update profil sendiri
create policy "profiles: read own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles: update own" on public.profiles
  for update using (auth.uid() = id);

-- theme_purchases: user hanya bisa baca milik sendiri
create policy "theme_purchases: read own" on public.theme_purchases
  for select using (auth.uid() = user_id);

-- feedbacks: user bisa insert, bisa baca milik sendiri
create policy "feedbacks: insert" on public.feedbacks
  for insert with check (auth.uid() = user_id or user_id is null);

create policy "feedbacks: read own" on public.feedbacks
  for select using (auth.uid() = user_id);
