
-- SQL Script to auto-confirm emails for new users
-- Run this in Supabase Dashboard -> SQL Editor

-- 1. Create a function that sets the email_confirmed_at timestamp
create or replace function public.auto_confirm_email()
returns trigger as $$
begin
  new.email_confirmed_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- 2. Create a trigger that runs BEFORE insert on auth.users
--    We use BEFORE so it's saved with the confirmation timestamp immediately.
drop trigger if exists on_auth_user_created_auto_confirm on auth.users;

create trigger on_auth_user_created_auto_confirm
  before insert on auth.users
  for each row execute procedure public.auto_confirm_email();

-- 3. Optionally, confirm all existing unconfirmed users
update auth.users
set email_confirmed_at = now()
where email_confirmed_at is null;
