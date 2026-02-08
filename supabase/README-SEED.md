# Full curriculum seed (Option A)

The file **`seed-full-curriculum.sql`** contains all Brown Hat courses, modules, and lessons with **full lesson content** (markdown) for every level:

- **Level 0:** BH-BRIDGE (Technical Readiness Bridge) — 4 modules, 11 lessons  
- **Level 1:** BH-FOUND-1, BH-FOUND-2 (IT & Cyber Foundations) — 7 modules, 16 lessons  
- **Level 2:** BH-CYBER-2 (Core Cyber) — 3 modules, 6 lessons  
- **Level 3:** BH-OPS-2 (Practitioner Core) — 2 modules, 4 lessons  
- **Level 4:** BH-SPEC-SOC (Specialisation: SOC) — 2 modules, 4 lessons  
- **Level 5:** BH-ADV (Advanced & Leadership) — 2 modules, 4 lessons  

**Warning:** Running this seed **deletes** existing data in `user_progress`, `lessons`, `modules`, `course_enrollments`, and `courses`, then inserts the full curriculum. Subscription tiers, skills, profiles, and auth data are **not** modified.

## How to run the seed

### Option 1: Supabase Dashboard (SQL Editor)

1. Open your project in [Supabase Dashboard](https://app.supabase.com).  
2. Go to **SQL Editor**.  
3. Paste the entire contents of `seed-full-curriculum.sql`.  
4. Click **Run**.

### Option 2: Supabase CLI (local or linked project)

```bash
# From project root, with Supabase CLI installed and linked
psql "$(supabase status -o env | grep DATABASE_URL | cut -d= -f2-)" -f supabase/seed-full-curriculum.sql
```

Or open the Supabase SQL Editor in the dashboard and paste the file contents there.

### Optional: Add example quizzes

1. Apply the **quiz migration** first (creates `quiz_questions`, `quiz_question_options`, `user_quiz_attempts`). In Supabase Dashboard → SQL Editor, run the contents of **`migrations/20260207210000_quiz_tables.sql`** if you haven’t already.
2. Then run **`seed-quiz-example.sql`** in the SQL Editor. This adds quiz questions for the first two lessons of BH-BRIDGE. The course player will show a "Lesson quiz" section for those lessons.

### After running

- **Dashboard → My Courses** will list all 7 courses.  
- **Dashboard → Course player** (`/dashboard/course/bh-bridge`, etc.) will show modules and lessons with full content.  
- Enroll users in courses via `course_enrollments` (or your app’s enrollment flow) so they can track progress.

### If you still don’t see courses

Row Level Security (RLS) only allows **authenticated** users to read `courses` and `modules` by default. If the app still shows an empty curriculum after seeding:

1. **Same project:** Ensure your app’s `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (in `.env`) point to the same Supabase project where you ran the seed.
2. **Allow catalog read for everyone:** In Supabase **SQL Editor**, run:

```sql
CREATE POLICY "Anon can view courses" ON public.courses
  FOR SELECT TO anon USING (true);

CREATE POLICY "Anon can view modules" ON public.modules
  FOR SELECT TO anon USING (true);
```

Then refresh the app. Lessons stay gated by subscription; only the course/module list becomes visible.
