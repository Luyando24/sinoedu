-- Add whatsapp_number column to contact_submissions table
ALTER TABLE public.contact_submissions
ADD COLUMN whatsapp_number text;
