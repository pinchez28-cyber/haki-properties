create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_haki_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_users
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

drop policy if exists "Admins can view admin users" on public.admin_users;
create policy "Admins can view admin users"
on public.admin_users
for select
using (public.is_haki_admin());

drop policy if exists "Admins can add admin users" on public.admin_users;
create policy "Admins can add admin users"
on public.admin_users
for insert
with check (public.is_haki_admin());

drop policy if exists "Admins can view all listings" on public.listings;
create policy "Admins can view all listings"
on public.listings
for select
using (public.is_haki_admin());

drop policy if exists "Admins can update listings" on public.listings;
create policy "Admins can update listings"
on public.listings
for update
using (public.is_haki_admin())
with check (public.is_haki_admin());

-- After creating your own Supabase Auth user, run this once with your email:
-- insert into public.admin_users (email, role)
-- values ('your-email@example.com', 'owner')
-- on conflict (email) do update set role = 'owner';
