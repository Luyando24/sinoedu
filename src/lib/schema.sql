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

-- Create Universities table
create table public.universities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  location text, -- City/Province
  description text,
  logo_url text,
  image_url text, -- Campus photo
  ranking text, -- e.g. "Top 10 in China"
  established_year text,
  website_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for universities
alter table public.universities enable row level security;

-- Policies for universities
create policy "Universities are viewable by everyone" on public.universities
  for select using (true);

create policy "Only admins can insert universities" on public.universities
  for insert with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can update universities" on public.universities
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can delete universities" on public.universities
  for delete using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));


-- Create Programs table
create table public.programs (
  id uuid default uuid_generate_v4() primary key,
  program_id_code text, -- e.g. SWGZGZHSXY-2
  title text not null,
  
  -- Replaced school_name with university_id
  university_id uuid references public.universities(id) on delete cascade,
  
  location text, -- City/Province (can be different from uni location)
  
  level text check (level in ('Bachelor', 'Masters', 'PhD', 'High School', 'Language')),
  duration text,
  tuition_fee text,
  description text,
  requirements text, -- General requirements description
  
  -- Basic Info
  language text, -- Language of Instruction
  intake text, -- e.g. autumn 2025
  application_deadline text,
  
  -- Eligibility
  age_requirements text,
  nationality_restrictions text,
  language_requirements text, -- Language Classes/Requirements
  applicants_inside_china text, -- Not Accepted / Accepted
  academic_requirements text[], -- List of requirements
  
  -- Financial
  registration_fee text,
  application_fee_status text, -- Refundable/etc
  scholarship_details text,
  
  -- Accommodation
  accommodation_costs jsonb, -- { single: "...", double: "..." }
  accommodation_details text,
  off_campus_living text, -- Allowed / Not Allowed
  dormitory_photos text[], -- List of URLs
  
  -- Application Process
  processing_speed text,
  required_documents text[], -- List of documents

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
  
  -- Applicant Details (Snapshot)
  full_name text,
  nationality text,
  passport_number text,
  date_of_birth date,
  highest_qualification text,
  
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

-- Create Posts table (Blog/News)
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text, -- unique identifier for url
  excerpt text,
  content text,
  image_url text,
  category text,
  author_id uuid references public.users(id) on delete set null,
  published boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for posts
alter table public.posts enable row level security;

-- Policies for posts
create policy "Posts are viewable by everyone" on public.posts
  for select using (published = true);

create policy "Admins can view all posts" on public.posts
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can insert posts" on public.posts
  for insert with check (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can update posts" on public.posts
  for update using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

create policy "Only admins can delete posts" on public.posts
  for delete using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

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

-- Create Storage Bucket for Documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Set up storage policies for documents
create policy "Authenticated users can upload documents"
  on storage.objects for insert
  with check (bucket_id = 'documents' and auth.role() = 'authenticated');

create policy "Users can view their own documents"
  on storage.objects for select
  using (bucket_id = 'documents'); 

create policy "Admins can view all documents"
  on storage.objects for select
  using (bucket_id = 'documents' and exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
