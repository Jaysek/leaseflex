-- Outreach prospects (property managers to contact)
create table if not exists outreach_prospects (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  email text not null unique,
  company text,
  city text,
  state text,
  units text,
  source text default 'manual',
  status text default 'queued' check (status in ('queued', 'sent', 'followed_up_1', 'followed_up_2', 'replied', 'converted', 'unsubscribed', 'bounced')),
  last_contacted_at timestamptz,
  notes text
);

create index if not exists idx_outreach_prospects_status on outreach_prospects(status);
create index if not exists idx_outreach_prospects_email on outreach_prospects(email);

-- Outreach email log (every email sent)
create table if not exists outreach_emails (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  prospect_id uuid references outreach_prospects(id) on delete cascade,
  step text not null check (step in ('initial', 'follow_up_1', 'follow_up_2')),
  subject text not null,
  resend_id text
);

create index if not exists idx_outreach_emails_prospect on outreach_emails(prospect_id);
