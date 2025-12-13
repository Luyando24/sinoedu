-- SQL script to upgrade a user to Admin
-- 
-- INSTRUCTIONS:
-- 1. Sign up a new user in your application (e.g. at http://localhost:3000/auth/register)
--    with the email address you want to be an admin (e.g. 'admin@example.com').
-- 2. Go to your Supabase Dashboard -> SQL Editor.
-- 3. Run the following SQL command (replace the email with your user's email):

update public.users 
set role = 'admin' 
where email = 'admin@example.com';

-- Verification:
-- select * from public.users where role = 'admin';
