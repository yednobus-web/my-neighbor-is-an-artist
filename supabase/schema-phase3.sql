-- ============================================================
-- Phase 3 — additive migration on top of schema.sql
-- Run AFTER schema.sql. Safe to run multiple times.
-- Project: https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/sql/new
-- ============================================================

-- ARTIST GEO + STRIPE
alter table public.artists
  add column if not exists lat              double precision,
  add column if not exists lng              double precision,
  add column if not exists stripe_account_id text;

-- ARTWORK GEO + BUYER
alter table public.artworks
  add column if not exists lat              double precision,
  add column if not exists lng              double precision,
  add column if not exists buyer_user_id    uuid references auth.users(id) on delete set null,
  add column if not exists sold_at          timestamptz;

-- ============================================================
-- ORDERS — track every Stripe checkout
-- ============================================================
create table if not exists public.orders (
  id                       uuid primary key default uuid_generate_v4(),
  buyer_user_id            uuid references auth.users(id) on delete set null,
  artwork_id               uuid references public.artworks(id) on delete set null,
  artist_id                uuid references public.artists(id) on delete set null,
  amount_cents             integer not null,
  currency                 text default 'usd',
  platform_fee_cents       integer not null default 0,
  stripe_session_id        text unique,
  stripe_payment_intent_id text,
  status                   text default 'pending' check (status in ('pending','paid','failed','refunded')),
  buyer_email              text,
  shipping_address         jsonb,
  created_at               timestamptz default now(),
  paid_at                  timestamptz
);

create index if not exists orders_buyer_idx on public.orders (buyer_user_id);
create index if not exists orders_artist_idx on public.orders (artist_id);
create index if not exists orders_artwork_idx on public.orders (artwork_id);

alter table public.orders enable row level security;

-- Users see only their own orders. Artists see orders for their work.
drop policy if exists "users see own orders" on public.orders;
create policy "users see own orders"
  on public.orders for select
  using (
    auth.uid() = buyer_user_id
    or exists (
      select 1 from public.artists a
      where a.id = orders.artist_id and a.user_id = auth.uid()
    )
  );

-- ============================================================
-- SEED COORDINATES on the demo artists (only sets if null)
-- ============================================================
update public.artists set lat=40.6943, lng=-73.9249 where id='11111111-1111-1111-1111-111111111111' and lat is null; -- Bushwick
update public.artists set lat=35.7050, lng=139.6492 where id='22222222-2222-2222-2222-222222222222' and lat is null; -- Koenji
update public.artists set lat= 6.5095, lng=  3.3711 where id='33333333-3333-3333-3333-333333333333' and lat is null; -- Yaba, Lagos
update public.artists set lat=19.4191, lng=-99.1601 where id='44444444-4444-4444-4444-444444444444' and lat is null; -- Roma Norte
update public.artists set lat=38.7137, lng= -9.1450 where id='55555555-5555-5555-5555-555555555555' and lat is null; -- Bairro Alto
update public.artists set lat=52.4994, lng= 13.4088 where id='66666666-6666-6666-6666-666666666666' and lat is null; -- Kreuzberg
update public.artists set lat=37.5563, lng=126.9236 where id='77777777-7777-7777-7777-777777777777' and lat is null; -- Hongdae
update public.artists set lat=-23.5440, lng=-46.6920 where id='88888888-8888-8888-8888-888888888888' and lat is null; -- Vila Madalena

-- For artworks without their own coords, the app reads from artist.
