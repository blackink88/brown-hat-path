-- Give new signups a default Professional subscription so they can use the app immediately.
-- Lessons remain viewable by all authenticated users (policy from 20260207220000 unchanged).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');

  -- Assign student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  -- Grant default Professional subscription so new users can use the app without admin step
  INSERT INTO public.subscriptions (user_id, tier_id, status, starts_at)
  SELECT NEW.id, t.id, 'active', now()
  FROM public.subscription_tiers t
  WHERE t.name = 'Professional'
  LIMIT 1;

  RETURN NEW;
END;
$$;