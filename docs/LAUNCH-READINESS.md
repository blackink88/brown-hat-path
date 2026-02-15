# Launch Readiness Assessment — Enroll Students Quickly

**Goal:** Launch the app so you can enroll students as quickly as possible.

---

## Executive summary

| Area | Status | Notes |
|------|--------|--------|
| Auth & signup | Ready | Enroll page → sign up → profile + student role created |
| Lesson access | Ready | All authenticated users can view lessons (no subscription gate) |
| Course player & progress | Ready | Completion and `user_progress` work |
| Admin: users & subscription | Ready | Grant subscription, change role, enroll user in course |
| My Courses | Ready | Real enrollments and progress; Enroll Now inserts `course_enrollments` |
| Dashboard home | Ready | Continue Learning and Quick Stats from real data |
| Payments | Not in app | Subscription is “granted” by admin; no Stripe/payment flow |
| Curriculum data | Ready | Run `seed-full-curriculum.sql` once in Supabase |

**Verdict:** Two changes are required for a minimal “enroll students quickly” launch: (1) My Courses must use real enrollments and real progress from the database, and (2) “Enroll Now” must create a row in `course_enrollments`. With those, students can sign up, enroll themselves in courses, and see correct progress.

---

## What already works

- **Sign up (Enroll page)**  
  New users get: Supabase Auth account, `profiles` row, `user_roles` = student. No subscription is created (see “New user subscription” below).

- **Login & session**  
  Auth context and protected routes work; dashboard is behind login.

- **Lessons**  
  Migration `20260207220000_lessons_allow_all_authenticated.sql` allows all authenticated users to read lessons. No tier check.

- **Course player**  
  Loads course by code, shows lessons, loads `user_progress`, and “Mark as complete” / sidebar checkbox update `user_progress` correctly.

- **Database & RLS**  
  - `course_enrollments`: users can read own, insert own (self-enroll); admins can read/insert/delete all.  
  - `user_progress`: per-user lesson completion.  
  - Curriculum: courses, modules, lessons; run `supabase/seed-full-curriculum.sql` once.

- **Admin**  
  - Users: list profiles, change role (admin/student), grant subscription (tier).  
  - No UI yet to “enroll user in course” (admin can do it via SQL or we add a small UI later).

---

## Blockers (must fix to enroll students quickly)

### 1. My Courses uses mock data

- **Current:** `enrolledCourseIds = ["BH-BRIDGE", "BH-FOUND-1"]` and `courseProgress` are hardcoded.
- **Effect:** Every student sees the same two “enrolled” courses and fake progress.
- **Fix:**  
  - Fetch current user’s enrollments from `course_enrollments` (join `courses` to get `code`, `title`, etc.).  
  - Compute progress from `user_progress` (e.g. count completed lessons per course) or from course player logic.  
  - Use these for “Enrolled Courses” and “Available Courses” (not enrolled = available).

### 2. “Enroll Now” does nothing

- **Current:** On Available Courses, “Enroll Now” is a `<Button>` with no `onClick` or navigation; it does not insert into `course_enrollments`.
- **Effect:** Students cannot enroll from the UI; only admins could insert enrollments manually (e.g. via SQL).
- **Fix:**  
  - On “Enroll Now”, call Supabase: `insert into course_enrollments (user_id, course_id)` (use `auth.uid()` and course `id`).  
  - Invalidate enrollments query and refresh My Courses so the course moves to “Enrolled” and progress can be tracked.

---

## Recommended before / at launch

1. **Run curriculum seed**  
   In Supabase SQL Editor, run `supabase/seed-full-curriculum.sql` so courses, modules, and lessons exist. See `supabase/README-SEED.md`.

2. **First admin user**  
   Migration `20260208110000_founding_users_as_admin.sql` sets all existing `user_roles` to admin. So: create your account first, run migrations (or run that migration once), then you’re admin and can grant subscriptions / manage users. New users after that get `student` only unless you change role in Admin → Users.

3. **New user subscription** — **Implemented**  
   Migration `20260208120000_new_user_default_subscription.sql` gives new signups a default Professional subscription; lessons are open to all authenticated users anyway. For “enroll quickly” you can:  
   - Keep as-is: students self-enroll in courses; admin grants subscription when you introduce paid tiers later.  
   - Or: change `handle_new_user()` to grant a default tier (e.g. “Starter” or “Professional”) so Profile and any future tier-gated features work without admin step.

4. **Dashboard home** — **Implemented**  
   “Continue Learning” and “Quick Stats” are hardcoded (e.g. BH-BRIDGE, 35%, “12 lessons”). For accuracy, replace with: last-accessed or first-incomplete course from enrollments + real progress, and stats from `user_progress` / enrollments. Not blocking for enrollment.

5. **Admin: enroll user in course** — **Implemented**  
   Admin → Users has an "Enroll in course" button per user; dialog lets you pick a course and insert `course_enrollments`. Duplicate enrollment shows "Already enrolled" toast.

---

## Environment and deployment

- **Supabase:** Set project URL and anon key in `.env` (e.g. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`). Ensure all migrations are applied.
- **Auth:** Email signup with confirmation is on; configure redirect URLs and email templates in Supabase Auth if needed.
- **Deploy:** Build (`npm run build`) and host the static app (e.g. Vercel, Netlify). No server required for the current app.

---

## Checklist: “Enroll students quickly” launch

- [ ] Migrations applied in Supabase (including RLS and `handle_new_user`).
- [ ] Curriculum seed run once (`seed-full-curriculum.sql`).
- [ ] My Courses uses real `course_enrollments` and real progress (see Blockers).
- [ ] “Enroll Now” inserts into `course_enrollments` and refreshes the list (see Blockers).
- [ ] First admin: create account, then run `founding_users_as_admin` if you want that user as admin.
- [ ] Env vars set for production build and Supabase.
- [x] New users get default Professional subscription (migration `20260208120000_new_user_default_subscription.sql`).
- [x] Dashboard home and admin course-enrollment UI implemented.

Students can sign up, get a default subscription, open My Courses, click Enroll Now on any course (or be enrolled by an admin), and see correct enrollments and progress. Dashboard shows real "Continue Learning" and stats.
