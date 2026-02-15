-- Curriculum expansion for migration-defined courses.
-- Adds new theory and tool lessons to BH-GRC-2, BH-SPEC-IAM, BH-SPEC-CLOUD, BH-SPEC-GRC.
-- Replaces BH-SPEC-CLOUD capstone with cloud-aligned project.
-- Adds Microsoft SC-200 content to BH-SPEC-CLOUD.

BEGIN;

-- ========== Ensure the four courses exist (idempotent) ==========
INSERT INTO public.courses (id, code, title, description, level, required_tier_level, duration_hours, order_index, aligned_certifications) VALUES
  ('a0000000-0000-4000-8000-000000000008', 'BH-GRC-2',      'Practitioner Core: GRC',          'Governance, risk, and compliance.',          3, 2, 100, 5, ARRAY['ISC² SSCP']),
  ('a0000000-0000-4000-8000-000000000009', 'BH-SPEC-IAM',    'Specialisation: IAM',             'Identity and Access Management.',            4, 3, 120, 7, ARRAY['CISSP']),
  ('a0000000-0000-4000-8000-00000000000a', 'BH-SPEC-CLOUD',  'Specialisation: Cloud Security',  'Cloud security (AWS, Azure, GCP).',          4, 3, 120, 8, ARRAY['AWS Security','Microsoft SC-200']),
  ('a0000000-0000-4000-8000-00000000000b', 'BH-SPEC-GRC',    'Specialisation: Advanced GRC',    'Advanced governance, risk, and compliance.', 4, 3, 120, 9, ARRAY['CRISC'])
ON CONFLICT (code) DO NOTHING;

-- ========== Ensure modules exist (idempotent) ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('d0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000008', 'Compliance and Audit', 'Compliance programmes, audits, and reporting.', 4),
  ('d0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000009', 'Access Control Models and Mechanisms', 'DAC, MAC, RBAC, ABAC, MFA, and privileged access.', 2),
  ('d0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000009', 'IAM in Practice', 'Zero trust, cloud IAM, monitoring, and incident response.', 4),
  ('d0000000-0000-4000-8000-000000000021', 'a0000000-0000-4000-8000-00000000000a', 'Cloud Security Fundamentals', 'Shared responsibility, cloud models, and threats.', 1),
  ('d0000000-0000-4000-8000-000000000023', 'a0000000-0000-4000-8000-00000000000a', 'Cloud Infrastructure and Network Security', 'VPC, security groups, and network segmentation.', 3),
  ('d0000000-0000-4000-8000-000000000024', 'a0000000-0000-4000-8000-00000000000a', 'Cloud Security Operations', 'Cloud monitoring, logging, and incident response.', 4),
  ('d0000000-0000-4000-8000-000000000033', 'a0000000-0000-4000-8000-00000000000b', 'Risk Response and Monitoring', 'KRIs, dashboards, and ongoing monitoring.', 3),
  ('d0000000-0000-4000-8000-000000000034', 'a0000000-0000-4000-8000-00000000000b', 'Governance and Reporting', 'Board reporting, governance frameworks, and compliance.', 4)
ON CONFLICT (id) DO NOTHING;

-- =====================================================================
-- ========== BH-GRC-2: New Lesson — Module 4 ==========
-- =====================================================================
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('d0000000-0000-4000-8000-000000000004', 'Security Auditing with Lynis',
 'Using Lynis for system hardening audits and mapping findings to compliance frameworks.',
$md$
# Security Auditing with Lynis

## Objectives

By the end of this lesson you will be able to:

- Describe what Lynis is and how it supports security auditing.
- Run a Lynis audit and interpret the results.
- Map Lynis findings to compliance frameworks (NIST CSF, ISO 27001).
- Use Lynis output as audit evidence.

## What Is Lynis?

Lynis is an open-source security auditing tool for Linux, macOS, and Unix systems. It performs a comprehensive security scan covering:

- System configuration
- Authentication and access controls
- File permissions and integrity
- Firewall and network settings
- Kernel hardening
- Software and package management
- Logging and auditing configuration

Lynis is pre-installed on Kali Linux and widely used by security professionals, auditors, and system administrators.

## Running a Lynis Audit

### Basic Audit

```
sudo lynis audit system
```

This runs all test categories and produces a comprehensive report. The scan takes 2–5 minutes.

### Quick Audit

```
sudo lynis audit system --quick
```

Same tests but skips waiting for user input between sections.

### Viewing Results

After the scan completes, Lynis shows:

- **Warnings** — serious issues that should be addressed.
- **Suggestions** — improvements that would strengthen security.
- **Hardening index** — a score from 0 to 100 indicating overall hardening level.

View specific results:

```
sudo grep -E "warning|suggestion" /var/log/lynis.log
sudo grep "hardening_index" /var/log/lynis-report.dat
```

## Interpreting Lynis Output

### Hardening Index

| Score Range | Assessment |
|-------------|-----------|
| 80–100 | Well hardened |
| 60–79 | Moderate — some improvements needed |
| 40–59 | Below average — significant gaps |
| Below 40 | Poor — many controls missing |

### Test Categories

Lynis organises tests into categories:

| Category | What It Checks |
|----------|---------------|
| Boot and services | Boot loader security, running services |
| Kernel | Kernel parameters, modules, sysctl settings |
| Memory and processes | Process accounting, memory protection |
| Users and groups | Account configuration, password policies, sudo |
| Networking | Firewall, open ports, IP forwarding |
| Storage | Mount options, disk encryption |
| File systems | File permissions, SUID/SGID files |
| Software | Package managers, installed software, updates |
| Logging | Syslog configuration, log rotation, audit daemon |
| Cryptography | SSL/TLS settings, certificate validation |

## Mapping to Compliance Frameworks

Lynis findings can be mapped to framework controls:

| Lynis Finding | NIST CSF | ISO 27001 Annex A |
|---------------|----------|-------------------|
| No firewall active | PR.AC-5 (Network integrity) | A.8.20 (Network security) |
| Weak file permissions | PR.AC-1 (Identity/credential management) | A.8.3 (Information access restriction) |
| No automatic updates | PR.MA-1 (Maintenance) | A.8.8 (Management of technical vulnerabilities) |
| Logging not configured | DE.AE-3 (Event analysis) | A.8.15 (Logging) |
| No password policy | PR.AC-1 | A.5.17 (Authentication information) |

### Using Lynis as Audit Evidence

For each finding:

1. **Screenshot** the Lynis output showing the finding.
2. **Map** it to the relevant framework control.
3. **Assess** severity (critical, high, medium, low).
4. **Document** the remediation plan or risk acceptance.

This creates a direct link from technical evidence → compliance requirement → risk decision — exactly what auditors need.

## Key Takeaways

- Lynis provides automated, comprehensive security auditing for Linux systems.
- The hardening index gives a quick overall assessment; warnings and suggestions provide detail.
- Map Lynis findings to NIST CSF and ISO 27001 for compliance evidence.
- Lynis output serves as both technical evidence and a remediation roadmap.
$md$, 10, 5);

-- =====================================================================
-- ========== BH-SPEC-IAM: New Lessons ==========
-- =====================================================================

-- Module 2: Access Control Models — Physical Access Control and Biometrics
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('d0000000-0000-4000-8000-000000000012', 'Physical Access Control and Biometrics',
 'Physical security controls, biometric systems, and their integration with logical IAM.',
$md$
# Physical Access Control and Biometrics

## Objectives

By the end of this lesson you will be able to:

- Describe physical access control mechanisms and their layered deployment.
- Explain biometric authentication types, error rates, and selection criteria.
- Describe how physical and logical access controls integrate.

## Physical Access Control Layers

Physical security uses defence in depth, just like logical security:

| Layer | Controls | Purpose |
|-------|----------|---------|
| **Perimeter** | Fences, gates, lighting, CCTV, guards | Deter and detect unauthorised approach |
| **Building** | Locks, badge readers, mantraps/vestibules, visitor management | Control who enters the building |
| **Floor / zone** | Badge readers, cipher locks, key cards | Restrict access to specific areas |
| **Room** | Biometric readers, PINs, physical keys | Protect high-security areas (server rooms, safes) |

### Key Physical Controls

| Control | Description | Exam Note |
|---------|-------------|-----------|
| **Mantrap / vestibule** | Double-door system where only one door opens at a time; prevents tailgating | CISSP Domain 5 |
| **Turnstile** | Controlled entry point; counts entries | Prevents multiple entries on one badge |
| **Bollard** | Short concrete or steel post | Vehicle attack prevention |
| **CCTV** | Video surveillance | Detective control; deterrent when visible |
| **Guard** | Human security personnel | Can make judgement calls; expensive |
| **Cipher lock** | Mechanical or electronic combination lock | No badge needed; combination must be changed regularly |
| **Cable lock** | Physical lock attaching equipment to a desk | Prevents laptop theft |

## Biometric Authentication

Biometrics use unique physical or behavioural characteristics for authentication. They are "something you are" — the third authentication factor.

### Types

| Biometric | Type | Accuracy | Notes |
|-----------|------|----------|-------|
| **Fingerprint** | Physical | High | Most common; inexpensive; can be spoofed with effort |
| **Iris scan** | Physical | Very high | Scans the coloured ring of the eye; contactless |
| **Retina scan** | Physical | Highest | Scans blood vessel pattern; more invasive; expensive |
| **Facial recognition** | Physical | High | Contactless; affected by lighting, masks, ageing |
| **Voice recognition** | Behavioural | Moderate | Can be affected by illness, background noise |
| **Keystroke dynamics** | Behavioural | Moderate | Measures typing rhythm; used as second factor |
| **Gait analysis** | Behavioural | Moderate | Measures walking pattern; used in surveillance |

### Error Rates

| Metric | Definition | Implication |
|--------|-----------|-------------|
| **FAR** (False Acceptance Rate) | Percentage of impostors incorrectly accepted | Security risk — too high means unauthorised access |
| **FRR** (False Rejection Rate) | Percentage of legitimate users incorrectly rejected | Usability issue — too high frustrates users |
| **CER / EER** (Crossover Error Rate) | Point where FAR = FRR | Lower CER = better overall accuracy |

**Exam tip (CISSP):** The CER (or EER) is the standard metric for comparing biometric systems. A system with CER of 1% is more accurate than one with CER of 3%.

## Integration: Physical + Logical

Best practice is to integrate physical and logical access control:

- **Converged access** — same badge for building entry and computer login.
- **Conditional access** — deny VPN login if the user's badge has not been swiped at the building.
- **Unified audit** — correlate physical entry logs with logical access logs to detect anomalies (e.g. someone logged in from inside the building at a time when they did not badge in).

## Key Takeaways

- Physical access control uses layered defence: perimeter → building → floor → room.
- Biometric accuracy is measured by FAR, FRR, and CER (lower CER = better).
- Iris scan and retina scan are the most accurate biometrics; fingerprint is the most common.
- Integrating physical and logical access controls improves security and anomaly detection.
$md$, 10, 5),

-- Module 4: IAM in Practice — Linux Access Control Mechanics
('d0000000-0000-4000-8000-000000000014', 'Linux Access Control Mechanics',
 'Hands-on Linux file permissions, user management, and sudo configuration for the capstone.',
$md$
# Linux Access Control Mechanics

## Objectives

By the end of this lesson you will be able to:

- Create, modify, and delete user accounts on Linux.
- Set and interpret file permissions using chmod and chown.
- Configure and audit sudo access.
- Implement password policies with chage and PAM.

## User Management

### Creating Users

```
sudo adduser analyst           # Interactive — prompts for password, name, etc.
sudo useradd -m -s /bin/bash analyst  # Non-interactive — creates home directory, sets shell
```

### Modifying Users

```
sudo usermod -aG sudo analyst     # Add to sudo group
sudo usermod -L analyst           # Lock account (disable login)
sudo usermod -U analyst           # Unlock account
sudo usermod -s /usr/sbin/nologin analyst  # Set no-login shell (for service accounts)
```

### Deleting Users

```
sudo deluser analyst              # Remove user (keep home directory)
sudo deluser --remove-home analyst  # Remove user and home directory
```

## File Permissions

### Understanding the Permission String

```
-rwxr-xr-- 1 alice finance 4096 Feb 10 10:00 report.pdf
```

| Part | Meaning |
|------|---------|
| `-` | File type (- = file, d = directory, l = symlink) |
| `rwx` | Owner (alice) permissions: read, write, execute |
| `r-x` | Group (finance) permissions: read, execute |
| `r--` | Others permissions: read only |

### Numeric (Octal) Permissions

| Permission | Value |
|-----------|-------|
| Read (r) | 4 |
| Write (w) | 2 |
| Execute (x) | 1 |

Examples: `rwxr-xr--` = 754, `rw-r--r--` = 644, `rwx------` = 700.

### Changing Permissions

```
chmod 750 script.sh           # Owner: rwx, Group: r-x, Others: none
chmod u+x script.sh           # Add execute for owner
chmod go-w config.txt         # Remove write for group and others
chmod -R 640 /data/reports/   # Recursive change
```

### Changing Ownership

```
chown alice:finance report.pdf       # Change owner and group
chown -R alice:finance /data/reports/  # Recursive
```

## Sudo Configuration

### Viewing Your Sudo Privileges

```
sudo -l         # List what the current user can do with sudo
```

### The sudoers File

Edit with `visudo` (syntax checking prevents lockout):

```
sudo visudo
```

Key lines:

```
root    ALL=(ALL:ALL) ALL           # root can do anything
%sudo   ALL=(ALL:ALL) ALL           # Members of sudo group can do anything
analyst ALL=(ALL) /usr/bin/systemctl  # analyst can only run systemctl
```

### Auditing Sudo Usage

```
grep sudo /var/log/auth.log         # View sudo usage in auth log
journalctl _COMM=sudo               # View sudo entries in journal
```

## Password Policies with chage

```
sudo chage -l analyst               # View password policy for user
sudo chage -M 90 analyst            # Maximum password age: 90 days
sudo chage -m 7 analyst             # Minimum password age: 7 days
sudo chage -W 14 analyst            # Warning: 14 days before expiry
sudo chage -E 2026-12-31 analyst    # Account expires on this date
```

## Special Permissions

| Permission | Meaning | Security Note |
|-----------|---------|---------------|
| **SUID** (Set User ID) | File executes as the file owner, not the user running it | `chmod u+s file`. Dangerous if set on the wrong binary (privilege escalation). |
| **SGID** (Set Group ID) | File executes as the file's group; directories inherit group | `chmod g+s dir`. |
| **Sticky bit** | Only file owner can delete files in the directory | `chmod +t /tmp`. Protects shared directories. |

### Finding SUID/SGID Files (Security Audit)

```
find / -perm -4000 -type f 2>/dev/null    # Find all SUID files
find / -perm -2000 -type f 2>/dev/null    # Find all SGID files
```

Unexpected SUID files are a common privilege escalation vector. Review any unfamiliar entries.

## Key Takeaways

- Use `adduser` / `usermod` / `deluser` for user lifecycle management.
- File permissions use owner/group/others with read(4)/write(2)/execute(1).
- sudo configuration in `/etc/sudoers` controls privilege escalation — edit with `visudo`.
- `chage` manages password policies; SUID/SGID files need regular auditing.
$md$, 15, 5);

-- =====================================================================
-- ========== BH-SPEC-CLOUD: New Lessons ==========
-- =====================================================================

-- Module 1: Cloud Security Fundamentals — Microsoft Defender and Sentinel
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('d0000000-0000-4000-8000-000000000021', 'Microsoft Defender and Microsoft Sentinel',
 'Microsoft security stack: Defender XDR and Sentinel SIEM for SC-200 alignment.',
$md$
# Microsoft Defender and Microsoft Sentinel

## Objectives

By the end of this lesson you will be able to:

- Describe the Microsoft Defender XDR product suite and its components.
- Explain Microsoft Sentinel as a cloud-native SIEM/SOAR.
- Describe how Defender and Sentinel work together for detection and response.
- Identify key SC-200 exam concepts.

## Microsoft Defender XDR

Microsoft Defender XDR (Extended Detection and Response) is a unified security platform that correlates signals across endpoints, identities, email, and cloud applications.

### Components

| Product | Protects | Key Capabilities |
|---------|----------|-----------------|
| **Defender for Endpoint** | Workstations, servers | EDR, vulnerability management, attack surface reduction, automated investigation |
| **Defender for Identity** | Active Directory | Detects identity-based attacks (pass-the-hash, golden ticket, lateral movement) |
| **Defender for Office 365** | Email, collaboration | Anti-phishing, safe attachments, safe links, automated investigation |
| **Defender for Cloud Apps** | SaaS applications | CASB, app discovery, session controls, DLP for cloud apps |
| **Defender for Cloud** | Azure, AWS, GCP workloads | CSPM (Cloud Security Posture Management), CWP (Cloud Workload Protection) |

### Unified Incident View

Defender XDR correlates alerts from all components into a single **incident**. An incident might combine:
- Defender for Office 365: phishing email received.
- Defender for Endpoint: malicious attachment executed.
- Defender for Identity: lateral movement to domain controller.

This correlation gives analysts the full attack story in one view, rather than investigating separate alerts.

### Automated Investigation and Response

Defender XDR can automatically:
- Quarantine email messages.
- Isolate compromised devices.
- Disable compromised accounts.
- Block malicious files across all endpoints.

Automation levels: **Full** (auto-remediate), **Semi** (approve before action), **No** (manual only).

## Microsoft Sentinel

Microsoft Sentinel is a cloud-native SIEM (Security Information and Event Management) and SOAR (Security Orchestration, Automation, and Response) built on Azure.

### Key Features

| Feature | Description |
|---------|-------------|
| **Data connectors** | Ingest logs from Microsoft 365, Azure, AWS, on-premises, third-party tools (200+ connectors) |
| **Analytics rules** | Detect threats using scheduled queries, Microsoft security alerts, ML, and anomaly detection |
| **Incidents** | Group related alerts into incidents for investigation |
| **Workbooks** | Dashboards and visualisations for monitoring |
| **Playbooks** | Automated response workflows using Azure Logic Apps (SOAR) |
| **Hunting** | Proactive threat hunting using KQL (Kusto Query Language) |
| **Notebooks** | Jupyter notebooks for advanced investigation |

### Kusto Query Language (KQL)

KQL is used for querying logs in Sentinel:

```kql
SecurityEvent
| where EventID == 4625
| summarize FailedAttempts = count() by TargetAccount, IpAddress
| where FailedAttempts > 20
| sort by FailedAttempts desc
```

This query finds accounts with more than 20 failed logon attempts, grouped by account and source IP — a brute-force detection.

## Defender + Sentinel Integration

| Defender XDR | Sentinel |
|-------------|----------|
| Real-time detection and automated response | Long-term storage, correlation, and hunting |
| Focused on Microsoft ecosystem | Connects to any data source |
| Incident-level automation | Playbook-level orchestration |

Best practice: use Defender XDR for immediate detection and response; forward all Defender alerts to Sentinel for correlation with non-Microsoft data sources, long-term retention, and advanced hunting.

## SC-200 Exam Alignment

The Microsoft SC-200 exam covers three areas:

| Domain | Weight | Key Topics |
|--------|--------|------------|
| **Mitigate threats using Microsoft Defender XDR** | ~25-30% | Defender for Endpoint, Identity, Office 365, Cloud Apps |
| **Mitigate threats using Defender for Cloud** | ~15-20% | CSPM, CWP, regulatory compliance |
| **Mitigate threats using Microsoft Sentinel** | ~50-55% | Design, data connectors, analytics, incidents, hunting, playbooks |

## Key Takeaways

- Defender XDR unifies endpoint, identity, email, and cloud app protection with correlated incidents.
- Sentinel is a cloud-native SIEM/SOAR that ingests from 200+ sources and uses KQL for analytics and hunting.
- Together they provide detection (Defender) + correlation and automation (Sentinel).
- SC-200 focuses heavily on Sentinel (~50-55%) — know KQL, analytics rules, and playbooks.
$md$, 10, 5),

-- Module 3: Cloud Infrastructure and Network Security — TLS and Web Security
('d0000000-0000-4000-8000-000000000023', 'TLS, Certificates, and Web Security Fundamentals',
 'TLS protocol, certificate management, and web security headers.',
$md$
# TLS, Certificates, and Web Security Fundamentals

## Objectives

By the end of this lesson you will be able to:

- Describe the TLS handshake and how it establishes a secure connection.
- Explain certificate types, chains, and management.
- Identify critical web security headers and their purpose.
- Describe common TLS misconfigurations and their risks.

## TLS (Transport Layer Security)

TLS encrypts communication between clients and servers. It provides confidentiality (encryption), integrity (message authentication), and authentication (certificate verification).

### TLS Versions

| Version | Status | Notes |
|---------|--------|-------|
| SSL 2.0, 3.0 | Deprecated | Vulnerable; never use |
| TLS 1.0, 1.1 | Deprecated | Known vulnerabilities; browsers no longer support |
| TLS 1.2 | Current (acceptable) | Widely supported; secure with proper cipher suites |
| TLS 1.3 | Current (recommended) | Faster handshake; removed weak algorithms; forward secrecy mandatory |

### TLS 1.3 Handshake (Simplified)

1. **Client Hello** — client sends supported cipher suites, key share.
2. **Server Hello** — server selects cipher suite, sends its key share and certificate.
3. **Finished** — both sides derive session keys; encrypted communication begins.

TLS 1.3 completes in one round trip (vs two in TLS 1.2), improving performance.

### Forward Secrecy

If a server's private key is compromised in the future, forward secrecy ensures past communications cannot be decrypted. TLS 1.3 enforces this using ephemeral key exchange (ECDHE).

## Certificates

### Certificate Types

| Type | Validation | Use Case |
|------|-----------|----------|
| **DV** (Domain Validated) | CA verifies domain ownership only | Basic HTTPS; free (Let's Encrypt) |
| **OV** (Organisation Validated) | CA verifies organisation identity | Business websites |
| **EV** (Extended Validation) | Thorough identity verification | Financial, healthcare (shows org name in browser) |
| **Wildcard** | Covers all subdomains (*.example.com) | Multiple subdomains |
| **SAN** (Subject Alternative Name) | Multiple specific domains in one cert | Multiple domains on one server |

### Certificate Chain

Root CA → Intermediate CA → End-entity (server) certificate. Browsers trust root CAs in their trust store. The server sends its certificate + intermediate CA cert; the browser builds and validates the chain.

### Certificate Management

| Task | Consideration |
|------|--------------|
| **Renewal** | Certificates expire (90 days for Let's Encrypt, 1 year for commercial); automate renewal |
| **Revocation** | CRL (list of revoked certs) or OCSP (real-time check) |
| **Private key protection** | Store in HSM or secure key vault; never expose |
| **Monitoring** | Alert before expiry; detect unexpected certificates (Certificate Transparency logs) |

## Web Security Headers

| Header | Purpose | Recommended Value |
|--------|---------|-------------------|
| `Strict-Transport-Security` (HSTS) | Force HTTPS; prevent downgrade attacks | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` (CSP) | Control which scripts, styles, images can load | Define sources explicitly; prevents XSS |
| `X-Content-Type-Options` | Prevent MIME type sniffing | `nosniff` |
| `X-Frame-Options` | Prevent clickjacking (embedding in iframe) | `DENY` or `SAMEORIGIN` |
| `Referrer-Policy` | Control referrer information sent | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Control browser features (camera, mic, location) | Restrict to required features only |

## Common TLS Misconfigurations

| Issue | Risk | Detection |
|-------|------|-----------|
| Expired certificate | Browser warnings; users ignore warnings | Certificate monitoring |
| Self-signed certificate in production | No chain of trust; MITM risk | Certificate audit |
| Supporting TLS 1.0/1.1 | Known vulnerabilities (BEAST, POODLE) | TLS scanner (testssl.sh, ssllabs.com) |
| Weak cipher suites (RC4, DES, export ciphers) | Breakable encryption | TLS scanner |
| Missing HSTS | Downgrade attack possible | Header scanner |
| Certificate private key on web server as world-readable | Key compromise | File permission audit |

## Key Takeaways

- TLS 1.3 is the recommended version — one-round-trip handshake, mandatory forward secrecy.
- Know the certificate types (DV, OV, EV) and the chain of trust model.
- Web security headers (HSTS, CSP, X-Frame-Options) are critical complementary controls.
- Common misconfigurations: expired certs, weak ciphers, missing HSTS, supporting legacy TLS.
$md$, 10, 5),

-- Module 3: Cloud Infrastructure — Cloud and Web Assessment Tools
('d0000000-0000-4000-8000-000000000023', 'Cloud and Web Assessment Tools',
 'Hands-on introduction to testssl.sh, curl, openssl, and nmap for web and cloud security assessment.',
$md$
# Cloud and Web Assessment Tools

## Objectives

By the end of this lesson you will be able to:

- Use testssl.sh to assess TLS/SSL configuration of web servers.
- Use curl to inspect HTTP headers and test web security.
- Use openssl to examine certificates from the command line.
- Use nmap for web service detection and vulnerability scanning.

## testssl.sh

testssl.sh is a comprehensive TLS/SSL testing tool. It checks protocols, cipher suites, vulnerabilities, and certificate details.

### Installation (if not already installed)

```
sudo apt update && sudo apt install -y testssl.sh
```

### Basic Usage

```
testssl.sh example.com
```

This tests: supported protocols, cipher suites, certificate details, known vulnerabilities (BEAST, POODLE, Heartbleed, etc.), and HTTP security headers.

### Specific Tests

```
testssl.sh --protocols example.com     # Test supported TLS/SSL versions only
testssl.sh --headers example.com       # Test HTTP security headers only
testssl.sh --vulnerable example.com    # Test for known vulnerabilities only
```

### Reading Output

testssl.sh uses colour-coded output:
- **Green** — good (secure configuration)
- **Yellow** — warning (suboptimal)
- **Red** — critical (vulnerable or misconfigured)

Key things to look for:
- **TLS 1.0/1.1 offered** — should be disabled.
- **Weak ciphers** — RC4, DES, export ciphers should not be offered.
- **HSTS not set** — should be present for production sites.
- **Certificate issues** — expired, wrong hostname, weak signature algorithm.

## curl — HTTP Header Inspection

curl is a command-line tool for transferring data. For security, use it to inspect HTTP headers:

```
curl -I https://example.com                    # Show response headers only
curl -Iv https://example.com 2>&1 | head -30   # Verbose (shows TLS negotiation)
curl -s -o /dev/null -w "%{http_code}" https://example.com  # Just the status code
```

### Checking Security Headers

```
curl -sI https://example.com | grep -iE "strict-transport|content-security|x-frame|x-content-type|referrer-policy"
```

## openssl — Certificate Inspection

```
# Connect and show the certificate:
openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -text

# Show just the subject and issuer:
openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates

# Check certificate expiry:
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null | openssl x509 -noout -enddate
```

Key fields to examine:
- **Subject** — who the certificate is for (CN or SAN).
- **Issuer** — which CA signed it.
- **Not After** — expiry date.
- **Signature Algorithm** — should be SHA-256 or stronger (not SHA-1).

## nmap for Web Services

```
nmap -sV -p 80,443 example.com                # Service detection on web ports
nmap --script ssl-enum-ciphers -p 443 example.com  # Enumerate TLS cipher suites
nmap --script http-security-headers -p 443 example.com  # Check security headers
```

## Practical Workflow

A typical web/cloud security assessment follows these steps:

1. **testssl.sh** — comprehensive TLS assessment.
2. **curl** — check HTTP security headers.
3. **openssl** — inspect certificate details and chain.
4. **nmap** — service detection and additional vulnerability checks.
5. **Document** — compile findings, rate severity, and recommend fixes.

## Key Takeaways

- testssl.sh is the most comprehensive TLS testing tool — use it as the primary scanner.
- curl -I quickly shows HTTP security headers.
- openssl s_client inspects certificates, expiry, and chain from the command line.
- nmap complements with service detection and scripted checks.
$md$, 10, 6),

-- Module 4: Cloud Security Operations — AWS Security Services
('d0000000-0000-4000-8000-000000000024', 'AWS Security Services',
 'GuardDuty, Config, Inspector, KMS, Macie, Security Hub, WAF, and Shield.',
$md$
# AWS Security Services

## Objectives

By the end of this lesson you will be able to:

- Describe the key AWS security services and their functions.
- Explain how AWS native security services fit into a cloud security programme.
- Map AWS services to security capabilities (detection, prevention, compliance, encryption).

## AWS Security Service Overview

### Threat Detection

| Service | Function | Key Feature |
|---------|----------|-------------|
| **GuardDuty** | Threat detection | Analyses CloudTrail, VPC Flow Logs, and DNS logs using ML to detect threats (reconnaissance, credential compromise, cryptomining, C2) |
| **Security Hub** | Centralised security dashboard | Aggregates findings from GuardDuty, Inspector, Macie, Config, and third-party tools into one view |

### Configuration and Compliance

| Service | Function | Key Feature |
|---------|----------|-------------|
| **AWS Config** | Configuration compliance | Continuously monitors resource configurations; rules check against best practices (e.g. "S3 bucket must not be public") |
| **CloudTrail** | API activity logging | Records all API calls (who, what, when, from where); essential for investigation and compliance |
| **Trusted Advisor** | Best practice recommendations | Checks across cost, performance, security, fault tolerance, and service limits |

### Vulnerability and Data Protection

| Service | Function | Key Feature |
|---------|----------|-------------|
| **Inspector** | Vulnerability assessment | Scans EC2 instances, Lambda functions, and container images for software vulnerabilities and network exposure |
| **Macie** | Data discovery and classification | Uses ML to discover and classify sensitive data (PII, financial data) in S3 buckets |
| **KMS** (Key Management Service) | Encryption key management | Create and manage encryption keys; integrates with S3, EBS, RDS, and other services for encryption at rest |
| **Secrets Manager** | Secrets storage | Store and rotate API keys, passwords, database credentials securely |

### Network Protection

| Service | Function | Key Feature |
|---------|----------|-------------|
| **WAF** (Web Application Firewall) | Application layer protection | Filters HTTP/HTTPS requests based on rules (IP blocking, rate limiting, SQL injection patterns) |
| **Shield** | DDoS protection | Standard (free, automatic) and Advanced (paid, managed DDoS response team) |
| **Network Firewall** | Network layer filtering | Stateful inspection, IDS/IPS, domain filtering for VPCs |

### Identity and Access

| Service | Function | Key Feature |
|---------|----------|-------------|
| **IAM** | Identity management | Users, groups, roles, policies; principle of least privilege |
| **Organizations** | Multi-account management | Service Control Policies (SCPs) restrict what accounts can do |
| **SSO / IAM Identity Center** | Centralised access | Single sign-on to multiple AWS accounts and business applications |

## Mapping AWS Services to Security Capabilities

| Capability | AWS Services |
|-----------|-------------|
| **Prevent** | IAM, SCPs, Security Groups, WAF, Shield, Network Firewall |
| **Detect** | GuardDuty, CloudTrail, Config Rules, Inspector, Macie |
| **Respond** | EventBridge + Lambda (automated response), Security Hub (triage) |
| **Recover** | AWS Backup, S3 versioning, cross-region replication |
| **Comply** | Config (compliance rules), CloudTrail (audit trail), Security Hub (compliance standards) |

## AWS Security Best Practices

1. **Enable CloudTrail** in all regions with multi-region trail.
2. **Enable GuardDuty** in all accounts.
3. **Enforce MFA** on root account; do not use root for daily operations.
4. **Use IAM roles** (not access keys) wherever possible.
5. **Enable Config** with compliance rules for critical resources.
6. **Encrypt everything at rest** using KMS.
7. **Use Security Hub** to aggregate and prioritise findings.

## Key Takeaways

- GuardDuty detects threats using ML; Config monitors compliance; Inspector finds vulnerabilities.
- KMS manages encryption keys; Macie discovers sensitive data; WAF/Shield protect against web attacks and DDoS.
- CloudTrail is the foundation of cloud security — it logs all API activity.
- Security Hub aggregates findings from all services into one prioritised dashboard.
$md$, 15, 5);

-- =====================================================================
-- ========== BH-SPEC-CLOUD: Replace Capstone Content ==========
-- =====================================================================
UPDATE public.lessons
SET title = 'Capstone: Cloud Security Posture Assessment',
    description = 'Assess cloud and web security posture using Kali tools, then write a cloud security assessment report.',
    content_markdown = $md$
# Capstone: Cloud Security Posture Assessment

## Overview

You will assess the security posture of web services and simulate a cloud security review using Kali Linux tools. This capstone integrates TLS assessment, web security header analysis, certificate inspection, and vulnerability scanning into a professional cloud security report.

**Time estimate:** 90–120 minutes
**Prerequisite:** Kali Linux with internet access; testssl.sh installed.
**Deliverable:** PDF with screenshots and a cloud security assessment report.

## Important: Legal and Ethical Note

The tools in this capstone **only read publicly available information** (TLS certificates, HTTP headers). They do not exploit vulnerabilities. You will test sites that serve public content. Only test targets you have permission for or that are explicitly designed for testing.

Suggested targets: `badssl.com` (deliberately misconfigured SSL/TLS), `example.com` (simple public site), and `expired.badssl.com`, `self-signed.badssl.com`, etc.

## Tasks

### Task 1 — TLS Configuration Assessment (20 marks)

Install testssl.sh if needed:
```
sudo apt update && sudo apt install -y testssl.sh
```

Run a comprehensive TLS assessment against two targets:
```
testssl.sh badssl.com > ~/capstone/tls-badssl.txt
testssl.sh example.com > ~/capstone/tls-example.txt
```

Also test a deliberately misconfigured site:
```
testssl.sh expired.badssl.com > ~/capstone/tls-expired.txt
```

Take screenshots of each scan. In your report, document for each target:
- Supported TLS/SSL versions
- Whether weak cipher suites are offered
- Any vulnerability findings (BEAST, POODLE, Heartbleed, etc.)
- Overall assessment (secure / needs improvement / insecure)

### Task 2 — Certificate Analysis (15 marks)

Use openssl to examine certificates:
```
echo | openssl s_client -connect badssl.com:443 -servername badssl.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates -serial
echo | openssl s_client -connect expired.badssl.com:443 -servername expired.badssl.com 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

Screenshot the output. For each certificate, document:
- Subject (who it's for)
- Issuer (who signed it)
- Validity dates
- Any issues (expired, self-signed, mismatched)

### Task 3 — Web Security Headers (20 marks)

Check HTTP security headers for three sites:
```
curl -sI https://example.com | grep -iE "strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy"
curl -sI https://badssl.com | grep -iE "strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy"
curl -sI https://google.com | grep -iE "strict-transport|content-security|x-frame|x-content-type|referrer-policy|permissions-policy"
```

Screenshot the output. Create a comparison table:

| Header | example.com | badssl.com | google.com |
|--------|------------|------------|------------|
| HSTS | ? | ? | ? |
| CSP | ? | ? | ? |
| X-Frame-Options | ? | ? | ? |
| X-Content-Type-Options | ? | ? | ? |
| Referrer-Policy | ? | ? | ? |

For each missing header, explain the security risk.

### Task 4 — Service and Vulnerability Scanning (15 marks)

Use nmap to scan web ports:
```
nmap -sV -p 80,443 badssl.com
nmap --script ssl-enum-ciphers -p 443 badssl.com
nmap --script http-security-headers -p 443 example.com
```

Screenshot all output. Identify any findings not already captured by testssl.sh or curl.

### Task 5 — Cloud Security Assessment Report (30 marks)

Compile your findings into a professional report:

**1. Cover Page:** "Cloud and Web Security Posture Assessment", date, your name, "CONFIDENTIAL".

**2. Executive Summary** (half page): Summarise the overall security posture of the assessed targets. State the most critical finding and the top recommendation.

**3. Methodology:** Tools used (testssl.sh, openssl, curl, nmap), what was tested, and limitations.

**4. Findings Table:**

| # | Finding | Target | Severity | Category |
|---|---------|--------|----------|----------|

Include at least 8 findings across all tests.

**5. Detailed Findings:** For the top 3 most critical findings, provide:
- Description
- Evidence (screenshot)
- Impact
- Remediation

**6. Recommendations:** List 5 prioritised security recommendations applicable to a cloud deployment. Frame them as if advising a company about their cloud security posture.

**7. Conclusion:** 2–3 sentences summarising the assessment.

---

## Marking Rubric

| Section | Marks | Criteria |
|---------|-------|----------|
| Task 1: TLS Assessment | 20 | Both targets scanned; versions, ciphers, and vulns documented |
| Task 2: Certificates | 15 | openssl output shown; issues correctly identified |
| Task 3: Security Headers | 20 | Three sites compared; missing headers explained |
| Task 4: nmap Scanning | 15 | Scans completed; additional findings noted |
| Task 5: Report | 30 | Executive summary clear; 8+ findings; top 3 detailed; 5 recommendations |
| **Total** | **100** | |

## Submission

1. Compile into PDF.
2. Name: **`BH-SPEC-CLOUD-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$
WHERE id = 'f1000000-0000-4000-8000-000000000003';

-- =====================================================================
-- ========== BH-SPEC-GRC: New Lessons ==========
-- =====================================================================

-- Module 3: Risk Response and Monitoring — BCP/DR and IT Operations Risk
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('d0000000-0000-4000-8000-000000000033', 'Business Continuity, Disaster Recovery, and IT Operations Risk',
 'BCP/DRP at GRC level, change management, and IT operations risk for CRISC Domain 4.',
$md$
# Business Continuity, Disaster Recovery, and IT Operations Risk

## Objectives

By the end of this lesson you will be able to:

- Describe business continuity planning (BCP) and disaster recovery planning (DRP) from a GRC perspective.
- Explain BIA (Business Impact Analysis) and how it drives recovery priorities.
- Describe change management and IT operations risk.
- Map BCP/DRP concepts to CRISC Domain 4.

## Business Continuity vs Disaster Recovery

| Aspect | BCP | DRP |
|--------|-----|-----|
| **Scope** | Entire business operations | IT systems and data |
| **Goal** | Keep the business running during and after disruption | Restore IT services after a disaster |
| **Owner** | Business leadership / COO | IT leadership / CIO |
| **Output** | Business continuity plan | IT disaster recovery plan |

BCP includes DRP. BCP addresses people, processes, facilities, and technology. DRP focuses specifically on restoring IT systems.

## Business Impact Analysis (BIA)

The BIA identifies critical business functions and the impact of their disruption. It drives recovery priorities by answering:

- **Which functions are critical?** (e.g. payment processing, customer service)
- **What is the maximum tolerable downtime (MTD)?** (how long before the impact becomes unacceptable)
- **What resources do they depend on?** (systems, people, data, third parties)

### Recovery Metrics

| Metric | Definition | Set By |
|--------|-----------|--------|
| **MTD** (Maximum Tolerable Downtime) | Maximum time a function can be down before unacceptable impact | Business |
| **RTO** (Recovery Time Objective) | Target time to restore the function | IT (must be ≤ MTD) |
| **RPO** (Recovery Point Objective) | Maximum acceptable data loss | Business + IT |
| **WRT** (Work Recovery Time) | Time after IT restoration to resume full business operations | Business |

**Relationship:** MTD = RTO + WRT. The BIA sets MTD; IT designs DRP to achieve RTO and RPO within that window.

## BCP Lifecycle

1. **Initiation** — obtain management support, define scope, assign roles.
2. **BIA** — identify critical functions, dependencies, and impact of disruption.
3. **Strategy development** — select recovery strategies (hot/warm/cold site, cloud, etc.).
4. **Plan development** — document procedures, contact lists, communication plans.
5. **Testing** — tabletop, simulation, parallel, or full interruption tests.
6. **Maintenance** — review and update regularly (at least annually) and after significant changes.

## Change Management and IT Operations Risk

Change management controls modifications to IT systems to prevent outages and security incidents:

1. **Request** — document what, why, and risk.
2. **Assess** — impact analysis, rollback plan.
3. **Approve** — CAB or change manager.
4. **Implement** — during approved window.
5. **Review** — verify success; close.

### IT Operations Risks

| Risk Category | Example | GRC Response |
|--------------|---------|-------------|
| **Unplanned change** | Developer pushes fix to production without approval | Enforce change management policy |
| **Patch failure** | Patch causes application outage | Test patches in staging; require rollback plan |
| **Capacity** | System runs out of storage during peak | Monitor capacity KRIs; plan ahead |
| **Third-party** | Cloud provider outage | Multi-region / multi-cloud strategy; SLA review |
| **Data loss** | Backup not tested; fails during recovery | Regular backup testing (monthly restore test) |

## CRISC Domain 4 Alignment

CRISC Domain 4 (Information Technology and Security) covers:
- Aligning IT risk with enterprise risk.
- IT operations risk management (change, capacity, availability).
- BCP/DRP as risk response strategies.
- Monitoring and reporting IT risk.

## Key Takeaways

- BIA drives recovery priorities: MTD → RTO → RPO.
- BCP covers the entire business; DRP covers IT specifically.
- Test plans regularly — untested plans are unreliable.
- Change management prevents unplanned outages — a top IT operations risk.
$md$, 10, 5),

-- Module 4: Governance and Reporting — COBIT Framework
('d0000000-0000-4000-8000-000000000034', 'COBIT Framework and IT Governance',
 'COBIT 2019, governance vs management, and IT governance alignment for CRISC.',
$md$
# COBIT Framework and IT Governance

## Objectives

By the end of this lesson you will be able to:

- Describe COBIT 2019 and its purpose in IT governance.
- Distinguish governance from management in the COBIT context.
- Describe the COBIT governance system and its components.
- Explain how COBIT supports IT risk management and CRISC objectives.

## What Is COBIT?

COBIT (Control Objectives for Information and Related Technologies) is an IT governance and management framework developed by ISACA. COBIT 2019 is the current version. It helps organisations:

- Align IT with business objectives.
- Deliver value from IT investments.
- Manage IT-related risk.
- Optimise IT resources.

## Governance vs Management

COBIT makes a clear distinction:

| | Governance | Management |
|-|-----------|-----------|
| **Who** | Board, executive leadership | Senior and middle management |
| **Focus** | Direction, oversight, accountability | Planning, building, running, monitoring |
| **Questions** | Are we doing the right things? Are they being done correctly? | How do we do them? Are they working? |
| **COBIT domain** | EDM (Evaluate, Direct, Monitor) | APO, BAI, DSS, MEA |

## COBIT Domains

| Domain | Acronym | Description | Example Objectives |
|--------|---------|-------------|-------------------|
| **Evaluate, Direct, Monitor** | EDM | Governance | Ensure value delivery, risk optimisation, stakeholder engagement |
| **Align, Plan, Organise** | APO | Strategic planning | IT strategy, enterprise architecture, budgets, human resources, security |
| **Build, Acquire, Implement** | BAI | Delivery | Solutions development, change management, asset management |
| **Deliver, Service, Support** | DSS | Operations | Service requests, problems, security, business process controls |
| **Monitor, Evaluate, Assess** | MEA | Oversight | Performance monitoring, compliance, assurance |

## COBIT Design Factors

COBIT 2019 introduces **design factors** that tailor the governance system to the organisation:

| Design Factor | Description |
|--------------|-------------|
| Enterprise strategy | Cost leadership, innovation, growth, etc. |
| Enterprise goals | Financial, customer, internal, learning |
| Risk profile | Current risk exposure |
| IT-related issues | What problems exist? |
| Threat landscape | External threats affecting the enterprise |
| Compliance requirements | Regulatory and contractual obligations |
| Role of IT | Support, factory, turnaround, strategic |
| Sourcing model | Outsourced, insourced, cloud |
| IT implementation methods | Agile, DevOps, traditional |
| Technology adoption strategy | First mover, follower, slow adopter |
| Enterprise size | Small, medium, large |

## COBIT and IT Risk Management

COBIT supports CRISC objectives by providing:

- **APO12 — Managed Risk**: Collect data, analyse risk, maintain a risk profile, articulate risk, define a risk management action portfolio, respond to risk.
- **EDM03 — Ensured Risk Optimisation**: Evaluate risk management, direct risk management, monitor risk management.
- **Integration with other frameworks**: COBIT maps to ISO 27001, NIST, ITIL, and CRISC.

### COBIT in Practice

When an organisation says "we use COBIT for IT governance," it means:
1. The board sets direction (EDM domain).
2. Management plans and organises IT (APO domain).
3. Solutions are built and implemented with controls (BAI domain).
4. Services are delivered and supported (DSS domain).
5. Performance is monitored and compliance assessed (MEA domain).

Each domain has specific processes with activities, inputs, outputs, and RACI charts.

## Key Takeaways

- COBIT separates governance (EDM — board level) from management (APO, BAI, DSS, MEA).
- COBIT 2019 uses design factors to tailor the governance system to the organisation.
- APO12 (Managed Risk) and EDM03 (Ensured Risk Optimisation) directly support IT risk management.
- COBIT maps to ISO 27001, NIST, ITIL, and CRISC for integrated governance.
$md$, 10, 5),

-- Module 4: Governance and Reporting — System Evidence Gathering Tool Lesson
('d0000000-0000-4000-8000-000000000034', 'System Evidence Gathering on Linux',
 'Using Lynis, iptables, systemctl, journalctl, and ss for compliance evidence gathering.',
$md$
# System Evidence Gathering on Linux

## Objectives

By the end of this lesson you will be able to:

- Use Lynis to run a security audit and interpret the hardening index.
- Use iptables to inspect firewall rules.
- Use systemctl and journalctl to review services and system logs.
- Use ss to identify listening services and network exposure.
- Compile evidence for compliance assessments and capstone projects.

## Evidence Gathering Overview

Compliance assessments require **evidence** — proof that controls are in place and operating. For Linux systems, the following tools provide technical evidence across key control areas:

| Tool | Evidence Area | Framework Mapping |
|------|--------------|------------------|
| **Lynis** | Overall system hardening | ISO 27001 multiple controls, NIST PR.IP, CIS Benchmarks |
| **iptables** | Firewall / network access control | ISO A.8.20, NIST PR.AC-5 |
| **systemctl** | Service management | ISO A.8.9, NIST PR.IP-1 |
| **journalctl** | System event logs | ISO A.8.15, NIST DE.AE |
| **ss** | Network exposure (listening ports) | ISO A.8.20, NIST DE.CM-7 |

## Lynis — Security Audit

```
sudo lynis audit system --quick
```

Key output to capture:
- **Hardening index** — overall score (0-100).
- **Warnings** — critical issues.
- **Suggestions** — improvements.

```
# View detailed results:
sudo cat /var/log/lynis-report.dat | grep "hardening_index"
sudo grep "warning" /var/log/lynis.log
```

## iptables — Firewall Rules

```
sudo iptables -L -n -v    # List all rules with packet counts
sudo iptables -L -n       # Simpler output
sudo ip6tables -L -n      # IPv6 rules
```

Document: What is the default policy (ACCEPT or DROP)? Are there explicit rules? Is there a rule allowing SSH from specific IPs only?

If the output is empty or shows "policy ACCEPT" with no rules, that is a finding: **no firewall rules configured**.

## systemctl — Service Management

```
systemctl list-units --type=service --state=running   # Currently running services
systemctl list-unit-files --state=enabled             # Services that start at boot
systemctl is-active sshd                               # Check specific service
```

Security questions to answer:
- Are unnecessary services running (e.g. FTP, Telnet, CUPS on a server)?
- Is SSH running? (Expected on a managed server.)
- Are services enabled that should be disabled?

## journalctl — System Logs

```
journalctl -p err --since "1 hour ago"      # Errors in the last hour
journalctl _COMM=sshd --since today         # SSH-related events today
journalctl _COMM=sudo --since today         # Sudo usage today
journalctl --list-boots                     # List system boots
```

Security evidence: authentication events, failed logins, sudo usage, service start/stop events.

## ss — Network Exposure

```
ss -tuln        # TCP/UDP listening ports, numeric
ss -tulnp       # Add process names (requires sudo)
```

Document all listening ports. Compare against expected services. Unexpected open ports indicate potential misconfigurations or compromises.

## Practical Evidence Workflow

For the capstone and real-world assessments, follow this workflow:

1. **Run Lynis** → capture hardening index and top findings.
2. **Check iptables** → document firewall posture.
3. **List services** → identify running and enabled services.
4. **Check logs** → look for authentication events and errors.
5. **Check listening ports** → document network exposure.
6. **Compile** → create a summary table mapping each finding to a framework control.

Example summary table:

| Evidence | Finding | Framework Control | Status | Recommendation |
|----------|---------|------------------|--------|----------------|
| Lynis hardening index | 62/100 | ISO multiple / NIST PR.IP | Needs improvement | Address top 5 warnings |
| iptables | Default ACCEPT, no rules | ISO A.8.20 | Non-compliant | Implement firewall rules |
| ss -tuln | Port 23 (Telnet) listening | ISO A.8.9 | Finding | Disable Telnet; use SSH |
| journalctl | 15 failed SSH logins from unknown IP | ISO A.8.15 | Informational | Implement fail2ban |
| systemctl | cups.service enabled | ISO A.8.9 | Finding | Disable unnecessary services |

## Key Takeaways

- Five tools (Lynis, iptables, systemctl, journalctl, ss) provide comprehensive Linux security evidence.
- Map each finding to a framework control for compliance evidence.
- Document the evidence collection process for audit trail.
- An evidence summary table bridges technical findings and compliance requirements.
$md$, 15, 6);

-- =====================================================================
-- ========== RECALIBRATE LESSON DURATIONS (content-based) ==========
-- =====================================================================

-- Theory lessons (400-700 words each → 5 min realistic study time at 150 wpm)
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'What is GRC?';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'The Role of Security in the Organisation';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Ethics and Professional Conduct';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Identification';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Assessment';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Treatment and Monitoring';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Policies, Standards, and Procedures';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Control Frameworks';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Security Controls and Control Types';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Compliance Programmes';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Internal and External Audit';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Reporting and Metrics';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Identity, Authentication, and Authorization';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Directory Services and Identity Stores';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Federation and Trust';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Access Control Models';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Multi-Factor and Strong Authentication';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Privileged Access Management';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Identity Lifecycle';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Single Sign-On and Access Aggregation';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Federation in Practice';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'IAM in Zero Trust';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Cloud and Hybrid IAM';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'IAM Monitoring and Incident Response';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Shared Responsibility Model';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Cloud Threats and Attack Vectors';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Cloud Security Posture and Governance';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Cloud IAM and Roles';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Conditional Access and Zero Trust in Cloud';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Securing Cloud Data';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Network Security in the Cloud';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Logging and Monitoring in the Cloud';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Containers and Serverless Security';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Cloud Incident Response';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Compliance and Assurance in the Cloud';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Security Automation and DevSecOps in the Cloud';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Enterprise Risk Management Frameworks';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Appetite and Tolerance';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Board and Executive Risk Reporting';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'IT Risk Scenarios and Threat Modelling';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Quantitative Risk Analysis';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Control Design and Effectiveness';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Response Strategies';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Key Risk Indicators and Monitoring';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Register and Lifecycle';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Governance and Committees';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Assurance and Third-Party Risk';
UPDATE public.lessons SET duration_minutes = 5 WHERE title = 'Risk Culture and Communication';

-- Practicals (scenario reading + 3-4 tasks → 15 min with thinking/writing time)
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Map the GRC Structure';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Build a Risk Register';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Control Mapping Exercise';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Prepare for Audit';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Identity and Access Analysis';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Design an RBAC Model';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Access Review and Offboarding';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Respond to a Credential Compromise';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Shared Responsibility Worksheet';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Review a Cloud IAM Policy';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Design Cloud Network Security';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Cloud Incident Triage';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Enterprise Risk Heat Map';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Quantitative Risk Assessment';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: KRI Dashboard Design';
UPDATE public.lessons SET duration_minutes = 15 WHERE title = 'Practical: Draft a Board Risk Report';

-- =====================================================================
-- ========== UPDATE COURSE DURATION_HOURS (calculated from lesson totals) ==========
-- =====================================================================
UPDATE public.courses SET duration_hours = 4 WHERE code = 'BH-GRC-2';
UPDATE public.courses SET duration_hours = 4 WHERE code = 'BH-SPEC-IAM';
UPDATE public.courses SET duration_hours = 5 WHERE code = 'BH-SPEC-CLOUD';
UPDATE public.courses SET duration_hours = 6 WHERE code = 'BH-SPEC-GRC';

-- =====================================================================
-- ========== POPULATE courses.skills FOR "Skills You Will Gain" ==========
-- =====================================================================
UPDATE public.courses SET skills = '["Governance and accountability","Risk identification and assessment","Policy and control frameworks","Compliance programmes and audit","Security auditing with Lynis"]'::jsonb WHERE code = 'BH-GRC-2';
UPDATE public.courses SET skills = '["Identity lifecycle management","Access control models (RBAC, ABAC)","MFA and privileged access","Federation and SSO","Linux access control and permissions"]'::jsonb WHERE code = 'BH-SPEC-IAM';
UPDATE public.courses SET skills = '["Cloud shared responsibility model","Cloud IAM and network security","Microsoft Defender and Sentinel","AWS security services","TLS assessment and web security"]'::jsonb WHERE code = 'BH-SPEC-CLOUD';
UPDATE public.courses SET skills = '["Enterprise risk management","Quantitative risk analysis (ALE)","KRI dashboards and monitoring","COBIT and IT governance","BCP/DRP and compliance evidence"]'::jsonb WHERE code = 'BH-SPEC-GRC';

COMMIT;
