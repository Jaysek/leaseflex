-- Distribution CRM tables

-- Buildings / properties
create table if not exists buildings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null,
  company text,
  address text,
  city text not null,
  state text not null,
  unit_count integer,
  property_url text,
  source text, -- apartments_com, google, manual
  status text not null default 'new' check (status in ('new', 'enriched', 'contacted', 'replied', 'meeting', 'onboarded', 'rejected')),
  notes text
);

-- Contacts at buildings
create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  building_id uuid references buildings(id) on delete cascade,
  full_name text not null,
  title text, -- Asset Manager, Property Manager, etc.
  email text,
  linkedin_url text,
  phone text,
  source text, -- linkedin, website, apollo, manual
  status text not null default 'new' check (status in ('new', 'emailed', 'replied', 'meeting', 'closed', 'unsubscribed'))
);

-- Outreach emails
create table if not exists outreach_emails (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  contact_id uuid references contacts(id) on delete cascade,
  building_id uuid references buildings(id) on delete cascade,
  sequence_number integer not null default 1, -- 1 = first email, 2 = follow-up, etc.
  subject text not null,
  body text not null,
  status text not null default 'draft' check (status in ('draft', 'queued', 'sent', 'opened', 'replied', 'bounced')),
  sent_at timestamptz,
  opened_at timestamptz,
  replied_at timestamptz
);

-- Indexes
create index if not exists idx_buildings_city on buildings (city);
create index if not exists idx_buildings_status on buildings (status);
create index if not exists idx_contacts_status on contacts (status);
create index if not exists idx_contacts_building on contacts (building_id);
create index if not exists idx_outreach_contact on outreach_emails (contact_id);
create index if not exists idx_outreach_status on outreach_emails (status);
