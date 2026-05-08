-- Add utility scholarship types to ensure they are available in the database-driven dropdowns
INSERT INTO public.scholarships (name, description, coverage, is_active)
VALUES 
  ('Self-funded', 'No scholarship applied. Program is fully funded by the student.', 'None', true),
  ('Any Scholarship', 'A meta-category to filter programs that have any type of scholarship support.', 'Variable', true)
ON CONFLICT (name) DO NOTHING;
