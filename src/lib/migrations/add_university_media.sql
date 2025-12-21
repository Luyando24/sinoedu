-- Add cover_image and gallery_images to universities table
ALTER TABLE public.universities 
ADD COLUMN cover_image text,
ADD COLUMN gallery_images text[];
