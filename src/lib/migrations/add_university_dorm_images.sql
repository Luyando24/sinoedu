-- Add dormitory_images column to universities table
ALTER TABLE public.universities 
ADD COLUMN IF NOT EXISTS dormitory_images text[];
