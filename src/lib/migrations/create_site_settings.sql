-- Create site_settings table
create table if not exists public.site_settings (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- Create policy for public read access (so we can check site_locked status)
create policy "Anyone can read site settings" on public.site_settings
  for select using (true);

-- Create policy for public update access (for the secret toggle link)
-- In a real production app, we would restrict this more, but the user specifically
-- requested a secret link to lock/unlock the site without admin login.
create policy "Anyone can update site settings" on public.site_settings
  for update using (true);

-- Seed site_locked setting
insert into public.site_settings (key, value, description)
values ('site_locked', 'false'::jsonb, 'Whether the entire website is locked/under maintenance')
on conflict (key) do nothing;
