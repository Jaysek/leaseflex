create table if not exists partner_inquiries (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text,
  email text not null,
  company text,
  units text,
  message text
);

create index idx_partner_inquiries_email on partner_inquiries(email);
