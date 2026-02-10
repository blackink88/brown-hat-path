-- Optional traceability: which exam objectives a lesson covers (e.g. "Security+ 1.1, 1.2; ISC² CC Security Principles").
-- Enables future UI: "Covers: Security+ 1.2, 1.3" and reporting on objective coverage.

ALTER TABLE public.lessons
  ADD COLUMN IF NOT EXISTS exam_alignment TEXT;

COMMENT ON COLUMN public.lessons.exam_alignment IS 'Short text listing exam objectives this lesson covers, e.g. "Security+ 1.1, 1.2; ISC² CC Security Principles". Optional.';
