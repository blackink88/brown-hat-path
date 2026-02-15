-- Move capstone lessons to standalone modules and add practical submission support.

BEGIN;

-- ========== Add response_text column for practical text submissions ==========
ALTER TABLE public.capstone_submissions ADD COLUMN IF NOT EXISTS response_text TEXT;

-- ========== Create standalone Capstone Project modules for migration courses ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('d0000000-0000-4000-8000-000000000071', 'a0000000-0000-4000-8000-000000000008', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5),
  ('d0000000-0000-4000-8000-000000000072', 'a0000000-0000-4000-8000-000000000009', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5),
  ('d0000000-0000-4000-8000-000000000073', 'a0000000-0000-4000-8000-00000000000a', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5),
  ('d0000000-0000-4000-8000-000000000074', 'a0000000-0000-4000-8000-00000000000b', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5)
ON CONFLICT (id) DO NOTHING;

-- ========== Move capstone lessons to standalone modules ==========
UPDATE public.lessons SET module_id = 'd0000000-0000-4000-8000-000000000071', order_index = 1 WHERE id = 'f1000000-0000-4000-8000-000000000001';
UPDATE public.lessons SET module_id = 'd0000000-0000-4000-8000-000000000072', order_index = 1 WHERE id = 'f1000000-0000-4000-8000-000000000002';
UPDATE public.lessons SET module_id = 'd0000000-0000-4000-8000-000000000073', order_index = 1 WHERE id = 'f1000000-0000-4000-8000-000000000003';
UPDATE public.lessons SET module_id = 'd0000000-0000-4000-8000-000000000074', order_index = 1 WHERE id = 'f1000000-0000-4000-8000-000000000004';

COMMIT;
