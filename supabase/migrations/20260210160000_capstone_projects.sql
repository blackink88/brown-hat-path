-- Capstone submission infrastructure and capstone lessons for migration-defined courses.

BEGIN;

-- ========== CAPSTONE SUBMISSIONS TABLE ==========
CREATE TABLE IF NOT EXISTS public.capstone_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  submitted_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT DEFAULT 'submitted' NOT NULL CHECK (status IN ('submitted', 'under_review', 'graded', 'resubmit')),
  grade INTEGER CHECK (grade IS NULL OR (grade >= 0 AND grade <= 100)),
  feedback TEXT,
  graded_by UUID REFERENCES auth.users(id),
  graded_at TIMESTAMPTZ,
  UNIQUE(user_id, lesson_id)
);

-- RLS policies
ALTER TABLE public.capstone_submissions ENABLE ROW LEVEL SECURITY;

-- Students can view their own submissions
CREATE POLICY "Students can view own submissions"
  ON public.capstone_submissions FOR SELECT
  USING (auth.uid() = user_id);

-- Students can insert their own submissions
CREATE POLICY "Students can submit capstones"
  ON public.capstone_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Students can update their own submissions (re-upload)
CREATE POLICY "Students can update own submissions"
  ON public.capstone_submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- Admins can view all submissions (via user_roles)
CREATE POLICY "Admins can view all submissions"
  ON public.capstone_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

-- Admins can update all submissions (grade, feedback)
CREATE POLICY "Admins can grade submissions"
  ON public.capstone_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

-- ========== STORAGE BUCKET ==========
INSERT INTO storage.buckets (id, name, public)
VALUES ('capstone-submissions', 'capstone-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- Students can upload to their own folder
CREATE POLICY "Students upload own capstones"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'capstone-submissions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Students can read their own files
CREATE POLICY "Students read own capstone files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'capstone-submissions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Students can overwrite their own files (re-upload)
CREATE POLICY "Students overwrite own capstone files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'capstone-submissions'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can read all capstone files
CREATE POLICY "Admins read all capstone files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'capstone-submissions'
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'
    )
  );

-- ========== CAPSTONE LESSONS — Migration courses ==========

-- BH-GRC-2: Capstone (Module d04, order 5)
INSERT INTO public.lessons (id, module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('f1000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000004',
 'Capstone: Security Audit with Lynis',
 'Run a security audit on Kali Linux using Lynis, map findings to NIST CSF, and write an audit report.',
 E'# Capstone: Security Audit with Lynis\n\n## Overview\n\nYou will run a professional security audit on your own Kali Linux system using **Lynis**, interpret the results, map findings to the NIST Cybersecurity Framework, and produce a formal audit report.\n\n**Time estimate:** 90–120 minutes\n**Prerequisite:** Kali Linux running (Lynis is pre-installed).\n**Deliverable:** PDF with screenshots and an audit report.\n\n## Tasks\n\n### Task 1 — Run the Lynis Audit (15 marks)\n\nRun a full system audit:\n\n```\nsudo lynis audit system\n```\n\nThis takes 2–5 minutes. Take screenshots of:\n- The scan running (showing test categories being checked).\n- The **final summary** showing the hardening index score.\n\nRecord your hardening index score (e.g. "Hardening index: 62 [############        ]").\n\n### Task 2 — Review Warnings and Suggestions (20 marks)\n\nLynis produces two categories of findings: **Warnings** (serious) and **Suggestions** (improvements).\n\nView them:\n```\nsudo grep -E "warning\\[\\]|suggestion\\[\\]" /var/log/lynis.log | head -20\n```\n\nOr review the full report:\n```\nsudo cat /var/log/lynis-report.dat | grep suggestion\n```\n\nTake a screenshot. In your report, create a table of the **top 10 findings** (mix of warnings and suggestions):\n\n| # | Finding | Severity (Warning/Suggestion) | Category |\n|---|---------|-------------------------------|----------|\n| 1 | ... | ... | ... |\n\n### Task 3 — Map to NIST CSF (20 marks)\n\nFor each of your 10 findings, map it to a **NIST CSF function** (Identify, Protect, Detect, Respond, Recover) and the relevant category:\n\n| # | Finding | NIST Function | NIST Category | Rationale |\n|---|---------|---------------|---------------|-----------|\n| 1 | No firewall active | Protect | PR.AC (Access Control) | Firewall protects network boundaries |\n| 2 | ... | ... | ... | ... |\n\n### Task 4 — Risk Rating (15 marks)\n\nFor each finding, assign a risk rating:\n\n| Rating | Criteria |\n|--------|----------|\n| **Critical** | Exploitable remotely; could lead to full system compromise |\n| **High** | Significant weakness; requires attention within 30 days |\n| **Medium** | Moderate weakness; should be addressed within 90 days |\n| **Low** | Minor; address during regular maintenance |\n\n### Task 5 — Audit Report (30 marks)\n\nWrite a formal audit report:\n\n**1. Executive Summary** (half page): Audit scope, date, overall hardening index, key findings summary.\n\n**2. Scope and Methodology:** What was audited (Kali Linux VM), what tool was used (Lynis), and any limitations.\n\n**3. Findings Table:** Your 10 findings with NIST mapping and risk ratings.\n\n**4. Remediation Plan:** For the top 3 findings, provide:\n- Action to remediate\n- Owner (who should fix it)\n- Deadline\n- How to verify the fix\n\n**5. Conclusion:** 2–3 sentences summarising the audit and recommended next steps.\n\n---\n\n## Marking Rubric\n\n| Task | Marks | Criteria |\n|------|-------|----------|\n| 1. Lynis audit | 15 | Audit run; hardening index recorded; screenshots shown |\n| 2. Findings review | 20 | 10 findings listed with severity and category |\n| 3. NIST CSF mapping | 20 | Correct functions and categories; rationale provided |\n| 4. Risk rating | 15 | Ratings are reasonable and consistent |\n| 5. Audit report | 30 | All sections present; professional format; remediation actionable |\n| **Total** | **100** | |\n\n## Submission\n\n1. Compile into PDF.\n2. Name: **`BH-GRC2-capstone-[FirstName]-[LastName].pdf`**\n3. Upload using the **Upload Capstone** button below.', 120, 5);

-- BH-SPEC-IAM: Capstone (Module d14, order 5)
INSERT INTO public.lessons (id, module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('f1000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000014',
 'Capstone: Access Control Audit',
 'Audit user accounts, permissions, and sudo configuration on a Linux system.',
 E'# Capstone: Access Control Audit\n\n## Overview\n\nYou will audit the identity and access controls on your Kali Linux system: enumerate users and groups, review sudo configuration, test password policies, and produce an IAM audit report.\n\n**Time estimate:** 90–120 minutes\n**Prerequisite:** Kali Linux running.\n**Deliverable:** PDF with screenshots and an IAM audit report.\n\n## Tasks\n\n### Task 1 — User Enumeration (15 marks)\n\nList all user accounts and their properties:\n\n```\n# All users with shell access:\ngrep "/bin/bash\\|/bin/sh\\|/bin/zsh" /etc/passwd\n\n# All groups:\ncat /etc/group | head -20\n\n# Current user''s groups:\nid\ngroups\n```\n\nTake screenshots. In your report, list:\n- How many accounts have interactive shell access\n- Any service accounts (non-human accounts)\n- Your user''s group memberships\n\n### Task 2 — Sudo Configuration Audit (20 marks)\n\nReview sudo privileges:\n\n```\n# What can your user do with sudo?\nsudo -l\n\n# Review the sudoers file:\nsudo cat /etc/sudoers\n\n# Check sudoers.d directory:\nsudo ls -la /etc/sudoers.d/\n```\n\nTake screenshots. In your report, answer:\n- Does your user have unrestricted sudo (ALL:ALL)?\n- Are there any NOPASSWD entries (sudo without password)?\n- Is this configuration secure? Why or why not?\n\n### Task 3 — Password Policy Check (15 marks)\n\nCheck password configuration:\n\n```\n# Password ageing policy:\nsudo chage -l kali\n\n# PAM password requirements:\ncat /etc/pam.d/common-password\n\n# Shadow file permissions:\nls -la /etc/shadow\n```\n\nTake screenshots. Assess:\n- Is password expiry configured?\n- Are password complexity requirements enforced?\n- Is /etc/shadow properly protected (permissions)?\n\n### Task 4 — Create Test Users and Permissions (20 marks)\n\nCreate a test scenario with different access levels:\n\n```\n# Create two test users:\nsudo adduser --disabled-password --gecos "" analyst1\nsudo adduser --disabled-password --gecos "" analyst2\n\n# Create a group:\nsudo groupadd security-team\nsudo usermod -aG security-team analyst1\n\n# Create a shared directory:\nsudo mkdir -p /opt/security-reports\nsudo chown root:security-team /opt/security-reports\nsudo chmod 770 /opt/security-reports\n\n# Verify:\nls -la /opt/ | grep security\nid analyst1\nid analyst2\n```\n\nTake screenshots. Verify:\n- analyst1 (in security-team) can access /opt/security-reports\n- analyst2 (not in security-team) cannot access it\n\n```\nsudo -u analyst1 ls /opt/security-reports\nsudo -u analyst2 ls /opt/security-reports\n```\n\n### Task 5 — IAM Audit Report (30 marks)\n\nWrite an audit report:\n\n**1. Executive Summary:** Scope, methodology, key findings.\n\n**2. Findings Table:**\n\n| # | Finding | Risk | Recommendation |\n|---|---------|------|-----------------|\n| 1 | kali user has unrestricted sudo | High | Implement least privilege; use specific commands |\n| 2 | ... | ... | ... |\n\nInclude at least 5 findings.\n\n**3. Access Control Matrix:** Document who has access to what.\n\n**4. Recommendations:** Prioritised list of 5 improvements.\n\n---\n\n## Marking Rubric\n\n| Task | Marks | Criteria |\n|------|-------|----------|\n| 1. User enumeration | 15 | Users and groups listed; service accounts identified |\n| 2. Sudo audit | 20 | sudoers reviewed; NOPASSWD identified; assessment provided |\n| 3. Password policy | 15 | Ageing, complexity, and shadow permissions checked |\n| 4. Test users | 20 | Users created; permissions set and tested; screenshots shown |\n| 5. Audit report | 30 | 5+ findings; access matrix; 5 recommendations |\n| **Total** | **100** | |\n\n## Cleanup\n\n```\nsudo deluser --remove-home analyst1\nsudo deluser --remove-home analyst2\nsudo groupdel security-team\nsudo rm -rf /opt/security-reports\n```\n\n## Submission\n\n1. Compile into PDF.\n2. Name: **`BH-SPEC-IAM-capstone-[FirstName]-[LastName].pdf`**\n3. Upload using the **Upload Capstone** button below.', 120, 5);

-- BH-SPEC-CLOUD: Capstone (Module d24, order 5)
INSERT INTO public.lessons (id, module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('f1000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000024',
 'Capstone: TLS and Web Security Assessment',
 'Test SSL/TLS configuration and web server security, then write a cloud/web security report.',
 E'# Capstone: TLS and Web Security Assessment\n\n## Overview\n\nYou will assess the SSL/TLS configuration and web security of public-facing websites using Kali tools, then produce a professional security assessment report.\n\n**Time estimate:** 90–120 minutes\n**Prerequisite:** Kali Linux with internet access.\n**Deliverable:** PDF with screenshots and a security assessment report.\n\n## Important: Legal and Ethical Note\n\nThe tools in this capstone **only read publicly available information** (TLS certificates, HTTP headers). They do not exploit vulnerabilities. You will test sites that serve public content. Nevertheless, only test targets you have permission for or that are explicitly designed for testing.\n\nSuggested targets: your own website, or public test sites such as:\n- `badssl.com` (deliberately misconfigured SSL/TLS for testing)\n- `example.com` (simple public site)\n\n## Tasks\n\n### Task 1 — Install testssl.sh (5 marks)\n\n```\nsudo apt update && sudo apt install -y testssl.sh\ntestssl --version\n```\n\nTake a screenshot showing the version.\n\n### Task 2 — TLS Configuration Scan (25 marks)\n\nRun a full TLS assessment against a target:\n\n```\ntestssl https://badssl.com/\n```\n\nThis takes 2–5 minutes. Take screenshots of:\n- The **overall rating** section\n- The **protocols** section (which TLS versions are supported)\n- The **cipher suites** section\n- Any **vulnerabilities** detected (e.g. BEAST, POODLE, Heartbleed)\n\nIn your report, create a summary table:\n\n| Check | Result | Status |\n|-------|--------|--------|\n| TLS 1.0 | Enabled/Disabled | Pass/Fail |\n| TLS 1.1 | Enabled/Disabled | Pass/Fail |\n| TLS 1.2 | Enabled/Disabled | Pass/Fail |\n| TLS 1.3 | Enabled/Disabled | Pass/Fail |\n| Certificate valid | Yes/No | Pass/Fail |\n| HSTS header | Present/Missing | Pass/Fail |\n| Known vulnerabilities | List any found | Pass/Fail |\n\n### Task 3 — HTTP Security Headers (20 marks)\n\nCheck HTTP security headers:\n\n```\ncurl -sI https://example.com | grep -iE \"strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy\"\n```\n\nAlternatively, use nmap:\n```\nnmap --script http-security-headers -p 443 example.com\n```\n\nTake a screenshot. Assess which of these headers are present and which are missing:\n\n| Header | Purpose | Present? |\n|--------|---------|----------|\n| Strict-Transport-Security (HSTS) | Forces HTTPS | ? |\n| Content-Security-Policy (CSP) | Prevents XSS and injection | ? |\n| X-Frame-Options | Prevents clickjacking | ? |\n| X-Content-Type-Options | Prevents MIME sniffing | ? |\n| Referrer-Policy | Controls referrer information | ? |\n| Permissions-Policy | Controls browser features | ? |\n\n### Task 4 — Certificate Analysis (15 marks)\n\nExamine the TLS certificate:\n\n```\necho | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -text | head -30\n```\n\nTake a screenshot. Record:\n- Issuer (who issued the certificate)\n- Subject (who it was issued to)\n- Validity period (not before / not after)\n- Signature algorithm\n- Key size\n\n### Task 5 — Security Assessment Report (35 marks)\n\nWrite a professional report:\n\n**1. Executive Summary:** Scope, targets tested, overall security posture.\n\n**2. Methodology:** Tools used (testssl.sh, curl, nmap, openssl), what was tested.\n\n**3. Findings:**\n\n| # | Finding | Severity | Impact | Recommendation |\n|---|---------|----------|--------|-----------------|\n| 1 | TLS 1.0 enabled | High | Vulnerable to POODLE/BEAST | Disable TLS 1.0 and 1.1 |\n| 2 | Missing CSP header | Medium | XSS risk | Implement Content-Security-Policy |\n| ... | ... | ... | ... | ... |\n\nInclude at least 5 findings.\n\n**4. Recommendations:** Prioritised list of improvements.\n\n**5. Conclusion:** Overall assessment and next steps.\n\n---\n\n## Marking Rubric\n\n| Task | Marks | Criteria |\n|------|-------|----------|\n| 1. Install testssl | 5 | Version shown |\n| 2. TLS scan | 25 | Scan completed; summary table accurate |\n| 3. Security headers | 20 | Headers checked; table completed |\n| 4. Certificate analysis | 15 | Certificate details extracted correctly |\n| 5. Assessment report | 35 | 5+ findings; executive summary; recommendations |\n| **Total** | **100** | |\n\n## Submission\n\n1. Compile into PDF.\n2. Name: **`BH-SPEC-CLOUD-capstone-[FirstName]-[LastName].pdf`**\n3. Upload using the **Upload Capstone** button below.', 120, 5);

-- BH-SPEC-GRC: Capstone (Module d34, order 5)
INSERT INTO public.lessons (id, module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('f1000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000034',
 'Capstone: Compliance Assessment Report',
 'Run a security audit, map findings to ISO 27001, score compliance, and write a full assessment.',
 E'# Capstone: Compliance Assessment Report\n\n## Overview\n\nYou will conduct a technical compliance assessment: run Lynis to gather technical evidence, map findings to ISO 27001 Annex A controls, calculate a compliance score, and produce a comprehensive compliance assessment report for a fictitious company.\n\n**Time estimate:** 2–3 hours\n**Prerequisite:** Kali Linux running.\n**Deliverable:** PDF with screenshots and a full compliance assessment report.\n\n## Scenario\n\nYou are the GRC consultant engaged by **DataVault Solutions**, a data processing company, to assess their server compliance against ISO 27001 Annex A controls. You are auditing a representative Linux server (your Kali VM).\n\n## Tasks\n\n### Task 1 — Technical Evidence Gathering (15 marks)\n\nRun a comprehensive audit:\n\n```\nsudo lynis audit system --quick\n```\n\nAlso gather additional evidence:\n\n```\n# Firewall status:\nsudo iptables -L -n\n\n# Running services:\nsystemctl list-units --type=service --state=running\n\n# Failed login attempts:\nsudo journalctl _SYSTEMD_UNIT=ssh.service | tail -20\n\n# Open ports:\nss -tuln\n```\n\nTake screenshots of each. These are your audit evidence.\n\n### Task 2 — Map to ISO 27001 Annex A (25 marks)\n\nMap your findings to ISO 27001 Annex A controls. Complete this table for at least **10 controls**:\n\n| Annex A Control | Control Title | Evidence Gathered | Compliance Status | Gap |\n|-----------------|---------------|-------------------|-------------------|-----|\n| A.8.1 | Asset management | System info from uname | Partial — no formal inventory | Need CMDB |\n| A.9.2 | User access management | /etc/passwd review | Partial — no access review process | Need quarterly reviews |\n| A.12.4 | Logging and monitoring | journalctl output | Partial — logs exist but no SIEM | Need centralised logging |\n| A.12.6 | Technical vulnerability management | Lynis findings | Partial — scan done but no remediation tracking | Need vuln management process |\n| ... | ... | ... | ... | ... |\n\nUse the Lynis findings, firewall status, service list, and port scan as evidence.\n\n### Task 3 — Compliance Score (15 marks)\n\nCalculate a compliance score for DataVault:\n\n| Status | Count | Weight |\n|--------|-------|--------|\n| Compliant | ? | 1.0 |\n| Partially compliant | ? | 0.5 |\n| Non-compliant | ? | 0.0 |\n| Not applicable | ? | Excluded |\n\n**Score formula:** (Sum of weights) / (Total applicable controls) × 100\n\nExample: If 3 compliant (3.0) + 5 partial (2.5) + 2 non-compliant (0.0) = 5.5 / 10 = **55%**\n\n### Task 4 — Compliance Assessment Report (45 marks)\n\nWrite a full report for DataVault Solutions:\n\n**1. Cover Page:** Company name, "ISO 27001 Compliance Assessment", date, your name, "CONFIDENTIAL".\n\n**2. Executive Summary** (half page): Scope, overall compliance score, key gaps, and top recommendation.\n\n**3. Scope and Methodology:**\n- What was assessed (Linux server representing DataVault infrastructure)\n- Tools used (Lynis, manual checks)\n- Framework (ISO 27001:2022 Annex A)\n- Limitations (single server; organisational controls not assessed)\n\n**4. Compliance Summary:**\n- Overall score with visual indicator\n- Breakdown by compliance status\n\n**5. Detailed Findings:** Your 10-control mapping table from Task 2.\n\n**6. Gap Analysis:** For each non-compliant or partially compliant control, describe:\n- The gap\n- The risk if not addressed\n- Recommended remediation\n- Priority (Critical / High / Medium / Low)\n- Estimated timeline\n\n**7. Remediation Roadmap:** Prioritised list of actions for the next 12 months.\n\n**8. Conclusion and Next Steps:** 3–4 sentences.\n\n---\n\n## Marking Rubric\n\n| Task | Marks | Criteria |\n|------|-------|----------|\n| 1. Evidence gathering | 15 | All commands run; screenshots clear |\n| 2. ISO 27001 mapping | 25 | 10+ controls mapped; evidence linked; status accurate |\n| 3. Compliance score | 15 | Formula correct; score calculated and justified |\n| 4. Report — Executive summary | 10 | Clear, concise, non-technical |\n| 4. Report — Findings and gaps | 15 | Detailed; risks stated; remediation actionable |\n| 4. Report — Roadmap and professionalism | 20 | Prioritised; timeline realistic; cover page; clean format |\n| **Total** | **100** | |\n\n## Submission\n\n1. Compile into PDF.\n2. Name: **`BH-SPEC-GRC-capstone-[FirstName]-[LastName].pdf`**\n3. Upload using the **Upload Capstone** button below.', 180, 5);

COMMIT;
