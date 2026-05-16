-- ============================================================
-- MIGRATION: enforce_agent_approval
-- Purpose: Ensure agents are NEVER granted active access until
--          an admin explicitly approves their account.
--
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- ============================================================
-- STEP 1: Ensure all required columns exist in public.users
--         The base schema only has: id, email, name, role, created_at
--         We need: country, status, social_media_link, whatsapp_number, updated_at
-- ============================================================

-- 1a. Allow 'agent' in the role check constraint
ALTER TABLE public.users
  DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE public.users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('user', 'admin', 'agent'));

-- 1b. Add missing columns (safe – skipped if they already exist)
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS country          text,
  ADD COLUMN IF NOT EXISTS social_media_link text,
  ADD COLUMN IF NOT EXISTS whatsapp_number  text,
  ADD COLUMN IF NOT EXISTS updated_at       timestamp with time zone DEFAULT now(),
  ADD COLUMN IF NOT EXISTS status           text DEFAULT 'active'
    CHECK (status IN ('active', 'pending', 'rejected'));

-- ============================================================
-- STEP 2: Replace handle_new_user trigger function
--         Agents → role='agent', status='pending'
--         Students → role='user',  status='active'
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  IF new.raw_user_meta_data->>'role' = 'agent' THEN
    INSERT INTO public.users (
      id,
      email,
      name,
      country,
      role,
      status,
      social_media_link,
      whatsapp_number
    )
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'country',
      'agent',
      'pending',
      new.raw_user_meta_data->>'social_media_link',
      new.raw_user_meta_data->>'whatsapp_number'
    )
    ON CONFLICT (id) DO NOTHING;
  ELSE
    INSERT INTO public.users (
      id,
      email,
      name,
      country,
      role,
      status,
      social_media_link,
      whatsapp_number
    )
    VALUES (
      new.id,
      new.email,
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'country',
      'user',
      'active',
      new.raw_user_meta_data->>'social_media_link',
      new.raw_user_meta_data->>'whatsapp_number'
    )
    ON CONFLICT (id) DO NOTHING;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- STEP 3: Update get_my_role() to return 'pending_agent'
--         for agents who haven't been approved yet.
--         All public pages check role === 'agent' so they
--         automatically deny access to pending_agent.
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role   text;
  user_status text;
BEGIN
  SELECT role, status
  INTO user_role, user_status
  FROM public.users
  WHERE id = auth.uid();

  IF user_role = 'agent' AND (user_status IS NULL OR user_status != 'active') THEN
    RETURN 'pending_agent';
  END IF;

  RETURN user_role;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_my_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_role() TO anon;

-- ============================================================
-- STEP 4: Admin functions to approve / reject agents
-- ============================================================
CREATE OR REPLACE FUNCTION public.approve_agent(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: only admins can approve agents';
  END IF;

  UPDATE public.users
  SET status = 'active', updated_at = now()
  WHERE id = target_user_id AND role = 'agent';
END;
$$;

GRANT EXECUTE ON FUNCTION public.approve_agent(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.reject_agent(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: only admins can reject agents';
  END IF;

  UPDATE public.users
  SET status = 'rejected', updated_at = now()
  WHERE id = target_user_id AND role = 'agent';
END;
$$;

GRANT EXECUTE ON FUNCTION public.reject_agent(uuid) TO authenticated;

-- ============================================================
-- STEP 5 (Optional): Retroactive fix for existing agent accounts
--         that were incorrectly set to status='active' by master_fix.sql.
--         Uncomment ONLY if you need to force re-review of existing agents.
-- ============================================================
-- UPDATE public.users
-- SET status = 'pending'
-- WHERE role = 'agent' AND status = 'active';
