
-- Add paystack_plan_code column to subscription_tiers
ALTER TABLE public.subscription_tiers
ADD COLUMN paystack_plan_code TEXT;
