-- Admin RLS: allow admins to manage content and users

-- Courses: admin full access
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Modules: admin full access
CREATE POLICY "Admins can insert modules" ON public.modules FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update modules" ON public.modules FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete modules" ON public.modules FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Lessons: admin full access
CREATE POLICY "Admins can insert lessons" ON public.lessons FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update lessons" ON public.lessons FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete lessons" ON public.lessons FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Quiz questions: admin full access
CREATE POLICY "Admins can insert quiz_questions" ON public.quiz_questions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quiz_questions" ON public.quiz_questions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quiz_questions" ON public.quiz_questions FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Quiz question options: admin full access
CREATE POLICY "Admins can insert quiz_options" ON public.quiz_question_options FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update quiz_options" ON public.quiz_question_options FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete quiz_options" ON public.quiz_question_options FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Profiles: admin can read all (for user list)
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User roles: admin can read all and manage
CREATE POLICY "Admins can view all user_roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert user_roles" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user_roles" ON public.user_roles FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete user_roles" ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Subscriptions: admin can read all and manage
CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert subscriptions" ON public.subscriptions FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update subscriptions" ON public.subscriptions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Course enrollments: admin can read all and manage
CREATE POLICY "Admins can view all enrollments" ON public.course_enrollments FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert enrollments" ON public.course_enrollments FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete enrollments" ON public.course_enrollments FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User progress: admin can read all (for support)
CREATE POLICY "Admins can view all user_progress" ON public.user_progress FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Make all existing users admins (founding users)
UPDATE public.user_roles
SET role = 'admin'
WHERE role = 'student';