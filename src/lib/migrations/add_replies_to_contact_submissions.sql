-- Add replies column to contact_submissions
alter table public.contact_submissions 
add column if not exists replies jsonb default '[]'::jsonb;

-- Comment for documentation
comment on column public.contact_submissions.replies is 'Array of reply objects: [{text, sent_at, sent_by}]';
