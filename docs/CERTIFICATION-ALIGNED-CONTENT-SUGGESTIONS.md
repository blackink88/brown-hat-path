# Certification-Aligned Course Content — Suggestions (No Implementation Yet)

This doc is **suggestions only**. Use it to decide approach and priority before we add or change any content or schema.

---

## 1. Use official exam objectives as the skeleton

Vendors publish **exam objectives** (domains, sub-objectives, skills). They are the single source of truth for “what the exam tests” and should drive your course structure.

| Certification | Where to get objectives | Typical structure |
|---------------|-------------------------|---------------------|
| **CompTIA A+** | comptia.org → A+ → Exam Objectives (PDF) | 2 exams (220-1101, 220-1102); 4–5 domains each |
| **CompTIA Network+** | comptia.org → Network+ → Exam Objectives | 5 domains (e.g. Networking Fundamentals, Implementations, Operations, Security, Troubleshooting) |
| **CompTIA Security+** | comptia.org → Security+ → Exam Objectives | 5 domains (General Concepts, Threats, Architecture, Operations, Program Management) |
| **CompTIA CySA+** | comptia.org → CySA+ → Exam Objectives | 4 domains (Security Operations, Vulnerability Management, Incident Response, Reporting) |
| **ISC² CC** | isc2.org → Certified in Cybersecurity → Exam Outline | Domains: Security Principles, BC/DR, Access Control, Network Security, Security Operations |
| **ISC² SSCP** | isc2.org → SSCP → Exam Outline | 7 domains (e.g. Access Controls, Security Operations, Risk Identification) |
| **CISSP** | isc2.org → CISSP → Exam Outline | 8 domains |
| **CISM** | isaca.org → CISM → Job Practice / Study Materials | 4 domains |
| **CRISC** | isaca.org → CRISC → Job Practice | 4 domains (Governance, Risk, Response, Assurance) |

**Suggestion:** For each course, start from the **primary** cert’s objectives (e.g. BH-CYBER-2 → Security+ first, then map ISC² CC where it overlaps). One course can cover more than one cert if objectives align; avoid “one lesson per cert” with no clear objective mapping.

---

## 2. Map modules and lessons to objectives (outline first)

**Workflow:**

1. **Per course:** List the main certification(s) and get the latest objective PDF/outline.
2. **Modules:** Group objectives into 3–6 modules. Each module = one clear theme (e.g. “Threats and Vulnerabilities”, “Security Operations”).
3. **Lessons:** Split each module into 2–5 lessons. Each lesson should map to one or more **specific sub-objectives** (e.g. “Explain types of malware”, “Configure a firewall”).
4. **Naming:** Use objective-friendly titles so instructors and students can cross-check (e.g. “Security Controls and Cryptography” → “1.2 Summarize cryptographic concepts”).

**Benefits:**

- No “exam surprise”: every objective is covered somewhere.
- Gaps are visible: if an objective has no lesson, add one or extend an existing lesson.
- Easier to maintain when the vendor updates the exam: you see which lessons to touch.

**Optional (for later):** Add a field to lessons (e.g. `exam_objective_ids` or `exam_domain`) so the UI can show “Covers: Security+ 1.2, 1.3” and you can report “% of objectives covered”.

---

## 3. Content sources (what to base lessons on)

- **Official study guides / learning:** CompTIA CertMaster, ISC² study guides, ISACA review manuals. Use for accuracy; don’t copy verbatim (copyright).
- **Exam objective PDFs:** Free; use wording and structure to name modules/lessons and check coverage.
- **Vendor docs:** Microsoft Learn (SC-200, Azure), AWS Security docs, Splunk docs for SIEM.
- **Your existing seed:** You already reference domains (e.g. “Security+ domain 1”, “CySA+ domain 2”). Keep that pattern and deepen so each lesson clearly ties to one or two sub-objectives.

**Suggestion:** Write in your own words, include **definitions**, **why it matters for the exam**, and **brief “exam tip” or “practice question” style** so it’s clearly exam-prep, not just theory.

---

## 4. Structure of a single lesson (consistent and exam-ready)

Keep your current format (markdown, duration), and aim for:

- **Title** — Matches or closely reflects an objective (e.g. “Summarize cryptographic concepts”).
- **Short description** — One line for the card/list view.
- **Body (markdown):**
  - **What** — Clear definition and scope.
  - **Why** — Relevance to the exam and to the job.
  - **Key points** — Bullets or numbered list (easy to revise for exam).
  - **Exam alignment** — One line: “Security+ 1.2, 1.3” or “ISC² CC: Security Principles”.
- **Duration** — Realistic read + note-taking (e.g. 15–25 min for a dense lesson).

**Suggestion:** Add a short “Key takeaway” or “Practice focus” at the end so students know what to remember for the exam.

---

## 5. Priority order (which courses to deepen first)

Given your path (Bridge → Foundations → Core → Practitioner → Spec/Advanced):

1. **BH-FOUND-1 / BH-FOUND-2 (A+, Network+)** — High impact; many students start here. Use A+ 220-1101/1102 and Network+ objectives to add or expand lessons until every domain has at least one lesson (and major sub-objectives are covered).
2. **BH-CYBER-2 (Security+, ISC² CC)** — Core for everyone. Map Security+ domains 1–5 and ISC² CC domains; ensure no domain is “one lesson only” if the exam weighs it heavily.
3. **BH-OPS-2 (CySA+, SSCP)** — Practitioner level. CySA+ has 4 domains; SSCP 7. Align modules to CySA+ first, then tag SSCP where it overlaps.
4. **BH-SPEC-SOC (CySA+)** — Already CySA+-focused; deepen SOC/SIEM/IR lessons with CySA+ sub-objectives and hands-on focus.
5. **BH-GRC-2 (SSCP, GRC)** — Use SSCP + CRISC/GRC concepts; add lessons for risk, governance, compliance so they’re clearly aligned to exam language.
6. **BH-ADV (CISSP, CISM, TOGAF)** — Broad; best tackled once lower levels are solid. Map to CISSP 8 domains first, then CISM/TOGAF where they fit.

---

## 6. How I can help (before implementing)

- **Outlines:** For a chosen course (e.g. BH-CYBER-2), I can propose a **module + lesson outline** with each lesson title and the exact exam objective(s) it should cover, using the vendor’s domain/sub-objective list. You review; then we don’t write content until you’re happy with the map.
- **Lesson stubs:** After the outline is approved, I can add **placeholder lessons** (title, description, “Content TBD”, duration estimate) so the structure exists in the seed; you or I fill content later.
- **Full lessons:** I can write **full markdown lessons** (in your style: definitions, exam alignment line, key takeaway) for a given module or course, using public exam objectives and general knowledge. You’d review for accuracy and brand voice.
- **Gap analysis:** From your current seed, I can list “Security+ objectives with no or weak coverage” (and same for other certs) so you know what to add first.
- **Schema (optional):** If you want traceability, I can suggest a small **schema change** (e.g. `lessons.exam_objective_ids` or a mapping table) and where to display it in the UI; you decide if/when to implement.

---

## 7. What to decide next

1. **Which course(s)** do you want to prioritise? (e.g. “Security+ and BH-CYBER-2 first”.)
2. **Outline only, or outline + content?** (e.g. “Give me the outline for BH-CYBER-2; I’ll approve before you write lessons.”)
3. **Do you want objective-level traceability in the DB/UI?** (e.g. “Show which Security+ objectives this lesson covers”.) If yes, we can add a minimal schema and one place in the UI.
4. **Any constraints?** (e.g. “No copy from CertMaster”; “Prefer ISC² wording for CC/SSCP”; “Keep lessons under 30 min.”)

Once you answer these, we can proceed with a concrete plan (e.g. “Step 1: BH-CYBER-2 outline; Step 2: approve; Step 3: add 6 lessons for domain 1”) and only then implement.
