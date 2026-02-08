-- Allow all authenticated users to view lessons (no subscription required).
-- Use this when there are no subscriptions and users only have the student role.
-- Drops the tier-gated policy and adds a simple "authenticated can read all" policy.

DROP POLICY IF EXISTS "Users can view lessons based on subscription" ON public.lessons;

CREATE POLICY "Authenticated users can view all lessons" ON public.lessons
  FOR SELECT TO authenticated USING (true);
