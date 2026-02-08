-- Store Stripe customer and subscription IDs so we can cancel via Stripe API and stay in sync with webhooks.
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS 'Stripe Customer ID from checkout session; used for billing portal and cancel.';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'Stripe Subscription ID; used to cancel subscription via API.';
