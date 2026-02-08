-- Add aligned_certifications column to courses table
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS aligned_certifications text[] DEFAULT '{}';

COMMENT ON COLUMN public.courses.aligned_certifications IS 'Array of certification names this course helps prepare for';