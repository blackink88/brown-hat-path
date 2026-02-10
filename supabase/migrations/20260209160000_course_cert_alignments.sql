-- Certification alignment for all specialisations and practitioner GRC.
-- SOC → CySA+ only; GRC → CRISC only; IAM → CISSP; Cloud → AWS Security, SC-200; BH-GRC-2 → SSCP.

UPDATE public.courses
SET aligned_certifications = ARRAY['CompTIA CySA+']
WHERE code = 'BH-SPEC-SOC';

UPDATE public.courses
SET aligned_certifications = ARRAY['CRISC'],
    description = 'Advanced governance, risk, and compliance. Enterprise risk management, IT risk analysis, response and monitoring, governance and reporting. Aligned to CRISC.'
WHERE code = 'BH-SPEC-GRC';

UPDATE public.courses
SET aligned_certifications = ARRAY['CISSP'],
    description = 'Identity and Access Management. Identity, authentication, authorization, access control models, PAM, lifecycle, federation, zero trust, and cloud IAM. Aligned to CISSP.'
WHERE code = 'BH-SPEC-IAM';

UPDATE public.courses
SET aligned_certifications = ARRAY['AWS Security', 'Microsoft SC-200'],
    description = 'Cloud security (AWS, Azure, GCP). Shared responsibility, identity and access, infrastructure and network security, operations, incident response, and compliance.'
WHERE code = 'BH-SPEC-CLOUD';

UPDATE public.courses
SET aligned_certifications = ARRAY['ISC² SSCP'],
    description = 'Governance, risk, and compliance. Risk management, policy development, and compliance frameworks.'
WHERE code = 'BH-GRC-2';
