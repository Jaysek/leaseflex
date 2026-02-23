-- Subscriptions table (tracks Stripe subscriptions)
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  offer_id uuid references offers(id),
  email text not null,
  stripe_customer_id text,
  stripe_subscription_id text unique,
  status text not null default 'active' check (status in ('active', 'cancelled', 'past_due', 'paused')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancelled_at timestamptz
);

create index if not exists idx_subscriptions_email on subscriptions (email);
create index if not exists idx_subscriptions_stripe_sub on subscriptions (stripe_subscription_id);

-- Claims table
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  subscription_id uuid references subscriptions(id),
  email text not null,
  offer_id uuid references offers(id),
  event_type text not null check (event_type in ('job_relocation', 'job_loss', 'medical', 'domestic_violence', 'other')),
  event_description text not null,
  event_date date not null,
  supporting_docs text[], -- URLs to uploaded documents
  status text not null default 'submitted' check (status in ('submitted', 'under_review', 'approved', 'denied', 'paid')),
  reviewed_at timestamptz,
  payout_amount numeric,
  notes text
);

create index if not exists idx_claims_email on claims (email);
create index if not exists idx_claims_status on claims (status);
create index if not exists idx_claims_subscription on claims (subscription_id);

-- Waitlist drip tracking
alter table if exists waitlist add column if not exists drip_step integer default 0;
alter table if exists waitlist add column if not exists last_drip_at timestamptz;
