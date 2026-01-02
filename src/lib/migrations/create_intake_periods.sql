-- Create Intake Periods table
CREATE TABLE IF NOT EXISTS public.intake_periods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.intake_periods ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Intake periods are viewable by everyone" ON public.intake_periods
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert intake periods" ON public.intake_periods
  FOR INSERT WITH CHECK (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

CREATE POLICY "Only admins can update intake periods" ON public.intake_periods
  FOR UPDATE USING (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));

CREATE POLICY "Only admins can delete intake periods" ON public.intake_periods
  FOR DELETE USING (exists (select 1 from public.users where id = auth.uid() and role = 'admin'));
