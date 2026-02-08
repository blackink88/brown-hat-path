-- Subscription model: backfill existing users with Professional tier only.
-- New signups get no subscription; they must choose a tier and pay.

-- 1) Backfill: give every user who has a profile but no subscription a Professional-tier subscription
INSERT INTO public.subscriptions (user_id, tier_id, status, starts_at)
SELECT p.user_id, t.id, 'active', now()
FROM public.profiles p
CROSS JOIN public.subscription_tiers t
WHERE t.name = 'Professional'
  AND NOT EXISTS (
    SELECT 1 FROM public.subscriptions s
    WHERE s.user_id = p.user_id
  );

-- 2) New signups: profile + student role only; no subscription (they must choose tier and pay)
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

  -- No subscription: new users must choose a tier and complete payment
  RETURN NEW;
END;
$$;

-- 3) Re-enable subscription check for lessons (tier-based access)
DROP POLICY IF EXISTS "Authenticated users can view all lessons" ON public.lessons;

CREATE POLICY "Users can view lessons based on subscription" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON m.course_id = c.id
      WHERE m.id = lessons.module_id
        AND c.required_tier_level <= public.get_user_tier_level(auth.uid())
    )
    OR public.has_role(auth.uid(), 'admin')
  );
