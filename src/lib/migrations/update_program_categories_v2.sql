-- Update the program categories
-- 1. Drop the existing check constraint
ALTER TABLE public.programs DROP CONSTRAINT IF EXISTS programs_level_check;

-- 2. Update existing data to match new categories
UPDATE public.programs 
SET level = 'Top-up program' 
WHERE level = 'Senior high school';

UPDATE public.programs 
SET level = 'Camp' 
WHERE level = 'Short-term Language';

-- 3. Add the new check constraint with updated categories
ALTER TABLE public.programs 
ADD CONSTRAINT programs_level_check 
CHECK (level in (
  'Bachelor', 
  'Master', 
  'Doctor', 
  'PhD', 
  'Masters', 
  'High School', 
  'Top-up program', -- Replaces Senior high school
  'Language', 
  'Camp', -- Replaces Short-term Language
  'Long-term Language', 
  'College', 
  'Secondary Vocational Education'
));
