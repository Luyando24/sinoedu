-- Run this SQL to fix the issue where admins cannot see applicant names
create policy "Admins can view all profiles" on public.users
  for select using (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
