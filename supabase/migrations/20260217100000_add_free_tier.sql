-- Add Explorer tier (level 0, free) for Bridge course access.
-- Align all tier feature descriptions with official level names.

-- Insert Explorer tier (level 0, R0)
INSERT INTO public.subscription_tiers (name, price_zar, level, features)
VALUES (
  'Explorer',
  0,
  0,
  '["Level 0: Bridge - Digital Readiness", "Computer fundamentals & digital literacy", "Basic networking concepts", "No credit card required"]'::jsonb
)
ON CONFLICT (name) DO UPDATE SET
  price_zar = EXCLUDED.price_zar,
  level = EXCLUDED.level,
  features = EXCLUDED.features;

-- Update Foundation features with correct level names
UPDATE public.subscription_tiers
SET features = '["Level 1: Foundations - IT & Cyber Foundations", "Basic Skills Radar tracking", "Community access (invite via email)", "Email support"]'::jsonb
WHERE name = 'Foundation';

-- Update Practitioner features with correct level names
UPDATE public.subscription_tiers
SET features = '["All Foundation features", "Level 2: Core Cyber - Core Cyber Foundations", "Level 3: Practitioner Core (Blue Team or GRC)", "Certification path tracking (Security+, SSCP, etc.)", "Toolbox Mastery content in curriculum", "Live Q&A (dates shared by email)", "Priority email support"]'::jsonb
WHERE name = 'Practitioner';

-- Update Professional features with correct level names
UPDATE public.subscription_tiers
SET features = '["All Practitioner features", "Level 4: Specialisation Tracks", "Level 5: Advanced & Leadership", "Verified Skills Portfolio (shareable link)", "Career coaching & employer intros (arranged via email)", "1-on-1 mentorship (arranged via email)"]'::jsonb
WHERE name = 'Professional';

-- Update Bridge course to require tier level 0 (Explorer) instead of 1 (Foundation)
UPDATE public.courses
SET required_tier_level = 0
WHERE code = 'BH-BRIDGE';
