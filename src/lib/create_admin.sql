-- 1. Create the user first via the App (Sign Up) or using the script provided.
--    The user 'cluyando2@gmail.com' has already been created by the system.

-- 2. Run this script in your Supabase Dashboard -> SQL Editor to make them an Admin and confirm their email.

-- Confirm the email (so they can log in without clicking a link)
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'cluyando2@gmail.com';

-- Elevate to Admin
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'cluyando2@gmail.com';

-- Verify
select * from public.users where email = 'cluyando2@gmail.com';
