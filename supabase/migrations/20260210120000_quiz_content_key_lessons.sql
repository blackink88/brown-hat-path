-- Quiz content for key lessons: reinforces what matters (GRC-2, IAM, Cloud, Advanced GRC).
-- Uses fixed lesson IDs from full_spec_and_grc_curriculum migration. Run after that migration.

-- ========== BH-GRC-2: Ethics and Professional Conduct (lesson 003) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000003', 'What should you do when you have a conflict of interest in a GRC context?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Disclose it to your manager or compliance and recuse yourself where appropriate', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000003' AND order_index = 1
UNION ALL SELECT id, 'Ignore it and continue with the task', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000003' AND order_index = 1
UNION ALL SELECT id, 'Only document it after the decision is made', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000003' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000003', 'GRC practitioners should treat risk and compliance information as confidential.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000003' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000003' AND order_index = 2;

-- ========== BH-GRC-2: Risk Treatment and Monitoring (lesson 006) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000006', 'Which risk treatment option means reducing likelihood or impact through controls?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Mitigate', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000006' AND order_index = 1
UNION ALL SELECT id, 'Accept', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000006' AND order_index = 1
UNION ALL SELECT id, 'Transfer', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000006' AND order_index = 1
UNION ALL SELECT id, 'Avoid', false, 4 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000006' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000006', 'Risk should be monitored and reviewed regularly because it changes over time.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000006' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000006' AND order_index = 2;

-- ========== BH-GRC-2: Security Controls and Control Types (lesson 009) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000009', 'A firewall that blocks unauthorised access is an example of which type of control?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Preventive', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000009' AND order_index = 1
UNION ALL SELECT id, 'Detective', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000009' AND order_index = 1
UNION ALL SELECT id, 'Corrective', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000009' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000009', 'Controls can be classified by implementation as technical, administrative, or physical.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000009' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000009' AND order_index = 2;

-- ========== BH-GRC-2: Reporting and Metrics (lesson 00c) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000000c', 'What should executive and board reports focus on?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Status, key metrics, top risks, and decisions or resources needed', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000000c' AND order_index = 1
UNION ALL SELECT id, 'Detailed technical logs only', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000000c' AND order_index = 1
UNION ALL SELECT id, 'Only pass rates and certifications', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000000c' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000000c', 'Reporting risk and compliance to leadership helps create accountability.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000000c' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000000c' AND order_index = 2;

-- ========== BH-SPEC-IAM: Federation and Trust (lesson 013) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000013', 'In federated identity, which party authenticates the user and issues an assertion?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Identity provider (IdP)', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000013' AND order_index = 1
UNION ALL SELECT id, 'Service provider (SP)', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000013' AND order_index = 1
UNION ALL SELECT id, 'The user''s browser', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000013' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000013', 'SAML and OAuth/OIDC are commonly used for federated identity.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000013' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000013' AND order_index = 2;

-- ========== BH-SPEC-IAM: IAM Monitoring and Incident Response (lesson 01c) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000001c', 'Which of these should you monitor for signs of identity compromise?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Failed logins followed by success, logins from unusual locations, privilege escalation', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000001c' AND order_index = 1
UNION ALL SELECT id, 'Only successful logins', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000001c' AND order_index = 1
UNION ALL SELECT id, 'Only password changes', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000001c' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000001c', 'When responding to credential compromise, you should revoke or reset credentials and check for lateral movement.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000001c' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000001c' AND order_index = 2;

-- ========== BH-SPEC-CLOUD: Cloud Security Posture and Governance (lesson 023) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000023', 'What does CSPM stand for and what does it do?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Cloud Security Posture Management; it scans cloud configuration and compares to policy and benchmarks', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000023' AND order_index = 1
UNION ALL SELECT id, 'Cloud Service Provider Management; it provisions resources', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000023' AND order_index = 1
UNION ALL SELECT id, 'Customer Security Policy Module; it defines SLAs', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000023' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000023', 'Security posture in the cloud should be assessed continuously, not only at deploy time.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000023' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000023' AND order_index = 2;

-- ========== BH-SPEC-CLOUD: Security Automation and DevSecOps (lesson 02c) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000002c', '"Shift left" in security typically means:', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Finding and fixing security issues early (e.g. in code, dependencies, or at deploy time)', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000002c' AND order_index = 1
UNION ALL SELECT id, 'Moving security team to the left side of the office', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000002c' AND order_index = 1
UNION ALL SELECT id, 'Delaying security checks until after go-live', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000002c' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000002c', 'Infrastructure as code can be scanned for misconfigurations before apply.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000002c' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000002c' AND order_index = 2;

-- ========== BH-SPEC-GRC: Board and Executive Risk Reporting (lesson 033) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000033', 'What does the board need from risk reporting?', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'Top risks, trend, alignment with appetite/tolerance, and decisions required', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000033' AND order_index = 1
UNION ALL SELECT id, 'Day-to-day operational logs only', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000033' AND order_index = 1
UNION ALL SELECT id, 'Only when an incident has occurred', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000033' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-000000000033', 'Board reports should be concise and focused on what the board can act on.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000033' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-000000000033' AND order_index = 2;

-- ========== BH-SPEC-GRC: Risk Culture and Communication (lesson 03c) ==========
INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000003c', 'A positive risk culture is one where:', 'multiple_choice', 1);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'People understand risk, own it where appropriate, and escalate when needed', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000003c' AND order_index = 1
UNION ALL SELECT id, 'Risk is seen as someone else''s job', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000003c' AND order_index = 1
UNION ALL SELECT id, 'Only the risk team talks about risk', false, 3 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000003c' AND order_index = 1;

INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
VALUES ('e0000000-0000-4000-8000-00000000003c', 'Communicating risk in business terms helps leadership prioritise and resource security.', 'true_false', 2);
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT id, 'True', true, 1 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000003c' AND order_index = 2
UNION ALL SELECT id, 'False', false, 2 FROM public.quiz_questions WHERE lesson_id = 'e0000000-0000-4000-8000-00000000003c' AND order_index = 2;
