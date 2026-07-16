-- Run this once if rsvps/memories already exist and you only need site_settings.
-- Supabase → SQL Editor → New query → Run

create table if not exists site_settings (
  id int primary key default 1 check (id = 1),
  event_date_label text not null,
  event_time_label text not null,
  venue_name text not null,
  venue_address text not null,
  rsvp_deadline_label text not null,
  updated_at timestamptz not null default now()
);

insert into site_settings (
  id,
  event_date_label,
  event_time_label,
  venue_name,
  venue_address,
  rsvp_deadline_label
) values (
  1,
  'Saturday, October 17, 2026',
  '5:00 PM – 9:00 PM',
  'Venue to be announced',
  'Address to be announced',
  'September 20, 2026'
) on conflict (id) do nothing;

alter table site_settings enable row level security;
