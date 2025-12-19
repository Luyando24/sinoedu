
-- FIX ADMIN ACCESS SCRIPT
-- Run this in Supabase Dashboard -> SQL Editor

-- 1. Ensure RLS is enabled but policies are correct
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;

-- 3. Re-create correct policies
-- Allow users to see their own profile (Critical for role check)
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow admins to see everyone
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Force Update the specific user to be admin (Just in case)
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'cluyando2@gmail.com';

-- 5. Verify the user exists in public.users
INSERT INTO public.users (id, email, name, role)
SELECT id, email, raw_user_meta_data->>'name', 'admin'
FROM auth.users
WHERE email = 'cluyando2@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
