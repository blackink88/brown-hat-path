-- Add skills JSONB to courses and modules for "Skills You Will Gain" display
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;

ALTER TABLE public.modules
ADD COLUMN IF NOT EXISTS skills JSONB DEFAULT '[]'::jsonb;

-- Add career_roles to courses for "Career Alignment" mapping
ALTER TABLE public.courses
ADD COLUMN IF NOT EXISTS career_roles JSONB DEFAULT '[]'::jsonb;

-- Create certificates table for digital certificate issuance
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  certificate_type TEXT NOT NULL CHECK (certificate_type IN ('bridge', 'foundations', 'core_cyber', 'specialist')),
  stage_name TEXT NOT NULL,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  learner_name TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, certificate_type)
);

-- Enable RLS on certificates
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS policies for certificates
CREATE POLICY "Users can view own certificates"
  ON public.certificates
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own certificates"
  ON public.certificates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can verify certificates by number"
  ON public.certificates
  FOR SELECT
  USING (true);

-- Create stage_requirements table for progression gatekeeping
CREATE TABLE IF NOT EXISTS public.stage_requirements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  stage_key TEXT NOT NULL UNIQUE,
  stage_name TEXT NOT NULL,
  stage_level INTEGER NOT NULL,
  required_courses TEXT[] DEFAULT '{}',
  min_assessment_score INTEGER NOT NULL DEFAULT 70,
  prerequisite_stage TEXT,
  career_roles JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stage_requirements
ALTER TABLE public.stage_requirements ENABLE ROW LEVEL SECURITY;

-- Anyone can view stage requirements
CREATE POLICY "Anyone can view stage requirements"
  ON public.stage_requirements
  FOR SELECT
  USING (true);

-- Admins can manage stage requirements
CREATE POLICY "Admins can insert stage requirements"
  ON public.stage_requirements
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update stage requirements"
  ON public.stage_requirements
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete stage requirements"
  ON public.stage_requirements
  FOR DELETE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Insert default stage requirements with career roles
INSERT INTO public.stage_requirements (stage_key, stage_name, stage_level, required_courses, min_assessment_score, prerequisite_stage, career_roles)
VALUES
  ('bridge', 'Bridge', 0, ARRAY['BH-BRIDGE'], 70, NULL, '["IT Support Technician", "Help Desk Analyst"]'::jsonb),
  ('foundations', 'Foundations', 1, ARRAY['BH-101', 'BH-102'], 70, 'bridge', '["Junior Security Analyst", "IT Security Administrator"]'::jsonb),
  ('core_cyber', 'Core Cyber', 2, ARRAY['BH-201', 'BH-202', 'BH-203'], 70, 'foundations', '["Junior SOC Analyst", "GRC Analyst (Entry-level)", "IAM Administrator (Junior)"]'::jsonb),
  ('specialist', 'Specialist Tracks', 3, ARRAY['BH-301', 'BH-302'], 70, 'core_cyber', '["SOC Analyst", "Security Engineer", "Penetration Tester (Junior)", "Cloud Security Analyst"]'::jsonb)
ON CONFLICT (stage_key) DO NOTHING;

-- Create user_stage_completions table to track stage completion status
CREATE TABLE IF NOT EXISTS public.user_stage_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  stage_key TEXT NOT NULL REFERENCES public.stage_requirements(stage_key),
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  average_score INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, stage_key)
);

-- Enable RLS on user_stage_completions
ALTER TABLE public.user_stage_completions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_stage_completions
CREATE POLICY "Users can view own stage completions"
  ON public.user_stage_completions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stage completions"
  ON public.user_stage_completions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stage completions"
  ON public.user_stage_completions
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all stage completions"
  ON public.user_stage_completions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));