-- Add unique constraint on user_id to prevent duplicate profiles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);