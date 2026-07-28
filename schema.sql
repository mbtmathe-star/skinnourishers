-- Reference only — this has already been run against the production Neon
-- database (via the Neon SQL Editor, reachable from the Vercel dashboard's
-- Storage tab -> Open in Neon Console). Kept here so the schema is visible
-- in the repo and can be re-run (idempotent) if the database is ever recreated.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null, -- 'booking' | 'shop'
  status text not null default 'paid',
  m_payment_id text not null unique,
  pf_payment_id text,
  amount numeric not null,
  description text, -- human-readable summary, e.g. "Brow Lamination (Eye Segment)" or "2x Acne Serum, 1x Pigmentation Cleanser"
  customer_name text,
  customer_email text,
  customer_phone text,
  raw_itn jsonb
);
