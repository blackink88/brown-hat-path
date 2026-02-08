-- Certification goals: students select which exams they're working toward (e.g. Security+, SSCP).
-- We provide support and discounts for these; curriculum aligns to the material.

CREATE TABLE public.user_certification_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  certification_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, certification_slug)
);

ALTER TABLE public.user_certification_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own certification goals"
  ON public.user_certification_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certification goals"
  ON public.user_certification_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own certification goals"
  ON public.user_certification_goals FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.user_certification_goals IS 'Certifications the user is working toward; used for support and exam discounts.';
