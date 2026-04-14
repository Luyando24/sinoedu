-- One-time cleanup for existing data in programs and universities tables

-- Cleanup programs
UPDATE programs
SET 
  title = regexp_replace(trim(title), '\s+', ' ', 'g'),
  program_id_code = regexp_replace(trim(program_id_code), '\s+', ' ', 'g'),
  location = regexp_replace(trim(location), '\s+', ' ', 'g'),
  level = regexp_replace(trim(level), '\s+', ' ', 'g'),
  duration = regexp_replace(trim(duration), '\s+', ' ', 'g'),
  language = regexp_replace(trim(language), '\s+', ' ', 'g'),
  intake = regexp_replace(trim(intake), '\s+', ' ', 'g');

-- Cleanup universities
UPDATE universities
SET 
  name = regexp_replace(trim(name), '\s+', ' ', 'g'),
  location = regexp_replace(trim(location), '\s+', ' ', 'g');
