-- 1. Update the role check constraint to include 'agent'
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE public.users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('user', 'admin', 'agent'));

-- 2. Add 'status' column to users table (default 'active' for normal users, 'pending' for agents)
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active' CHECK (status IN ('active', 'pending', 'rejected'));

-- 3. Create function to handle agent registration
--    This logic should be handled in the trigger if possible, or we rely on the client sending metadata
--    and the trigger updating the role.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if metadata contains role='agent'
  IF new.raw_user_meta_data->>'role' = 'agent' THEN
    INSERT INTO public.users (id, email, name, country, role, status)
    VALUES (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'name', 
      new.raw_user_meta_data->>'country',
      'agent',
      'pending' -- Agents start as pending
    );
  ELSE
    -- Default behavior for normal users
    INSERT INTO public.users (id, email, name, country, role, status)
    VALUES (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'name', 
      new.raw_user_meta_data->>'country',
      'user',
      'active'
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function for admins to approve agents
CREATE OR REPLACE FUNCTION public.approve_agent(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.users
  SET status = 'active'
  WHERE id = target_user_id AND role = 'agent';
END;
$$;

-- 5. Create function for admins to reject agents
CREATE OR REPLACE FUNCTION public.reject_agent(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if caller is admin
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  UPDATE public.users
  SET status = 'rejected'
  WHERE id = target_user_id AND role = 'agent';
END;
$$;

-- 6. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.approve_agent(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reject_agent(uuid) TO authenticated;
