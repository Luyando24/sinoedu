
-- FIX INFINITE RECURSION IN RLS POLICIES
-- Run this in Supabase Dashboard -> SQL Editor

-- 1. Create a Secure Helper Function to Check Admin Status
--    This function uses SECURITY DEFINER to bypass RLS when checking the role.
--    This prevents the "infinite recursion" that happens when a policy queries the table it protects.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$;

-- 2. Drop the problematic policies that cause recursion
--    (These were the ones doing `select * from users` inside the users table policy)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Only admins can insert universities" ON public.universities;
DROP POLICY IF EXISTS "Only admins can update universities" ON public.universities;
DROP POLICY IF EXISTS "Only admins can delete universities" ON public.universities;
DROP POLICY IF EXISTS "Only admins can insert programs" ON public.programs;
DROP POLICY IF EXISTS "Only admins can update programs" ON public.programs;
DROP POLICY IF EXISTS "Only admins can delete programs" ON public.programs;

-- 3. Re-create policies using the secure helper function
--    (This breaks the recursion loop)

-- Users Table Policies
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (is_admin());

-- Universities Table Policies
CREATE POLICY "Only admins can insert universities" ON public.universities
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update universities" ON public.universities
  FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete universities" ON public.universities
  FOR DELETE USING (is_admin());

-- Programs Table Policies (Assuming these exist or will be needed)
CREATE POLICY "Only admins can insert programs" ON public.programs
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update programs" ON public.programs
  FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete programs" ON public.programs
  FOR DELETE USING (is_admin());

-- Content Blocks Table Policies (Fixing potential future issues here too)
DROP POLICY IF EXISTS "Only admins can insert content blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "Only admins can update content blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "Only admins can delete content blocks" ON public.content_blocks;

CREATE POLICY "Only admins can insert content blocks" ON public.content_blocks
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update content blocks" ON public.content_blocks
  FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete content blocks" ON public.content_blocks
  FOR DELETE USING (is_admin());
