-- Certification alignment: each course has aligned certs (from Learning Path). Students pass the cert aligned to the course.

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS aligned_certifications TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.courses.aligned_certifications IS 'Certification(s) this course aligns to; students work toward passing these. Support and exam discounts offered.';

-- Backfill from Learning Path alignment (by course code)
UPDATE public.courses SET aligned_certifications = '{}' WHERE code = 'BH-BRIDGE';
UPDATE public.courses SET aligned_certifications = ARRAY['CompTIA A+'] WHERE code = 'BH-FOUND-1';
UPDATE public.courses SET aligned_certifications = ARRAY['CompTIA Network+'] WHERE code = 'BH-FOUND-2';
UPDATE public.courses SET aligned_certifications = ARRAY['CompTIA Security+', 'ISC² CC'] WHERE code = 'BH-CYBER-2';
UPDATE public.courses SET aligned_certifications = ARRAY['CompTIA CySA+', 'ISC² SSCP'] WHERE code = 'BH-OPS-2';
UPDATE public.courses SET aligned_certifications = ARRAY['CompTIA CASP+', 'Microsoft SC-200', 'AWS Security'] WHERE code = 'BH-SPEC-SOC';
UPDATE public.courses SET aligned_certifications = ARRAY['CISSP', 'CISM', 'TOGAF'] WHERE code = 'BH-ADV';
