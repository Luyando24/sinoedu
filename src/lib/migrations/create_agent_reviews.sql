-- Create agent_reviews table
CREATE TABLE IF NOT EXISTS public.agent_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    country TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.agent_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Public can view reviews" ON public.agent_reviews;
CREATE POLICY "Public can view reviews" ON public.agent_reviews
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage reviews" ON public.agent_reviews;
CREATE POLICY "Admins can manage reviews" ON public.agent_reviews
    FOR ALL USING (
        public.get_my_role() = 'admin'
    );

-- Insert initial data from the hardcoded values
INSERT INTO public.agent_reviews (name, role, country, content, image_url)
VALUES 
    ('Nguyen Van Minh', 'Director, Global Education Solutions', 'Vietnam', 'Sinoway has been an incredible partner for us. Their team''s deep knowledge of Chinese universities and the admission process has helped hundreds of our students secure their spots. The efficiency and transparency they offer are unmatched.', NULL),
    ('Aisha Karimova', 'Senior Consultant, Future Pathways', 'Kazakhstan', 'Working with Sinoway Edu is a pleasure. They are responsive, professional, and truly care about the students'' success. Their support with scholarship applications has been a game-changer for our agency.', NULL),
    ('Budi Santoso', 'Founder, Study Bridge', 'Indonesia', 'We value the integrity and reliability of Sinoway. They always deliver on their promises and provide accurate information. A trusted partner for anyone looking to send students to China.', NULL);
