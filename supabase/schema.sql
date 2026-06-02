-- ============================================================
-- MY NEIGHBOR IS AN ARTIST — Supabase Schema
-- Paste this whole file into the Supabase SQL Editor and run.
-- Project: https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/sql
-- ============================================================

-- Enable UUID generator
create extension if not exists "uuid-ossp";

-- ============================================================
-- ARTISTS
-- ============================================================
create table if not exists public.artists (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid references auth.users(id) on delete set null,
  handle        text unique not null,
  name          text not null,
  bio           text,
  avatar_url    text,
  city          text not null,
  neighborhood  text not null,
  country       text not null,
  country_flag  text,
  vibe          text[] default '{}',
  followers     integer default 0,
  created_at    timestamptz default now()
);

create index if not exists artists_city_idx on public.artists (city);
create index if not exists artists_neighborhood_idx on public.artists (neighborhood);
create index if not exists artists_country_idx on public.artists (country);

-- ============================================================
-- ARTWORKS
-- ============================================================
create table if not exists public.artworks (
  id            uuid primary key default uuid_generate_v4(),
  artist_id     uuid references public.artists(id) on delete cascade not null,
  slug          text unique not null,
  title         text not null,
  description   text,
  medium        text,
  year          integer,
  width_cm      integer,
  height_cm     integer,
  price         numeric(10,2) not null,
  currency      text default 'USD',
  image_url     text not null,
  tags          text[] default '{}',
  -- optional location override (artist may sell from a different place)
  city          text,
  neighborhood  text,
  status        text default 'available' check (status in ('available','sold','reserved','draft')),
  created_at    timestamptz default now()
);

create index if not exists artworks_artist_idx on public.artworks (artist_id);
create index if not exists artworks_status_idx on public.artworks (status);
create index if not exists artworks_tags_idx on public.artworks using gin (tags);

-- Full-text search across title + description + tags
create or replace view public.artworks_search as
select
  w.*,
  to_tsvector('simple',
    coalesce(w.title,'') || ' ' ||
    coalesce(w.description,'') || ' ' ||
    array_to_string(w.tags,' ')
  ) as search_doc
from public.artworks w;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.artists  enable row level security;
alter table public.artworks enable row level security;

-- Anyone can read artists & available artworks
drop policy if exists "artists are public" on public.artists;
create policy "artists are public"
  on public.artists for select
  using (true);

drop policy if exists "artworks are public" on public.artworks;
create policy "artworks are public"
  on public.artworks for select
  using (status <> 'draft');

-- Artists can manage their own profile
drop policy if exists "artists manage self" on public.artists;
create policy "artists manage self"
  on public.artists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Artists can manage their own artworks
drop policy if exists "artists manage own works" on public.artworks;
create policy "artists manage own works"
  on public.artworks for all
  using (
    exists (
      select 1 from public.artists a
      where a.id = artworks.artist_id and a.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.artists a
      where a.id = artworks.artist_id and a.user_id = auth.uid()
    )
  );

-- ============================================================
-- STORAGE BUCKET for artwork images
-- (Supabase auto-creates the storage schema. Just create the bucket.)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('artworks', 'artworks', true)
on conflict (id) do nothing;

-- Anyone can read images
drop policy if exists "artwork images public read" on storage.objects;
create policy "artwork images public read"
  on storage.objects for select
  using (bucket_id = 'artworks');

-- Authenticated users can upload to their own folder (artworks/<user_id>/...)
drop policy if exists "artwork images user upload" on storage.objects;
create policy "artwork images user upload"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'artworks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "artwork images user update" on storage.objects;
create policy "artwork images user update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'artworks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "artwork images user delete" on storage.objects;
create policy "artwork images user delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'artworks'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- SEED DATA — populate with the same artists & artworks
-- the mock layer uses, so the app looks identical with DB on.
-- ============================================================
insert into public.artists (id, handle, name, bio, avatar_url, city, neighborhood, country, country_flag, vibe, followers) values
  ('11111111-1111-1111-1111-111111111111', '@kira.spray',     'Kira Mendez',    'Bushwick wall painter. Makes loud girls louder. Coffee, cans, chaos.',                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', 'Brooklyn',     'Bushwick',      'USA',          '🇺🇸', array['graffiti','feminist','neon'], 12400),
  ('22222222-2222-2222-2222-222222222222', '@yuto.ink',       'Yuto Tanaka',    'Koenji-based illustrator. Cyberpunk meets ukiyo-e. Always too caffeinated.',         'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', 'Tokyo',        'Koenji',        'Japan',        '🇯🇵', array['illustration','cyberpunk','anime'], 28900),
  ('33333333-3333-3333-3333-333333333333', '@amara.collage',  'Amara Okafor',   'Yaba collage queen. Recycled magazines, ancestral vibes, future thoughts.',         'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80', 'Lagos',        'Yaba',          'Nigeria',      '🇳🇬', array['collage','afrofuturism','mixed-media'], 18700),
  ('44444444-4444-4444-4444-444444444444', '@leoo.tags',      'Léo Vasquez',    'Roma Norte tagger turned canvas guy. Skate parks raised me.',                        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80', 'Mexico City',  'Roma Norte',    'Mexico',       '🇲🇽', array['graffiti','skate','lettering'], 9300),
  ('55555555-5555-5555-5555-555555555555', '@nina.pixels',    'Nina Ferreira',  'Pixel artist + risograph nerd. Bairro Alto windows, neon, salt air.',                'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80', 'Lisbon',       'Bairro Alto',   'Portugal',     '🇵🇹', array['pixel-art','riso','lo-fi'], 14200),
  ('66666666-6666-6666-6666-666666666666', '@rashid.rugs',    'Rashid Al-Hassan','Tufting freak in Kreuzberg. Sells weird rugs from a basement studio.',              'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80', 'Berlin',       'Kreuzberg',     'Germany',      '🇩🇪', array['textile','rugs','soft-sculpture'], 22100),
  ('77777777-7777-7777-7777-777777777777', '@sol.ceramics',   'Sol Park',       'Hongdae ceramicist. Funky mugs, weird vases, body parts.',                          'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80', 'Seoul',        'Hongdae',       'South Korea',  '🇰🇷', array['ceramics','sculpture','body'], 31400),
  ('88888888-8888-8888-8888-888888888888', '@dani.zines',     'Daniela Rossi',  'Vila Madalena zine maker. Photography, riot grrrl energy.',                         'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80', 'São Paulo',    'Vila Madalena', 'Brazil',       '🇧🇷', array['zine','photo','diy'], 7800)
on conflict (id) do nothing;

insert into public.artworks (artist_id, slug, title, description, medium, year, width_cm, height_cm, price, image_url, tags) values
  ('11111111-1111-1111-1111-111111111111', 'loud-girl-no1',          'LOUD GIRL #1',                'She is loud on purpose. Hot pink spray, acid green underpaint, and a stare that''s done apologizing.', 'Spray + acrylic on canvas',     2026, 60, 80,  480.00, 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=900&q=80', array['graffiti','portrait','feminist','neon']),
  ('11111111-1111-1111-1111-111111111111', 'bushwick-bodega-2am',    'Bushwick Bodega 2AM',         'Painted on a delivery box behind Mr. Kim''s bodega.',                                                  'Spray on cardboard',            2025, 50, 70,  320.00, 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80', array['graffiti','street','nyc']),
  ('22222222-2222-2222-2222-222222222222', 'neon-koenji-rain',       'Neon Koenji Rain',            'Wet streets reflecting a thousand kanji signs.',                                                       'Digital print, signed',         2026, 42, 59,  560.00, 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=900&q=80', array['illustration','cyberpunk','tokyo']),
  ('22222222-2222-2222-2222-222222222222', 'yokai-on-the-train',     'Yokai on the Train',          'Spotted a yokai on the Yamanote line, drew it before he got off.',                                     'Ink on washi paper',            2026, 40, 60,  410.00, 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=900&q=80', array['illustration','anime','ink']),
  ('33333333-3333-3333-3333-333333333333', 'ancestor-static',        'ANCESTOR / STATIC',           'Old issues of Drum magazine, gold foil, prayer.',                                                      'Collage on board',              2026, 70,100, 720.00, 'https://images.unsplash.com/photo-1578321272125-4e4c4c3643c5?w=900&q=80', array['collage','afrofuturism']),
  ('33333333-3333-3333-3333-333333333333', 'yaba-sundays',           'Yaba Sundays',                'Sunday market chaos, with love.',                                                                       'Mixed media on paper',          2025, 50, 70,  390.00, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80', array['collage','lagos','color']),
  ('44444444-4444-4444-4444-444444444444', 'roma-norte-tag',         'ROMA NORTE TAG',              'Made in 20 minutes, then ran from the cops. Worth it.',                                                'Spray on wood panel',           2026, 40, 60,  240.00, 'https://images.unsplash.com/photo-1561149877-84d3766dffa3?w=900&q=80', array['graffiti','lettering','skate']),
  ('44444444-4444-4444-4444-444444444444', 'skate-saint',            'Skate Saint',                 'Patron saint of slams.',                                                                                'Acrylic on grip tape',          2026, 20, 80,  350.00, 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80', array['graffiti','skate']),
  ('55555555-5555-5555-5555-555555555555', 'bairro-alto-window',     'Bairro Alto Window',          'Looking up at laundry lines like prayer flags.',                                                       'Risograph print, edition of 50',2026, 30, 42,  180.00, 'https://images.unsplash.com/photo-1505764706515-aa95265c5abc?w=900&q=80', array['riso','lisbon','lo-fi']),
  ('55555555-5555-5555-5555-555555555555', 'pixel-saudade',          'Pixel Saudade',               'A small ache, 32 pixels wide.',                                                                         'Pixel art print',               2025, 30, 30,  220.00, 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=900&q=80', array['pixel-art','lo-fi']),
  ('66666666-6666-6666-6666-666666666666', 'kreuzberg-rug-gremlin',  'Kreuzberg Rug Gremlin',       'A gremlin that lives in your living room and judges you.',                                              'Hand-tufted wool rug',          2026, 90,120, 890.00, 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=80', array['textile','rugs','weird']),
  ('66666666-6666-6666-6666-666666666666', 'soft-machine',           'Soft Machine',                'Half engine, half cuddle.',                                                                             'Tufted yarn sculpture',         2026, 60, 60, 1200.00, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', array['textile','sculpture']),
  ('77777777-7777-7777-7777-777777777777', 'hongdae-mug-face',       'HONGDAE MUG FACE',            'Drink your matcha out of a screaming face.',                                                            'Ceramic mug, glazed',           2026, 12, 12,   65.00, 'https://images.unsplash.com/photo-1493106819501-66d381c466f1?w=900&q=80', array['ceramics','functional','weird']),
  ('77777777-7777-7777-7777-777777777777', 'vase-with-feet',         'Vase With Feet',              'It walks at night. Probably.',                                                                          'Stoneware',                     2026, 25, 35,  220.00, 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=900&q=80', array['ceramics','sculpture','body']),
  ('88888888-8888-8888-8888-888888888888', 'vila-madalena-zine-vol1','VILA MADALENA ZINE Vol. 1',   'Photos from one wild weekend in Vila Madalena.',                                                        'Risograph zine, 32 pages',      2026, 15, 21,   18.00, 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?w=900&q=80', array['zine','photo','diy']),
  ('88888888-8888-8888-8888-888888888888', 'riot-girls-of-sp',       'RIOT GIRLS OF SP',            'Shot at a basement show, 2AM, sweat-soaked.',                                                           'Photo print, signed',           2026, 30, 40,   95.00, 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&q=80', array['photo','riot'])
on conflict (slug) do nothing;
