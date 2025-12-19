
-- 1. Create a secure function to get the current user's role
--    This bypasses RLS policies on the users table because it's SECURITY DEFINER
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

-- 2. Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO anon;

-- 3. Force Admin Role (Again, just to be sure)
UPDATE public.users 
SET role = 'admin' 
WHERE email = 'cluyando2@gmail.com';

-- 4. Ensure profile exists (Again)
INSERT INTO public.users (id, email, name, role)
SELECT id, email, raw_user_meta_data->>'name', 'admin'
FROM auth.users
WHERE email = 'cluyando2@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
