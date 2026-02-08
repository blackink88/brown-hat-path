-- Server-side upsert for user_progress to avoid 409 on duplicate (user_id, lesson_id).
-- Uses auth.uid() so clients can only update their own progress.

CREATE OR REPLACE FUNCTION public.upsert_user_progress(
  p_lesson_id uuid,
  p_completed boolean,
  p_completed_at timestamptz DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_progress (user_id, lesson_id, completed, completed_at)
  VALUES (auth.uid(), p_lesson_id, p_completed, p_completed_at)
  ON CONFLICT (user_id, lesson_id)
  DO UPDATE SET
    completed = EXCLUDED.completed,
    completed_at = EXCLUDED.completed_at;
END;
$$;

-- Allow authenticated users to call it
GRANT EXECUTE ON FUNCTION public.upsert_user_progress(uuid, boolean, timestamptz) TO authenticated;
