-- Add cover_image to programs table
ALTER TABLE public.programs 
ADD COLUMN cover_image text;

-- Add dormitory_photos to programs table
ALTER TABLE public.programs
ADD COLUMN dormitory_photos text[];

-- Add video_url to universities table
ALTER TABLE public.universities 
ADD COLUMN video_url text;
