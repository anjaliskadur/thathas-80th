-- Run this once in Supabase → SQL Editor → New query → Run
-- Creates tables + a public storage bucket for the memory wall.

do $$ begin
  create type media_type as enum ('PHOTO', 'VIDEO');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type rsvp_status as enum ('ATTENDING', 'NOT_ATTENDING');
exception when duplicate_object then null;
end $$;

create table if not exists rsvps (
  id text primary key,
  full_name text not null,
  email text,
  phone text,
  status rsvp_status not null default 'ATTENDING',
  guest_count int not null default 1,
  dietary_notes text,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists rsvps_created_at_idx on rsvps (created_at desc);

create table if not exists memories (
  id text primary key,
  author_name text not null,
  message text,
  media_url text,
  media_type media_type,
  edit_token_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists memories_created_at_idx on memories (created_at desc);

insert into storage.buckets (id, name, public)
values ('memory-wall', 'memory-wall', true)
on conflict (id) do nothing;

-- Singleton row for host-editable event details (admin UI).
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

alter table rsvps enable row level security;
alter table memories enable row level security;
alter table site_settings enable row level security;

do $$ begin
  create policy "Public read memory-wall"
    on storage.objects for select
    using (bucket_id = 'memory-wall');
exception when duplicate_object then null;
end $$;

-- If you already ran an older schema.sql, also run the site_settings
-- block above (create table + insert + enable RLS) once in the SQL Editor.
