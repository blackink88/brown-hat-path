-- Add enrollment and subscription tracking columns to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_enrolled boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS subscription_status text NOT NULL DEFAULT 'inactive';

-- Add index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_is_enrolled ON public.profiles(is_enrolled);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON public.profiles(subscription_status);