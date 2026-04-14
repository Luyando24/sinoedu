-- Create Program Levels table
CREATE TABLE IF NOT EXISTS public.program_levels (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.program_levels ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Program levels are viewable by everyone" ON public.program_levels
    FOR SELECT USING (true);

CREATE POLICY "Only admins can manage program levels" ON public.program_levels
    FOR ALL USING (exists (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Seed data with logical sort order
INSERT INTO public.program_levels (name, sort_order) VALUES
('Language', 10),
('Long-term Language', 20),
('Camp', 30),
('High School', 40),
('College', 50),
('Secondary Vocational Education', 60),
('Top-up program', 70),
('Bachelor', 80),
('Master', 90),
('Masters', 100),
('PhD', 110),
('Doctor', 120)
ON CONFLICT (name) DO NOTHING;
