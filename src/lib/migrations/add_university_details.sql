-- Add detailed fields to universities table
ALTER TABLE public.universities
ADD COLUMN IF NOT EXISTS type text, -- e.g. Public, Private
ADD COLUMN IF NOT EXISTS total_students text, -- e.g. "30,000+"
ADD COLUMN IF NOT EXISTS international_students text, -- e.g. "2,000+"
ADD COLUMN IF NOT EXISTS tags text[]; -- e.g. ["985", "211", "Double First Class"]
