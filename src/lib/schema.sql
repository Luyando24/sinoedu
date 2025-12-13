-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Users table (extends Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  country text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for users
alter table public.users enable row level security;

-- Policies for users
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

create policy "Admins can view all profiles" on public.users
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Create Programs table
create table public.programs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  school_name text not null,
  level text check (level in ('Bachelor', 'Masters', 'PhD', 'High School', 'Language')),
  duration text,
  tuition_fee text,
  description text,
  requirements text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for programs
alter table public.programs enable row level security;

-- Policies for programs
create policy "Programs are viewable by everyone" on public.programs
  for select using (true);

create policy "Only admins can insert programs" on public.programs
  for insert with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can update programs" on public.programs
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can delete programs" on public.programs
  for delete using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Create Applications table
create table public.applications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  program_id uuid references public.programs(id) on delete set null,
  status text default 'Pending' check (status in ('Pending', 'Processing', 'Accepted', 'More Documents Needed', 'Rejected')),
  passport_file text,
  transcript_file text,
  passport_photo text,
  additional_doc text,
  personal_statement text,
  submitted_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for applications
alter table public.applications enable row level security;

-- Policies for applications
create policy "Users can view their own applications" on public.applications
  for select using (auth.uid() = user_id);

create policy "Users can create applications" on public.applications
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own applications" on public.applications
  for update using (auth.uid() = user_id);

create policy "Admins can view all applications" on public.applications
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Admins can update all applications" on public.applications
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Create Payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  application_id uuid references public.applications(id) on delete set null,
  amount decimal(10, 2) not null,
  currency text default 'USD',
  transaction_id text,
  status text default 'pending',
  method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for payments
alter table public.payments enable row level security;

-- Policies for payments
create policy "Users can view their own payments" on public.payments
  for select using (auth.uid() = user_id);

create policy "Admins can view all payments" on public.payments
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'user');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert seed data (Optional)
-- insert into public.programs (title, school_name, level, duration, tuition_fee, description, location) values ...
