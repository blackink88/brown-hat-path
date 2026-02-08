# Text-first teaching and in-lesson quizzes – suggestion

## Current state

- **Lessons** have both `video_url` and `content_markdown`. The course player shows a **video area** first (or “Video coming soon” if empty), then **Lesson Notes** (markdown) in a tabbed panel below.
- **Progress** is tracked per lesson via `user_progress` (completed checkbox); there is **no quiz system** yet.

---

## 1. Text-first teaching (no video)

**Goal:** Use only text (markdown) for teaching. No video dependency.

**Options:**

| Option | What changes | Pros / cons |
|--------|----------------|-------------|
| **A. Text-primary layout** | Make the main content area show **lesson notes (markdown)** as the primary block. Remove or collapse the video block so it’s not the focus (e.g. one small “Optional video” link if `video_url` exists, or hide it entirely). | Clear text-first experience; video can be added later without changing flow. |
| **B. Text-only layout** | Same as A but never show video UI at all. Treat `video_url` as unused for now. | Simplest; no “Video coming soon” or empty states. |
| **C. Keep schema, UI only** | No DB change. In the app: show a single column with title → description → full markdown content (no video section). Optional: keep `video_url` in DB for future use. | Fast to implement; schema stays flexible. |

**Recommendation:** **C** (or A with video hidden by default). Lesson content is already in `content_markdown` in the seed; we only change the course player so the **main area is the lesson text**, with no (or minimal) video emphasis.

---

## 2. Quizzes in relevant lessons

**Goal:** Add quizzes to selected lessons so students can check understanding before moving on (and optionally to “unlock” completion).

### 2.1 Data model (new tables)

- **`lesson_quizzes`** (optional wrapper; could be skipped)
  - Or: quizzes are “attached” to a lesson by having questions that reference that lesson.

- **`quiz_questions`**
  - `id`, `lesson_id` (FK → lessons), `question_text`, `question_type` (`multiple_choice` | `true_false`), `order_index`.
  - One lesson can have 0 or more questions.

- **`quiz_question_options`**
  - `id`, `question_id` (FK → quiz_questions), `option_text`, `is_correct` (boolean), `order_index`.
  - For multiple choice: 2–6 options; one or more can be correct (e.g. “select all that apply” later).

- **`user_quiz_attempts`** (or `user_lesson_quiz_scores`)
  - `user_id`, `lesson_id`, `score_percent`, `passed` (e.g. ≥ 70%), `completed_at`, optionally `attempt_number`.
  - Enables “best attempt” or “must pass once” and analytics.

**Recommendation:** Start with **`quiz_questions`** and **`quiz_question_options`** only; add **`user_quiz_attempts`** when you want to store results and optionally gate completion on passing.

### 2.2 Where quizzes appear

- **Per lesson:** After the lesson content (markdown), show a section **“Lesson quiz”** with N questions. Submit → show score and which answers were wrong (with correct answers).
- **Optional:** “Pass threshold” (e.g. 70%) to mark the lesson complete or to unlock the next lesson (then we’d use `user_quiz_attempts` and possibly tie it to `user_progress`).

### 2.3 Question types (MVP)

- **Multiple choice (single answer):** One correct option per question; simple to author and grade.
- **True/false:** Two options; one correct.  
Later: multiple correct (checkboxes), short answer, or ordering.

### 2.4 Authoring quizzes

- **Option 1 – Seed (SQL):** Add INSERTs for `quiz_questions` and `quiz_question_options` for chosen lessons (e.g. 3–5 questions per lesson for 2–3 lessons to start). Good for a fixed curriculum.
- **Option 2 – Admin UI later:** Build a simple “Edit lesson → Add quiz questions” screen that writes to these tables. Can come after MVP.

**Recommendation:** Start with **Option 1** (seed) for 1–2 lessons (e.g. first lesson of BH-BRIDGE) so the flow is end-to-end; then add more lessons and, if needed, an admin UI.

### 2.5 UX flow in the course player

1. Student reads the **lesson text** (markdown) as the main content.
2. Below the content, a **“Lesson quiz”** block appears (if that lesson has questions).
3. Student answers questions and clicks **Submit**.
4. Show **score** (e.g. “3/5 – 60%”) and **feedback**: which questions were wrong and what the correct answer(s) are.
5. **Optional:** “Retry” to attempt again; optionally only mark lesson complete when quiz is passed (e.g. ≥ 70%), and/or store best attempt in `user_quiz_attempts`.

---

## 3. Suggested implementation order

| Step | What | Outcome |
|------|------|--------|
| 1 | **Text-first UI** | Course player: main area = lesson title + description + full markdown; no (or minimal) video block. |
| 2 | **Quiz schema** | Migration: `quiz_questions`, `quiz_question_options`; optionally `user_quiz_attempts`. |
| 3 | **Seed a few quizzes** | e.g. 3–5 MC questions for 1–2 lessons in `seed-full-curriculum.sql` (or a small `seed-quiz-example.sql`). |
| 4 | **Quiz UI in CoursePlayer** | “Lesson quiz” section below content; render questions, submit, show score and correct answers. |
| 5 | **(Optional)** | Save attempts to `user_quiz_attempts`; optionally require pass to mark lesson complete. |

If you confirm this direction (text-first + quizzes as above), next step is to implement in this order: (1) text-first layout, (2) migration + seed for quizzes, (3) quiz block in the course player.
