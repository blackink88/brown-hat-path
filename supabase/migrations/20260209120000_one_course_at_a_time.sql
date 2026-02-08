-- Enforce one active enrollment: user must finish current course (100%) before enrolling in another.
-- App enforces this in MyCourses; this trigger blocks bypasses (e.g. direct API insert).

CREATE OR REPLACE FUNCTION public.get_course_progress_percent(p_user_id uuid, p_course_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH course_lesson_ids AS (
    SELECT l.id
    FROM public.lessons l
    JOIN public.modules m ON m.id = l.module_id
    WHERE m.course_id = p_course_id
  ),
  total AS (SELECT count(*)::integer AS n FROM course_lesson_ids),
  completed AS (
    SELECT count(*)::integer AS n
    FROM public.user_progress up
    WHERE up.user_id = p_user_id
      AND up.completed = true
      AND up.lesson_id IN (SELECT id FROM course_lesson_ids)
  )
  SELECT CASE
    WHEN (SELECT n FROM total) = 0 THEN 100
    ELSE (SELECT (COALESCE(c.n, 0) * 100 / NULLIF(t.n, 0))::integer FROM completed c CROSS JOIN total t LIMIT 1)
  END;
$$;

CREATE OR REPLACE FUNCTION public.check_one_incomplete_enrollment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  other_enrollment record;
  pct integer;
BEGIN
  FOR other_enrollment IN
    SELECT course_id FROM public.course_enrollments WHERE user_id = NEW.user_id
  LOOP
    pct := public.get_course_progress_percent(NEW.user_id, other_enrollment.course_id);
    IF pct < 100 THEN
      RAISE EXCEPTION 'Finish your current course before enrolling in another. Complete all lessons to 100%%.'
        USING errcode = 'check_violation';
    END IF;
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_one_incomplete_enrollment ON public.course_enrollments;
CREATE TRIGGER enforce_one_incomplete_enrollment
  BEFORE INSERT ON public.course_enrollments
  FOR EACH ROW
  EXECUTE PROCEDURE public.check_one_incomplete_enrollment();
