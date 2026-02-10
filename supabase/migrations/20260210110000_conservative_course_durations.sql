-- Realistic course duration: lesson content time × 1.25 (content + light practice).
-- Lab sessions may add time; students work at their own pace. Single course capped at 80h.

COMMENT ON COLUMN public.courses.duration_hours IS 'Estimated total hours to complete (content + practice). Derived from sum of lesson duration_minutes × 1.25. Lab sessions may add time. Work at your own pace.';

UPDATE public.courses c
SET duration_hours = sub.est_hours
FROM (
  SELECT
    m.course_id,
    GREATEST(8, LEAST(80, (CEIL(COALESCE(SUM(l.duration_minutes), 0) / 60.0 * 1.25))::INTEGER)) AS est_hours
  FROM public.modules m
  LEFT JOIN public.lessons l ON l.module_id = m.id
  GROUP BY m.course_id
) sub
WHERE c.id = sub.course_id
  AND (SELECT COALESCE(SUM(l.duration_minutes), 0) FROM public.modules m2 JOIN public.lessons l ON l.module_id = m2.id WHERE m2.course_id = c.id) > 0;
