-- Add contact fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS social_media_link text,
ADD COLUMN IF NOT EXISTS whatsapp_number text;

-- Update handle_new_user function to include these fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Check if metadata contains role='agent'
  IF new.raw_user_meta_data->>'role' = 'agent' THEN
    INSERT INTO public.users (
      id, 
      email, 
      name, 
      country, 
      role, 
      status,
      social_media_link,
      whatsapp_number
    )
    VALUES (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'name', 
      new.raw_user_meta_data->>'country',
      'agent',
      'pending', -- Agents start as pending
      new.raw_user_meta_data->>'social_media_link',
      new.raw_user_meta_data->>'whatsapp_number'
    );
  ELSE
    -- Default behavior for normal users
    INSERT INTO public.users (
      id, 
      email, 
      name, 
      country, 
      role, 
      status,
      social_media_link,
      whatsapp_number
    )
    VALUES (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'name', 
      new.raw_user_meta_data->>'country',
      'user',
      'active',
      new.raw_user_meta_data->>'social_media_link',
      new.raw_user_meta_data->>'whatsapp_number'
    );
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
