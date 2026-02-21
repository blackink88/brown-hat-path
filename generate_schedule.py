#!/usr/bin/env python3
"""
Brown Hat Academy -2026 Learning Schedule Generator
Generates a professional PDF timetable starting March 1, 2026.
"""

from fpdf import FPDF
from datetime import date, timedelta
import os

# ── Configuration ──────────────────────────────────────────────

LOGO_PATH = os.path.join(os.path.dirname(__file__), "src", "assets", "bhlogo.png")
OUTPUT_PATH = os.path.join(os.path.dirname(__file__), "Brown_Hat_Academy_Learning_Schedule_2026.pdf")

PRIMARY_COLOR = (139, 69, 19)       # Brown primary
DARK_COLOR = (30, 30, 30)
MUTED_COLOR = (100, 100, 100)
ACCENT_GREEN = (34, 139, 34)
WHITE = (255, 255, 255)
LIGHT_BG = (248, 245, 240)
HEADER_BG = (139, 69, 19)
ROW_ALT = (252, 249, 245)

START_DATE = date(2026, 3, 1)  # Sunday -first session Monday March 2

# South African public holidays 2026 (that fall on weekdays during our schedule)
SA_HOLIDAYS = {
    date(2026, 3, 21): "Human Rights Day (Sat -no effect)",
    date(2026, 4, 3): "Good Friday",
    date(2026, 4, 6): "Family Day",
    date(2026, 4, 27): "Freedom Day",
    date(2026, 5, 1): "Workers' Day",
    date(2026, 6, 16): "Youth Day",
    date(2026, 8, 10): "National Women's Day (observed)",
    date(2026, 9, 24): "Heritage Day",
    date(2026, 12, 16): "Day of Reconciliation",
    date(2026, 12, 25): "Christmas Day",
    date(2026, 12, 26): "Day of Goodwill (Sat -no effect)",
}

# Weekday holidays that actually affect our schedule (Mon-Thu evenings)
WEEKDAY_HOLIDAYS = {d for d, n in SA_HOLIDAYS.items() if d.weekday() < 5 and "no effect" not in n}


# ── Curriculum Data ────────────────────────────────────────────

CURRICULUM = [
    {
        "level": "Level 0",
        "title": "Bridge -Digital Readiness",
        "code": "BH-BRIDGE",
        "weeks": 1,
        "modules": [
            "Computer Fundamentals & Digital Literacy",
            "Basic Networking Concepts",
            "Introduction to Operating Systems",
            "Professional Communication & Study Skills",
        ],
        "certs": "None (Preparatory)",
        "has_practical": False,
        "assessment_weeks": 0,
        "notes": "Optional for learners with no prior IT experience",
    },
    {
        "level": "Level 1",
        "title": "Foundations -IT & Cyber Foundations",
        "code": "BH-FOUND-1 / BH-FOUND-2",
        "weeks": 6,
        "modules": [
            "Introduction to Cybersecurity",
            "Hardware and Mobile Devices",
            "Networking Fundamentals (TCP/IP, OSI)",
            "Security Concepts and Best Practices",
            "Advanced Networking & Protocols",
            "Operating System Administration",
        ],
        "certs": "CompTIA A+, CompTIA Network+",
        "has_practical": False,
        "assessment_weeks": 2,
        "notes": "Quizzes per lesson aligned to A+ and Network+ domains",
    },
    {
        "level": "Level 2",
        "title": "Core -Core Cyber Foundations",
        "code": "BH-CYBER-2",
        "weeks": 8,
        "modules": [
            "General Security Concepts",
            "Identity and Access Management",
            "Cryptography in Practice",
            "Threats and Vulnerabilities",
            "Vulnerability Assessment & Response",
            "Security Architecture & Resilience",
            "Monitoring & Security Operations (SIEM)",
            "Security Policies & Compliance",
        ],
        "certs": "CompTIA Security+ (SY0-701), ISC2 CC",
        "has_practical": False,
        "assessment_weeks": 2,
        "notes": "Core security knowledge -prepares for Security+ exam",
    },
    {
        "level": "Level 3",
        "title": "Practitioner -Choose Your Track",
        "code": "BH-OPS-2 / BH-GRC-2",
        "weeks": 8,
        "modules": [
            "Track A: Security Ops & Vulnerability Mgmt",
            "Track A: Incident Response & Recovery",
            "Track B: GRC Foundations & Risk Management",
            "Track B: Policy, Control Frameworks & Audit",
        ],
        "certs": "CompTIA CySA+ (CS0-003), ISC2 SSCP",
        "has_practical": True,
        "assessment_weeks": 3,
        "notes": "Choose Cyber Operations or GRC track. 4 practical exercises per track.",
    },
    {
        "level": "Level 4",
        "title": "Specialisation -Deep Expertise",
        "code": "BH-SPEC-*",
        "weeks": 10,
        "modules": [
            "SOC & Incident Response (CySA+ advanced)",
            "Identity & Access Management (CISSP IAM)",
            "Cloud Security (AWS/Azure/SC-200)",
            "Advanced GRC & Risk (CRISC)",
        ],
        "certs": "CySA+, CISSP, AWS Security, SC-200, CRISC",
        "has_practical": True,
        "assessment_weeks": 3,
        "notes": "Choose one specialisation. 4 practicals with scenario-based assessment.",
    },
    {
        "level": "Level 5",
        "title": "Advanced & Leadership",
        "code": "BH-ADV",
        "weeks": 8,
        "modules": [
            "Security & Risk Management (CISSP Domain 1)",
            "Security Program Development (CISM)",
            "Security Architecture & Engineering",
            "Leadership, Communication & Strategy",
        ],
        "certs": "CISSP, CISM, TOGAF",
        "has_practical": True,
        "assessment_weeks": 4,
        "notes": "Capstone project + portfolio. Assessment period includes project review.",
    },
]


# ── Schedule Builder ───────────────────────────────────────────

def build_schedule():
    """Build a week-by-week schedule with dates."""
    schedule = []
    current = START_DATE
    # Align to first Monday
    while current.weekday() != 0:
        current += timedelta(days=1)

    for course in CURRICULUM:
        # Teaching weeks
        for w in range(1, course["weeks"] + 1):
            week_start = current
            week_end = current + timedelta(days=3)  # Mon-Thu
            schedule.append({
                "week_start": week_start,
                "week_end": week_end,
                "level": course["level"],
                "title": course["title"],
                "phase": f"Teaching Week {w}/{course['weeks']}",
                "type": "teaching",
            })
            current += timedelta(days=7)

        # Assessment weeks
        for w in range(1, course["assessment_weeks"] + 1):
            week_start = current
            week_end = current + timedelta(days=3)
            label = "Assessment" if course["assessment_weeks"] == 1 else f"Assessment Week {w}/{course['assessment_weeks']}"
            if course["has_practical"] and w <= 2:
                label += " + Practical Review"
            schedule.append({
                "week_start": week_start,
                "week_end": week_end,
                "level": course["level"],
                "title": course["title"],
                "phase": label,
                "type": "assessment",
            })
            current += timedelta(days=7)

        # Break week between levels (except after last)
        if course != CURRICULUM[-1]:
            week_start = current
            week_end = current + timedelta(days=6)
            schedule.append({
                "week_start": week_start,
                "week_end": week_end,
                "level": "",
                "title": "Break & Catch-up Week",
                "phase": "Self-study / revision / rest",
                "type": "break",
            })
            current += timedelta(days=7)

    return schedule


# ── PDF Generation ─────────────────────────────────────────────

class SchedulePDF(FPDF):
    def __init__(self):
        super().__init__(orientation="P", unit="mm", format="A4")
        self.set_auto_page_break(auto=True, margin=20)

    def header(self):
        if self.page_no() > 1:
            self.set_font("Helvetica", "B", 9)
            self.set_text_color(*MUTED_COLOR)
            self.cell(0, 8, "Brown Hat Academy -2026 Learning Schedule", align="L")
            self.cell(0, 8, f"Page {self.page_no()}", align="R", new_x="LMARGIN", new_y="NEXT")
            self.set_draw_color(*PRIMARY_COLOR)
            self.set_line_width(0.3)
            self.line(10, self.get_y(), 200, self.get_y())
            self.ln(4)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "", 7)
        self.set_text_color(*MUTED_COLOR)
        self.cell(0, 10, "Brown Hat Academy | www.brownhat.academy | Confidential", align="C")


def generate_pdf():
    pdf = SchedulePDF()

    # ── Cover Page ──────────────────────────────────────
    pdf.add_page()
    pdf.ln(30)

    # Logo
    if os.path.exists(LOGO_PATH):
        pdf.image(LOGO_PATH, x=75, y=30, w=60)
        pdf.ln(55)
    else:
        pdf.ln(20)

    pdf.set_font("Helvetica", "B", 28)
    pdf.set_text_color(*DARK_COLOR)
    pdf.cell(0, 14, "Learning Schedule", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("Helvetica", "", 16)
    pdf.set_text_color(*PRIMARY_COLOR)
    pdf.cell(0, 10, "2026 Intake - Starting March 2026", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(10)
    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(*MUTED_COLOR)
    pdf.cell(0, 7, "Practical cybersecurity training from first principles", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 7, "to professional certification.", align="C", new_x="LMARGIN", new_y="NEXT")

    pdf.ln(15)

    # Key facts box
    pdf.set_fill_color(*LIGHT_BG)
    pdf.set_draw_color(*PRIMARY_COLOR)
    box_x, box_y = 30, pdf.get_y()
    box_w, box_h = 150, 52
    pdf.rect(box_x, box_y, box_w, box_h, style="DF")

    pdf.set_xy(box_x + 5, box_y + 5)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(*PRIMARY_COLOR)
    pdf.cell(box_w - 10, 7, "Programme Overview", new_x="LMARGIN", new_y="NEXT")

    facts = [
        ("Start Date:", "Monday, 2 March 2026"),
        ("Duration:", "Approximately 10 months (41 teaching weeks + assessments)"),
        ("Schedule:", "Monday to Thursday evenings, 17:00 - 20:00"),
        ("Live Sessions:", "Tuesday & Thursday (2 sessions per week)"),
        ("Levels:", "6 levels (Bridge through Advanced & Leadership)"),
        ("Certifications:", "CompTIA A+/Net+/Sec+/CySA+, ISC2 CC/SSCP, CISSP, CISM"),
    ]

    pdf.set_font("Helvetica", "", 9)
    for label, value in facts:
        pdf.set_x(box_x + 8)
        pdf.set_text_color(*DARK_COLOR)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(35, 6, label)
        pdf.set_font("Helvetica", "", 9)
        pdf.set_text_color(*MUTED_COLOR)
        pdf.cell(box_w - 48, 6, value, new_x="LMARGIN", new_y="NEXT")

    pdf.ln(20)

    # Session structure
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*DARK_COLOR)
    pdf.cell(0, 8, "Weekly Session Structure", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    days = [
        ("Monday", "17:00 - 20:00", "Self-paced study + Lab work", "Study & Labs"),
        ("Tuesday", "17:00 - 20:00", "Live instructor-led session", "Live Session"),
        ("Wednesday", "17:00 - 20:00", "Self-paced study + Lab work", "Study & Labs"),
        ("Thursday", "17:00 - 20:00", "Live instructor-led session", "Live Session"),
        ("Friday - Sunday", "--", "Rest / optional revision", "Off"),
    ]

    # Table header
    pdf.set_fill_color(*HEADER_BG)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(35, 8, "  Day", fill=True)
    pdf.cell(30, 8, "  Time", fill=True)
    pdf.cell(80, 8, "  Activity", fill=True)
    pdf.cell(40, 8, "  Type", fill=True, new_x="LMARGIN", new_y="NEXT")

    for i, (day, time, activity, typ) in enumerate(days):
        if i % 2 == 0:
            pdf.set_fill_color(*ROW_ALT)
        else:
            pdf.set_fill_color(*WHITE)
        pdf.set_text_color(*DARK_COLOR)
        pdf.set_font("Helvetica", "B" if "Live" in typ else "", 9)
        pdf.cell(35, 7, f"  {day}", fill=True)
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(30, 7, f"  {time}", fill=True)
        pdf.cell(80, 7, f"  {activity}", fill=True)
        color = ACCENT_GREEN if "Live" in typ else MUTED_COLOR if typ == "Off" else DARK_COLOR
        pdf.set_text_color(*color)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(40, 7, f"  {typ}", fill=True, new_x="LMARGIN", new_y="NEXT")

    # ── Curriculum Overview Page ─────────────────────────
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(*DARK_COLOR)
    pdf.cell(0, 10, "Curriculum Overview", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    for course in CURRICULUM:
        # Level header
        pdf.set_fill_color(*HEADER_BG)
        pdf.set_text_color(*WHITE)
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 8, f"  {course['level']}: {course['title']}", fill=True, new_x="LMARGIN", new_y="NEXT")

        pdf.set_text_color(*DARK_COLOR)
        pdf.set_font("Helvetica", "", 9)

        # Course info
        info_items = [
            f"Code: {course['code']}",
            f"Duration: {course['weeks']} teaching weeks + {course['assessment_weeks']} assessment week(s)",
            f"Certifications: {course['certs']}",
        ]
        if course["has_practical"]:
            info_items.append("Includes practical exercises and hands-on labs")

        for item in info_items:
            pdf.set_x(15)
            pdf.cell(0, 5.5, f"  {item}", new_x="LMARGIN", new_y="NEXT")

        # Modules
        pdf.set_x(15)
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(0, 6, "  Modules:", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 8.5)
        for mod in course["modules"]:
            pdf.set_x(20)
            pdf.cell(0, 5, f"  - {mod}", new_x="LMARGIN", new_y="NEXT")

        # Notes
        if course["notes"]:
            pdf.set_x(15)
            pdf.set_font("Helvetica", "I", 8)
            pdf.set_text_color(*MUTED_COLOR)
            pdf.cell(0, 5.5, f"  Note: {course['notes']}", new_x="LMARGIN", new_y="NEXT")
            pdf.set_text_color(*DARK_COLOR)

        pdf.ln(3)

    # ── Week-by-Week Schedule ────────────────────────────
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(*DARK_COLOR)
    pdf.cell(0, 10, "Week-by-Week Schedule", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(*MUTED_COLOR)
    pdf.cell(0, 5, "Sessions run Monday to Thursday, 17:00 - 20:00. Live sessions on Tuesday & Thursday.", new_x="LMARGIN", new_y="NEXT")
    pdf.cell(0, 5, "Public holidays are marked with (*). No sessions on public holidays or weekends.", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    schedule = build_schedule()

    # Table header
    pdf.set_fill_color(*HEADER_BG)
    pdf.set_text_color(*WHITE)
    pdf.set_font("Helvetica", "B", 8)
    pdf.cell(10, 7, "  #", fill=True)
    pdf.cell(30, 7, "  Dates", fill=True)
    pdf.cell(22, 7, "  Level", fill=True)
    pdf.cell(60, 7, "  Course", fill=True)
    pdf.cell(55, 7, "  Phase", fill=True, new_x="LMARGIN", new_y="NEXT")

    current_level = ""
    for i, week in enumerate(schedule):
        # Check if we need a new page
        if pdf.get_y() > 265:
            pdf.add_page()
            pdf.set_fill_color(*HEADER_BG)
            pdf.set_text_color(*WHITE)
            pdf.set_font("Helvetica", "B", 8)
            pdf.cell(10, 7, "  #", fill=True)
            pdf.cell(30, 7, "  Dates", fill=True)
            pdf.cell(22, 7, "  Level", fill=True)
            pdf.cell(60, 7, "  Course", fill=True)
            pdf.cell(55, 7, "  Phase", fill=True, new_x="LMARGIN", new_y="NEXT")

        # Check for holidays in this week
        has_holiday = False
        holiday_name = ""
        ws = week["week_start"]
        for d in range(4):  # Mon-Thu
            check_date = ws + timedelta(days=d)
            if check_date in WEEKDAY_HOLIDAYS:
                has_holiday = True
                holiday_name = SA_HOLIDAYS.get(check_date, "")
                break

        # Row colors
        if week["type"] == "break":
            pdf.set_fill_color(230, 240, 230)
        elif week["type"] == "assessment":
            pdf.set_fill_color(255, 248, 230)
        elif i % 2 == 0:
            pdf.set_fill_color(*ROW_ALT)
        else:
            pdf.set_fill_color(*WHITE)

        date_str = f"{ws.strftime('%d %b')} - {week['week_end'].strftime('%d %b')}"
        if has_holiday:
            date_str += " *"

        pdf.set_text_color(*DARK_COLOR)
        pdf.set_font("Helvetica", "", 8)
        pdf.cell(10, 6.5, f"  {i+1}", fill=True)
        pdf.cell(30, 6.5, f"  {date_str}", fill=True)

        if week["type"] == "break":
            pdf.set_font("Helvetica", "I", 8)
            pdf.set_text_color(*ACCENT_GREEN)
            pdf.cell(22, 6.5, "", fill=True)
            pdf.cell(60, 6.5, f"  {week['title']}", fill=True)
            pdf.cell(55, 6.5, f"  {week['phase']}", fill=True, new_x="LMARGIN", new_y="NEXT")
        else:
            pdf.set_font("Helvetica", "B" if week["level"] != current_level else "", 8)
            pdf.cell(22, 6.5, f"  {week['level']}", fill=True)
            pdf.set_font("Helvetica", "", 8)

            title = week["title"]
            if len(title) > 35:
                title = title[:33] + ".."
            pdf.cell(60, 6.5, f"  {title}", fill=True)

            if week["type"] == "assessment":
                pdf.set_text_color(180, 120, 0)
                pdf.set_font("Helvetica", "B", 8)
            pdf.cell(55, 6.5, f"  {week['phase']}", fill=True, new_x="LMARGIN", new_y="NEXT")

        if week["level"]:
            current_level = week["level"]

        # Holiday note
        if has_holiday:
            pdf.set_font("Helvetica", "I", 7)
            pdf.set_text_color(180, 60, 60)
            pdf.set_x(15)
            pdf.cell(0, 4.5, f"    * Public Holiday: {holiday_name} -session rescheduled or self-study", new_x="LMARGIN", new_y="NEXT")

    # End date
    last_week = schedule[-1]
    end_date = last_week["week_end"] + timedelta(days=3)
    pdf.ln(5)
    pdf.set_font("Helvetica", "B", 10)
    pdf.set_text_color(*PRIMARY_COLOR)
    pdf.cell(0, 7, f"Programme End Date: Approximately {end_date.strftime('%d %B %Y')}", align="L", new_x="LMARGIN", new_y="NEXT")

    # ── Public Holidays Reference ────────────────────────
    pdf.ln(6)
    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*DARK_COLOR)
    pdf.cell(0, 8, "South African Public Holidays 2026", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    pdf.set_font("Helvetica", "", 8.5)
    for d, name in sorted(SA_HOLIDAYS.items()):
        if d < START_DATE or d > end_date:
            continue
        affects = d in WEEKDAY_HOLIDAYS
        pdf.set_text_color(*DARK_COLOR if affects else MUTED_COLOR)
        marker = "  *" if affects else "   "
        pdf.cell(0, 5.5, f" {marker} {d.strftime('%A, %d %B %Y')} - {name}" + (" (affects schedule)" if affects else ""), new_x="LMARGIN", new_y="NEXT")

    # ── Assessment Policy ────────────────────────────────
    if pdf.get_y() > 230:
        pdf.add_page()
    else:
        pdf.ln(8)

    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*DARK_COLOR)
    pdf.cell(0, 8, "Assessment & Grading Policy", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    policies = [
        ("Quizzes", "Per-lesson quizzes aligned to certification exam objectives. Results available immediately."),
        ("Practical Exercises", "Scenario-based practical work assessed within 2-3 weeks of submission."),
        ("Project Assessment", "Capstone and major projects assessed within 8-10 weeks. Detailed feedback provided."),
        ("Certification Prep", "Mock exams and study guides provided 2 weeks before each certification window."),
        ("Minimum Pass Mark", "70% for quizzes, Competent/Not Yet Competent for practicals."),
        ("Resubmission", "One resubmission allowed per practical within 7 days of feedback."),
    ]

    for label, desc in policies:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*DARK_COLOR)
        pdf.cell(0, 6, f"  {label}", new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 8.5)
        pdf.set_text_color(*MUTED_COLOR)
        pdf.set_x(15)
        pdf.multi_cell(175, 5, f"  {desc}", new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

    # ── Important Notes ──────────────────────────────────
    if pdf.get_y() > 230:
        pdf.add_page()
    else:
        pdf.ln(6)

    pdf.set_font("Helvetica", "B", 12)
    pdf.set_text_color(*DARK_COLOR)
    pdf.cell(0, 8, "Important Notes", align="L", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    notes = [
        "All sessions run in the evenings: 17:00 - 20:00 (SAST) to accommodate working professionals.",
        "Live sessions are held on Tuesdays and Thursdays. Monday and Wednesday are for self-paced study and lab work.",
        "Fridays, Saturdays, and Sundays are rest days -no scheduled sessions.",
        "No sessions are scheduled on South African public holidays. Affected weeks may have reduced contact time.",
        "At Level 3, students choose between Cyber Operations and GRC tracks.",
        "At Level 4, students choose one specialisation: SOC & IR, IAM, Cloud Security, or Advanced GRC.",
        "Students must complete each level before progressing to the next.",
        "Break weeks between levels are provided for revision, catch-up, and rest.",
        "The schedule is designed to be fast-paced but realistic -approximately 10 months from start to completion.",
        "All dates are subject to change. Students will be notified of any schedule adjustments in advance.",
    ]

    pdf.set_font("Helvetica", "", 8.5)
    pdf.set_text_color(*MUTED_COLOR)
    for note in notes:
        pdf.set_x(15)
        bullet_y = pdf.get_y() + 2
        pdf.set_text_color(*PRIMARY_COLOR)
        pdf.set_font("Helvetica", "B", 8.5)
        pdf.cell(5, 5, "-")
        pdf.set_text_color(*MUTED_COLOR)
        pdf.set_font("Helvetica", "", 8.5)
        pdf.multi_cell(165, 5, note, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(0.5)

    # ── Save ─────────────────────────────────────────────
    pdf.output(OUTPUT_PATH)
    print(f"PDF generated: {OUTPUT_PATH}")
    print(f"Total schedule weeks: {len(build_schedule())}")
    last = build_schedule()[-1]
    print(f"Programme ends approximately: {(last['week_end'] + timedelta(days=3)).strftime('%d %B %Y')}")


if __name__ == "__main__":
    generate_pdf()
