/**
 * Frappe LMS Proxy — Supabase Edge Function (JWT-only, no Supabase auth)
 * ─────────────────────────────────────────────────────────────────────
 * Site: lms-dzr-tbs.c.frappe.cloud
 *
 * This function is the sole backend for the Brown Hat Academy React app.
 * Authentication: proxy-issued JWTs (HMAC-SHA256, no Supabase dependency).
 *
 * PUBLIC actions (no Authorization header required):
 *   POST  ?action=register    { email, password, full_name }
 *   POST  ?action=login       { email, password }
 *   GET   ?action=tiers       → list BH Subscription Tier docs
 *   POST  ?action=forgot-password  { email } → triggers Frappe reset email
 *
 * AUTHENTICATED actions (Authorization: Bearer <jwt> required):
 *   POST  ?action=mark-complete      { course, chapter_number, lesson_number }
 *   POST  ?action=enroll             { course }
 *   POST  ?action=submit-quiz        { quiz, results }
 *   POST  ?action=submit-capstone    { course, lesson?, file_url }
 *   POST  ?action=submit-practical   { course, lesson?, content }
 *   POST  ?action=issue-certificate  { course }
 *   POST  ?action=upload-file        (multipart/form-data)
 *   POST  ?action=activate-subscription  { tier_name, paystack_reference, paystack_subscription_code?, amount_paid }
 *   POST  ?action=cancel-subscription
 *   POST  ?action=change-password    { new_password }
 *   GET   ?action=progress           ?course=xxx
 *   GET   ?action=list-enrollments
 *   GET   ?action=get-submissions    ?course=xxx (optional)
 *   GET   ?action=get-certificates
 *   GET   ?action=my-subscription
 *
 * Required secrets (set in Supabase Dashboard → Edge Functions → frappe-proxy):
 *   FRAPPE_URL           https://lms-dzr-tbs.c.frappe.cloud
 *   FRAPPE_API_KEY       Frappe admin API key
 *   FRAPPE_API_SECRET    Frappe admin API secret
 *   PROXY_JWT_SECRET     ≥32-character random string for signing JWTs
 */

const FRAPPE_URL       = Deno.env.get("FRAPPE_URL")       ?? "https://lms-dzr-tbs.c.frappe.cloud";
const FRAPPE_API_KEY   = Deno.env.get("FRAPPE_API_KEY")   ?? "";
const FRAPPE_API_SECRET = Deno.env.get("FRAPPE_API_SECRET") ?? "";
const JWT_SECRET       = Deno.env.get("PROXY_JWT_SECRET") ?? "change-me-in-production-32chars!!";

const JWT_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 days

const corsHeaders = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ── JSON response helper ───────────────────────────────────────────────────────

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// ── JWT (HS256) — pure Web Crypto API, no external deps ───────────────────────

function b64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function ab2b64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  bytes.forEach((b) => { binary += String.fromCharCode(b); });
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getHmacKey(usage: KeyUsage[]) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(JWT_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage,
  );
}

async function signJWT(payload: Record<string, unknown>): Promise<string> {
  const header  = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body    = b64url(JSON.stringify(payload));
  const input   = `${header}.${body}`;
  const key     = await getHmacKey(["sign"]);
  const sig     = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  return `${input}.${ab2b64url(sig)}`;
}

async function verifyJWT(token: string): Promise<Record<string, unknown> | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const input   = `${header}.${body}`;
  const key     = await getHmacKey(["verify"]);
  const sigBytes = Uint8Array.from(
    atob(sig.replace(/-/g, "+").replace(/_/g, "/")),
    (c) => c.charCodeAt(0),
  );
  const valid = await crypto.subtle.verify("HMAC", key, sigBytes, new TextEncoder().encode(input));
  if (!valid) return null;
  try {
    const payloadJson = decodeURIComponent(escape(atob(body.replace(/-/g, "+").replace(/_/g, "/"))));
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;
    if (payload.exp && Date.now() / 1000 > (payload.exp as number)) return null;
    return payload;
  } catch {
    return null;
  }
}

async function issueJWT(email: string, fullName: string, tierLevel: number, isAdmin = false): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  return signJWT({
    sub:        email,
    email,
    full_name:  fullName,
    tier_level: tierLevel,
    is_admin:   isAdmin,
    iat:        now,
    exp:        now + JWT_EXPIRY_SECONDS,
  });
}

/** Check if a Frappe user has System Manager role */
async function checkIsAdmin(email: string): Promise<boolean> {
  const result = await frappeDocGet(
    "Has Role",
    [["parent", "=", email], ["role", "=", "System Manager"]],
    ["name"],
    1,
  );
  return (result.data?.data ?? []).length > 0;
}

// ── Frappe admin helpers ───────────────────────────────────────────────────────

function frappeAdminHeader() {
  return `token ${FRAPPE_API_KEY}:${FRAPPE_API_SECRET}`;
}

async function frappeMethodPost(method: string, body: Record<string, unknown>) {
  const res = await fetch(`${FRAPPE_URL}/api/method/${method}`, {
    method: "POST",
    headers: {
      Authorization: frappeAdminHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function frappeDocPost(doctype: string, doc: Record<string, unknown>) {
  const res = await fetch(`${FRAPPE_URL}/api/resource/${encodeURIComponent(doctype)}`, {
    method: "POST",
    headers: {
      Authorization: frappeAdminHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(doc),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function frappeDocGet(
  doctype: string,
  filters: unknown[][],
  fields: string[] = ["name"],
  limit = 50,
) {
  const url = new URL(`${FRAPPE_URL}/api/resource/${encodeURIComponent(doctype)}`);
  url.searchParams.set("filters", JSON.stringify(filters));
  url.searchParams.set("fields",  JSON.stringify(fields));
  url.searchParams.set("limit",   String(limit));
  const res = await fetch(url.toString(), {
    headers: { Authorization: frappeAdminHeader(), Accept: "application/json" },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function frappeDocPut(doctype: string, name: string, doc: Record<string, unknown>) {
  const res = await fetch(
    `${FRAPPE_URL}/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
    {
      method: "PUT",
      headers: {
        Authorization: frappeAdminHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(doc),
    },
  );
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

// ── Get a user's active subscription tier level ────────────────────────────────

async function getUserTierLevel(email: string): Promise<number> {
  const result = await frappeDocGet(
    "BH Subscription",
    [["member", "=", email], ["status", "=", "Active"]],
    ["name", "tier"],
    1,
  );
  const rows = result.data?.data ?? [];
  if (!rows.length) return 0; // Explorer (free)

  const tierName = rows[0].tier as string;
  // Fetch tier level
  const tierResult = await frappeDocGet(
    "BH Subscription Tier",
    [["tier_name", "=", tierName]],
    ["tier_level"],
    1,
  );
  const tierRows = tierResult.data?.data ?? [];
  return (tierRows[0]?.tier_level as number) ?? 0;
}

// ── Main handler ───────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url    = new URL(req.url);
  const action = url.searchParams.get("action") ?? "";

  // ── PUBLIC: register ──────────────────────────────────────────────────────
  if (req.method === "POST" && action === "register") {
    const { email, password, full_name } = await req.json().catch(() => ({}));
    if (!email || !password || !full_name)
      return json({ error: "email, password, and full_name are required" }, 400);

    // Check if user already exists
    const existing = await frappeDocGet("User", [["name", "=", email]], ["name"], 1);
    if ((existing.data?.data ?? []).length > 0)
      return json({ error: "An account with this email already exists" }, 409);

    // Create Frappe user
    const createResult = await frappeDocPost("User", {
      email,
      first_name:   full_name.split(" ")[0] ?? full_name,
      last_name:    full_name.split(" ").slice(1).join(" ") || "",
      full_name,
      new_password: password,
      user_type:    "Website User",
      send_welcome_email: 0,
      roles: [{ role: "LMS Student" }],
    });

    if (!createResult.ok) {
      const errMsg = createResult.data?.message ?? createResult.data?.exception ?? "Registration failed";
      return json({ error: errMsg }, 400);
    }

    const token = await issueJWT(email, full_name, 0);
    return json({ token, email, full_name, tier_level: 0 });
  }

  // ── PUBLIC: login ─────────────────────────────────────────────────────────
  if (req.method === "POST" && action === "login") {
    const { email, password } = await req.json().catch(() => ({}));
    if (!email || !password)
      return json({ error: "email and password are required" }, 400);

    // Verify credentials against Frappe
    const loginRes = await fetch(`${FRAPPE_URL}/api/method/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ usr: email, pwd: password }),
    });

    if (!loginRes.ok) {
      const err = await loginRes.json().catch(() => ({}));
      const msg = err?.message ?? "Invalid email or password";
      return json({ error: msg }, 401);
    }

    // Get user's full name from Frappe
    const userResult = await frappeDocGet("User", [["name", "=", email]], ["full_name", "first_name", "last_name"], 1);
    const userData   = (userResult.data?.data ?? [])[0] ?? {};
    const full_name  = (userData.full_name as string) || email;

    // Get subscription tier level and admin status
    const [tier_level, is_admin] = await Promise.all([
      getUserTierLevel(email),
      checkIsAdmin(email),
    ]);

    const token = await issueJWT(email, full_name, tier_level, is_admin);
    return json({ token, email, full_name, tier_level, is_admin });
  }

  // ── PUBLIC: tiers ─────────────────────────────────────────────────────────
  if (req.method === "GET" && action === "tiers") {
    const result = await frappeDocGet(
      "BH Subscription Tier",
      [["is_active", "=", 1]],
      ["name", "tier_name", "tier_level", "price_zar", "features", "paystack_plan_code"],
      20,
    );
    return json({ tiers: result.data?.data ?? [] });
  }

  // ── PUBLIC: forgot-password ───────────────────────────────────────────────
  if (req.method === "POST" && action === "forgot-password") {
    const { email: resetEmail } = await req.json().catch(() => ({})) as { email?: string };
    if (!resetEmail) return json({ error: "email required" }, 400);
    // Trigger Frappe's built-in reset email (fire-and-forget; always return success
    // to avoid email enumeration attacks)
    fetch(`${FRAPPE_URL}/api/method/frappe.core.doctype.user.user.reset_password`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Authorization: frappeAdminHeader() },
      body: new URLSearchParams({ user: resetEmail }),
    }).catch(() => {});
    return json({ success: true });
  }

  // ── All other actions require JWT auth ─────────────────────────────────────
  const authHeader = req.headers.get("Authorization") ?? "";
  const token      = authHeader.replace(/^Bearer\s+/i, "");
  const payload    = token ? await verifyJWT(token) : null;

  if (!payload) return json({ error: "Unauthorized — valid JWT required" }, 401);

  const memberEmail = payload.email as string;
  const tierLevel   = (payload.tier_level as number) ?? 0;

  try {

    // ── POST: mark-complete ────────────────────────────────────────────────
    if (req.method === "POST" && action === "mark-complete") {
      const { course, chapter_number, lesson_number } = await req.json();
      if (!course || !chapter_number || !lesson_number)
        return json({ error: "course, chapter_number and lesson_number required" }, 400);

      const result = await frappeMethodPost("lms.lms.api.mark_lesson_progress", {
        course,
        chapter_number: String(chapter_number),
        lesson_number:  String(lesson_number),
        member: memberEmail,
      });
      return json(result.data, result.status);
    }

    // ── POST: enroll ───────────────────────────────────────────────────────
    if (req.method === "POST" && action === "enroll") {
      const { course } = await req.json();
      if (!course) return json({ error: "course required" }, 400);

      // Tier access check — fetch required_tier_level from LMS Course
      const courseResult = await frappeDocGet(
        "LMS Course",
        [["name", "=", course]],
        ["name", "custom_required_tier_level"],
        1,
      );
      const courseData     = (courseResult.data?.data ?? [])[0] ?? {};
      const requiredTier   = (courseData.custom_required_tier_level as number) ?? 0;

      if (tierLevel < requiredTier) {
        return json({
          error: `This course requires a subscription tier of level ${requiredTier} or higher. Your current tier level is ${tierLevel}.`,
          required_tier_level: requiredTier,
          user_tier_level: tierLevel,
        }, 403);
      }

      // Check if already enrolled
      const existing = await frappeDocGet(
        "LMS Enrollment",
        [["course", "=", course], ["member", "=", memberEmail]],
        ["name", "progress"],
      );
      if ((existing.data?.data ?? []).length > 0)
        return json({ message: "already_enrolled", enrollment: existing.data.data[0] }, 200);

      const result = await frappeDocPost("LMS Enrollment", {
        course,
        member:      memberEmail,
        member_type: "Student",
      });
      return json(result.data, result.ok ? 200 : result.status);
    }

    // ── GET: progress ──────────────────────────────────────────────────────
    if (req.method === "GET" && action === "progress") {
      const course = url.searchParams.get("course") ?? "";
      if (!course) return json({ error: "course required" }, 400);

      const result = await frappeDocGet(
        "LMS Enrollment",
        [["course", "=", course], ["member", "=", memberEmail]],
        ["name", "course", "progress", "current_lesson", "member"],
      );
      const enrollment = (result.data?.data ?? [])[0] ?? null;
      return json({ message: "ok", enrollment });
    }

    // ── POST: submit-quiz ──────────────────────────────────────────────────
    if (req.method === "POST" && action === "submit-quiz") {
      const { quiz, results } = await req.json();
      if (!quiz || !results) return json({ error: "quiz and results required" }, 400);

      const result = await frappeMethodPost(
        "lms.lms.doctype.lms_quiz.lms_quiz.quiz_summary",
        { quiz, results: JSON.stringify(results), member: memberEmail },
      );
      return json(result.data, result.status);
    }

    // ── POST: submit-capstone ──────────────────────────────────────────────
    if (req.method === "POST" && action === "submit-capstone") {
      const { course, lesson, file_url } = await req.json();
      if (!course || !file_url) return json({ error: "course and file_url required" }, 400);

      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const doc: Record<string, unknown> = {
        course, member: memberEmail,
        submission_type: "Capstone",
        file_url, status: "Submitted", submitted_at: now,
      };
      if (lesson) doc.lesson = lesson;

      const result = await frappeDocPost("BH Submission", doc);
      return json(result.data, result.ok ? 200 : result.status);
    }

    // ── POST: submit-practical ─────────────────────────────────────────────
    if (req.method === "POST" && action === "submit-practical") {
      const { course, lesson, content } = await req.json();
      if (!course || !content) return json({ error: "course and content required" }, 400);

      const now = new Date().toISOString().replace("T", " ").substring(0, 19);
      const doc: Record<string, unknown> = {
        course, member: memberEmail,
        submission_type: "Practical",
        content, status: "Submitted", submitted_at: now,
      };
      if (lesson) doc.lesson = lesson;

      const result = await frappeDocPost("BH Submission", doc);
      return json(result.data, result.ok ? 200 : result.status);
    }

    // ── GET: get-submissions ───────────────────────────────────────────────
    if (req.method === "GET" && action === "get-submissions") {
      const course = url.searchParams.get("course") ?? "";
      const filters: unknown[][] = [["member", "=", memberEmail]];
      if (course) filters.push(["course", "=", course]);

      const result = await frappeDocGet(
        "BH Submission", filters,
        ["name","course","lesson","submission_type","status","grade","feedback","file_url","content","submitted_at"],
        100,
      );
      return json({ submissions: result.data?.data ?? [] });
    }

    // ── GET: get-certificates ──────────────────────────────────────────────
    if (req.method === "GET" && action === "get-certificates") {
      const result = await frappeDocGet(
        "LMS Certificate",
        [["member", "=", memberEmail]],
        ["name","course","course_title","issue_date","expiry_date","published"],
        50,
      );
      return json({ certificates: result.data?.data ?? [] });
    }

    // ── POST: issue-certificate ────────────────────────────────────────────
    if (req.method === "POST" && action === "issue-certificate") {
      const { course } = await req.json();
      if (!course) return json({ error: "course required" }, 400);

      const existing = await frappeDocGet(
        "LMS Certificate",
        [["member", "=", memberEmail], ["course", "=", course]],
        ["name"],
      );
      if ((existing.data?.data ?? []).length > 0)
        return json({ message: "already_issued", certificate: existing.data.data[0] }, 200);

      const result = await frappeDocPost("LMS Certificate", {
        member: memberEmail,
        course,
        issue_date: new Date().toISOString().substring(0, 10),
      });
      return json(result.data, result.ok ? 200 : result.status);
    }

    // ── POST: upload-file ──────────────────────────────────────────────────
    if (req.method === "POST" && action === "upload-file") {
      const contentType = req.headers.get("content-type") ?? "";
      if (!contentType.includes("multipart/form-data"))
        return json({ error: "multipart/form-data required" }, 400);

      const frappeRes = await fetch(`${FRAPPE_URL}/api/method/upload_file`, {
        method: "POST",
        headers: {
          Authorization: frappeAdminHeader(),
          "Content-Type": contentType,
        },
        body: req.body,
      });
      const data = await frappeRes.json().catch(() => ({}));
      return json(data, frappeRes.ok ? 200 : frappeRes.status);
    }

    // ── GET: list-enrollments ──────────────────────────────────────────────
    if (req.method === "GET" && action === "list-enrollments") {
      const result = await frappeDocGet(
        "LMS Enrollment",
        [["member", "=", memberEmail]],
        ["name","course","progress","current_lesson"],
        50,
      );
      return json({ enrollments: result.data?.data ?? [] });
    }

    // ── GET: my-subscription ───────────────────────────────────────────────
    if (req.method === "GET" && action === "my-subscription") {
      const subResult = await frappeDocGet(
        "BH Subscription",
        [["member", "=", memberEmail], ["status", "=", "Active"]],
        ["name","tier","status","start_date","end_date","amount_paid","paystack_subscription_code"],
        1,
      );
      const rows = subResult.data?.data ?? [];
      if (!rows.length) return json({ subscription: null, tier: null });

      const sub       = rows[0];
      const tierName  = sub.tier as string;

      const tierResult = await frappeDocGet(
        "BH Subscription Tier",
        [["tier_name", "=", tierName]],
        ["tier_name","tier_level","price_zar","features","paystack_plan_code"],
        1,
      );
      const tierRows = tierResult.data?.data ?? [];
      return json({ subscription: sub, tier: tierRows[0] ?? null });
    }

    // ── POST: activate-subscription ────────────────────────────────────────
    if (req.method === "POST" && action === "activate-subscription") {
      const {
        tier_name,
        paystack_reference,
        paystack_subscription_code,
        paystack_customer_code,
        amount_paid,
      } = await req.json();

      if (!tier_name || !paystack_reference)
        return json({ error: "tier_name and paystack_reference required" }, 400);

      // Verify tier exists
      const tierResult = await frappeDocGet(
        "BH Subscription Tier",
        [["tier_name", "=", tier_name]],
        ["name","tier_level"],
        1,
      );
      const tierRows = tierResult.data?.data ?? [];
      if (!tierRows.length)
        return json({ error: `Subscription tier '${tier_name}' not found` }, 404);

      const newTierLevel = (tierRows[0].tier_level as number) ?? 0;

      // Cancel any existing active subscription
      const existingResult = await frappeDocGet(
        "BH Subscription",
        [["member", "=", memberEmail], ["status", "=", "Active"]],
        ["name"],
        5,
      );
      for (const existing of existingResult.data?.data ?? []) {
        await frappeDocPut("BH Subscription", existing.name as string, { status: "Cancelled" });
      }

      // Create new subscription
      const today     = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const createResult = await frappeDocPost("BH Subscription", {
        member:                     memberEmail,
        tier:                       tier_name,
        status:                     "Active",
        paystack_reference:         paystack_reference,
        paystack_subscription_code: paystack_subscription_code ?? "",
        paystack_customer_code:     paystack_customer_code ?? "",
        start_date:                 today.toISOString().substring(0, 10),
        end_date:                   nextMonth.toISOString().substring(0, 10),
        amount_paid:                amount_paid ?? 0,
      });

      if (!createResult.ok)
        return json({ error: "Failed to create subscription record" }, 500);

      // Issue a fresh JWT with the new tier level
      const newToken = await issueJWT(memberEmail, payload.full_name as string, newTierLevel);
      return json({
        success:    true,
        token:      newToken,
        tier_level: newTierLevel,
        subscription: createResult.data?.data,
      });
    }

    // ── POST: cancel-subscription ──────────────────────────────────────────
    if (req.method === "POST" && action === "cancel-subscription") {
      const existingResult = await frappeDocGet(
        "BH Subscription",
        [["member", "=", memberEmail], ["status", "=", "Active"]],
        ["name"],
        5,
      );
      const rows = existingResult.data?.data ?? [];
      if (!rows.length) return json({ error: "No active subscription found" }, 404);

      for (const sub of rows) {
        await frappeDocPut("BH Subscription", sub.name as string, { status: "Cancelled" });
      }

      // Issue a new JWT with tier_level 0 (Explorer)
      const newToken = await issueJWT(memberEmail, payload.full_name as string, 0);
      return json({ success: true, token: newToken });
    }

    // ── POST: change-password ──────────────────────────────────────────────
    if (req.method === "POST" && action === "change-password") {
      const { new_password } = await req.json();
      if (!new_password || new_password.length < 6)
        return json({ error: "new_password must be at least 6 characters" }, 400);

      const result = await frappeDocPut("User", memberEmail, {
        new_password,
        logout_all_sessions: 0,
      });
      if (!result.ok)
        return json({ error: "Password change failed" }, 500);

      return json({ success: true });
    }

    return json({ error: `Unknown action: ${action}` }, 400);

  } catch (err) {
    return json({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});
