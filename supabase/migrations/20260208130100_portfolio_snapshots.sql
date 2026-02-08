-- Public portfolio snapshots: one row per user, readable by anyone with the slug for employer sharing.

CREATE TABLE public.portfolio_snapshots (
  slug TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  courses_completed JSONB NOT NULL DEFAULT '[]',
  skills JSONB NOT NULL DEFAULT '[]',
  certification_goals TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view portfolio by slug"
  ON public.portfolio_snapshots FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own portfolio"
  ON public.portfolio_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio"
  ON public.portfolio_snapshots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio"
  ON public.portfolio_snapshots FOR DELETE
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.portfolio_snapshots IS 'Public portfolio view for sharing with employers; updated by user from dashboard.';
