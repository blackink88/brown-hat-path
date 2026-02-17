-- Add a Free tier (level 0) that gives access to the Bridge course only.
-- Also update Foundation tier features since Bridge is now covered by Free.

-- Insert Free tier (level 0, R0)
INSERT INTO public.subscription_tiers (name, price_zar, level, features)
VALUES (
  'Free',
  0,
  0,
  '["Level 0: Bridge course", "Digital literacy fundamentals", "Basic networking intro", "No credit card required"]'::jsonb
)
ON CONFLICT (name) DO UPDATE SET
  price_zar = EXCLUDED.price_zar,
  level = EXCLUDED.level,
  features = EXCLUDED.features;

-- Update Foundation features to remove Bridge reference (now in Free tier)
UPDATE public.subscription_tiers
SET features = '["Level 1: Foundations Curriculum", "Basic Skills Radar tracking", "Community access (invite via email)", "Email support"]'::jsonb
WHERE name = 'Foundation';

-- Update Bridge course to require tier level 0 (Free) instead of 1 (Foundation)
UPDATE public.courses
SET required_tier_level = 0
WHERE code = 'BH-BRIDGE';
