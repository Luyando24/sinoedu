
-- MASTER FIX SCRIPT
-- Run this in Supabase Dashboard -> SQL Editor to fix login and registration issues completely.

-- 1. Auto-confirm email for ALL existing users (Fixes "Email not confirmed" login error)
UPDATE auth.users
SET email_confirmed_at = now()
WHERE email_confirmed_at IS NULL;

-- 2. Setup Auto-Confirm for FUTURE users (Prevents future email confirmation issues)
CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS TRIGGER AS $$
BEGIN
  NEW.email_confirmed_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_auto_confirm ON auth.users;
CREATE TRIGGER on_auth_user_created_auto_confirm
BEFORE INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.auto_confirm_email();

-- 3. Ensure Public User Profile Creation (Fixes "User registered but not found in database" issue)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name', 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Fix missing profiles for existing users (Backfills any broken accounts)
INSERT INTO public.users (id, email, name, role)
SELECT 
  id, 
  email, 
  raw_user_meta_data->>'name', 
  'user'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);
