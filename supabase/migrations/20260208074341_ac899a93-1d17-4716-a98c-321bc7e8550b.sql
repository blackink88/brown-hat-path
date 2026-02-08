-- Portfolio snapshots: stores public portfolio data for sharing with employers
CREATE TABLE public.portfolio_snapshots (
  slug TEXT PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT NOT NULL,
  courses_completed JSONB DEFAULT '[]'::jsonb,
  skills JSONB DEFAULT '[]'::jsonb,
  certification_goals JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_snapshots ENABLE ROW LEVEL SECURITY;

-- Users can manage their own snapshots
CREATE POLICY "Users can view own portfolio snapshots"
  ON public.portfolio_snapshots FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own portfolio snapshots"
  ON public.portfolio_snapshots FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own portfolio snapshots"
  ON public.portfolio_snapshots FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own portfolio snapshots"
  ON public.portfolio_snapshots FOR DELETE
  USING (auth.uid() = user_id);

-- Public can view any portfolio by slug (for sharing)
CREATE POLICY "Anyone can view portfolio by slug"
  ON public.portfolio_snapshots FOR SELECT
  USING (true);

-- Index for user lookups
CREATE INDEX idx_portfolio_snapshots_user_id ON public.portfolio_snapshots(user_id);

-- User certification goals: tracks which certifications users are working toward
CREATE TABLE public.user_certification_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  certification_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, certification_slug)
);

-- Enable RLS
ALTER TABLE public.user_certification_goals ENABLE ROW LEVEL SECURITY;

-- Users can manage their own goals
CREATE POLICY "Users can view own certification goals"
  ON public.user_certification_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certification goals"
  ON public.user_certification_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own certification goals"
  ON public.user_certification_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Index for user lookups
CREATE INDEX idx_user_certification_goals_user_id ON public.user_certification_goals(user_id);