# Course Duration Model

## Summary

- **Lesson `duration_minutes`**: Realistic time for the **content only** (reading/watching). Not a bootcamp—students work **at their own pace**. For lessons that include or suggest lab work, set the number to content-only; labs may take longer and that’s expected.
- **Course `duration_hours`**: Estimated total time to complete the course (content + light practice). Derived from lessons; **lab sessions may add time**. Shown in the dashboard so students can plan; many will finish sooner if they move quickly.

## Formula

- **Content hours** = sum of all lesson `duration_minutes` in the course ÷ 60.
- **Course `duration_hours`** = content hours × **1.25** (to allow for light practice/notes; not a heavy multiplier so students can finish as soon as they’re ready), then:
  - **Minimum** 8 hours per course (so short courses still show a meaningful estimate).
  - **Maximum** 80 hours per course (so no single course dominates the path).

Applied in migration `20260210110000_conservative_course_durations.sql` (run after curriculum migrations).

## Labs and pace

- **Lab sessions** often take extra time; the estimate does not force that in. Students who do full labs may take longer; that’s fine.
- **Own pace**: Some students will complete in less than the estimate (content-only or minimal practice); others will take longer with labs and deeper practice. The estimate is a guide, not a fixed schedule.

## Dashboard

- **My Courses**: Each course shows **"Est. X hours"**, **"at your own pace"**, and optional **"~Y–Z weeks if 5–8 hrs/week"**, with a note that labs may add time.
- If `duration_hours` is null (e.g. course has no lessons yet), the UI shows "—".

## Adjusting lesson times

Set `duration_minutes` to **content-only** (typically 15–30 minutes per lesson). For theory-heavy lessons, use the lower end; for lessons that are mostly “read and try one small exercise,” 20–25 is fine. Don’t inflate for full lab sessions—those are “may add time” by design. Re-run the duration migration after curriculum changes to refresh course totals.
