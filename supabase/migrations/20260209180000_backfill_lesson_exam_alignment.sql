-- Backfill exam_alignment for certification-aligned lessons (for "Covers: ..." in UI).
-- Matches lessons by module_id and title; safe to run multiple times.

UPDATE public.lessons AS l
SET exam_alignment = v.exam_alignment
FROM (VALUES
  ('b0000000-0000-4000-8000-000000000011', 'Welcome to Cybersecurity', 'A+ 220-1102 Op. Proc.; course overview'),
  ('b0000000-0000-4000-8000-000000000011', 'The Threat Landscape', 'A+ 220-1102 2.0 (Security); threat types'),
  ('b0000000-0000-4000-8000-000000000012', 'Motherboard and Internal Components', 'A+ 220-1101 3.0 (Hardware)'),
  ('b0000000-0000-4000-8000-000000000012', 'Mobile Devices and Connectivity', 'A+ 220-1101 1.0 (Mobile Devices)'),
  ('b0000000-0000-4000-8000-000000000013', 'TCP/IP and the OSI Model', 'Network+ 1.0; A+ 220-1101 2.0'),
  ('b0000000-0000-4000-8000-000000000013', 'Network Types and Cabling', 'Network+ 1.0, 2.0'),
  ('b0000000-0000-4000-8000-000000000014', 'CIA Triad and Security Controls', 'A+ 220-1102 2.0; Network+ 4.0'),
  ('b0000000-0000-4000-8000-000000000014', 'Physical Security and Authentication', 'A+ 220-1102 2.0 (Physical security, auth)'),
  ('b0000000-0000-4000-8000-000000000021', 'DNS and DHCP', 'Network+ 1.0, 3.0'),
  ('b0000000-0000-4000-8000-000000000021', 'Application Protocols and Ports', 'Network+ 1.0, 3.0'),
  ('b0000000-0000-4000-8000-000000000022', 'Firewalls and Network Segmentation', 'Network+ 4.0'),
  ('b0000000-0000-4000-8000-000000000022', 'Intrusion Detection and Prevention', 'Network+ 4.0'),
  ('b0000000-0000-4000-8000-000000000023', 'Windows Security Basics', 'A+ 220-1102 1.0; Security+'),
  ('b0000000-0000-4000-8000-000000000023', 'Linux Security Basics', 'A+ 220-1102 1.0; Security+'),
  ('b0000000-0000-4000-8000-000000000031', 'Security Controls and Cryptography', 'Security+ 1.1–1.2; ISC² CC Security Principles'),
  ('b0000000-0000-4000-8000-000000000031', 'Identity and Access Management', 'Security+ 1.3–1.4; ISC² CC Access Control'),
  ('b0000000-0000-4000-8000-000000000031', 'Cryptography in Practice', 'Security+ 1.2; ISC² CC Security Principles'),
  ('b0000000-0000-4000-8000-000000000032', 'Threat Actors and Attack Types', 'Security+ 2.1–2.2; ISC² CC Security Operations'),
  ('b0000000-0000-4000-8000-000000000032', 'Vulnerability Assessment and Response', 'Security+ 2.3, 4.x; ISC² CC BC/DR, Security Operations'),
  ('b0000000-0000-4000-8000-000000000032', 'Vulnerability Types and Prioritisation', 'Security+ 2.3–2.4'),
  ('b0000000-0000-4000-8000-000000000033', 'Security Architecture and Resilience', 'Security+ 3.0; ISC² CC Security Principles'),
  ('b0000000-0000-4000-8000-000000000033', 'Monitoring and Security Operations', 'Security+ 4.1–4.3; ISC² CC Security Operations'),
  ('b0000000-0000-4000-8000-000000000033', 'Secure Deployment and Hardening', 'Security+ 3.x, 4.x'),
  ('b0000000-0000-4000-8000-000000000034', 'Security Policies and Compliance', 'Security+ 5.1–5.2; ISC² CC'),
  ('b0000000-0000-4000-8000-000000000034', 'Security Awareness and Third-Party Risk', 'Security+ 5.3–5.4; ISC² CC'),
  ('b0000000-0000-4000-8000-000000000041', 'Security Operations and Threat Detection', 'CySA+ 1.0; SSCP Security Operations, Risk ID'),
  ('b0000000-0000-4000-8000-000000000041', 'Vulnerability Management Lifecycle', 'CySA+ 2.0; SSCP Risk ID, Monitoring'),
  ('b0000000-0000-4000-8000-000000000042', 'Incident Response Process', 'CySA+ 3.0; SSCP IR and Recovery'),
  ('b0000000-0000-4000-8000-000000000042', 'Reporting and Communication', 'CySA+ 4.0; SSCP Security Operations'),
  ('b0000000-0000-4000-8000-000000000051', 'SIEM Administration and Tuning', 'CySA+ 1.0 (Security Operations)'),
  ('b0000000-0000-4000-8000-000000000051', 'Defender XDR and Cloud Security', 'CySA+ 1.0 (XDR, cloud)'),
  ('b0000000-0000-4000-8000-000000000052', 'Threat Hunting Methodologies', 'CySA+ 1.0, 3.0'),
  ('b0000000-0000-4000-8000-000000000052', 'Advanced Incident Handling', 'CySA+ 3.0'),
  ('b0000000-0000-4000-8000-000000000061', 'Security Governance and Risk Management', 'CISSP Domain 1; CISM Gov, Risk'),
  ('b0000000-0000-4000-8000-000000000061', 'Security Program Development', 'CISM Domain 3; CISSP Domain 5'),
  ('b0000000-0000-4000-8000-000000000062', 'Security Architecture and Engineering', 'CISSP Domain 3; TOGAF'),
  ('b0000000-0000-4000-8000-000000000062', 'Leadership and Communication', 'CISM; CISSP leadership')
) AS v(module_id, title, exam_alignment)
WHERE l.module_id = v.module_id::uuid AND l.title = v.title;
