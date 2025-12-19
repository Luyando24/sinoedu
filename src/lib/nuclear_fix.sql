
-- NUCLEAR FIX SCRIPT
-- Run this in Supabase Dashboard -> SQL Editor

-- 1. Create the RPC function (Bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$;

-- 2. Grant permissions
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO anon;

-- 3. Fix Public User Record (Delete and Recreate to ensure ID match)
--    WARNING: This resets the user's profile data, but ensures they can login.
DELETE FROM public.users WHERE email = 'cluyando2@gmail.com';

INSERT INTO public.users (id, email, name, role)
SELECT id, email, raw_user_meta_data->>'name', 'admin'
FROM auth.users
WHERE email = 'cluyando2@gmail.com';

-- 4. Fix RLS Policies (Just in case fallback is needed)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- 5. Confirm Email
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email = 'cluyando2@gmail.com';
