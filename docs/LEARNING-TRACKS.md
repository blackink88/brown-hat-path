# Learning Path Tracks — Current State & Future Flow

## What the UI shows

- **Practitioner Core (Level 3):** Two tracks — **Track A: Cyber Operations** (Blue Team) and **Track B: GRC** (Governance, Risk & Compliance). Students are expected to choose one.
- **Specialisation (Level 4):** Multiple tracks (e.g. SOC & IR, IAM, Cloud Security, Offensive Security, Vuln Management, Advanced GRC). The intent is one specialist track per student.

## Current implementation

### Enrollment

- **One course at a time:** A student may only have one **incomplete** enrollment. They must complete a course to 100% before enrolling in another (`MyCourses`, DB trigger in `20260209120000_one_course_at_a_time.sql`).
- **No track field:** There is no `practitioner_track` or `specialisation_track` on `profiles` or `course_enrollments`. The app does not record “Blue Team vs GRC” or “SOC vs IAM”.
- **Linear course list:** Enrollment is by **course** (e.g. BH-OPS-2, BH-SPEC-SOC). The seed defines a single path: Bridge → Foundations 1 & 2 → Core Cyber → Practitioner (OPS) → Specialisation (SOC) → Advanced.

### Content (seed)

- **Practitioner:** Only **BH-OPS-2** (“Practitioner Core: Cyber Operations”) exists. There is no separate **BH-GRC-2** course in the seed.
- **Specialisation:** Only **BH-SPEC-SOC** exists. There are no BH-SPEC-IAM, BH-SPEC-CLOUD, BH-SPEC-GRC, etc., in the seed.

So today:

- Students do **not** choose a practitioner or specialisation “track” at enrollment.
- They enroll in **courses** in sequence; the only practitioner course is OPS, and the only spec course is SOC.
- There is **no** “enroll in one track only” or “block multiple tracks” logic — the constraint is “one course at a time”, not “one track per level”.

## What would be needed for track-based flow

1. **Track choice at Practitioner**
   - Add a way for the student to choose **Practitioner track** (e.g. Blue Team vs GRC) before or when enrolling in Level 3.
   - Store it (e.g. `profiles.practitioner_track` or a dedicated table).
   - Add **BH-GRC-2** (and any other practitioner tracks) to the seed with track-specific modules/lessons.
   - In My Courses / enrollment UI: only offer the course that matches the chosen practitioner track (or offer both and enforce “already chose track” so they can’t add the other).

2. **One track per level / no double-specialisation**
   - For Specialisation: store chosen spec track (e.g. `profiles.specialisation_track`: SOC | IAM | CLOUD | GRC | …).
   - Add courses (or course variants) per track (BH-SPEC-IAM, BH-SPEC-CLOUD, etc.) and seed content.
   - Enforce in app + optional DB constraint: at most one specialisation course enrollment (or at most one “specialisation track” per user).
   - Show only the course(s) for the chosen track when enrolling at Level 4.

3. **Relevant content per track**
   - Each track (Practitioner and Specialisation) needs its own **courses** and **modules/lessons** in the DB (or a clear mapping course_id → track). The current seed only has content for OPS (practitioner) and SOC (spec); GRC and other spec tracks need to be added when you want that content live.

## Summary

| Question | Answer |
|----------|--------|
| Icons instead of emojis for Practitioner tracks? | Done: Track A uses Shield, Track B uses FileCheck (see Learning Path page). |
| Logical flow to enroll in **one** track (and not multiple) for Practitioner / Specialisation? | **Implemented.** Migration `20260209150000_learning_tracks.sql` adds `profiles.practitioner_track` and `profiles.specialisation_track`; `courses.track`; and BH-GRC-2 plus placeholder spec courses (IAM, Cloud, GRC). My Courses: when enrolling in Level 3 or 4, the user must choose a track (via `TrackPickerDialog`); profile is updated and they can only enroll in the course for that track. Once set, only the matching course is shown. |
| Relevant content for each track? | Practitioner OPS and SOC have full content; BH-GRC-2 and placeholder spec courses (IAM, Cloud, GRC) have one placeholder module/lesson each. Content can be expanded in seed or via admin. |
