-- Quiz tables for lesson quizzes

-- Quiz questions table
CREATE TABLE public.quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz question options table
CREATE TABLE public.quiz_question_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- User quiz attempts table
CREATE TABLE public.user_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 0,
  passed BOOLEAN NOT NULL DEFAULT false,
  attempted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Quiz questions: readable by authenticated users with subscription access (same as lessons)
CREATE POLICY "Users can view quiz questions based on subscription"
  ON public.quiz_questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.lessons l
      JOIN public.modules m ON l.module_id = m.id
      JOIN public.courses c ON m.course_id = c.id
      WHERE l.id = quiz_questions.lesson_id
        AND c.required_tier_level <= get_user_tier_level(auth.uid())
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- Quiz options: readable if user can read the question
CREATE POLICY "Users can view quiz options based on subscription"
  ON public.quiz_question_options FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_questions q
      JOIN public.lessons l ON q.lesson_id = l.id
      JOIN public.modules m ON l.module_id = m.id
      JOIN public.courses c ON m.course_id = c.id
      WHERE q.id = quiz_question_options.question_id
        AND c.required_tier_level <= get_user_tier_level(auth.uid())
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  );

-- User quiz attempts: users can view and insert their own
CREATE POLICY "Users can view own quiz attempts"
  ON public.user_quiz_attempts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON public.user_quiz_attempts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_quiz_questions_lesson ON public.quiz_questions(lesson_id);
CREATE INDEX idx_quiz_options_question ON public.quiz_question_options(question_id);
CREATE INDEX idx_user_quiz_attempts_user ON public.user_quiz_attempts(user_id);
CREATE INDEX idx_user_quiz_attempts_lesson ON public.user_quiz_attempts(lesson_id);