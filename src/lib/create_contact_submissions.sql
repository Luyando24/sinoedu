-- Enable UUID extension
create extension if not exists "uuid-ossp";

create table public.contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  first_name text,
  last_name text,
  email text not null,
  subject text,
  message text,
  status text default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_submissions enable row level security;

-- Policies
create policy "Anyone can insert contact submissions" on public.contact_submissions
  for insert with check (true);

create policy "Admins can view all contact submissions" on public.contact_submissions
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update contact submissions" on public.contact_submissions
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
