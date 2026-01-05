-- Migration to add is_active column to programs table
ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
