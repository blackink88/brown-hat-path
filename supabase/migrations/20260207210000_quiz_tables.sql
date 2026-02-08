-- Quiz tables for in-lesson quizzes (text-first teaching)
-- quiz_questions: one per lesson (or more), multiple_choice / true_false
-- quiz_question_options: options per question, one is_correct
-- user_quiz_attempts: store score and pass per user/lesson (optional gating)

CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false')),
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.quiz_question_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES public.quiz_questions(id) ON DELETE CASCADE NOT NULL,
  option_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT false,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.user_quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  score_percent INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_questions_lesson ON public.quiz_questions(lesson_id);
CREATE INDEX idx_user_quiz_attempts_user_lesson ON public.user_quiz_attempts(user_id, lesson_id);

-- RLS
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_question_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions" ON public.quiz_questions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view quiz options" ON public.quiz_question_options
  FOR SELECT USING (true);

CREATE POLICY "Users can view own quiz attempts" ON public.user_quiz_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" ON public.user_quiz_attempts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
