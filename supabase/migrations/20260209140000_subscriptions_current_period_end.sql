-- Next billing date for monthly subscription (from Stripe subscription.current_period_end).
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS current_period_end timestamptz;

COMMENT ON COLUMN public.subscriptions.current_period_end IS 'End of current billing period (next billing date); from Stripe subscription.';
