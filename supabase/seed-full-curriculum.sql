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
-- aligned_certifications: certs aligned to this course (from Learning Path); support and exam discounts offered.
INSERT INTO public.courses (id, code, title, description, level, required_tier_level, duration_hours, order_index, aligned_certifications) VALUES
  ('a0000000-0000-4000-8000-000000000001', 'BH-BRIDGE', 'Technical Readiness Bridge', 'Build the digital and IT foundations you need before diving into cybersecurity. No prior experience required.', 0, 1, 40, 1, '{}'),
  ('a0000000-0000-4000-8000-000000000002', 'BH-FOUND-1', 'IT & Cyber Foundations I', 'Core IT skills, hardware, and cybersecurity concepts. Aligned to CompTIA A+ and Network+.', 1, 1, 80, 2, ARRAY['CompTIA A+']),
  ('a0000000-0000-4000-8000-000000000003', 'BH-FOUND-2', 'IT & Cyber Foundations II', 'Networking fundamentals and security principles. Completes Foundations level for A+ and Network+ readiness.', 1, 1, 70, 3, ARRAY['CompTIA Network+']),
  ('a0000000-0000-4000-8000-000000000004', 'BH-CYBER-2', 'Core Cyber Foundations', 'Threat landscape, security controls, and operations. Aligned to CompTIA Security+ and ISC² CC.', 2, 2, 90, 4, ARRAY['CompTIA Security+', 'ISC² CC']),
  ('a0000000-0000-4000-8000-000000000005', 'BH-OPS-2', 'Practitioner Core: Cyber Operations', 'SOC operations, incident response, and threat hunting. Aligned to CompTIA CySA+ and ISC² SSCP.', 3, 2, 100, 5, ARRAY['CompTIA CySA+', 'ISC² SSCP']),
  ('a0000000-0000-4000-8000-000000000006', 'BH-SPEC-SOC', 'Specialisation: SOC & Incident Response', 'Advanced SOC, SIEM, and incident handling. Aligned to CompTIA CySA+.', 4, 3, 120, 6, ARRAY['CompTIA CySA+']),
  ('a0000000-0000-4000-8000-000000000007', 'BH-ADV', 'Advanced & Leadership', 'Security architecture, governance, and leadership. Aligned to CISSP, CISM, and TOGAF.', 5, 3, 150, 7, ARRAY['CISSP', 'CISM', 'TOGAF']);

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

## Introduction

This lesson introduces what a computer is and how hardware and software work together. You will learn the main components and why they matter for security and support roles.

## Objectives

By the end of this lesson you will be able to:

- Define a computer in terms of input, processing, and output.
- Distinguish hardware from software and give examples of each.
- Explain why computer fundamentals matter for cybersecurity.

## Main Components

- **Hardware** — The physical parts you can touch: the case, screen, keyboard, memory (RAM), storage (disk or SSD), and the central processing unit (CPU).
- **Software** — Programs and operating systems that tell the hardware what to do. Examples include Windows, macOS, Linux, and applications like web browsers and word processors.

## Why This Matters for Cybersecurity

In cybersecurity, you will often need to understand how data is stored (storage), how it is processed (CPU and memory), and how it moves between components. Knowing the basics helps you identify where risks and protections should be applied.

## Key takeaway

Every device you will secure or defend is built from these same building blocks. A solid grasp of computer fundamentals is the first step toward securing them.

## Exam alignment

Foundational; no certification exam.
$md$, 15, 1),
  ('b0000000-0000-4000-8000-000000000001', 'Hardware vs Software', 'The difference between physical components and programs.', $md$
# Hardware vs Software

## Introduction

This lesson explains the difference between hardware and software and how they work together. You will see how each relates to security.

## Objectives

By the end of this lesson you will be able to:

- Define hardware and software and give examples.
- Explain how the CPU, storage, and software interact.
- Describe how hardware and software security differ.

## Hardware and Software

**Hardware** is the physical equipment: the motherboard, CPU, RAM, hard drive or SSD, power supply, and peripherals (keyboard, mouse, monitor). It does not change unless you add, remove, or replace a part.

**Software** is the set of instructions that run on the hardware. It includes the **operating system (OS)** (e.g. Windows, Linux, macOS) and **applications** (browsers, email clients, office suites).

## How They Work Together

The CPU executes instructions from software. Software is stored on disk or SSD and loaded into RAM when running. Without software, hardware can do nothing; without hardware, software has nothing to run on.

## Security Angle

**Hardware security** can include physical access controls and secure boot. **Software security** involves keeping the OS and applications updated and using antivirus. Most attacks target software (e.g. malware, exploits) rather than hardware.

## Key takeaway

Hardware is the physical equipment; software is the instructions that run on it. Both have security implications, with most attacks targeting software.

## Exam alignment

Foundational; no certification exam.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000001', 'Storage and Memory (RAM)', 'How data is stored and used while the computer is on.', $md$
# Storage and Memory (RAM)

## Introduction

This lesson covers the difference between storage and memory (RAM) and how the computer uses both. You will see why this matters for security and forensics.

## Objectives

By the end of this lesson you will be able to:

- Distinguish storage from RAM and describe how each is used.
- Explain what happens to data when the power is off.
- Describe why storage and RAM matter for malware and incident response.

## Storage and RAM

**Storage** (hard drive, SSD) holds data and programs permanently, even when the power is off. **RAM (Random Access Memory)** is temporary working memory. When you open a program, data is copied from storage into RAM so the CPU can work with it quickly. When you shut down, the contents of RAM are lost unless saved back to storage.

## For Cybersecurity

Malware can hide in storage (files) or exist only in RAM (fileless malware). Forensic and incident response work often involves capturing both disk images and RAM to analyse what was running.

## Key takeaway

Storage is permanent; RAM is temporary working memory. Both are relevant to how malware persists and how investigators capture evidence.

## Exam alignment

Foundational; no certification exam.
$md$, 18, 3),
  ('b0000000-0000-4000-8000-000000000001', 'Input and Output Devices', 'How we interact with computers and how they communicate results.', $md$
# Input and Output Devices

## Introduction

This lesson introduces input and output devices and how they connect to the computer. You will learn why they matter for security.

## Objectives

By the end of this lesson you will be able to:

- Define input and output devices and give examples.
- Identify devices that act as both input and output.
- Explain how peripherals can be security risks.

## Input and Output

**Input devices** send data into the computer: keyboard, mouse, touchscreen, microphone, camera. **Output devices** present results: monitor, speakers, printer. Some devices are both (e.g. touchscreen).

## Relevance to Security

Peripherals can be attack vectors: malicious USB devices, compromised cameras or microphones. Display and audio can leak sensitive information. Understanding I/O helps you think about where data can be observed or tampered with.

## Key takeaway

Input and output devices are how we interact with computers; they can also be entry points for attacks or sources of data leakage.

## Exam alignment

Foundational; no certification exam.
$md$, 12, 4);

-- ========== BRIDGE: LESSONS (Module 2 — Basic Networking) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000002', 'What is a Network?', 'Networks connect devices so they can share data and resources.', $md$
# What is a Network?

## Introduction

This lesson introduces what a network is and how devices connect to share data. You will learn basic terms and why networking matters for security.

## Objectives

By the end of this lesson you will be able to:

- Define a network and distinguish LAN from WAN.
- Explain what protocols are and why they matter.
- Describe why networks are central to modern attacks and defences.

## What is a Network?

A **network** is a group of devices (computers, phones, servers) connected to share information and resources. The internet is a global network of networks. **LAN** (Local Area Network) covers one location; **WAN** (Wide Area Network) spans larger areas. **Protocols** (e.g. TCP/IP) define how devices communicate.

## Why It Matters for Cyber

Almost every modern attack involves the network: malware spreads over the network, attackers move between systems through the network, and data is stolen over the network. Understanding basic networking is essential for defending and monitoring systems.

## Key takeaway

Networks connect devices to share data; protocols define how they communicate. Networking is essential for both using and securing systems.

## Exam alignment

Foundational; no certification exam.
$md$, 15, 1),
  ('b0000000-0000-4000-8000-000000000002', 'IP Addresses and the Internet', 'How devices are identified and how traffic finds its way.', $md$
# IP Addresses and the Internet

## Introduction

This lesson covers how devices are identified on a network (IP addresses) and how names are resolved to addresses (DNS). You will see how this relates to security and monitoring.

## Objectives

By the end of this lesson you will be able to:

- Explain what an IP address is and the difference between IPv4 and IPv6.
- Describe how DNS resolves names to addresses.
- Explain how IP addresses are used in security (targeting, blocking, monitoring).

## IP Addresses and DNS

An **IP address** is a unique identifier for a device on a network. **IPv4** uses four numbers (e.g. 192.168.1.1); **IPv6** uses longer addresses. When you open a website, **DNS (Domain Name System)** turns a name like www.example.com into an IP address. Attackers use IP addresses to target machines or spoof their origin. Monitoring and firewalls use IP addresses and ports to allow or block traffic.

## Key takeaway

IP addresses identify devices; DNS maps names to addresses. Both are used by defenders and attackers.

## Exam alignment

Foundational; no certification exam.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000002', 'Wi-Fi and Safe Connectivity', 'How wireless networks work and how to connect safely.', $md$
# Wi-Fi and Safe Connectivity

## Introduction

This lesson covers how Wi-Fi works and how to connect safely at home and on public networks. You will learn what to recommend when assessing network security.

## Objectives

By the end of this lesson you will be able to:

- Explain how Wi-Fi and routers work at a basic level.
- Recommend secure Wi-Fi settings (encryption, strong passwords).
- Describe risks of public Wi-Fi and when to use a VPN.

## Wi-Fi and Security

**Wi-Fi** lets devices connect using radio waves. A **router** broadcasts a network name (SSID) and manages which devices can join. Use **WPA2 or WPA3** encryption and a strong password. On **public Wi-Fi**, avoid sending sensitive data unless you use a VPN or a trusted, encrypted connection. As a security professional, you will assess whether networks are configured securely and recommend encryption and access controls.

## Key takeaway

Secure Wi-Fi with strong encryption and passwords; treat public Wi-Fi as untrusted unless you use a VPN or encrypted channels.

## Exam alignment

Foundational; no certification exam.
$md$, 18, 3);

-- ========== BRIDGE: LESSONS (Module 3 — Operating Systems) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000003', 'What is an Operating System?', 'The OS manages hardware and runs your applications.', $md$
# What is an Operating System?

## Introduction

This lesson explains what an operating system is and what it does. You will learn why the OS is a central focus for security.

## Objectives

By the end of this lesson you will be able to:

- Define the role of an operating system (managing hardware and running programs).
- Name common OSs and what they manage (processes, memory, file system).
- Explain why patching and least privilege matter for OS security.

## The Operating System

The **operating system (OS)** manages the hardware (CPU, memory, storage, network) and provides a platform for other programs. It handles process management, memory management, the file system, and the user interface. Common OSs include **Windows**, **macOS**, and **Linux**. The OS is a primary target for attackers; patching, strong authentication, and limiting privileges are core security practices.

## Key takeaway

The OS is the layer between hardware and applications; securing it is foundational.

## Exam alignment

Foundational; no certification exam.
$md$, 18, 1),
  ('b0000000-0000-4000-8000-000000000003', 'Windows and macOS Basics', 'Everyday use and file management on the most common OSs.', $md$
# Windows and macOS Basics

## Introduction

This lesson covers everyday use of Windows and macOS: file management, installing software, and applying updates. You will see why these skills matter for support and security roles.

## Objectives

By the end of this lesson you will be able to:

- Perform basic file management and software installation on Windows and macOS.
- Explain why keeping the OS updated is a key security habit.
- Describe when you need to work across both platforms (support, analysis, tool deployment).

## Windows and macOS

Both provide a graphical interface for file management, installing and uninstalling software, and applying updates. Keeping the OS updated is a key security habit. You will often need to work on both Windows and macOS when helping users, analysing a compromised machine, or deploying security tools.

## Key takeaway

Fluency in both Windows and macOS supports user support, incident analysis, and security tooling.

## Exam alignment

Foundational; no certification exam.
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000003', 'Introduction to Linux', 'Why Linux matters in cybersecurity and how to get started.', $md$
# Introduction to Linux

## Introduction

This lesson introduces Linux and why it matters for cybersecurity. You will learn key concepts: distributions, the command line, and users and permissions.

## Objectives

By the end of this lesson you will be able to:

- Explain why Linux is important in servers, cloud, and security tools.
- Define distributions and give examples.
- Describe the role of the command line and of users and permissions.

## Linux in Practice

**Linux** is used on many servers, cloud systems, and security tools. You will encounter it in web servers, firewalls, and penetration-testing distributions (e.g. Kali). Key concepts: **distributions** (e.g. Ubuntu, Debian), the **command line** for administration, and **users and permissions**. A large portion of the internet runs on Linux; understanding Linux basics is a core skill for cybersecurity.

## Key takeaway

Linux is widespread in infrastructure and security; learning distributions, the command line, and permissions is essential.

## Exam alignment

Foundational; no certification exam.
$md$, 22, 3);

-- ========== BRIDGE: LESSONS (Module 4 — Professional Communication) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000004', 'Communicating Clearly in Tech', 'Writing and speaking so others understand.', $md$
# Communicating Clearly in Tech

## Introduction

This lesson covers how to communicate technical issues clearly to management and non-technical audiences. You will learn structure and tone for reports, email, and meetings.

## Objectives

By the end of this lesson you will be able to:

- Explain technical issues in plain language.
- Structure written and verbal communication (main point first, then detail).
- Be accurate about risks and follow up in writing when it matters.

## Main content

Explain technical issues in plain language when reporting to management or writing for general users. Be structured: use short paragraphs, bullet points, and clear headings. State the main point first then add detail. Be accurate about risks. In email and reports, be professional and factual; in meetings, confirm actions and follow up in writing when it matters.

## Key takeaway

Clear, structured communication builds trust and ensures actions are understood and tracked.

## Exam alignment

Foundational; no certification exam.
$md$, 15, 1),
  ('b0000000-0000-4000-8000-000000000004', 'Study Skills and Time Management', 'How to learn effectively and stay on track.', $md$
# Study Skills and Time Management

## Introduction

This lesson covers how to learn effectively and manage your time. You will build habits that support you through the curriculum and into your career.

## Objectives

By the end of this lesson you will be able to:

- Practice actively (labs, tools) and space out learning and review.
- Take notes in your own words and set priorities.
- Block time for study and reduce distractions.

## Main content

Practice actively: do labs and use the tools you read about. Space out learning and review earlier material. Take notes in your own words. Set priorities and block time for study; reduce distractions. Building these habits now will support you through the rest of the Brown Hat path and into your career.

## Key takeaway

Active practice, spaced review, and clear priorities make learning stick and keep you on track.

## Exam alignment

Foundational; no certification exam.
$md$, 18, 2);

-- ========== LEVEL 1: BH-FOUND-1 — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000011', 'a0000000-0000-4000-8000-000000000002', 'Introduction to Cybersecurity', 'The field, threats, and career paths.', 1),
  ('b0000000-0000-4000-8000-000000000012', 'a0000000-0000-4000-8000-000000000002', 'Hardware and Mobile Devices', 'Hardware, components, and mobile device support.', 2),
  ('b0000000-0000-4000-8000-000000000013', 'a0000000-0000-4000-8000-000000000002', 'Networking Fundamentals', 'TCP/IP, DNS, cabling, and network types.', 3),
  ('b0000000-0000-4000-8000-000000000014', 'a0000000-0000-4000-8000-000000000002', 'Security Concepts and Best Practices', 'CIA triad, physical security, and secure disposal.', 4);

-- ========== BH-FOUND-1: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000011', 'Welcome to Cybersecurity', 'Course overview and what you will learn.', $md$
# Welcome to Cybersecurity

This course builds your IT and cybersecurity foundations. You will learn hardware and software basics, networking fundamentals, and core security concepts that every practitioner needs.

## What You Will Cover

- The threat landscape and why security matters
- Hardware, mobile devices, and troubleshooting
- Networking: TCP/IP, DNS, network types, and security
- Security fundamentals: CIA triad, access control, and safe practices

## How to Use This Course

Work through each module in order. Complete the lessons and take notes; later courses (Core Cyber, Practitioner) build directly on these concepts. By the end you will be ready to move on to core security and practitioner-level content.

## Exam alignment

A+ 220-1102 Operational Procedures; course overview.
$md$, 10, 1),
  ('b0000000-0000-4000-8000-000000000011', 'The Threat Landscape', 'Types of threats, actors, and attack vectors.', $md$
# The Threat Landscape

**Threat actors** include nation-states, criminal groups, hacktivists, and insiders. They seek financial gain, espionage, disruption, or notoriety. **Attack vectors** are the ways they get in: phishing, malware, exploiting vulnerabilities, weak passwords, or physical access.

## Common Threats

- **Malware** — Viruses, worms, ransomware, and trojans that damage or compromise systems.
- **Phishing** — Fraudulent emails or sites that trick users into giving credentials or installing malware.
- **Exploits** — Use of software vulnerabilities to gain unauthorised access or control.

Understanding who might attack and how they do it helps you prioritise defences and explain risks to others.

## Exam alignment

A+ 220-1102 2.0 (Security); threat types and attack vectors.
$md$, 18, 2),
  ('b0000000-0000-4000-8000-000000000012', 'Motherboard and Internal Components', 'Motherboard, CPU, RAM, and expansion.', $md$
# Motherboard and Internal Components

The **motherboard** is the main circuit board that connects the CPU, RAM, storage, and expansion cards. The **CPU** executes instructions; **RAM** provides temporary storage for running programs; **expansion slots** (e.g. PCIe) allow adding graphics cards, network cards, and other hardware.

## Key Concepts

You should be able to identify components, understand compatibility (e.g. RAM type and speed, CPU socket), and perform basic troubleshooting (e.g. reseating RAM, checking connections). Secure disposal of components (e.g. wiping storage, recycling) is also part of operational procedures.

## Exam alignment

A+ 220-1101 3.0 (Hardware).
$md$, 22, 1),
  ('b0000000-0000-4000-8000-000000000012', 'Mobile Devices and Connectivity', 'Laptops, smartphones, and wireless connectivity.', $md$
# Mobile Devices and Connectivity

Laptops, tablets, and smartphones use similar principles to desktops but with different form factors, batteries, and connectivity (Wi-Fi, Bluetooth, cellular). **Mobile device management (MDM)** and **BYOD** (bring your own device) policies are common in organisations and have security implications: device encryption, remote wipe, and acceptable use.

## Why This Matters

Foundation exams include mobile device hardware (e.g. display types, batteries), connectivity, and troubleshooting. Understanding how mobile devices connect and how to secure them supports both exam readiness and real-world support roles.

## Exam alignment

A+ 220-1101 1.0 (Mobile Devices).
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000013', 'TCP/IP and the OSI Model', 'How data moves across networks.', $md$
# TCP/IP and the OSI Model

**TCP/IP** is the suite of protocols that powers the internet: **IP** for addressing and routing, **TCP** for reliable delivery, **UDP** for lightweight delivery, and **DNS** for name resolution. The **OSI model** (seven layers) and the **TCP/IP model** (four layers) describe how data is encapsulated and transmitted from application to physical link.

## Why It Matters

TCP/IP, subnetting, and the OSI model are core networking topics. Security controls (firewalls, IDS/IPS) operate at specific layers; understanding layers helps you troubleshoot and design secure networks. You will use this in every subsequent security course.

## Exam alignment

Network+ 1.0; A+ 220-1101 2.0 (Networking).
$md$, 25, 1),
  ('b0000000-0000-4000-8000-000000000013', 'Network Types and Cabling', 'LAN, WAN, wireless, and physical media.', $md$
# Network Types and Cabling

**LAN** (local area network) and **WAN** (wide area network) differ in scope. **Ethernet** uses twisted-pair (e.g. Cat 5e, Cat 6) or fibre cabling. **Wi-Fi** (802.11) provides wireless access. Choosing the right media and securing wireless networks (WPA2/WPA3, strong passwords, placement of access points) is part of network implementation and security.

## Exam alignment

Network+ 1.0, 2.0 (Networking Fundamentals, Implementations).
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000014', 'CIA Triad and Security Controls', 'Confidentiality, integrity, availability, and control types.', $md$
# CIA Triad and Security Controls

The **CIA triad** is the foundation of security: **Confidentiality** (only authorised access), **Integrity** (data is accurate and unchanged), and **Availability** (systems and data are accessible when needed). **Security controls** can be technical (firewalls, encryption), administrative (policies, training), or physical (locks, badges).

## Best Practices

Apply defence in depth (multiple layers of controls), least privilege (minimum access necessary), and secure disposal (wipe drives, destroy media) when decommissioning equipment. These concepts underpin all later security work.

## Exam alignment

A+ 220-1102 2.0 (Security); Network+ 4.0.
$md$, 20, 1),
  ('b0000000-0000-4000-8000-000000000014', 'Physical Security and Authentication', 'Access control and authentication methods.', $md$
# Physical Security and Authentication

**Physical security** protects buildings and hardware: locks, badges, cameras, and environmental controls (e.g. fire suppression). **Authentication** verifies identity: something you know (password), something you have (token, card), or something you are (biometrics). **Multi-factor authentication (MFA)** combines two or more factors and greatly reduces the risk of credential theft.

## For the Workplace

You will be expected to recommend MFA, strong password policies, and physical security measures. Authentication and access control are covered in foundational and security exams; this lesson gives you the foundation.

## Exam alignment

A+ 220-1102 2.0 (Physical security, authentication).
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

**DNS (Domain Name System)** translates human-readable names (e.g. www.example.com) into IP addresses. **DHCP (Dynamic Host Configuration Protocol)** automatically assigns IP addresses and other settings to devices on a network. Both are essential for network operations. Misconfigured or compromised DNS can redirect users to malicious sites; securing DNS (e.g. DNSSEC, monitoring) is part of network security.

## Exam alignment

Network+ 1.0, 3.0 (Network services).
$md$, 20, 1),
  ('b0000000-0000-4000-8000-000000000021', 'Application Protocols and Ports', 'HTTP/HTTPS, SSH, FTP, and well-known ports.', $md$
# Application Protocols and Ports

**Ports** identify services on a host (e.g. 80 for HTTP, 443 for HTTPS, 22 for SSH). **HTTP** is unencrypted; **HTTPS** uses TLS for encryption. **SSH** secures remote access; **FTP** is an older file transfer protocol (prefer SFTP or SCP for security). Firewalls and security tools use port and protocol information to allow or block traffic. Knowing common ports and protocols is essential for configuring and troubleshooting security controls.

## Exam alignment

Network+ 1.0, 3.0 (Protocols and ports).
$md$, 22, 2),
  ('b0000000-0000-4000-8000-000000000022', 'Firewalls and Network Segmentation', 'How firewalls work and why we segment networks.', $md$
# Firewalls and Network Segmentation

A **firewall** filters traffic based on rules (e.g. allow/deny by IP, port, or application). **Network segmentation** divides the network into zones (e.g. DMZ, internal, management) so that a breach in one zone does not automatically expose everything. Segmenting and restricting traffic between segments is a core security practice.

## Exam alignment

Network+ 4.0 (Network Security).
$md$, 25, 1),
  ('b0000000-0000-4000-8000-000000000022', 'Intrusion Detection and Prevention', 'IDS vs IPS and how they fit into security operations.', $md$
# Intrusion Detection and Prevention

**IDS (Intrusion Detection System)** monitors traffic and alerts on suspicious activity. **IPS (Intrusion Prevention System)** can also block or mitigate attacks. Both use signatures and/or behaviour-based analysis. They are deployed at network or host level. Understanding IDS/IPS prepares you for SOC roles where monitoring and response are central.

## Exam alignment

Network+ 4.0 (Network Security).
$md$, 20, 2),
  ('b0000000-0000-4000-8000-000000000023', 'Windows Security Basics', 'Updates, user accounts, and local security.', $md$
# Windows Security Basics

Keep Windows updated (security patches), use strong passwords or Windows Hello, limit use of administrator accounts, and enable the built-in firewall and Defender. **Group Policy** can enforce security settings across the organisation. **User Account Control (UAC)** reduces the impact of malware by prompting for elevation.

## Exam alignment

A+ 220-1102 1.0 (Windows); Security+ secure host configuration.
$md$, 22, 1),
  ('b0000000-0000-4000-8000-000000000023', 'Linux Security Basics', 'Users, permissions, and basic hardening.', $md$
# Linux Security Basics

Linux uses **users and groups** and **file permissions** (read, write, execute for owner, group, and others). Commands like chmod, chown, and sudo are fundamental. Keep the system updated (apt, yum), disable unnecessary services, and use SSH with key-based authentication instead of passwords where possible. Many security tools and servers run on Linux; this foundation supports Core Cyber and Practitioner courses.

## Exam alignment

A+ 220-1102 1.0 (Linux); Security+ secure host configuration.
$md$, 25, 2);

-- ========== LEVEL 2: BH-CYBER-2 — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000031', 'a0000000-0000-4000-8000-000000000004', 'General Security Concepts', 'Controls, cryptography, and identity.', 1),
  ('b0000000-0000-4000-8000-000000000032', 'a0000000-0000-4000-8000-000000000004', 'Threats and Vulnerabilities', 'Threat actors, attacks, and mitigations.', 2),
  ('b0000000-0000-4000-8000-000000000033', 'a0000000-0000-4000-8000-000000000004', 'Security Architecture and Operations', 'Design and day-to-day operations.', 3),
  ('b0000000-0000-4000-8000-000000000034', 'a0000000-0000-4000-8000-000000000004', 'Security Program Management and Oversight', 'Policies, compliance, awareness, and third-party risk.', 4);

-- ========== BH-CYBER-2: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000031', 'Security Controls and Cryptography', 'Technical, administrative, physical controls; encryption basics.', $md$
# Security Controls and Cryptography

## Introduction

This lesson covers how organisations reduce risk through security controls and how cryptography protects data and communications. You will learn control types, the role of encryption and hashing, and how symmetric and asymmetric cryptography work together in practice.

## Objectives

By the end of this lesson you will be able to:

- Classify security controls as preventive, detective, corrective, deterrent, or compensatory.
- Explain how cryptography supports confidentiality, integrity, and non-repudiation.
- Distinguish symmetric from asymmetric encryption and describe typical use cases.
- Describe how TLS uses both symmetric and asymmetric cryptography for secure communication.

## Security Controls

**Security controls** are measures that reduce risk. They can be **technical** (firewalls, encryption, access controls), **administrative** (policies, training, procedures), or **physical** (locks, badges, environmental controls). By function they are:

- **Preventive** — Stop an incident (e.g. firewall blocks unauthorised access).
- **Detective** — Identify when something has happened (e.g. IDS alerts, logging).
- **Corrective** — Fix or limit damage after an incident (e.g. patches, backups).
- **Deterrent** — Discourage attacks (e.g. warnings, visible controls).
- **Compensating** — Alternative when a primary control is not possible (e.g. extra monitoring).

Controls are most effective when layered (defence in depth) and aligned to the organisation''s risk appetite.

## Cryptography Basics

**Cryptography** supports three goals:

- **Confidentiality** — Only intended parties can read the data (encryption).
- **Integrity** — Data has not been altered (hashing, HMAC).
- **Non-repudiation** — The sender cannot deny sending (digital signatures).

**Symmetric encryption** uses one shared key for both encryption and decryption (e.g. AES). It is fast and suitable for bulk data; the challenge is key distribution. **Asymmetric encryption** uses a public key and a private key (e.g. RSA). Data encrypted with the public key can only be decrypted with the private key. Asymmetric is used for key exchange and digital signatures; symmetric is used for the actual data in transit. **TLS** (Transport Layer Security) uses asymmetric cryptography to establish a session and exchange a symmetric key, then uses symmetric encryption for the rest of the session. **Hashing** (e.g. SHA-256) produces a fixed-size fingerprint of data; changing one bit changes the hash. **HMAC** combines a secret key with a hash to verify both integrity and origin.

## Key takeaway

Security controls mitigate risk through prevention, detection, correction, deterrence, and compensation. Cryptography provides confidentiality (encryption), integrity (hashing, HMAC), and non-repudiation (signatures). Symmetric and asymmetric cryptography are used together in protocols like TLS for secure communication.

## Exam alignment

Security+ 1.1–1.2 (General Security Concepts); ISC² CC Security Principles.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000031', 'Identity and Access Management', 'Authentication, authorization, and access models.', $md$
# Identity and Access Management

**Authentication** verifies identity; **authorization** determines what an authenticated user can do. **Access control models** include DAC (discretionary), MAC (mandatory), and RBAC (role-based). **Federation** and **SSO** allow single sign-on across systems. **MFA** and **privileged access management** reduce the risk of credential compromise. They are central to securing enterprises.

## Exam alignment

Security+ 1.3–1.4 (Identity, access); ISC² CC Access Control Concepts.
$md$, 25, 2),
  ('b0000000-0000-4000-8000-000000000032', 'Threat Actors and Attack Types', 'Who attacks and how: malware, phishing, and exploits.', $md$
# Threat Actors and Attack Types

## Introduction

This lesson introduces who carries out attacks (threat actors), common attack types (malware, phishing, exploits, DDoS, insiders), and how organisations mitigate them through vulnerability management and user awareness.

## Objectives

By the end of this lesson you will be able to:

- Describe categories of threat actors and their typical motives and capabilities.
- Define malware types (ransomware, trojans, rootkits) and how they spread.
- Explain phishing and social engineering and how to mitigate them.
- Summarise exploits, DDoS, and insider threats and relevant controls.

## Threat Actors

Threat actors range from **script kiddies** (low skill, using others’ tools) to **organised crime** (financial gain), **hacktivists** (ideological), **nation-states** (espionage, disruption), and **insiders** (employees or partners with access). Motives include money, data theft, disruption, and reputation damage. Understanding who might target your organisation helps prioritise defences.

## Malware and Attack Types

**Malware** includes **viruses** (spread by infecting files), **worms** (self-propagating), **trojans** (disguised as legitimate software), **ransomware** (encrypts data and demands payment), and **rootkits** (persist and hide). **Phishing** uses email or other channels to trick users into revealing credentials or installing malware. **Social engineering** manipulates people into breaking security (e.g. pretexting, baiting). **Exploits** use software or configuration weaknesses to gain access or cause harm. **DDoS (Distributed Denial of Service)** floods a target with traffic to make it unavailable. **Insider threats** are people who misuse legitimate access (malicious or negligent).

## Mitigations

**Vulnerability management** — Discover (scanning), prioritise (risk and exposure), and remediate (patch or mitigate) vulnerabilities. **User awareness** — Training and phishing simulations so users recognise and report threats. **Defence in depth** — Multiple controls so one failure does not mean full compromise.

## Key takeaway

Threat actors vary by motive and capability. Malware, phishing, social engineering, exploits, DDoS, and insiders are common attack types. Vulnerability management and user awareness are core mitigations.

## Exam alignment

Security+ 2.1–2.2 (Threats, attacks); ISC² CC Security Operations.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000032', 'Vulnerability Assessment and Response', 'Scanning, prioritisation, and incident response basics.', $md$
# Vulnerability Assessment and Response

## Introduction

This lesson covers how organisations find and prioritise vulnerabilities (scanning, penetration testing) and how they respond to incidents. You will learn the vulnerability management process and the main phases of incident response.

## Objectives

By the end of this lesson you will be able to:

- Explain vulnerability scanning and how it differs from penetration testing.
- Describe how to prioritise remediation using severity and exposure.
- List and describe the phases of incident response.
- Explain why preparation and documentation matter for response.

## Vulnerability Scanning and Penetration Testing

**Vulnerability scanning** uses tools to compare systems and software against known weaknesses (e.g. missing patches, misconfigurations). Scans are typically automated and recurring. **Penetration testing** simulates an attacker: testers attempt to exploit findings to confirm impact and chain vulnerabilities. It is done with explicit authorisation and scope. Both feed into **prioritisation**: consider severity (e.g. CVSS), whether the asset is internet-facing, exploitability, and business criticality. Not every high-severity finding is urgent if the system is isolated or non-critical.

## Incident Response

**Incident response** is the process of handling security events. Common phases:

- **Preparation** — Plans, runbooks, contacts, and tools in place before an incident.
- **Detection and analysis** — Identifying and validating that an incident has occurred.
- **Containment** — Limiting damage (e.g. isolate systems, disable accounts).
- **Eradication** — Removing the cause (e.g. malware, attacker access).
- **Recovery** — Restoring systems and validating they are secure.
- **Post-incident** — Documentation, lessons learned, and process improvement.

Communication and clear roles (e.g. incident commander) are essential. Backups and disaster recovery procedures support recovery and business continuity.

## Key takeaway

Vulnerability scanning and penetration testing find and validate weaknesses; prioritisation uses severity and context. Incident response follows preparation, detection, containment, eradication, recovery, and post-incident review.

## Exam alignment

Security+ 2.3, 4.x (Vulnerability management, IR); ISC² CC BC/DR, Security Operations.
$md$, 25, 2),
  ('b0000000-0000-4000-8000-000000000033', 'Security Architecture and Resilience', 'Secure design, zero trust, and resilience.', $md$
# Security Architecture and Resilience

## Introduction

This lesson covers how to design secure networks and systems: segmentation, defence in depth, zero trust, and resilience. You will learn principles that apply to on-premises, cloud, and hybrid environments.

## Objectives

By the end of this lesson you will be able to:

- Explain security architecture concepts: segmentation, defence in depth, and secure design.
- Define zero trust and how it differs from perimeter-based security.
- Describe resilience: redundancy, backups, and recovery.
- Summarise how these concepts apply in cloud and hybrid environments.

## Security Architecture

**Security architecture** is the design of systems and networks with security built in. **Network segmentation** divides the network into zones (e.g. DMZ, internal, management) and restricts traffic between them so a breach in one zone does not automatically compromise everything. **Defence in depth** uses multiple layers of controls (network, host, application, data) so that if one control fails, others can still limit damage. **Secure design principles** include least privilege, fail secure, and avoiding security through obscurity.

## Zero Trust

**Zero trust** assumes no implicit trust based on location or network. Every access request is verified regardless of where it comes from. Identity, device posture, and context (e.g. time, resource) are used to grant or deny access. Zero trust reduces reliance on the traditional network perimeter and supports remote work and cloud.

## Resilience

**Resilience** means the organisation can continue or recover after disruption. It includes **redundancy** (duplicate systems or paths), **backups** (regular, tested, offline or immutable where appropriate), and **recovery procedures** (documented, practised). **Business continuity** and **disaster recovery** plans define how critical functions are restored.

## Cloud and Hybrid

In **cloud** and **hybrid** environments, segmentation and identity-centric controls (e.g. zero trust) apply across on-premises and cloud. Shared responsibility models define what the provider secures versus what the customer must secure. Architecture choices (e.g. network design, encryption, access control) should be consistent across environments.

## Key takeaway

Security architecture uses segmentation and defence in depth. Zero trust verifies every access. Resilience relies on redundancy, backups, and recovery. These principles apply in on-premises, cloud, and hybrid environments.

## Exam alignment

Security+ 3.0 (Security Architecture); ISC² CC Security Principles.
$md$, 26, 1),
  ('b0000000-0000-4000-8000-000000000033', 'Monitoring and Security Operations', 'Logging, SIEM, and operational security.', $md$
# Monitoring and Security Operations

## Introduction

This lesson covers how organisations gain visibility into their systems through logging and monitoring, how a SIEM supports detection and response, and what day-to-day security operations involve.

## Objectives

By the end of this lesson you will be able to:

- Explain why logging and monitoring are essential for security.
- Describe what a SIEM does and how it supports detection.
- List typical security operations activities: alert triage, incident handling, runbooks.
- Explain how operational hygiene (e.g. tuning, retention) supports effectiveness.

## Logging and Monitoring

**Logging** records events from systems, applications, and network devices (e.g. logins, errors, configuration changes). **Monitoring** uses those logs and metrics to observe behaviour and spot anomalies. Logs must be protected from tampering and retained according to policy. Centralised collection makes analysis and retention easier.

## SIEM

A **SIEM (Security Information and Event Management)** aggregates logs from many sources, normalises them, and supports **detection** (rules and analytics to find suspicious activity), **investigation** (search and correlation), and **reporting**. SIEMs help analysts triage alerts, investigate incidents, and meet compliance requirements. Effective use depends on quality data sources, tuned rules to limit false positives, and clear runbooks for common scenarios.

## Security Operations

**Security operations** include monitoring dashboards and queues, **triaging** alerts (deciding what is real and what is priority), **responding** to incidents (containment, escalation), and maintaining **runbooks** and playbooks. Operations teams also maintain and tune controls (e.g. firewall rules, detection rules) and participate in exercises and tabletop drills.

## Key takeaway

Logging and monitoring provide visibility; a SIEM aggregates and analyses logs for detection and investigation. Security operations centre on triage, response, runbooks, and continuous tuning.

## Exam alignment

Security+ 4.1–4.3 (Security Operations); ISC² CC Security Operations.
$md$, 24, 2),
  ('b0000000-0000-4000-8000-000000000031', 'Cryptography in Practice', 'Symmetric, asymmetric, TLS, and certificates in the real world.', $md$
# Cryptography in Practice

## Introduction

This lesson applies cryptography to real-world use: how TLS secures web and API traffic, how certificates and PKI establish trust, and how symmetric and asymmetric encryption are used together.

## Objectives

By the end of this lesson you will be able to:

- Describe how TLS uses asymmetric key exchange and symmetric bulk encryption.
- Explain what certificates and CAs are and how they support trust.
- Identify where encryption at rest and in transit apply (e.g. disk, database, TLS).
- Troubleshoot common certificate and TLS issues (expiry, chain, hostname).

## Symmetric and Asymmetric in Practice

**Symmetric encryption** (e.g. AES) uses one shared key; it is fast and used for bulk data. **Asymmetric** (e.g. RSA, ECC) uses public/private key pairs; the public key can be shared, the private key is kept secret. **TLS** uses asymmetric cryptography to authenticate the server (and optionally the client) and to exchange a symmetric session key; the rest of the session uses symmetric encryption for performance. You will see TLS in HTTPS, VPNs, email (TLS for transport), and many APIs.

## Certificates and PKI

**Certificates** bind a public key to an identity (e.g. domain name, organisation). A **Certificate Authority (CA)** signs certificates; clients trust CAs (via a root store) and thus trust certificates signed by them. **PKI (Public Key Infrastructure)** is the set of policies, CAs, and procedures for issuing and revoking certificates. Common issues: expired certificates, broken chain (intermediate not trusted), hostname mismatch. Best practice: automate renewal (e.g. Let''s Encrypt) and monitor expiry.

## Encryption at Rest and in Transit

**In transit** — Data moving over the network should be encrypted (e.g. TLS). **At rest** — Data on disk or in databases should be encrypted (e.g. full-disk encryption, database encryption, encrypted backups). Key management (generation, storage, rotation, destruction) is critical; losing keys can mean losing access to data.

## Key takeaway

TLS combines asymmetric key exchange with symmetric bulk encryption. Certificates and PKI establish trust. Encryption at rest and in transit, with proper key management, are baseline for protecting data.

## Exam alignment

Security+ 1.2; ISC² CC Security Principles.
$md$, 26, 3),
  ('b0000000-0000-4000-8000-000000000032', 'Vulnerability Types and Prioritisation', 'CVE, CVSS, and how to prioritise remediation.', $md$
# Vulnerability Types and Prioritisation

## Introduction

This lesson explains how vulnerabilities are named (CVE), how severity is scored (CVSS), and how to prioritise remediation using score, exposure, exploitability, and business context.

## Objectives

By the end of this lesson you will be able to:

- Explain what CVE and CVSS are and how they are used.
- Interpret a CVSS score and its components (e.g. base, temporal, environmental).
- Prioritise remediation using severity, exposure, exploitability, and asset criticality.
- Apply risk-based prioritisation when resources are limited.

## CVE and CVSS

**CVE (Common Vulnerabilities and Exposures)** is a catalogue of known vulnerabilities; each has a unique ID (e.g. CVE-2024-1234). **CVSS (Common Vulnerability Scoring System)** produces a score (0–10) for severity. The **base** score reflects exploitability and impact; **temporal** adjusts for exploit availability and patches; **environmental** adjusts for your environment (e.g. criticality of affected asset). Scores help compare and communicate risk but should not be the only input for prioritisation.

## Prioritisation

Prioritise using:

- **Severity** — CVSS and whether exploit code or active attacks exist.
- **Exposure** — Is the asset internet-facing or in a sensitive segment?
- **Exploitability** — Is there a known exploit? Is the software widely deployed?
- **Asset criticality** — How important is the system to the business?

A critical vulnerability on an isolated, non-critical system may be lower priority than a high (not critical) vulnerability on an internet-facing payment system. Document criteria and exceptions so decisions are consistent and auditable.

## Key takeaway

CVE provides standard identifiers; CVSS provides severity scores. Use severity, exposure, exploitability, and asset criticality together to prioritise remediation.

## Exam alignment

Security+ 2.3–2.4.
$md$, 22, 3),
  ('b0000000-0000-4000-8000-000000000033', 'Secure Deployment and Hardening', 'Baselines, hardening, and secure development lifecycle basics.', $md$
# Secure Deployment and Hardening

## Introduction

This lesson covers how to deploy systems securely using security baselines, hardening, and secure development and deployment practices. You will learn how to reduce attack surface and integrate security into the lifecycle.

## Objectives

By the end of this lesson you will be able to:

- Define security baselines and give examples (e.g. CIS Benchmarks).
- List hardening steps for servers and network devices.
- Describe how security fits into the development and deployment lifecycle.
- Explain secure pipelines, dependency checks, and secure coding basics.

## Security Baselines

**Security baselines** are standard secure configurations for operating systems, applications, and devices. **CIS Benchmarks** and vendor guidance (e.g. Microsoft Security Baseline) provide recommended settings. Baselines address default passwords, unnecessary services, logging, encryption, and access control. New systems and major upgrades should be built to the baseline and validated (e.g. scanning, manual checks) before going live.

## Hardening

**Hardening** is the process of reducing attack surface: disable or remove unneeded services and features, restrict permissions (least privilege), apply patches, configure firewalls and access lists, enable logging, and protect management interfaces. Different asset types (web server, database, network device) have different hardening checklists. Hardening should be documented and repeated when images or configurations change.

## Secure SDLC and Deployment

**Secure SDLC** integrates security into design, development, and deployment. Practices include: secure design and threat modelling, secure coding standards and training, **dependency scanning** (known vulnerable libraries), **SAST/DAST** (static and dynamic testing), secure **CI/CD** (pipeline secrets, signed artefacts, approval gates), and post-deployment monitoring. The goal is to find and fix issues early rather than only in production.

## Key takeaway

Baselines and hardening reduce attack surface for deployed systems. A secure lifecycle (design, code, build, deploy) prevents many issues before they reach production.

## Exam alignment

Security+ 3.x, 4.x.
$md$, 25, 3),
  ('b0000000-0000-4000-8000-000000000034', 'Security Policies and Compliance', 'Policies, standards, and compliance.', $md$
# Security Policies and Compliance

## Introduction

This lesson covers how organisations set security expectations (policies, standards, procedures) and how compliance and audits drive and verify control implementation. You will learn the role of policy and how to work effectively with compliance requirements.

## Objectives

By the end of this lesson you will be able to:

- Distinguish policies, standards, and procedures and give examples.
- Explain how compliance frameworks (e.g. GDPR, PCI-DSS) drive controls.
- Describe the role of audits and how to prepare for them.
- Justify technical controls using policy and compliance requirements.

## Policies, Standards, and Procedures

**Policies** are high-level statements of what the organisation expects (e.g. “We protect confidential data”, “Access is based on role and need”). **Standards** define specific requirements (e.g. password length, encryption algorithms). **Procedures** are step-by-step instructions for carrying out tasks (e.g. how to grant access, how to handle an incident). Policies are approved by leadership; standards and procedures support implementation and consistency.

## Compliance

**Compliance** means meeting legal, regulatory, or contractual requirements. Examples: **GDPR** (EU data protection), **HIPAA** (US health data), **PCI-DSS** (payment card data), **SOC 2** (service organisation controls). Frameworks specify control requirements; organisations map their controls to the framework and collect evidence. **Audits** (internal or external) verify that controls are in place and operating effectively. Non-compliance can result in fines, legal action, or loss of trust.

## Working with Policy and Compliance

Security teams implement controls that satisfy policy and compliance. When designing or changing controls, reference the relevant policy and framework requirements so that implementations are traceable. Document how each control maps to a requirement. This supports audits and helps explain to management why certain controls are needed.

## Key takeaway

Policies set expectations; standards and procedures implement them. Compliance frameworks and audits define and verify required controls. Technical controls should be traceable to policy and compliance.

## Exam alignment

Security+ 5.1–5.2; ISC² CC (governance).
$md$, 24, 1),
  ('b0000000-0000-4000-8000-000000000034', 'Security Awareness and Third-Party Risk', 'Training, phishing simulation, and vendor risk.', $md$
# Security Awareness and Third-Party Risk

## Introduction

This lesson covers how to reduce human risk through security awareness and phishing simulations, and how to manage risk from third parties (vendors, partners) that have access to your systems or data.

## Objectives

By the end of this lesson you will be able to:

- Design and deliver effective security awareness training.
- Use phishing simulations to measure and improve behaviour.
- Explain third-party and vendor risk and how to assess and monitor it.
- Describe contracts, assessments, and ongoing monitoring for vendors.

## Security Awareness Training

**Security awareness training** teaches staff to recognise threats (e.g. phishing, social engineering), use strong passwords and MFA, handle data correctly, and report incidents. Training should be role-relevant, regular, and reinforced (e.g. short modules, reminders). Topics often include: phishing, passwords, physical security, clean desk, and incident reporting. Measure completion and, where possible, behaviour change.

## Phishing Simulations

**Phishing simulations** send simulated phishing emails to staff to test whether they click or report. Results show where awareness is weak; follow-up training can target those who need it. Simulations should be authorised, clearly distinguishable from real phishing after the fact (e.g. landing page that says “This was a test”), and used to improve training rather than to punish. Track click rates and report rates over time.

## Third-Party and Vendor Risk

**Third-party risk** is the risk that suppliers, partners, or service providers introduce (e.g. they are compromised, they misuse access, they fail to protect your data). **Vendor management** addresses this through: **due diligence** (assess security before engaging), **contracts** (security and privacy requirements, audit rights, breach notification), **continuous monitoring** (questionnaires, certifications, incident notification), and **termination** (offboarding access and data). Prioritise vendors with access to sensitive systems or data.

## Key takeaway

Awareness training and phishing simulations reduce human error. Third-party risk is managed through due diligence, contracts, and ongoing monitoring. People and partners are part of the security perimeter.

## Exam alignment

Security+ 5.3–5.4; ISC² CC (Security Program).
$md$, 22, 2);

-- ========== LEVEL 3: BH-OPS-2 — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000041', 'a0000000-0000-4000-8000-000000000005', 'Security Operations and Vulnerability Management', 'Operations and vulnerability management for SOC and practitioner roles.', 1),
  ('b0000000-0000-4000-8000-000000000042', 'a0000000-0000-4000-8000-000000000005', 'Incident Response and Recovery', 'IR process and recovery for security operations.', 2);

-- ========== BH-OPS-2: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000041', 'Security Operations and Threat Detection', 'Day-to-day SOC activities and threat detection.', $md$
# Security Operations and Threat Detection

## Introduction

This lesson covers how security operations centres (SOCs) and operations teams monitor, triage, and respond to threats. You will learn how detection works (signatures, behaviour, threat intelligence) and how EDR and XDR extend visibility and response.

## Objectives

By the end of this lesson you will be able to:

- Describe typical security operations activities: monitoring, triage, runbooks.
- Explain threat detection using signatures, behaviour, and threat intelligence.
- Define EDR and XDR and how they support detection and response.
- Apply runbook-based response for common alert types.

## Security Operations Activities

**Security operations** include continuous **monitoring** of dashboards and queues, **triaging** alerts (determining validity and priority), **investigating** incidents (gathering context, correlating events), and **responding** (containment, escalation, documentation). **Runbooks** and playbooks document how to handle common scenarios so that response is consistent and efficient. Shift handover and escalation paths ensure coverage and clarity.

## Threat Detection

**Threat detection** combines **signature-based** detection (known malware, known IOCs), **behaviour-based** detection (anomalies, suspicious patterns), and **threat intelligence** (IOCs, TTPs from external sources). Tuning reduces false positives; context (asset, user, business) improves prioritisation. Detection effectiveness depends on quality data sources (logs, EDR, network) and clear use cases.

## EDR and XDR

**EDR (Endpoint Detection and Response)** provides visibility and response on endpoints: process and file activity, network connections, and the ability to isolate or remediate. **XDR** extends visibility across endpoints, email, identity, and cloud applications so analysts can correlate and respond across domains. Both support investigation and containment; XDR reduces silos and accelerates cross-domain visibility.

## Key takeaway

Security operations centre on monitoring, triage, investigation, and response. Detection uses signatures, behaviour, and threat intelligence. EDR and XDR provide the visibility and response capabilities needed for effective operations.

## Exam alignment

CySA+ 1.0 (Security Operations); SSCP Security Operations, Risk Identification.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000041', 'Vulnerability Management Lifecycle', 'Scanning, prioritisation, and remediation.', $md$
# Vulnerability Management Lifecycle

## Introduction

This lesson covers the full vulnerability management lifecycle: discovery, prioritisation, remediation, and verification. You will learn how to use CVSS and business context to prioritise and how to track remediation to closure.

## Objectives

By the end of this lesson you will be able to:

- List and describe the phases of the vulnerability management lifecycle.
- Use CVSS and organisational context to prioritise remediation.
- Explain remediation options: patch, mitigate, accept, transfer.
- Verify that remediation was effective and document exceptions.

## Lifecycle Phases

The **vulnerability management lifecycle** has four main phases:

- **Discovery** — Identify vulnerabilities via scanning (network, host, application), penetration testing, and threat intelligence. Scope and schedule scans; ensure authorisation.
- **Prioritisation** — Score and rank findings using CVSS, exposure, exploitability, and asset criticality. Focus on the highest risk first when resources are limited.
- **Remediation** — Apply patches, configuration changes, or compensating controls; or formally accept or transfer risk. Assign owners and deadlines; track to completion.
- **Verification** — Rescan or otherwise verify that the vulnerability is resolved. Document any accepted or deferred risk with justification and review dates.

## Prioritisation in Practice

**CVSS** provides a baseline severity; **temporal** and **environmental** modifiers adjust for your context. Combine with: Is the system internet-facing? Is there an exploit? How critical is the asset? **Risk acceptance** should be documented, time-bound, and approved by the right level. **Compensating controls** (e.g. WAF rule, network segmentation) may reduce risk when patching is delayed.

## Key takeaway

Vulnerability management is a continuous cycle: discover, prioritise, remediate, verify. Prioritisation uses severity and business context. Document acceptance and compensating controls.

## Exam alignment

CySA+ 2.0 (Vulnerability Management); SSCP Risk Identification, Monitoring, and Analysis.
$md$, 26, 2),
  ('b0000000-0000-4000-8000-000000000042', 'Incident Response Process', 'Detection, containment, eradication, recovery.', $md$
# Incident Response Process

## Introduction

This lesson walks through the incident response process from preparation through post-incident review. You will learn the phases, roles, and why communication and documentation are essential.

## Objectives

By the end of this lesson you will be able to:

- List and describe the phases of incident response.
- Explain containment strategies: short-term and long-term.
- Distinguish eradication from recovery and when each happens.
- Describe the purpose of post-incident review and lessons learned.

## IR Phases

**Preparation** — Plans, runbooks, contact lists, and tools in place. **Detection and analysis** — Identify and confirm the incident; determine scope and impact. **Containment** — Limit damage (short-term: isolate systems, disable accounts; long-term: apply fixes so the threat cannot return). **Eradication** — Remove the cause (malware, attacker access, misconfiguration). **Recovery** — Restore systems safely; validate integrity and monitor for recurrence. **Post-incident** — Document timeline, root cause, and lessons learned; update plans and controls.

## Containment, Eradication, Recovery

**Containment** choices depend on impact: taking a system offline may stop the attack but affect business; sometimes containment is gradual (e.g. block C2 first, then rebuild). **Eradication** must remove the root cause; rebuilding from known-good images is often part of this. **Recovery** includes restoring from backups if needed, verifying systems are clean, and watching for reinfection or secondary attacks. Communication with stakeholders (internal and, if required, external) is critical throughout.

## Key takeaway

Incident response follows preparation, detection, containment, eradication, recovery, and post-incident review. Containment limits damage; eradication removes the cause; recovery restores operations. Documentation and lessons learned improve future response.

## Exam alignment

CySA+ 3.0 (Incident Response and Management); SSCP Incident Response and Recovery.
$md$, 30, 1),
  ('b0000000-0000-4000-8000-000000000042', 'Reporting and Communication', 'Reporting to stakeholders.', $md$
# Reporting and Communication

## Introduction

This lesson covers how to report technical findings to management and stakeholders and how to communicate clearly during incidents. You will learn what to include in reports and how to tailor messaging for different audiences.

## Objectives

By the end of this lesson you will be able to:

- Write an executive summary that states impact and recommendations clearly.
- Structure technical reports for management and operational audiences.
- Describe communication best practices during incidents (internal and external).
- Explain why reporting and communication are critical for influence and accountability.

## Reporting

**Reporting** turns technical work into actionable information. **Executive summaries** should state the main finding, impact (business and risk), and recommended actions in plain language. **Technical appendices** can contain detail for those who need it. Use consistent metrics and trends (e.g. mean time to detect, number of open findings) so progress is visible. Reports support decision-making and demonstrate the value of security work.

## Communication During Incidents

During **incidents**, communication must be clear, consistent, and timely. **Internal** — Designate a single point or channel for updates; avoid speculation; state what is known, what is being done, and what is needed. **External** — Follow legal and contractual obligations (e.g. breach notification); coordinate with legal and communications. **Stakeholders** — Keep leadership and affected business units informed; set expectations for recovery and next steps.

## Key takeaway

Good reporting translates technical work into decisions and accountability. During incidents, clear and consistent communication (internal and external) is essential for effective response and trust.

## Exam alignment

CySA+ 4.0 (Reporting and Communication); SSCP Security Operations.
$md$, 22, 2);

-- ========== LEVEL 4: BH-SPEC-SOC — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000051', 'a0000000-0000-4000-8000-000000000006', 'Advanced SOC and SIEM', 'SOC and SIEM operations at an advanced level.', 1),
  ('b0000000-0000-4000-8000-000000000052', 'a0000000-0000-4000-8000-000000000006', 'Threat Hunting and Incident Handling', 'Hunting and advanced incident handling.', 2);

-- ========== BH-SPEC-SOC: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000051', 'SIEM Administration and Tuning', 'Configuring and tuning SIEM for detection.', $md$
# SIEM Administration and Tuning

**SIEM** administration includes onboarding data sources, writing and tuning detection rules, and managing false positives. **Microsoft Sentinel** and **Splunk** are common platforms; **KQL** (Kusto Query Language) is used for querying and building detections. You will use these skills daily in an advanced SOC or security engineering role.

## Exam alignment

CySA+ 1.0 (Security Operations — tooling).
$md$, 30, 1),
  ('b0000000-0000-4000-8000-000000000051', 'Defender XDR and Cloud Security', 'Microsoft Defender and cloud workload protection.', $md$
# Defender XDR and Cloud Security

**Microsoft Defender XDR** unifies endpoint, email, identity, and cloud app protection. **Defender for Cloud** secures Azure and hybrid workloads. Multi-cloud and hybrid environments require visibility and response across platforms; this lesson bridges SOC and cloud security.

## Exam alignment

CySA+ 1.0 (Security Operations — XDR, cloud).
$md$, 28, 2),
  ('b0000000-0000-4000-8000-000000000052', 'Threat Hunting Methodologies', 'Proactive hunting for threats.', $md$
# Threat Hunting Methodologies

**Threat hunting** is proactive search for threats that may have evaded detection. It uses hypotheses, data (logs, EDR), and iterative analysis. **Threat intelligence** informs hunting and prioritisation. Effective hunters combine tool fluency with an understanding of adversary behaviour and organisational context.

## Exam alignment

CySA+ 3.0 (Incident Response and Management); threat hunting.
$md$, 28, 1),
  ('b0000000-0000-4000-8000-000000000052', 'Advanced Incident Handling', 'Complex incidents and coordination.', $md$
# Advanced Incident Handling

**Advanced incident handling** deals with persistent threats, ransomware, and coordinated response across teams. **Forensics** (disk, memory, network) support root cause analysis. **Coordination** with IT, legal, and leadership is essential. This prepares you for lead analyst or incident commander responsibilities.

## Exam alignment

CySA+ 3.0 (Incident Response and Management).
$md$, 26, 2);

-- ========== LEVEL 5: BH-ADV — MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000061', 'a0000000-0000-4000-8000-000000000007', 'Security and Risk Management', 'Governance, risk, and compliance at a strategic level.', 1),
  ('b0000000-0000-4000-8000-000000000062', 'a0000000-0000-4000-8000-000000000007', 'Security Architecture and Leadership', 'Architecture and program management for security leaders.', 2);

-- ========== BH-ADV: LESSONS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000061', 'Security Governance and Risk Management', 'Governance, risk, and compliance.', $md$
# Security Governance and Risk Management

**Security governance** aligns security with business objectives and ensures accountability. **Risk management** includes identification, assessment (likelihood and impact), response (accept, mitigate, transfer, avoid), and monitoring. **Compliance** (regulatory, contractual) drives many security programs. Leaders use this to prioritise and justify security investments.

## Exam alignment

CISSP Domain 1 (Security and Risk Management); CISM (Governance, Risk Management).
$md$, 32, 1),
  ('b0000000-0000-4000-8000-000000000061', 'Security Program Development', 'Building and managing the security program.', $md$
# Security Program Development

A **security program** encompasses policies, standards, procedures, awareness training, and control implementation. **Program development** requires stakeholder buy-in, resources, and metrics. **Third-party risk** and **vendor management** are part of the program. This is the mindset of a CISO or security manager.

## Exam alignment

CISM Domain 3 (Information Security Program); CISSP Domain 5 (Security Program Management).
$md$, 30, 2),
  ('b0000000-0000-4000-8000-000000000062', 'Security Architecture and Engineering', 'Design and engineering for security architects.', $md$
# Security Architecture and Engineering

**Security architecture** designs systems and networks with security built in. It considers **secure design principles**, **cryptography**, and **physical security**. Enterprise architecture frameworks support consistent design; security architects align with them. This supports roles such as Security Architect or Lead Engineer.

## Exam alignment

CISSP Domain 3 (Security Architecture and Engineering); TOGAF (security architecture in EA).
$md$, 30, 1),
  ('b0000000-0000-4000-8000-000000000062', 'Leadership and Communication', 'Leading teams and communicating with the board.', $md$
# Leadership and Communication

**Security leaders** set strategy, manage teams, and communicate risk and programme status to the board and executives. **Board reporting** should be concise, risk-focused, and tied to business impact. **Building a team** and **developing talent** are part of the role. This lesson prepares you for CISO or senior management responsibilities.

## Exam alignment

CISM (Program, Incident Management); CISSP (leadership across domains).
$md$, 28, 2);

COMMIT;
