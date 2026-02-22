-- Add phone column to waitlist table (if table exists)
-- Run this in Supabase SQL editor if the column doesn't exist yet

alter table if exists waitlist add column if not exists phone text;
