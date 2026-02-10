-- Quiz questions for Bridge and Foundations (by course + module + lesson order).
-- Run AFTER seed-full-curriculum.sql and migration 20260207210000_quiz_tables.sql.
-- For GRC/IAM/Cloud/Advanced GRC quizzes see migration 20260210120000_quiz_content_key_lessons.sql.

-- Question 1: What is a computer?
WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-BRIDGE' AND m.order_index = 1 AND l.order_index = 1
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'What is a computer?', 'multiple_choice', 1 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'An electronic device that processes data', true, 1 FROM q
UNION ALL SELECT q.id, 'A type of book', false, 2 FROM q
UNION ALL SELECT q.id, 'A mechanical typewriter', false, 3 FROM q
UNION ALL SELECT q.id, 'A television set', false, 4 FROM q;

-- Question 2: Main components
WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-BRIDGE' AND m.order_index = 1 AND l.order_index = 1
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Which of these is an example of hardware?', 'multiple_choice', 2 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'RAM (memory)', true, 1 FROM q
UNION ALL SELECT q.id, 'Web browser', false, 2 FROM q
UNION ALL SELECT q.id, 'Operating system', false, 3 FROM q
UNION ALL SELECT q.id, 'An app', false, 4 FROM q;

-- Question 3: True/False
WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-BRIDGE' AND m.order_index = 1 AND l.order_index = 1
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Software is the set of instructions that run on hardware.', 'true_false', 3 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'True', true, 1 FROM q
UNION ALL SELECT q.id, 'False', false, 2 FROM q;

-- Optional: second lesson "Hardware vs Software" — 2 questions
WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-BRIDGE' AND m.order_index = 1 AND l.order_index = 2
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Data in RAM is preserved when you turn off the computer.', 'true_false', 1 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'False', true, 1 FROM q
UNION ALL SELECT q.id, 'True', false, 2 FROM q;

WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-BRIDGE' AND m.order_index = 1 AND l.order_index = 2
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Which is temporary working memory?', 'multiple_choice', 2 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'RAM', true, 1 FROM q
UNION ALL SELECT q.id, 'Hard drive', false, 2 FROM q
UNION ALL SELECT q.id, 'SSD', false, 3 FROM q
UNION ALL SELECT q.id, 'USB stick', false, 4 FROM q;

-- Bridge: first lesson of module 2 (Basic Networking) — 2 questions
WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-BRIDGE' AND m.order_index = 2 AND l.order_index = 1
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Networks allow computers to share data and resources.', 'true_false', 1 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'True', true, 1 FROM q
UNION ALL SELECT q.id, 'False', false, 2 FROM q;

WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-BRIDGE' AND m.order_index = 2 AND l.order_index = 1
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Which is a device that connects networks and forwards data?', 'multiple_choice', 2 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'Router', true, 1 FROM q
UNION ALL SELECT q.id, 'Monitor', false, 2 FROM q
UNION ALL SELECT q.id, 'Keyboard', false, 3 FROM q
UNION ALL SELECT q.id, 'Printer', false, 4 FROM q;

-- BH-FOUND-1: first lesson of first module — 2 questions (IT & Cyber Foundations I)
WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-FOUND-1' AND m.order_index = 1 AND l.order_index = 1
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Cybersecurity aims to protect systems, networks, and data from unauthorised access or harm.', 'true_false', 1 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'True', true, 1 FROM q
UNION ALL SELECT q.id, 'False', false, 2 FROM q;

WITH lesson AS (
  SELECT l.id FROM public.lessons l
  JOIN public.modules m ON l.module_id = m.id
  JOIN public.courses c ON m.course_id = c.id
  WHERE c.code = 'BH-FOUND-1' AND m.order_index = 1 AND l.order_index = 1
  LIMIT 1
),
q AS (
  INSERT INTO public.quiz_questions (lesson_id, question_text, question_type, order_index)
  SELECT id, 'Which is a key goal of security?', 'multiple_choice', 2 FROM lesson
  RETURNING id
)
INSERT INTO public.quiz_question_options (question_id, option_text, is_correct, order_index)
SELECT q.id, 'Confidentiality, integrity, and availability of information', true, 1 FROM q
UNION ALL SELECT q.id, 'Only keeping backups', false, 2 FROM q
UNION ALL SELECT q.id, 'Using the latest smartphone', false, 3 FROM q
UNION ALL SELECT q.id, 'Disabling the firewall', false, 4 FROM q;
