-- Full curriculum seed for Brown Hat Cybersecurity Academy
-- Run this after migrations. Clears existing course data and inserts all levels with full lesson content.
-- Order: delete dependent rows first, then courses, then insert courses -> modules -> lessons.

BEGIN;

-- Clear existing data (preserve subscription_tiers, skills, profiles, etc.)
DELETE FROM public.user_progress;
DELETE FROM public.lessons;
DELETE FROM public.modules;
DELETE FROM public.course_enrollments;
DELETE FROM public.courses;

-- ========== COURSES (all levels) ==========
INSERT INTO public.courses (id, code, title, description, level, required_tier_level, duration_hours, order_index) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'BH-BRIDGE', 'Technical Readiness Bridge', 'Build the digital and IT foundations you need before diving into cybersecurity. No prior experience required.', 0, 1, 40, 1),
  ('a0000000-0000-4000-8000-000000000002', 'BH-FOUND-1', 'IT & Cyber Foundations I', 'Core IT skills, hardware, and cybersecurity concepts. Aligned to CompTIA A+ and Network+.', 1, 1, 80, 2),
  ('a0000000-0000-4000-8000-000000000003', 'BH-FOUND-2', 'IT & Cyber Foundations II', 'Networking fundamentals and security principles. Completes Foundations level for A+ and Network+ readiness.', 1, 1, 70, 3),
  ('a0000000-0000-4000-8000-000000000004', 'BH-CYBER-2', 'Core Cyber Foundations', 'Threat landscape, security controls, and operations. Aligned to CompTIA Security+ and ISC² CC.', 2, 2, 90, 4),
  ('a0000000-0000-4000-8000-000000000005', 'BH-OPS-2', 'Practitioner Core: Cyber Operations', 'SOC operations, incident response, and threat hunting. Aligned to CompTIA CySA+ and ISC² SSCP.', 3, 2, 100, 5),
  ('a0000000-0000-4000-8000-000000000006', 'BH-SPEC-SOC', 'Specialisation: SOC & Incident Response', 'Advanced SOC, SIEM, and incident handling. Aligned to CASP+, Microsoft SC-200, and AWS Security.', 4, 3, 120, 6),
  ('a0000000-0000-4000-8000-000000000007', 'BH-ADV', 'Advanced & Leadership', 'Security architecture, governance, and leadership. Aligned to CISSP, CISM, and TOGAF.', 5, 3, 150, 7);

-- ========== LEVEL 0: BRIDGE — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 'Computer Fundamentals & Digital Literacy', 'Essential computer hardware, software, and basic operations.', 1),
  ('b0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Basic Networking Concepts', 'How computers communicate and connect.', 2),
  ('b0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Introduction to Operating Systems', 'Windows, Linux, and mobile OS basics.', 3),
  ('b0000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000001', 'Professional Communication & Study Skills', 'Communicating clearly and learning effectively.', 4);

-- ========== BRIDGE: LESSONS (Module 1 — Computer Fundamentals) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000001', 'What is a Computer?', 'Understanding the basic components of a computer system.', $md$
# What is a Computer?

A **computer** is an electronic device that accepts input, processes it according to stored instructions, and produces output. Whether it is a laptop, desktop, tablet, or smartphone, the same basic idea applies.

## Main Components

- **Hardware** — The physical parts you can touch: the case, screen, keyboard, memory (RAM), storage (disk or SSD), and the central processing unit (CPU).
- **Software** — Programs and operating systems that tell the hardware what to do. Examples include Windows, macOS, Linux, and applications like web browsers and word processors.

## Why This Matters for Cybersecurity

In cybersecurity, you will often need to understand how data is stored (storage), how it is processed (CPU and memory), and how it moves between components. Knowing the basics helps you identify where risks and protections should be applied.

## Key Takeaway

Every device you will secure or defend is built from these same building blocks. A solid grasp of computer fundamentals is the first step toward securing them.
$md$, 15, 1),
  ('b0000000-0000-4000-8000-000000000001', 'Hardware vs Software', 'The difference between physical components and programs.', $md$
# Hardware vs Software

**Hardware** is the physical equipment: the motherboard, CPU, RAM, hard drive or SSD, power supply, and peripherals (keyboard, mouse, monitor). It does not change unless you add, remove, or replace a part.

**Software** is the set of instructions that run on the hardware. It includes the **operating system (OS)** (e.g. Windows, Linux, macOS) and **applications** (browsers, email clients, office suites).

## How They Work Together

The CPU executes instructions from software. Software is stored on disk or SSD and loaded into RAM when running. Without software, hardware can do nothing; without hardware, software has nothing to run on.

## Security Angle

**Hardware security** can include physical access controls and secure boot. **Software security** involves keeping the OS and applications updated and using antivirus. Most attacks target software (e.g. malware, exploits) rather than hardware.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000001', 'Storage and Memory (RAM)', 'How data is stored and used while the computer is on.', $md$
# Storage and Memory (RAM)

**Storage** (hard drive, SSD) holds data and programs permanently, even when the power is off. **RAM (Random Access Memory)** is temporary working memory. When you open a program, data is copied from storage into RAM so the CPU can work with it quickly. When you shut down, the contents of RAM are lost unless saved back to storage.

## For Cybersecurity

Malware can hide in storage (files) or exist only in RAM (fileless malware). Forensic and incident response work often involves capturing both disk images and RAM to analyse what was running.
$md$, 18, 3),
  ('b0000000-0000-4000-8000-000000000001', 'Input and Output Devices', 'How we interact with computers and how they communicate results.', $md$
# Input and Output Devices

**Input devices** send data into the computer: keyboard, mouse, touchscreen, microphone, camera. **Output devices** present results: monitor, speakers, printer. Some devices are both (e.g. touchscreen).

## Relevance to Security

Peripherals can be attack vectors: malicious USB devices, compromised cameras or microphones. Display and audio can leak sensitive information. Understanding I/O helps you think about where data can be observed or tampered with.
$md$, 12, 4);

-- ========== BRIDGE: LESSONS (Module 2 — Basic Networking) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000002', 'What is a Network?', 'Networks connect devices so they can share data and resources.', $md$
# What is a Network?

A **network** is a group of devices (computers, phones, servers) connected to share information and resources. The internet is a global network of networks. **LAN** (Local Area Network) covers one location; **WAN** (Wide Area Network) spans larger areas. **Protocols** (e.g. TCP/IP) define how devices communicate.

## Why It Matters for Cyber

Almost every modern attack involves the network: malware spreads over the network, attackers move between systems through the network, and data is stolen over the network. Understanding basic networking is essential for defending and monitoring systems.
$md$, 15, 1),
  ('b0000000-0000-4000-8000-000000000002', 'IP Addresses and the Internet', 'How devices are identified and how traffic finds its way.', $md$
# IP Addresses and the Internet

An **IP address** is a unique identifier for a device on a network. **IPv4** uses four numbers (e.g. 192.168.1.1); **IPv6** uses longer addresses. When you open a website, **DNS (Domain Name System)** turns a name like www.example.com into an IP address. Attackers use IP addresses to target machines or spoof their origin. Monitoring and firewalls use IP addresses and ports to allow or block traffic.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000002', 'Wi-Fi and Safe Connectivity', 'How wireless networks work and how to connect safely.', $md$
# Wi-Fi and Safe Connectivity

**Wi-Fi** lets devices connect using radio waves. A **router** broadcasts a network name (SSID) and manages which devices can join. Use **WPA2 or WPA3** encryption and a strong password. On **public Wi-Fi**, avoid sending sensitive data unless you use a VPN or a trusted, encrypted connection. As a security professional, you will assess whether networks are configured securely and recommend encryption and access controls.
$md$, 18, 3);

-- ========== BRIDGE: LESSONS (Module 3 — Operating Systems) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000003', 'What is an Operating System?', 'The OS manages hardware and runs your applications.', $md$
# What is an Operating System?

The **operating system (OS)** manages the hardware (CPU, memory, storage, network) and provides a platform for other programs. It handles process management, memory management, the file system, and the user interface. Common OSs include **Windows**, **macOS**, and **Linux**. The OS is a primary target for attackers; patching, strong authentication, and limiting privileges are core security practices.
$md$, 18, 1),
  ('b0000000-0000-4000-8000-000000000003', 'Windows and macOS Basics', 'Everyday use and file management on the most common OSs.', $md$
# Windows and macOS Basics

Both provide a graphical interface for file management, installing and uninstalling software, and applying updates. Keeping the OS updated is a key security habit. You will often need to work on both Windows and macOS when helping users, analysing a compromised machine, or deploying security tools.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000003', 'Introduction to Linux', 'Why Linux matters in cybersecurity and how to get started.', $md$
# Introduction to Linux

**Linux** is used on many servers, cloud systems, and security tools. You will encounter it in web servers, firewalls, and penetration-testing distributions (e.g. Kali). Key concepts: **distributions** (e.g. Ubuntu, Debian), the **command line** for administration, and **users and permissions**. A large portion of the internet runs on Linux; understanding Linux basics is a core skill for cybersecurity.
$md$, 22, 3);

-- ========== BRIDGE: LESSONS (Module 4 — Professional Communication) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000004', 'Communicating Clearly in Tech', 'Writing and speaking so others understand.', $md$
# Communicating Clearly in Tech

Explain technical issues in plain language when reporting to management or writing for general users. Be structured: use short paragraphs, bullet points, and clear headings. State the main point first then add detail. Be accurate about risks. In email and reports, be professional and factual; in meetings, confirm actions and follow up in writing when it matters.
$md$, 15, 1),
  ('b0000000-0000-4000-8000-000000000004', 'Study Skills and Time Management', 'How to learn effectively and stay on track.', $md$
# Study Skills and Time Management

Practice actively: do labs and use the tools you read about. Space out learning and review earlier material. Take notes in your own words. Set priorities and block time for study; reduce distractions. Building these habits now will support you through the rest of the Brown Hat path and into your career.
$md$, 18, 2);

-- ========== LEVEL 1: BH-FOUND-1 — MODULES (A+ / Foundations I) ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000002', 'Introduction to Cybersecurity', 'The field, threats, and career paths. Aligned to A+ and Security fundamentals.', 1),
  ('b0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000002', 'Hardware and Mobile Devices', 'A+ Core 1: Hardware, components, and mobile device support.', 2),
  ('b0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000002', 'Networking Fundamentals', 'A+ and Network+: TCP/IP, DNS, cabling, and network types.', 3),
  ('b0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000002', 'Security Concepts and Best Practices', 'CIA triad, physical security, and secure disposal.', 4);

-- ========== BH-FOUND-1: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000011', 'Welcome to Cybersecurity', 'Course overview and what you will learn.', $md$
# Welcome to Cybersecurity

This course builds your IT and cybersecurity foundations and aligns with **CompTIA A+** and **CompTIA Network+** objectives. You will learn hardware and software basics, networking fundamentals, and core security concepts that every practitioner needs.

## What You Will Cover

- The threat landscape and why security matters
- Hardware, mobile devices, and troubleshooting
- Networking: TCP/IP, DNS, network types, and security
- Security fundamentals: CIA triad, access control, and safe practices

## How to Use This Course

Work through each module in order. Complete the lessons and take notes; later courses (Core Cyber, Practitioner) build directly on these concepts. By the end you will be ready to move on to Security+ and ISC² CC alignment.
$md$, 10, 1),
  ('b0000000-0000-4000-8000-000000000011', 'The Threat Landscape', 'Types of threats, actors, and attack vectors.', $md$
# The Threat Landscape

**Threat actors** include nation-states, criminal groups, hacktivists, and insiders. They seek financial gain, espionage, disruption, or notoriety. **Attack vectors** are the ways they get in: phishing, malware, exploiting vulnerabilities, weak passwords, or physical access.

## Common Threats

- **Malware** — Viruses, worms, ransomware, and trojans that damage or compromise systems.
- **Phishing** — Fraudulent emails or sites that trick users into giving credentials or installing malware.
- **Exploits** — Use of software vulnerabilities to gain unauthorised access or control.

Understanding who might attack and how they do it helps you prioritise defences and explain risks to others. This aligns with A+ and Network+ operational procedures and security objectives.
$md$, 18, 2),
  ('b0000000-0000-4000-8000-000000000012', 'Motherboard and Internal Components', 'A+ Core 1: Motherboard, CPU, RAM, and expansion.', $md$
# Motherboard and Internal Components

The **motherboard** is the main circuit board that connects the CPU, RAM, storage, and expansion cards. The **CPU** executes instructions; **RAM** provides temporary storage for running programs; **expansion slots** (e.g. PCIe) allow adding graphics cards, network cards, and other hardware.

## Key Concepts for A+

You should be able to identify components, understand compatibility (e.g. RAM type and speed, CPU socket), and perform basic troubleshooting (e.g. reseating RAM, checking connections). CompTIA A+ 220-1101 covers these topics in detail. Secure disposal of components (e.g. wiping storage, recycling) is also part of operational procedures.
$md$, 22, 1),
  ('b0000000-0000-4000-8000-000000000012', 'Mobile Devices and Connectivity', 'Laptops, smartphones, and wireless connectivity.', $md$
# Mobile Devices and Connectivity

Laptops, tablets, and smartphones use similar principles to desktops but with different form factors, batteries, and connectivity (Wi-Fi, Bluetooth, cellular). **Mobile device management (MDM)** and **BYOD** (bring your own device) policies are common in organisations and have security implications: device encryption, remote wipe, and acceptable use.

## A+ Relevance

A+ Core 1 and Core 2 include mobile device hardware (e.g. display types, batteries), connectivity, and troubleshooting. Understanding how mobile devices connect and how to secure them supports both the exam and real-world support roles.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000013', 'TCP/IP and the OSI Model', 'Network+ and A+: How data moves across networks.', $md$
# TCP/IP and the OSI Model

**TCP/IP** is the suite of protocols that powers the internet: **IP** for addressing and routing, **TCP** for reliable delivery, **UDP** for lightweight delivery, and **DNS** for name resolution. The **OSI model** (seven layers) and the **TCP/IP model** (four layers) describe how data is encapsulated and transmitted from application to physical link.

## Why It Matters

Network+ heavily tests TCP/IP, subnetting, and the OSI model. Security controls (firewalls, IDS/IPS) operate at specific layers; understanding layers helps you troubleshoot and design secure networks. You will use this in every subsequent security course.
$md$, 25, 1),
  ('b0000000-0000-4000-8000-000000000013', 'Network Types and Cabling', 'LAN, WAN, wireless, and physical media.', $md$
# Network Types and Cabling

**LAN** (local area network) and **WAN** (wide area network) differ in scope. **Ethernet** uses twisted-pair (e.g. Cat 5e, Cat 6) or fibre cabling. **Wi-Fi** (802.11) provides wireless access. Choosing the right media and securing wireless networks (WPA2/WPA3, strong passwords, placement of access points) is part of network implementation and security.

## Exam Alignment

Network+ domain 1 (Networking Fundamentals) and domain 2 (Network Implementations) cover these topics. You should know cable types, connectors, and basic wireless standards and security.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000014', 'CIA Triad and Security Controls', 'Confidentiality, integrity, availability, and control types.', $md$
# CIA Triad and Security Controls

The **CIA triad** is the foundation of security: **Confidentiality** (only authorised access), **Integrity** (data is accurate and unchanged), and **Availability** (systems and data are accessible when needed). **Security controls** can be technical (firewalls, encryption), administrative (policies, training), or physical (locks, badges).

## Best Practices

Apply defence in depth (multiple layers of controls), least privilege (minimum access necessary), and secure disposal (wipe drives, destroy media) when decommissioning equipment. These concepts appear in A+, Network+, and Security+ and underpin all later security work.
$md$, 20, 1),
  ('b0000000-0000-4000-8000-000000000014', 'Physical Security and Authentication', 'Access control and authentication methods.', $md$
# Physical Security and Authentication

**Physical security** protects buildings and hardware: locks, badges, cameras, and environmental controls (e.g. fire suppression). **Authentication** verifies identity: something you know (password), something you have (token, card), or something you are (biometrics). **Multi-factor authentication (MFA)** combines two or more factors and greatly reduces the risk of credential theft.

## For the Workplace

You will be expected to recommend MFA, strong password policies, and physical security measures. A+ and Security+ both cover authentication and access control; this lesson gives you the foundation.
$md$, 18, 2);

-- ========== LEVEL 1: BH-FOUND-2 — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000021', 'a0000000-0000-4000-8000-000000000003', 'Network Services and Protocols', 'DNS, DHCP, and common application protocols.', 1),
  ('b0000000-0000-4000-8000-000000000022', 'a0000000-0000-4000-8000-000000000003', 'Network Security and Hardening', 'Firewalls, IDS/IPS, and secure configuration.', 2),
  ('b0000000-0000-4000-8000-000000000023', 'a0000000-0000-4000-8000-000000000003', 'Operating System Security', 'Windows and Linux security basics.', 3);

-- ========== BH-FOUND-2: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000021', 'DNS and DHCP', 'How name resolution and IP assignment work.', $md$
# DNS and DHCP

**DNS (Domain Name System)** translates human-readable names (e.g. www.example.com) into IP addresses. **DHCP (Dynamic Host Configuration Protocol)** automatically assigns IP addresses and other settings to devices on a network. Both are essential for network operations. Misconfigured or compromised DNS can redirect users to malicious sites; securing DNS (e.g. DNSSEC, monitoring) is part of network security. Network+ covers DNS and DHCP in depth.
$md$, 20, 1),
  ('b0000000-0000-4000-8000-000000000021', 'Application Protocols and Ports', 'HTTP/HTTPS, SSH, FTP, and well-known ports.', $md$
# Application Protocols and Ports

**Ports** identify services on a host (e.g. 80 for HTTP, 443 for HTTPS, 22 for SSH). **HTTP** is unencrypted; **HTTPS** uses TLS for encryption. **SSH** secures remote access; **FTP** is an older file transfer protocol (prefer SFTP or SCP for security). Firewalls and security tools use port and protocol information to allow or block traffic. Knowing common ports and protocols is essential for Network+ and for configuring and troubleshooting security controls.
$md$, 22, 2),
  ('b0000000-0000-4000-8000-000000000022', 'Firewalls and Network Segmentation', 'How firewalls work and why we segment networks.', $md$
# Firewalls and Network Segmentation

A **firewall** filters traffic based on rules (e.g. allow/deny by IP, port, or application). **Network segmentation** divides the network into zones (e.g. DMZ, internal, management) so that a breach in one zone does not automatically expose everything. Segmenting and restricting traffic between segments is a core security practice and is covered in Network+ (domain 4: Network Security) and Security+.
$md$, 25, 1),
  ('b0000000-0000-4000-8000-000000000022', 'Intrusion Detection and Prevention', 'IDS vs IPS and how they fit into security operations.', $md$
# Intrusion Detection and Prevention

**IDS (Intrusion Detection System)** monitors traffic and alerts on suspicious activity. **IPS (Intrusion Prevention System)** can also block or mitigate attacks. Both use signatures and/or behaviour-based analysis. They are deployed at network or host level. Understanding IDS/IPS prepares you for Security+ and for SOC roles where monitoring and response are central.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000023', 'Windows Security Basics', 'Updates, user accounts, and local security.', $md$
# Windows Security Basics

Keep Windows updated (security patches), use strong passwords or Windows Hello, limit use of administrator accounts, and enable the built-in firewall and Defender. **Group Policy** can enforce security settings across the organisation. **User Account Control (UAC)** reduces the impact of malware by prompting for elevation. These topics align with A+ Core 2 (Windows OS) and Security+ (secure host configuration).
$md$, 22, 1),
  ('b0000000-0000-4000-8000-000000000023', 'Linux Security Basics', 'Users, permissions, and basic hardening.', $md$
# Linux Security Basics

Linux uses **users and groups** and **file permissions** (read, write, execute for owner, group, and others). Commands like chmod, chown, and sudo are fundamental. Keep the system updated (apt, yum), disable unnecessary services, and use SSH with key-based authentication instead of passwords where possible. Many security tools and servers run on Linux; this foundation supports Core Cyber and Practitioner courses.
$md$, 25, 2);

-- ========== LEVEL 2: BH-CYBER-2 — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000031', 'a0000000-0000-4000-8000-000000000004', 'General Security Concepts', 'Security+ domain 1: Controls, cryptography, and identity.', 1),
  ('b0000000-0000-4000-8000-000000000032', 'a0000000-0000-4000-8000-000000000004', 'Threats and Vulnerabilities', 'Security+ domain 2: Threat actors, attacks, and mitigations.', 2),
  ('b0000000-0000-4000-8000-000000000033', 'a0000000-0000-4000-8000-000000000004', 'Security Architecture and Operations', 'Security+ domains 3–4: Design and day-to-day operations.', 3);

-- ========== BH-CYBER-2: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000031', 'Security Controls and Cryptography', 'Technical, administrative, physical controls; encryption basics.', $md$
# Security Controls and Cryptography

**Security controls** mitigate risk: preventive, detective, corrective, deterrent, and compensatory. **Cryptography** provides confidentiality (encryption), integrity (hashing, HMAC), and non-repudiation (digital signatures). Symmetric encryption uses one key; asymmetric uses public/private key pairs. TLS uses both for secure communication. Security+ domain 1 (General Security Concepts) and ISC² CC (Security Principles) cover these topics. You will use them in every security role.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000031', 'Identity and Access Management', 'Authentication, authorization, and access models.', $md$
# Identity and Access Management

**Authentication** verifies identity; **authorization** determines what an authenticated user can do. **Access control models** include DAC (discretionary), MAC (mandatory), and RBAC (role-based). **Federation** and **SSO** allow single sign-on across systems. **MFA** and **privileged access management** reduce the risk of credential compromise. Security+ and ISC² CC both test IAM concepts; they are central to securing enterprises.
$md$, 25, 2),
  ('b0000000-0000-4000-8000-000000000032', 'Threat Actors and Attack Types', 'Who attacks and how: malware, phishing, and exploits.', $md$
# Threat Actors and Attack Types

Threat actors range from script kiddies to nation-states. **Attack types** include malware (ransomware, trojans, rootkits), **phishing** and **social engineering**, **exploits** of vulnerabilities, **DDoS**, and **insider threats**. **Vulnerability management** (scanning, patching, prioritisation) and **user awareness** (training, reporting) are key mitigations. Security+ domain 2 (Threats, Vulnerabilities, and Mitigations) and ISC² CC (Network Security, Security Operations) align with this content.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000032', 'Vulnerability Assessment and Response', 'Scanning, prioritisation, and incident response basics.', $md$
# Vulnerability Assessment and Response

**Vulnerability scanning** identifies known weaknesses; **penetration testing** (with authorisation) simulates attacks to find exploitable issues. Prioritise by severity and exposure. **Incident response** includes preparation, detection, containment, eradication, recovery, and lessons learned. Security+ domain 4 (Security Operations) and ISC² CC (BC/DR and Incident Response) cover these. This sets the stage for the Practitioner course (CySA+, SSCP).
$md$, 25, 2),
  ('b0000000-0000-4000-8000-000000000033', 'Security Architecture and Resilience', 'Secure design, zero trust, and resilience.', $md$
# Security Architecture and Resilience

**Security architecture** considers secure network design, segmentation, and defence in depth. **Zero trust** assumes no implicit trust; verify every access. **Resilience** includes redundancy, backups, and recovery procedures. **Cloud** and **hybrid** environments extend these concepts. Security+ domain 3 (Security Architecture) and domain 5 (Security Program Management) touch on governance and oversight. CISSP and CISM build on this at an advanced level.
$md$, 26, 1),
  ('b0000000-0000-4000-8000-000000000033', 'Monitoring and Security Operations', 'Logging, SIEM, and operational security.', $md$
# Monitoring and Security Operations

**Logging** and **monitoring** provide visibility into events. A **SIEM** (Security Information and Event Management) aggregates and analyses logs to detect threats. **Security operations** include managing incidents, responding to alerts, and maintaining controls. This aligns with Security+ domain 4 (Security Operations) and prepares you for the Practitioner course (SOC, CySA+, SSCP) where you will use SIEMs and runbooks daily.
$md$, 24, 2);

-- ========== LEVEL 3: BH-OPS-2 — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000041', 'a0000000-0000-4000-8000-000000000005', 'Security Operations and Vulnerability Management', 'CySA+ and SSCP: Operations and vuln management.', 1),
  ('b0000000-0000-4000-8000-000000000042', 'a0000000-0000-4000-8000-000000000005', 'Incident Response and Recovery', 'CySA+ and SSCP: IR process and recovery.', 2);

-- ========== BH-OPS-2: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000041', 'Security Operations and Threat Detection', 'Day-to-day SOC activities and threat detection.', $md$
# Security Operations and Threat Detection

**Security operations** include monitoring alerts, triaging events, and maintaining runbooks. **Threat detection** uses signatures, behaviour, and threat intelligence to identify malicious activity. **EDR** (Endpoint Detection and Response) and **XDR** extend visibility and response. CySA+ domain 1 (Security Operations) and SSCP (Security Concepts, Risk Identification) align here. You will apply this in SOC analyst and security operations roles.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000041', 'Vulnerability Management Lifecycle', 'Scanning, prioritisation, and remediation.', $md$
# Vulnerability Management Lifecycle

The **vulnerability management lifecycle** includes discovery (scanning), prioritisation (risk scoring), remediation (patching or mitigating), and verification. **CVSS** and organisational context help prioritise. CySA+ domain 2 (Vulnerability Management) and SSCP (Risk Identification, Monitoring, and Analysis) cover these topics. Effective vuln management reduces the attack surface and is a core responsibility in many security roles.
$md$, 26, 2),
  ('b0000000-0000-4000-8000-000000000042', 'Incident Response Process', 'Detection, containment, eradication, recovery.', $md$
# Incident Response Process

**Incident response** follows phases: preparation, detection and analysis, containment, eradication, recovery, and post-incident activity. **Containment** limits damage; **eradication** removes the threat; **recovery** restores systems. **Communication** and **documentation** are critical. CySA+ domain 3 (Incident Response Management) and SSCP (Incident Response and Recovery) align. This is essential for SOC and IR roles.
$md$, 30, 1),
  ('b0000000-0000-4000-8000-000000000042', 'Reporting and Communication', 'CySA+ domain 4: Reporting to stakeholders.', $md$
# Reporting and Communication

**Reporting** translates technical findings into actionable information for management and stakeholders. Include executive summaries, impact, and recommendations. **Communication** during incidents (internal and external) must be clear and consistent. CySA+ domain 4 (Reporting and Communication) and SSCP (Security Operations) emphasise these skills. They are what separate junior analysts from those who can lead and influence.
$md$, 22, 2);

-- ========== LEVEL 4: BH-SPEC-SOC — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000051', 'a0000000-0000-4000-8000-000000000006', 'Advanced SOC and SIEM', 'CASP+ and SC-200: SOC and SIEM operations.', 1),
  ('b0000000-0000-4000-8000-000000000052', 'a0000000-0000-4000-8000-000000000006', 'Threat Hunting and Incident Handling', 'Hunting and advanced incident handling.', 2);

-- ========== BH-SPEC-SOC: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000051', 'SIEM Administration and Tuning', 'Configuring and tuning SIEM for detection.', $md$
# SIEM Administration and Tuning

**SIEM** administration includes onboarding data sources, writing and tuning detection rules, and managing false positives. **Microsoft Sentinel** and **Splunk** are common platforms; **KQL** (Kusto Query Language) is used for querying and building detections. CASP+ (Security Operations) and Microsoft SC-200 (Configure protections and detections) align. You will use these skills daily in an advanced SOC or security engineering role.
$md$, 30, 1),
  ('b0000000-0000-4000-8000-000000000051', 'Defender XDR and Cloud Security', 'Microsoft Defender and cloud workload protection.', $md$
# Defender XDR and Cloud Security

**Microsoft Defender XDR** unifies endpoint, email, identity, and cloud app protection. **Defender for Cloud** secures Azure and hybrid workloads. Understanding these tools supports SC-200 (Security Operations Analyst) and AWS Security Specialty (cloud security). Multi-cloud and hybrid environments require visibility and response across platforms; this lesson bridges SOC and cloud security.
$md$, 28, 2),
  ('b0000000-0000-4000-8000-000000000052', 'Threat Hunting Methodologies', 'Proactive hunting for threats.', $md$
# Threat Hunting Methodologies

**Threat hunting** is proactive search for threats that may have evaded detection. It uses hypotheses, data (logs, EDR), and iterative analysis. **Threat intelligence** informs hunting and prioritisation. CASP+ (Security Operations) and SC-200 (Manage security threats) cover hunting. Effective hunters combine tool fluency with an understanding of adversary behaviour and organisational context.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000052', 'Advanced Incident Handling', 'Complex incidents and coordination.', $md$
# Advanced Incident Handling

**Advanced incident handling** deals with persistent threats, ransomware, and coordinated response across teams. **Forensics** (disk, memory, network) support root cause analysis. **Coordination** with IT, legal, and leadership is essential. CASP+ and SC-200 (Manage incident response) align. This prepares you for lead analyst or incident commander responsibilities.
$md$, 26, 2);

-- ========== LEVEL 5: BH-ADV — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000061', 'a0000000-0000-4000-8000-000000000007', 'Security and Risk Management', 'CISSP domain 1: Governance and risk.', 1),
  ('b0000000-0000-4000-8000-000000000062', 'a0000000-0000-4000-8000-000000000007', 'Security Architecture and Leadership', 'CISSP/CISM: Architecture and program management.', 2);

-- ========== BH-ADV: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000061', 'Security Governance and Risk Management', 'CISSP domain 1: Governance, risk, and compliance.', $md$
# Security Governance and Risk Management

**Security governance** aligns security with business objectives and ensures accountability. **Risk management** includes identification, assessment (likelihood and impact), response (accept, mitigate, transfer, avoid), and monitoring. **Compliance** (regulatory, contractual) drives many security programs. CISSP domain 1 (Security and Risk Management) and CISM (Governance, Risk Management) cover these at a strategic level. Leaders use this to prioritise and justify security investments.
$md$, 32, 1),
  ('b0000000-0000-4000-8000-000000000061', 'Security Program Development', 'CISM: Building and managing the security program.', $md$
# Security Program Development

A **security program** encompasses policies, standards, procedures, awareness training, and control implementation. **Program development** requires stakeholder buy-in, resources, and metrics. **Third-party risk** and **vendor management** are part of the program. CISM domain 3 (Information Security Program) and CISSP domain 5 (Security Program Management and Oversight) align. This is the mindset of a CISO or security manager.
$md$, 30, 2),
  ('b0000000-0000-4000-8000-000000000062', 'Security Architecture and Engineering', 'CISSP domain 3: Design and engineering.', $md$
# Security Architecture and Engineering

**Security architecture** designs systems and networks with security built in. It considers **secure design principles**, **cryptography**, and **physical security**. **TOGAF** and other frameworks support enterprise architecture; security architects align with them. CISSP domain 3 (Security Architecture and Engineering) and TOGAF (security architecture in EA) align. This supports roles such as Security Architect or Lead Engineer.
$md$, 30, 1),
  ('b0000000-0000-4000-8000-000000000062', 'Leadership and Communication', 'Leading teams and communicating with the board.', $md$
# Leadership and Communication

**Security leaders** set strategy, manage teams, and communicate risk and programme status to the board and executives. **Board reporting** should be concise, risk-focused, and tied to business impact. **Building a team** and **developing talent** are part of the role. CISM (Incident Management, Program) and CISSP (across domains) support this. This lesson prepares you for CISO or senior management responsibilities.
$md$, 28, 2);

COMMIT;
