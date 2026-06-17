-- ============================================================
-- Phase 4 — additive migration (run after schema-phase3.sql)
-- Paste into: https://supabase.com/dashboard/project/ykpkjibzhtpxjoonvnba/sql/new
-- ============================================================

alter table public.artworks
  add column if not exists style            text,
  add column if not exists depth_cm         numeric(8,2),
  add column if not exists measurement_unit text default 'cm' check (measurement_unit in ('cm','in'));

-- Also widen price to allow decimals if it isn't already numeric
-- (schema.sql already defines it as numeric(10,2) so this is a no-op)
