-- Run in Supabase SQL Editor (after enquiries.sql)

create table if not exists public.site_content (
  id text primary key,
  products jsonb not null default '[]'::jsonb,
  categories jsonb not null default '[]'::jsonb,
  branding jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_content (id)
values ('main')
on conflict (id) do nothing;

alter table public.site_content enable row level security;

drop policy if exists "Public read site content" on public.site_content;
create policy "Public read site content"
  on public.site_content for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated insert site content" on public.site_content;
create policy "Authenticated insert site content"
  on public.site_content for insert
  to authenticated
  with check (id = 'main');

drop policy if exists "Authenticated update site content" on public.site_content;
create policy "Authenticated update site content"
  on public.site_content for update
  to authenticated
  using (id = 'main')
  with check (id = 'main');

-- Realtime: visitors see admin saves without refresh
alter publication supabase_realtime add table public.site_content;
