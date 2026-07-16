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

alter table rsvps enable row level security;
alter table memories enable row level security;

do $$ begin
  create policy "Public read memory-wall"
    on storage.objects for select
    using (bucket_id = 'memory-wall');
exception when duplicate_object then null;
end $$;
