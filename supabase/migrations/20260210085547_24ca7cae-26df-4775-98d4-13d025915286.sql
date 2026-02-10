-- Add exam_alignment column to lessons
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS exam_alignment text;

-- Backfill exam_alignment for existing lessons based on course certifications
UPDATE public.lessons l
SET exam_alignment = sub.certs
FROM (
  SELECT l2.id AS lesson_id,
         array_to_string(c.aligned_certifications, '; ') AS certs
  FROM public.lessons l2
  JOIN public.modules m ON m.id = l2.module_id
  JOIN public.courses c ON c.id = m.course_id
  WHERE c.aligned_certifications IS NOT NULL
    AND array_length(c.aligned_certifications, 1) > 0
) sub
WHERE l.id = sub.lesson_id
  AND l.exam_alignment IS NULL;