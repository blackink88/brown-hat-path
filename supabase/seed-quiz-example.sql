-- Example quiz questions for BH-BRIDGE first lesson ("What is a Computer?")
-- Run this AFTER seed-full-curriculum.sql and AFTER migration 20260207210000_quiz_tables.sql.
-- Targets the first lesson of the first module of BH-BRIDGE.

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
