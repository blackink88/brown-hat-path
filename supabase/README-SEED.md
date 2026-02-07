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

### After running

- **Dashboard → My Courses** will list all 7 courses.  
- **Dashboard → Course player** (`/dashboard/course/bh-bridge`, etc.) will show modules and lessons with full content.  
- Enroll users in courses via `course_enrollments` (or your app’s enrollment flow) so they can track progress.
