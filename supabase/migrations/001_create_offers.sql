-- LeaseFlex offers table
create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  email text,
  monthly_rent numeric not null,
  address text,
  city text not null,
  state text not null,
  lease_start_date date not null,
  lease_end_date date not null,
  months_remaining integer not null,
  termination_fee_known boolean default false,
  termination_fee_amount numeric,
  sublet_allowed text default 'unknown' check (sublet_allowed in ('yes', 'no', 'unknown')),
  risk_score integer not null check (risk_score >= 0 and risk_score <= 100),
  flex_score integer not null check (flex_score >= 0 and flex_score <= 100),
  monthly_price numeric not null,
  coverage_cap numeric not null,
  deductible numeric not null default 500,
  waiting_period_days integer not null default 60,
  status text not null default 'quoted' check (status in ('quoted', 'emailed', 'started_checkout', 'waitlist'))
);

-- Index for lookups
create index if not exists idx_offers_email on offers (email) where email is not null;
create index if not exists idx_offers_status on offers (status);
