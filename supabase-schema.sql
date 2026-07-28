-- Run this once in the Supabase SQL editor (Project -> SQL Editor -> New query).
-- Creates the table that records validated PayFast payments.

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

-- Row Level Security is on by default for new tables in Supabase; the app only
-- ever writes via the service_role key (server-side, bypasses RLS), and never
-- exposes this table to the browser, so no policies are needed for the app to work.
alter table orders enable row level security;
