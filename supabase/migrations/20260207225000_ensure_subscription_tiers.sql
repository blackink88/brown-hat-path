-- Ensure all 3 subscription tiers exist with correct names and pricing (ZAR).
-- Foundation R499, Practitioner R1500, Professional R3000.
-- Idempotent: inserts if missing, updates price_zar/level/features if name exists.

INSERT INTO public.subscription_tiers (name, price_zar, level, features) VALUES
  (
    'Foundation',
    499,
    1,
    '["Level 0: Technical Readiness", "Level 1: Foundations", "Basic Skills Radar", "Community Access"]'::jsonb
  ),
  (
    'Practitioner',
    1500,
    2,
    '["All Foundation features", "Level 2: Core Cyber", "Level 3: Practitioner Core", "Certification Tracking", "Live Q&A"]'::jsonb
  ),
  (
    'Professional',
    3000,
    3,
    '["All Practitioner features", "Level 4: Specialisation", "Level 5: Advanced", "Amajoni Eligibility", "1-on-1 Mentorship"]'::jsonb
  )
ON CONFLICT (name) DO UPDATE SET
  price_zar = EXCLUDED.price_zar,
  level = EXCLUDED.level,
  features = EXCLUDED.features;
