-- Migration to add additional_info column to programs table
ALTER TABLE public.programs 
ADD COLUMN IF NOT EXISTS additional_info TEXT;

-- Update RLS policies (optional, but good practice if explicitly listed)
-- Since generic select/insert/update policies exist for programs, 
-- they should automatically cover the new column.
