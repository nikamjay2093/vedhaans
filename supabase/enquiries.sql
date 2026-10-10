-- Run in Supabase Dashboard → SQL Editor (one time per project)

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  product_id text not null,
  product_name text not null,
  name text not null,
  email text not null,
  phone text not null,
  company text default '',
  quantity text default '',
  message text default '',
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

drop policy if exists "Anyone can insert enquiries" on public.enquiries;
create policy "Anyone can insert enquiries"
  on public.enquiries for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Authenticated users can read enquiries" on public.enquiries;
create policy "Authenticated users can read enquiries"
  on public.enquiries for select
  to authenticated
  using (true);

-- Realtime: new rows appear in admin without refresh
alter publication supabase_realtime add table public.enquiries;
