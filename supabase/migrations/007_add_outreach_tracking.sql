-- Add email event tracking columns to outreach_emails
alter table outreach_emails add column if not exists delivered_at timestamptz;
alter table outreach_emails add column if not exists opened_at timestamptz;
alter table outreach_emails add column if not exists clicked_at timestamptz;
alter table outreach_emails add column if not exists bounced_at timestamptz;
alter table outreach_emails add column if not exists complained_at timestamptz;

-- Index on resend_id for fast webhook lookups
create index if not exists idx_outreach_emails_resend_id on outreach_emails(resend_id);
