-- Update the check constraint for program levels to include new categories
ALTER TABLE public.programs DROP CONSTRAINT IF EXISTS programs_level_check;

ALTER TABLE public.programs 
ADD CONSTRAINT programs_level_check 
CHECK (level in (
  'Bachelor', 
  'Masters', 
  'Master', 
  'PhD', 
  'Doctor', 
  'High School', 
  'Top-up program', 
  'Language', 
  'Camp', 
  'Long-term Language', 
  'College', 
  'Secondary Vocational Education'
));
