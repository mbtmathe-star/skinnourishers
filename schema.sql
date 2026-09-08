-- Reference schema. The `orders` table has already been run against the
-- production Neon database (via the Neon SQL Editor, reachable from the Vercel
-- dashboard's Storage tab -> Open in Neon Console). The `inquiries` table below
-- is new and must be run once against production before enquiry recording works
-- (the enquiry API treats a missing table as non-fatal until then).
-- All statements are idempotent and can be re-run if the database is recreated.

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

-- Every website enquiry is recorded here as well as emailed, so enquiries can be
-- counted, chased and reported on rather than living only in one inbox (Section 09).
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_name text not null,          -- e.g. "Online Skin Assessment"
  name text not null,
  email text not null,
  phone text not null,
  enquiring_about text,             -- the treatment the visitor was reading about, if any
  fields jsonb,                     -- all remaining form fields as submitted
  emailed boolean not null default false,
  status text not null default 'new'
);
