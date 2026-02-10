-- Learning path tracks: store user's practitioner and specialisation track; add track to courses; add BH-GRC-2 and placeholder spec courses.

-- 1. Profiles: practitioner_track ('ops' | 'grc'), specialisation_track ('soc' | 'iam' | 'cloud' | 'grc')
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS practitioner_track TEXT,
  ADD COLUMN IF NOT EXISTS specialisation_track TEXT;

COMMENT ON COLUMN public.profiles.practitioner_track IS 'Practitioner level track: ops (Blue Team) or grc. Set when user enrolls in Level 3.';
COMMENT ON COLUMN public.profiles.specialisation_track IS 'Specialisation track: soc, iam, cloud, grc. Set when user enrolls in Level 4.';

-- 2. Courses: track (nullable; only for level 3 and 4)
ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS track TEXT;

COMMENT ON COLUMN public.courses.track IS 'Learning track for this course: level 3 = ops | grc, level 4 = soc | iam | cloud | grc. Null for levels 0,1,2,5.';

-- 3. Backfill existing courses
UPDATE public.courses SET track = 'ops' WHERE code = 'BH-OPS-2';
UPDATE public.courses SET track = 'soc' WHERE code = 'BH-SPEC-SOC';

-- 4. BH-GRC-2 (Practitioner GRC) - one placeholder module + lesson
INSERT INTO public.courses (id, code, title, description, level, required_tier_level, duration_hours, order_index, aligned_certifications, track) VALUES
  ('a0000000-0000-4000-8000-000000000008', 'BH-GRC-2', 'Practitioner Core: GRC', 'Governance, risk, and compliance. Risk management, policy development, and compliance frameworks. Aligned to ISC² SSCP and related GRC certifications.', 3, 2, 100, 5, ARRAY['ISC² SSCP'], 'grc')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000008', 'GRC Foundations', 'Introduction to governance, risk, and compliance in cybersecurity.', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('c0000000-0000-4000-8000-000000000001', 'Welcome to GRC', 'Placeholder lesson.', '# Welcome to GRC\n\n## Introduction\n\nContent for this track is being developed. You are on the Governance, Risk & Compliance practitioner path.\n\n## Key takeaway\n\nFull curriculum will follow the same lesson structure as other tracks.\n\n## Exam alignment\n\nISC² SSCP (GRC focus). Content in development.', 5, 1);

-- 5. Placeholder specialisation courses (IAM, Cloud, GRC) - one module + one lesson each
INSERT INTO public.courses (id, code, title, description, level, required_tier_level, duration_hours, order_index, aligned_certifications, track) VALUES
  ('a0000000-0000-4000-8000-000000000009', 'BH-SPEC-IAM', 'Specialisation: IAM', 'Identity and Access Management. Content in development.', 4, 3, 120, 7, ARRAY['CISSP'], 'iam'),
  ('a0000000-0000-4000-8000-00000000000a', 'BH-SPEC-CLOUD', 'Specialisation: Cloud Security', 'Cloud security (AWS, Azure, GCP). Content in development.', 4, 3, 120, 8, ARRAY['AWS Security', 'Microsoft SC-200'], 'cloud'),
  ('a0000000-0000-4000-8000-00000000000b', 'BH-SPEC-GRC', 'Specialisation: Advanced GRC', 'Advanced governance, risk, and compliance. Content in development. Aligned to CRISC.', 4, 3, 120, 9, ARRAY['CRISC'], 'grc')
ON CONFLICT (code) DO NOTHING;

-- Modules and lessons for placeholder spec courses (deterministic UUIDs)
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('c0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000009', 'IAM Overview', 'Placeholder. Content in development.', 1),
  ('c0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-00000000000a', 'Cloud Security Overview', 'Placeholder. Content in development.', 1),
  ('c0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-00000000000b', 'Advanced GRC Overview', 'Placeholder. Content in development.', 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('c0000000-0000-4000-8000-000000000002', 'Coming soon', 'Placeholder.', '# IAM Specialisation\n\n## Introduction\n\nContent for this track is being developed. You are on the Identity and Access Management specialisation path.\n\n## Key takeaway\n\nFull curriculum will follow the same lesson structure as other tracks.\n\n## Exam alignment\n\nCISSP (Identity and Access Management). Content in development.', 5, 1),
  ('c0000000-0000-4000-8000-000000000003', 'Coming soon', 'Placeholder.', '# Cloud Security Specialisation\n\n## Introduction\n\nContent for this track is being developed. You are on the Cloud Security specialisation path.\n\n## Key takeaway\n\nFull curriculum will follow the same lesson structure as other tracks.\n\n## Exam alignment\n\nAWS Security, Microsoft SC-200. Content in development.', 5, 1),
  ('c0000000-0000-4000-8000-000000000004', 'Coming soon', 'Placeholder.', '# Advanced GRC Specialisation\n\n## Introduction\n\nContent for this track is being developed. You are on the Advanced GRC specialisation path.\n\n## Key takeaway\n\nFull curriculum will follow the same lesson structure as other tracks.\n\n## Exam alignment\n\nCRISC. Content in development.', 5, 1);

-- 6. Move BH-ADV order_index to 10 so spec courses (6,7,8,9) sit before it
UPDATE public.courses SET order_index = 10 WHERE code = 'BH-ADV';
