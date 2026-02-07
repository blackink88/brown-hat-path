-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create subscription_tiers table
CREATE TABLE public.subscription_tiers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  price_zar INTEGER NOT NULL,
  level INTEGER NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier_id UUID REFERENCES public.subscription_tiers(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  level INTEGER NOT NULL DEFAULT 0,
  required_tier_level INTEGER NOT NULL DEFAULT 1,
  thumbnail_url TEXT,
  duration_hours INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create modules table (sections within courses)
CREATE TABLE public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES public.modules(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  content_markdown TEXT,
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_progress table (tracks lesson completion)
CREATE TABLE public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

-- Create skills table (the 8 cyber domains for radar chart)
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  max_level INTEGER NOT NULL DEFAULT 100,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_skills table (tracks skill mastery)
CREATE TABLE public.user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE NOT NULL,
  current_level INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, skill_id)
);

-- Create course_enrollments table
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Security definer function to get user's subscription tier level
CREATE OR REPLACE FUNCTION public.get_user_tier_level(_user_id UUID)
RETURNS INTEGER
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT st.level 
     FROM public.subscriptions s
     JOIN public.subscription_tiers st ON s.tier_id = st.id
     WHERE s.user_id = _user_id 
       AND s.status = 'active'
       AND (s.ends_at IS NULL OR s.ends_at > now())
     ORDER BY st.level DESC
     LIMIT 1),
    0
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_roles (users can only view their own roles)
CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for subscription_tiers (public read)
CREATE POLICY "Anyone can view subscription tiers" ON public.subscription_tiers
  FOR SELECT USING (true);

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- RLS Policies for courses (viewable by authenticated users)
CREATE POLICY "Authenticated users can view courses" ON public.courses
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for modules
CREATE POLICY "Authenticated users can view modules" ON public.modules
  FOR SELECT TO authenticated USING (true);

-- RLS Policies for lessons (gated by subscription tier)
CREATE POLICY "Users can view lessons based on subscription" ON public.lessons
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.modules m
      JOIN public.courses c ON m.course_id = c.id
      WHERE m.id = lessons.module_id
        AND c.required_tier_level <= public.get_user_tier_level(auth.uid())
    )
    OR public.has_role(auth.uid(), 'admin')
  );

-- RLS Policies for user_progress
CREATE POLICY "Users can view own progress" ON public.user_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for skills (public read)
CREATE POLICY "Anyone can view skills" ON public.skills
  FOR SELECT USING (true);

-- RLS Policies for user_skills
CREATE POLICY "Users can view own skills" ON public.user_skills
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own skills" ON public.user_skills
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own skills" ON public.user_skills
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for course_enrollments
CREATE POLICY "Users can view own enrollments" ON public.course_enrollments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves" ON public.course_enrollments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Trigger function to create profile and assign student role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Assign student role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'student');
  
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed subscription tiers
INSERT INTO public.subscription_tiers (name, price_zar, level, features) VALUES
  ('Foundation', 499, 1, '["Level 0: Technical Readiness", "Level 1: Foundations", "Basic Skills Radar", "Community Access"]'::jsonb),
  ('Practitioner', 1500, 2, '["All Foundation features", "Level 2: Core Cyber", "Level 3: Practitioner Core", "Certification Tracking", "Live Q&A"]'::jsonb),
  ('Professional', 3000, 3, '["All Practitioner features", "Level 4: Specialisation", "Level 5: Advanced", "Amajoni Eligibility", "1-on-1 Mentorship"]'::jsonb);

-- Seed the 8 cyber domains for skill radar
INSERT INTO public.skills (name, category, icon) VALUES
  ('Network Security', 'Technical', 'network'),
  ('Threat Analysis', 'Technical', 'shield'),
  ('Incident Response', 'Technical', 'alert'),
  ('Cloud Security', 'Technical', 'cloud'),
  ('GRC & Compliance', 'Governance', 'clipboard'),
  ('Security Operations', 'Technical', 'monitor'),
  ('Penetration Testing', 'Offensive', 'target'),
  ('Cryptography', 'Technical', 'lock');

-- Seed sample courses
INSERT INTO public.courses (code, title, description, level, required_tier_level, duration_hours, order_index) VALUES
  ('BH-BRIDGE', 'Technical Readiness Bridge', 'Build your IT foundation before diving into cybersecurity.', 0, 1, 40, 1),
  ('BH-FOUND-1', 'Cybersecurity Foundations I', 'Core concepts, terminology, and the threat landscape.', 1, 1, 30, 2),
  ('BH-FOUND-2', 'Cybersecurity Foundations II', 'Networking fundamentals and security principles.', 1, 1, 35, 3),
  ('BH-CORE-1', 'Core Cyber: Defense Fundamentals', 'Blue team essentials and defensive strategies.', 2, 2, 45, 4),
  ('BH-CORE-2', 'Core Cyber: Security Operations', 'SIEM, log analysis, and SOC workflows.', 2, 2, 50, 5),
  ('BH-SPEC-SOC', 'SOC Analyst Specialisation', 'Advanced threat hunting and incident handling.', 3, 3, 60, 6);

-- Seed sample modules for BH-FOUND-1
INSERT INTO public.modules (course_id, title, description, order_index)
SELECT 
  c.id,
  m.title,
  m.description,
  m.order_index
FROM public.courses c
CROSS JOIN (
  VALUES 
    ('Introduction to Cybersecurity', 'Understanding the field and career paths', 1),
    ('The Threat Landscape', 'Types of threats, actors, and attack vectors', 2),
    ('Security Fundamentals', 'CIA triad, defense in depth, least privilege', 3),
    ('Hands-On Lab: Your First Security Tools', 'Introduction to essential security tools', 4)
) AS m(title, description, order_index)
WHERE c.code = 'BH-FOUND-1';

-- Seed sample lessons for first module
INSERT INTO public.lessons (module_id, title, description, duration_minutes, order_index)
SELECT 
  m.id,
  l.title,
  l.description,
  l.duration,
  l.order_index
FROM public.modules m
JOIN public.courses c ON m.course_id = c.id
CROSS JOIN (
  VALUES 
    ('Welcome to Cybersecurity', 'Course overview and what you will learn', 10, 1),
    ('What is Cybersecurity?', 'Defining the field and its importance', 15, 2),
    ('Career Paths in Cyber', 'Exploring different roles and specialisations', 20, 3),
    ('The Cybersecurity Mindset', 'Thinking like a defender', 15, 4),
    ('Module Assessment', 'Test your understanding', 10, 5)
) AS l(title, description, duration, order_index)
WHERE c.code = 'BH-FOUND-1' AND m.order_index = 1;