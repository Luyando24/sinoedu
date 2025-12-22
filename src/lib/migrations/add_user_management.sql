-- 1. Create a secure function to update user roles
--    This function can only be called by admins (checked inside)
CREATE OR REPLACE FUNCTION public.update_user_role(target_user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if the caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Only admins can update roles';
  END IF;

  -- Validate the new role
  IF new_role NOT IN ('user', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  -- Update the user's role
  UPDATE public.users
  SET role = new_role
  WHERE id = target_user_id;
END;
$$;

-- 2. Grant execute permission
GRANT EXECUTE ON FUNCTION public.update_user_role(uuid, text) TO authenticated;

-- 3. Ensure Admins can view all profiles (Double check)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
CREATE POLICY "Admins can view all profiles" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );
