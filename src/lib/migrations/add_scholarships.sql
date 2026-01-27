-- Create scholarships table
create table if not exists public.scholarships (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  coverage text, -- e.g. "Full Tuition", "Partial"
  amount text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.scholarships enable row level security;

-- Policies for scholarships
create policy "Scholarships are viewable by everyone" on public.scholarships
  for select using (true);

create policy "Only admins can manage scholarships" on public.scholarships
  for all using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Add scholarship_id to programs
alter table public.programs 
add column if not exists scholarship_id uuid references public.scholarships(id) on delete set null;
