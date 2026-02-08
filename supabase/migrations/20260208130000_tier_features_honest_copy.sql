-- Align tier feature lists with what the app actually delivers.
-- Curriculum levels, skills radar, certification goals + support/discounts; human-delivered items rephrased as "access via email".

UPDATE public.subscription_tiers SET features = '["Level 0: Technical Readiness Program", "Level 1: Foundations Curriculum", "Basic Skills Radar tracking", "Community access (invite via email)", "Email support"]'::jsonb WHERE name = 'Foundation';

UPDATE public.subscription_tiers SET features = '["All Foundation features", "Level 2: Core Cyber curriculum", "Level 3: Practitioner Core (Blue Team or GRC)", "Certification path tracking (Security+, SSCP, etc.)", "Toolbox Mastery content in curriculum", "Live Q&A (dates shared by email)", "Priority email support"]'::jsonb WHERE name = 'Practitioner';

UPDATE public.subscription_tiers SET features = '["All Practitioner features", "Level 4: Specialisation Tracks", "Level 5: Advanced & Leadership", "Verified Skills Portfolio (shareable link)", "Career coaching & employer intros (arranged via email)", "1-on-1 mentorship (arranged via email)"]'::jsonb WHERE name = 'Professional';
