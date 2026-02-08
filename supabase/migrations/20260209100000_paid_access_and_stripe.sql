-- Paid access: new users get no subscription (must pay). Add Stripe price ID for checkout.

-- 1) New signups: profile + student role only; no subscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student'));

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');

  -- No subscription: user must choose a tier and complete payment to access content
  RETURN NEW;
END;
$$;

-- 2) Optional Stripe Price ID per tier (set in Stripe Dashboard, then update here or via Admin)
ALTER TABLE public.subscription_tiers
  ADD COLUMN IF NOT EXISTS stripe_price_id text;

COMMENT ON COLUMN public.subscription_tiers.stripe_price_id IS 'Stripe Price ID for monthly subscription (e.g. price_xxx). Set after creating Product/Price in Stripe.';
