-- Allow anonymous (and unauthenticated) users to read courses and modules
-- so the curriculum catalog is visible in the app. Lessons remain gated by subscription tier.

CREATE POLICY "Anon can view courses" ON public.courses
  FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can view modules" ON public.modules
  FOR SELECT TO anon USING (true);
