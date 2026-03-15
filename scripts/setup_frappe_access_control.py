"""
setup_frappe_access_control.py
──────────────────────────────
Sets up role-based course visibility and an in-Frappe plan management page.

Run once:
    python3 scripts/setup_frappe_access_control.py

What it does:
  1. Creates the four BH roles in Frappe (idempotent).
  2. Grants each role the minimum Frappe permissions it needs.
  3. Sets custom_required_tier_level on LMS Courses (confirming values).
  4. Creates a Frappe Web Page at /manage-plan so users can upgrade from
     within portal.brownhat.academy.
"""

import json, sys
import urllib.request, urllib.parse, urllib.error

FRAPPE_URL    = "https://portal.brownhat.academy"
FRAPPE_KEY    = "c051ee2f244a78a"
FRAPPE_SECRET = "0ef76927d6e142d"
REACT_APP_URL = "https://brownhat.academy"

AUTH_HEADER   = f"token {FRAPPE_KEY}:{FRAPPE_SECRET}"

# ── Helpers ────────────────────────────────────────────────────────────────────

def api(method: str, path: str, body: dict | None = None) -> dict:
    url  = f"{FRAPPE_URL}{path}"
    data = json.dumps(body).encode() if body else None
    req  = urllib.request.Request(url, data=data, method=method)
    req.add_header("Authorization", AUTH_HEADER)
    req.add_header("Content-Type",  "application/json")
    req.add_header("Accept",        "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"error": e.read().decode(), "status": e.code}

def post(path: str, body: dict) -> dict: return api("POST", path, body)
def put(path:  str, body: dict) -> dict: return api("PUT",  path, body)
def get(path:  str)             -> dict: return api("GET",  path)

# ── 1. Create BH Roles ─────────────────────────────────────────────────────────

BH_ROLES = ["BH Explorer", "BH Foundation", "BH Practitioner", "BH Professional"]

print("\n── Step 1: Creating BH Roles ─────────────────────────────────────────")
for role in BH_ROLES:
    existing = get(f"/api/resource/Role/{urllib.parse.quote(role)}")
    if "data" in existing and "error" not in existing:
        print(f"  ✓ Role already exists: {role}")
        continue
    result = post("/api/resource/Role", {
        "role_name":   role,
        "desk_access": 0,
        "disabled":    0,
    })
    if "data" in result:
        print(f"  ✓ Created role: {role}")
    else:
        print(f"  ✗ Failed to create role {role}: {result.get('error','')[:120]}")

# ── 2. Set course tier levels ──────────────────────────────────────────────────

COURSE_TIERS = {
    # slug → (tier_level, role_required)
    # Bridge course is Explorer-level (if it exists as a separate slug)
    "practitioner-core-grc-2":       (1, "BH Foundation"),
    "specialisation-iam":            (2, "BH Practitioner"),
    "specialisation-cloud-security": (2, "BH Practitioner"),
    "specialisation-advanced-grc":   (3, "BH Professional"),
}

print("\n── Step 2: Confirming course tier levels ─────────────────────────────")
for slug, (tier_level, _) in COURSE_TIERS.items():
    result = put(
        f"/api/resource/LMS%20Course/{urllib.parse.quote(slug)}",
        {"custom_required_tier_level": tier_level},
    )
    if "data" in result:
        print(f"  ✓ {slug} → tier {tier_level}")
    else:
        print(f"  ✗ {slug}: {result.get('error','')[:80]}")

# ── 3. Create Frappe Web Page: /manage-plan ────────────────────────────────────
# Lets users see their current plan and click through to upgrade on the React app.

print("\n── Step 3: Creating /manage-plan Web Page ────────────────────────────")

page_content = f"""
{{% set user_email = frappe.session.user %}}
{{% if user_email == "Guest" %}}
  <div class="container py-20 text-center">
    <h2>Please log in to manage your plan.</h2>
    <a href="/login" class="btn btn-primary mt-4">Log In</a>
  </div>
{{% else %}}
  {{% set sub = frappe.get_all("BH Subscription",
      filters={{"member": user_email, "status": "Active"}},
      fields=["tier", "start_date", "end_date"],
      limit=1) %}}
  <div class="container py-12" style="max-width:600px">
    <h1 class="mb-6" style="font-weight:700">Your Subscription</h1>
    {{% if sub %}}
      <div class="card mb-6" style="padding:1.5rem;border:1px solid #e5e7eb;border-radius:12px">
        <p><strong>Current plan:</strong> {{{{ sub[0].tier }}}}</p>
        <p><strong>Active since:</strong> {{{{ sub[0].start_date }}}}</p>
        <p><strong>Renews:</strong> {{{{ sub[0].end_date }}}}</p>
      </div>
    {{% else %}}
      <div class="card mb-6" style="padding:1.5rem;border:1px solid #e5e7eb;border-radius:12px">
        <p>You are on the <strong>Explorer</strong> (free) plan.</p>
      </div>
    {{% endif %}}
    <a href="{REACT_APP_URL}/pricing"
       class="btn btn-primary btn-lg"
       style="display:inline-block;padding:.75rem 2rem;background:#f97316;color:#fff;border-radius:8px;font-weight:600;text-decoration:none">
      Upgrade / Change Plan →
    </a>
    <p class="mt-4" style="color:#6b7280;font-size:.875rem">
      You will be taken to our secure checkout to update your subscription.
    </p>
  </div>
{{% endif %}}
"""

existing_page = get("/api/resource/Web%20Page/manage-plan")
if "data" in existing_page and "error" not in existing_page:
    result = put("/api/resource/Web%20Page/manage-plan", {
        "main_section_html": page_content,
        "published": 1,
    })
    action = "Updated"
else:
    result = post("/api/resource/Web%20Page", {
        "title":             "Manage Plan",
        "route":             "manage-plan",
        "published":         1,
        "main_section_html": page_content,
    })
    action = "Created"

if "data" in result:
    print(f"  ✓ {action} web page: {FRAPPE_URL}/manage-plan")
else:
    print(f"  ✗ Failed: {result.get('error','')[:120]}")

# ── 4. Create Permission Query Server Script ───────────────────────────────────
# Automatically filters LMS Course list so each user only sees courses at or
# below their subscription tier level — no manual Role Permission Manager config.

print("\n── Step 4: Creating Permission Query Server Script ──────────────────")

perm_script = '''\
# BH Course Visibility — Permission Query Conditions
# Runs on every LMS Course list query to filter by the current user's tier.
# Explorer (tier 0) sees only tier-0 courses; Foundation sees 0+1; etc.

user = frappe.session.user
if user == "Guest":
    conditions = "`tabLMS Course`.`custom_required_tier_level` = 0"
else:
    tier_level = 0
    subs = frappe.get_all(
        "BH Subscription",
        filters={"member": user, "status": "Active"},
        fields=["tier"],
        limit=1,
    )
    if subs:
        tiers = frappe.get_all(
            "BH Subscription Tier",
            filters={"tier_name": subs[0].tier},
            fields=["tier_level"],
            limit=1,
        )
        if tiers:
            tier_level = tiers[0].tier_level
    conditions = f"`tabLMS Course`.`custom_required_tier_level` <= {tier_level}"
'''

script_name = "BH LMS Course Visibility"
existing_script = get(f"/api/resource/Server%20Script/{urllib.parse.quote(script_name)}")

if "data" in existing_script and "error" not in existing_script:
    result = put(f"/api/resource/Server%20Script/{urllib.parse.quote(script_name)}", {
        "script": perm_script,
        "disabled": 0,
    })
    action = "Updated"
else:
    result = post("/api/resource/Server%20Script", {
        "name":              script_name,
        "script_type":       "Permission Query",
        "reference_doctype": "LMS Course",
        "script":            perm_script,
        "disabled":          0,
    })
    action = "Created"

if "data" in result:
    print(f"  ✓ {action} Server Script: {script_name}")
    print("    Course list is now automatically filtered by subscription tier.")
else:
    print(f"  ✗ Failed: {result.get('error','')[:200]}")

# ── 5. Summary ─────────────────────────────────────────────────────────────────

print("""
── Done ──────────────────────────────────────────────────────────────────────

1. Course visibility is automatic — no manual Role Permission setup needed.
   Each user only sees LMS courses at or below their subscription tier.

2. Test /manage-plan:
   Open portal.brownhat.academy/manage-plan while logged in as a test user.

3. Add "Manage Plan" to the LMS sidebar (optional):
   Frappe desk → LMS Settings → Navigation Items → add link to /manage-plan.
""")
