-- Fix RLS Recursion on public.users and ensure all users are visible to admins

-- 1. Ensure get_my_role exists and is SECURITY DEFINER (bypasses RLS)
--    This allows us to check the role without triggering infinite recursion in RLS policies
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

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO anon;

-- 2. Drop the potentially recursive policy
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;

-- 3. Create a non-recursive policy using the function
--    This uses the SECURITY DEFINER function to check the role
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (
    public.get_my_role() = 'admin'
  );

-- 4. Also ensure users can view their own profile (standard)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (
    auth.uid() = id
  );

-- 5. Backfill any missing users from auth.users to public.users
--    This fixes cases where the trigger might have failed
INSERT INTO public.users (id, email, name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'name', 'User'), 
  'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
