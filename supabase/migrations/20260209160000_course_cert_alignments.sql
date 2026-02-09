-- Certification alignment fixes: BH-SPEC-SOC → CySA+ only; BH-SPEC-GRC → CRISC (not CISSP/CISM).

UPDATE public.courses
SET aligned_certifications = ARRAY['CompTIA CySA+']
WHERE code = 'BH-SPEC-SOC';

UPDATE public.courses
SET aligned_certifications = ARRAY['CRISC'],
    description = 'Advanced governance, risk, and compliance. Content in development. Aligned to CRISC.'
WHERE code = 'BH-SPEC-GRC';
