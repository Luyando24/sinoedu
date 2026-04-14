-- Seed common scholarship types to enable intelligent matching in the importer
INSERT INTO public.scholarships (name, description, coverage, is_active)
VALUES 
  ('Full Scholarship', 'Covers tuition, accommodation, and often includes a stipend.', 'Full', true),
  ('Partial Scholarship', 'Covers a portion of tuition or accommodation fees.', 'Partial', true),
  ('CSC Scholarship', 'Chinese Government Scholarship. High prestige and full coverage.', 'Full', true),
  ('Presidential Scholarship', 'University-level scholarship for top-performing international students.', 'Full/Partial', true),
  ('Bursary', 'Financial aid provided by the university based on academic merit or need.', 'Variable', true),
  ('Provincial Scholarship', 'Government scholarship provided at the provincial level.', 'Full/Partial', true)
ON CONFLICT DO NOTHING;
