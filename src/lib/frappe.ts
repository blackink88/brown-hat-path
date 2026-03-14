/**
 * Frappe LMS API client — Brown Hat Academy
 * ──────────────────────────────────────────
 * Site: lms-dzr-tbs.c.frappe.cloud
 *
 * Architecture:
 *   Frappe LMS  → ALL student data: courses, lessons, quizzes, enrollment,
 *                  progress, submissions (BH Submission), certificates
 *   Proxy       → Deno Deploy frappe-proxy (VITE_PROXY_URL) for authenticated actions
 *
 * Public endpoints (no auth needed — published courses):
 *   /api/method/lms.lms.utils.get_courses
 *   /api/method/lms.lms.utils.get_course_details
 *   /api/method/lms.lms.utils.get_course_outline
 *   /api/method/lms.lms.utils.get_lesson
 *
 * Authenticated endpoints (proxied via VITE_PROXY_URL):
 *   mark-complete, enroll, progress, submit-quiz,
 *   submit-capstone, submit-practical, get-submissions,
 *   get-certificates, issue-certificate, upload-file
 */

const FRAPPE_URL = (import.meta.env.VITE_FRAPPE_URL as string) ?? "https://lms-dzr-tbs.c.frappe.cloud";

// ─── Frappe SSO helper ────────────────────────────────────────────────────────
// Silently establishes a Frappe session cookie using credentials stored in
// sessionStorage by AuthContext during login/signup, then redirects to the LMS.
// The no-cors fetch bypasses CORS; Set-Cookie in the opaque response is still
// stored by the browser, giving the user a seamless single sign-on experience.

export async function redirectToLMS() {
  try {
    const raw  = sessionStorage.getItem("bh_sso_cred");
    const cred = raw ? (JSON.parse(raw) as { email?: string; password?: string }) : {};
    if (cred.email && cred.password) {
      await fetch(`${FRAPPE_URL}/api/method/login`, {
        method:      "POST",
        mode:        "no-cors",
        credentials: "include",
        body:        new URLSearchParams({ usr: cred.email, pwd: cred.password }),
      });
    }
  } catch { /* silent — navigate anyway; Frappe will prompt login if session missing */ }
  window.location.href = `${FRAPPE_URL}/lms`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FrappeCourse {
  name: string;               // Frappe doc name / slug
  title: string;
  short_introduction: string;
  description: string;        // HTML
  image: string | null;
  published: boolean;
  upcoming: boolean;
  paid_course: boolean;
  course_price: number | null;
  featured: boolean;
  lessons: number;            // total lesson count
  enrollments: number;
  rating: number | null;
  instructors: FrappeInstructor[];
  membership: FrappeMembership | null;  // null if not enrolled / not authenticated
  // custom fields (set when you added them in Frappe admin):
  custom_course_code?: string;
  custom_level?: number;
  custom_duration_hours?: number;
  custom_required_tier_level?: number;
  custom_aligned_certifications?: string;
  custom_track?: string;
}

export interface FrappeInstructor {
  name: string;       // user email
  username: string;
  full_name: string;
  user_image: string | null;
  first_name: string;
}

export interface FrappeMembership {
  name: string;
  progress: number;           // 0-100 percentage
  current_lesson: string;     // e.g. "1-3" (chapter_idx-lesson_idx)
  purchased_certificate: boolean;
  certificate: string | null;
}

/** LMS Enrollment doc returned by the `progress` proxy action */
export interface FrappeEnrollment {
  name: string;
  course: string;
  member: string;
  progress: number;           // 0-100 percentage
  current_lesson: string | null;
}

/** BH Submission doc for capstone and practical submissions */
export interface BHSubmission {
  name: string;
  course: string;
  lesson: string | null;
  member: string;
  submission_type: "Capstone" | "Practical";
  content: string | null;
  file_url: string | null;
  status: "Submitted" | "Under Review" | "Graded" | "Resubmit Required";
  grade: number | null;
  feedback: string | null;
  submitted_at: string | null;
}

/** LMS Certificate doc */
export interface FrappeCertificate {
  name: string;
  course: string;
  course_title: string;
  member: string;
  issue_date: string;
  expiry_date: string | null;
  published: boolean;
}

export interface FrappeChapter {
  name: string;
  title: string;
  idx: number;                // 1-based chapter order
  lessons: FrappeChapterLesson[];
}

export interface FrappeChapterLesson {
  name: string;               // Frappe lesson doc name
  title: string;
  idx: number;                // 1-based lesson order within chapter
  number: string;             // "chapter_idx-lesson_idx" e.g. "2-3"
  include_in_preview: boolean;
}

export interface FrappeCourseDetail extends FrappeCourse {
  chapters: FrappeChapter[];
}

export interface FrappeLesson {
  name: string;
  title: string;
  body: string;               // HTML content (the main lesson text)
  content: unknown;           // structured JSON content blocks (optional)
  youtube: string;            // YouTube video URL or ID
  quiz_id: string | null;     // linked LMS Quiz doc name
  chapter: string;
  course: string;
  number: string;             // "chapter_idx-lesson_idx"
  neighbours: {
    next: string | null;      // next lesson number
    prev: string | null;      // prev lesson number
  };
  progress: {
    is_complete: boolean;
    status: "Complete" | "Incomplete" | null;
  } | null;
  membership: FrappeMembership | null;
  is_scorm_package: boolean;
  // custom fields:
  custom_duration_minutes?: number;
  custom_exam_alignment?: string;
}

export interface FrappeQuizQuestion {
  name: string;
  question: string;
  type: "Choices" | "User Input" | "Open Ended";
  multiple: boolean;          // true = multiple correct answers
  // Options are stored as flat fields (not an array)
  option_1: string;
  option_2: string;
  option_3: string;
  option_4: string;
  is_correct_1: boolean;
  is_correct_2: boolean;
  is_correct_3: boolean;
  is_correct_4: boolean;
}

export interface FrappeQuiz {
  name: string;
  title: string;
  passing_percentage: number;
  max_attempts: number;
  show_answers: boolean;
  duration: number | null;    // minutes
  questions: FrappeQuizQuestion[];
}

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function frappeGet<T>(
  method: string,
  params: Record<string, string | number> = {}
): Promise<T> {
  const url = new URL(`${FRAPPE_URL}/api/method/${method}`);
  Object.entries(params).forEach(([k, v]) =>
    url.searchParams.set(k, String(v))
  );

  const res = await fetch(url.toString(), {
    method: "GET",
    credentials: "omit",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Frappe API ${res.status}: ${text.slice(0, 300)}`);
  }

  const json = await res.json();
  // Frappe wraps the actual response in `message`
  return (json.message ?? json.data ?? json) as T;
}

// ─── Course API (public — no auth required) ───────────────────────────────────

/**
 * List all published courses.
 * Returns courses enriched with enrollment membership if the user
 * happens to have a Frappe session cookie (not required for us since we proxy auth).
 */
export async function getCourses(): Promise<FrappeCourse[]> {
  return frappeGet<FrappeCourse[]>("lms.lms.utils.get_courses");
}

/**
 * Full course detail including chapters, instructors, membership.
 * @param course — Frappe course doc name / slug
 */
export async function getCourseDetails(course: string): Promise<FrappeCourseDetail> {
  return frappeGet<FrappeCourseDetail>("lms.lms.utils.get_course_details", { course });
}

/**
 * Course outline — chapters and lesson list (no full lesson body).
 * Use this to build the curriculum sidebar.
 * @param course — Frappe course doc name / slug
 * @param progress — pass 1 to include is_complete flag per lesson
 */
export async function getCourseOutline(
  course: string,
  progress = false
): Promise<FrappeChapter[]> {
  const result = await frappeGet<{ chapters: FrappeChapter[] }>(
    "lms.lms.utils.get_course_outline",
    { course, progress: progress ? 1 : 0 }
  );
  return result.chapters ?? (result as unknown as FrappeChapter[]);
}

/**
 * Fetch a single lesson's full content.
 * @param course  — Frappe course slug
 * @param chapter — 1-based chapter index
 * @param lesson  — 1-based lesson index within the chapter
 */
export async function getLesson(
  course: string,
  chapter: number,
  lesson: number
): Promise<FrappeLesson> {
  return frappeGet<FrappeLesson>("lms.lms.utils.get_lesson", {
    course,
    chapter,
    lesson,
  });
}

// ─── Quiz API (public for reading) ───────────────────────────────────────────

/**
 * Fetch a quiz's questions and options.
 * Called when the lesson has a quiz_id.
 */
export async function getQuiz(quiz: string): Promise<FrappeQuiz> {
  // Quiz data is on the LMS Quiz resource directly
  const res = await fetch(
    `${FRAPPE_URL}/api/resource/LMS Quiz/${encodeURIComponent(quiz)}`,
    { headers: { Accept: "application/json" } }
  );
  if (!res.ok) throw new Error(`Failed to load quiz: ${res.status}`);
  const json = await res.json();
  return json.data as FrappeQuiz;
}

/**
 * Convert Frappe's flat option fields to an array for easier rendering.
 */
export function getQuestionOptions(q: FrappeQuizQuestion) {
  const options: Array<{ text: string; isCorrect: boolean; idx: number }> = [];
  (["1", "2", "3", "4"] as const).forEach((n) => {
    const text = q[`option_${n}` as keyof FrappeQuizQuestion] as string;
    if (text) {
      options.push({
        text,
        isCorrect: q[`is_correct_${n}` as keyof FrappeQuizQuestion] as boolean,
        idx: Number(n),
      });
    }
  });
  return options;
}

// ─── Authenticated calls (proxied via Deno Deploy frappe-proxy) ───────────────

const PROXY_URL = import.meta.env.VITE_PROXY_URL as string;

async function proxyPost(
  action: string,
  body: Record<string, unknown>,
  accessToken: string
) {
  const res = await fetch(`${PROXY_URL}?action=${action}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Frappe proxy error");
  }
  return res.json();
}

async function proxyGet(
  action: string,
  params: Record<string, string>,
  accessToken: string
) {
  const qs = new URLSearchParams({ action, ...params }).toString();
  const res = await fetch(`${PROXY_URL}?${qs}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Frappe proxy error");
  }
  return res.json();
}

/**
 * Mark a lesson as complete in Frappe.
 * chapter_number and lesson_number are 1-based indices.
 */
export async function markLessonProgress(
  course: string,
  chapterNumber: number,
  lessonNumber: number,
  accessToken: string
): Promise<number> {
  // Returns the new course completion percentage
  const data = await proxyPost(
    "mark-complete",
    { course, chapter_number: chapterNumber, lesson_number: lessonNumber },
    accessToken
  );
  return data.percentage ?? 0;
}

/**
 * Get enrollment + progress info for a course.
 * Returns null if not enrolled.
 */
export async function getMembership(
  course: string,
  accessToken: string
): Promise<FrappeMembership | null> {
  const data = await proxyGet("progress", { course }, accessToken);
  return data?.enrollment ?? null;
}

/**
 * Get enrollment + progress for a course (typed alias for getMembership).
 * Returns null if not enrolled.
 */
export async function getEnrollment(
  course: string,
  accessToken: string
): Promise<FrappeEnrollment | null> {
  const data = await proxyGet("progress", { course }, accessToken);
  return data?.enrollment ?? null;
}

/**
 * Enroll the authenticated user in a Frappe course.
 * Idempotent — returns silently if already enrolled.
 */
export async function enrollInCourse(
  course: string,
  accessToken: string
): Promise<void> {
  await proxyPost("enroll", { course }, accessToken);
}

/**
 * Submit a quiz attempt.
 * results: Array of { question: string (doc name), selected_option: number (1-4) }
 */
export async function submitQuiz(
  quiz: string,
  results: Array<{ question: string; selected_option: number }>,
  accessToken: string
): Promise<{ score: number; passed: boolean }> {
  return proxyPost("submit-quiz", { quiz, results }, accessToken);
}

/**
 * Get upcoming live classes, optionally filtered by course.
 */
export async function getLiveClasses(
  course?: string,
  accessToken?: string
): Promise<Array<{
  name: string;
  title: string;
  date: string;
  time: string;
  duration: number;
  meeting_link: string;
  course: string;
}>> {
  if (accessToken) {
    return proxyGet("live-classes", course ? { course } : {}, accessToken);
  }
  return [];
}

/**
 * List all LMS Enrollments for the current user across all courses.
 * Used by MyCourses to determine enrollment status and progress per course.
 */
export async function listEnrollments(
  accessToken: string
): Promise<FrappeEnrollment[]> {
  const data = await proxyGet("list-enrollments", {}, accessToken);
  return data?.enrollments ?? [];
}

/**
 * Upload a file to Frappe (capstone PDF, etc.).
 * Returns the public file_url to store on the BH Submission doc.
 */
export async function uploadFileFrappe(
  file: File,
  accessToken: string
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file, file.name);
  formData.append("is_private", "0");

  const res = await fetch(`${PROXY_URL}?action=upload-file`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    // Do NOT set Content-Type — browser sets it with the boundary
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "File upload failed");
  }

  const json = await res.json();
  // Frappe returns { message: { file_url: "/files/...", ... } }
  const fileUrl: string = json?.message?.file_url ?? json?.file_url ?? "";
  if (!fileUrl) throw new Error("No file_url in Frappe upload response");
  return fileUrl;
}

/**
 * Submit a capstone assignment (PDF file upload).
 * Call uploadFileFrappe first to get the file_url, then call this.
 */
export async function submitCapstone(
  params: { course: string; lesson?: string; file_url: string },
  accessToken: string
): Promise<BHSubmission> {
  return proxyPost("submit-capstone", params, accessToken);
}

/**
 * Submit a practical exercise (written response).
 */
export async function submitPractical(
  params: { course: string; lesson?: string; content: string },
  accessToken: string
): Promise<BHSubmission> {
  return proxyPost("submit-practical", params, accessToken);
}

/**
 * List all BH Submission docs for the current user.
 * Optionally filtered by course.
 */
export async function getSubmissions(
  accessToken: string,
  course?: string
): Promise<BHSubmission[]> {
  const params: Record<string, string> = {};
  if (course) params.course = course;
  const data = await proxyGet("get-submissions", params, accessToken);
  return data?.submissions ?? [];
}

/**
 * List all LMS Certificates for the current user.
 */
export async function getCertificates(
  accessToken: string
): Promise<FrappeCertificate[]> {
  const data = await proxyGet("get-certificates", {}, accessToken);
  return data?.certificates ?? [];
}

/**
 * Issue a certificate for a completed course.
 * Idempotent — returns existing certificate if already issued.
 */
export async function issueCertificate(
  course: string,
  accessToken: string
): Promise<FrappeCertificate> {
  return proxyPost("issue-certificate", { course }, accessToken);
}

// ─── React Query keys ─────────────────────────────────────────────────────────

export const frappeKeys = {
  courses: () => ["frappe", "courses"] as const,
  courseDetails: (slug: string) => ["frappe", "course-details", slug] as const,
  courseOutline: (slug: string) => ["frappe", "outline", slug] as const,
  lesson: (slug: string, ch: number, ls: number) =>
    ["frappe", "lesson", slug, ch, ls] as const,
  quiz: (name: string) => ["frappe", "quiz", name] as const,
  membership: (slug: string) => ["frappe", "membership", slug] as const,
  enrollment: (slug: string) => ["frappe", "enrollment", slug] as const,
  enrollments: () => ["frappe", "enrollments"] as const,
  liveClasses: (course?: string) =>
    ["frappe", "live-classes", course ?? "all"] as const,
  submissions: (course?: string) =>
    ["frappe", "submissions", course ?? "all"] as const,
  certificates: () => ["frappe", "certificates"] as const,
};
