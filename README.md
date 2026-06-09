```markdown
# 🎓 AI Course Generator

An intelligent SaaS-based learning platform that automatically generates complete, custom educational courses using Generative AI. Designed as a college final-year capstone project, this platform creates structured curricula, detailed chapter content, programming examples, and curated video resources, enabling users to learn any topic through a personalized learning experience.

## 🌐 Live Demo

**Deployment:** [https://ai-course-generator-seven-phi.vercel.app](https://ai-course-generator-seven-phi.vercel.app)

---

## 📖 About the Project

**AI Course Generator** is a full-stack, AI-powered educational platform that allows users to generate complete, personalized courses in seconds. By combining advanced Large Language Models (LLMs) with automated web search pipelines, the application instantly drafts structured course outlines, compiles comprehensive sub-chapters with text explanations and code snippets, and matches them with high-quality, relevant educational videos. 

The application is built using a modern stack featuring **Next.js 16**, **React 19**, **Google Gemini AI**, **Neon serverless PostgreSQL**, **Drizzle ORM**, **Clerk Authentication**, and **Tailwind CSS v4**.

---

## 🎯 Purpose

The primary purpose of the AI Course Generator is to democratize education by offering **personalized, on-demand, and multi-lingual learning path construction**. Instead of forcing learners to browse multiple generic, unorganized educational sources or follow fixed, pre-recorded modules that might be too slow or too fast, this platform serves as an instant personal tutor. It instantly extracts, structures, and presents educational material optimized for a student's chosen topic, knowledge level, and native language.

---

## 📝 Problem Statement

Traditional online education systems (such as Massive Open Online Courses / MOOCs) suffer from several systemic limitations:
1. **Rigid & Non-Adaptive Curricula**: Existing courses offer static, pre-recorded structures. They fail to adapt to an individual student's specific knowledge gaps, interests, or pacing requirements.
2. **High Course Creation Overhead**: Creating a complete course layout, compiling explanations, writing source code examples, and recording corresponding video lectures takes subject-matter experts hundreds of hours.
3. **Monolingual Bias**: High-quality tech-related educational content is predominantly created in English, leaving regional or native-language learners with limited or low-quality materials.
4. **Information Sifting Fatigue**: Students lose hours switching back and forth between search engines, textual blogs, documentation, and random YouTube playlists to study a single topic in detail.
5. **Subscription & Transaction Overhead**: Creators and small-scale educational teams suffer high transaction commissions from major card payment gateways and lack support for direct, zero-fee peer-to-peer bank transfers (like UPI references) backed by a secure verification system.

---

## 💡 Solution (Proposed System)

The **AI Course Generator** addresses these challenges through a unified, automated, and robust learning portal:

* **Real-time Syllabus Generation**: Harnesses Google's Gemini AI to instantly create hierarchical modular course structures based on user inputs (Category, Topic, Level, Duration, and Language).
* **Multi-Modal Synchronization**: Automatically matches and embeds corresponding, high-quality, and duration-filtered video lessons for every generated chapter using the Google YouTube Data API v3.
* **Fault-Tolerant AI Parser (Robust Normalization)**: Utilizes a custom, client-side normalization pipeline (`configs/dbNormalize.js`) that handles inconsistencies in the AI model's JSON outputs. It dynamically parses raw arrays, case-insensitive properties, and localized keys (e.g. Tamil or Hindi terms like `அத்தியாயங்கள்` or `பிரிவுகள்`) to guarantee smooth rendering without breaking the UI.
* **Flexible Dual-Route Payment Gateway**: Features card processing checkouts (Razorpay and Stripe simulator) alongside a commission-free **Manual UPI Reference (UTR) Submission Portal** displaying dynamic checkout QR codes.
* **Administrative Audit Dashboard**: A secure, admin-only panel to review manual bank transfer reference (UTR) codes, verify payments, and instantly toggle premium Clerk memberships with a single click.

---

## 📐 System Architecture

The client application, serverless DB, and external AI models interact as shown in the data-flow diagram below:

```mermaid
graph TD
    subgraph Client Application (Next.js 16 / React 19)
        UI[User Interface / Stepper Wizard]
        Viewer[Course Player UI & Markdown Reader]
        AdminPanel[Admin Approval Console]
    end

    subgraph Authentication & Gateway Layer
        Clerk[Clerk Auth & Route Middleware]
        PG[Razorpay / Stripe Gateways]
    end

    subgraph Serverless Data Store
        Drizzle[Drizzle ORM]
        Postgres[(Neon Serverless PostgreSQL)]
    end

    subgraph Artificial Intelligence & Search APIs
        Gemini[Google Gemini API]
        YouTube[Google YouTube v3 Search API]
    end

    %% User interactions
    UI -->|1. Authenticates & Creates Course Request| Clerk
    UI -->|2. Requests Layout| Gemini
    Gemini -->|3. Returns JSON Outline| UI
    UI -->|4. Saves Layout| Drizzle
    Drizzle --> Postgres

    %% Content generation
    Viewer -->|5. Triggers Detailed Material Generation| Gemini
    Viewer -->|6. Queries Video Sync| YouTube
    Gemini -->|7. Returns Subchapter Explanations| Viewer
    YouTube -->|8. Returns Embeddable Video ID| Viewer
    Viewer -->|9. Stores Chapter Content & Video| Drizzle

    %% Admin & Billing
    UI -->|10. Submits Manual UPI UTR| Drizzle
    AdminPanel -->|11. Reads Pending UTRs| Drizzle
    AdminPanel -->|12. Approves/Rejects UTR| Clerk
    Clerk -->|13. Updates User Account Meta| Postgres
```

---

## ⚙️ Core Modules

1. **User Input & Validation Wizard**: A step-by-step options collection container (`SelectCategory`, `TopicDescription`, `SelectOption`) that collects preferences for course generation.
2. **AI Content Synthesis Engine**: Moves requests to Gemini AI via a resilient rate-limiting query orchestrator (`sendMessageWithRetry`) to draft detailed lesson plans.
3. **YouTube Resource Matcher**: An automated worker that constructs precise search phrases and retrieves matching embeddable instructional video keys.
4. **Data Normalization Layer**: Formats dynamic, unstructured AI responses into standard schema objects before database insertion and rendering.
5. **Subscription & Payment Controllers**: Controls free usage limits, premium plans, and handles credit card simulation and manual peer-to-peer payment submissions.
6. **Admin Review Interface**: A secured management console where platform administrators audit transaction receipts and toggle user memberships.

---

## 🚀 Key Features

* **✨ Dynamic AI Syllabus Generation**: Generates comprehensive course structures detailing categories, difficulty levels, target durations, and sub-chapters.
* **📖 Full Markdown Lesson Explanations**: Dynamically renders detailed sub-chapters featuring headings, code snippet containers, and comprehensive explanations.
* **📺 Curated Video Integrations**: Automatically pairs each generated chapter with relevant YouTube video resources.
* **🌐 Multilingual Generation Support**: Instantly translates and constructs courses in multiple languages including English, Tamil, Hindi, Spanish, and French.
* **🔒 Secure Authentication Boundary**: Routes protected by Clerk JWT middleware, separating standard dashboards from administrator consoles.
* **💳 P2P Payments & Admin Verification**: Support for direct UPI payments using dynamically generated QR codes with an administrative verification panel to manually clear UTR codes.
* **🌓 Dark & Light Modes**: Seamless visual system supporting dynamic dark and light mode themes.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 16 (App Router, React 19)
* **Styling**: Tailwind CSS v4, Radix UI Primitives, Lucide React Icons
* **Database**: Serverless PostgreSQL (hosted on [Neon.tech](https://neon.tech/))
* **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
* **Authentication**: [Clerk Next.js SDK](https://clerk.com/)
* **AI Model**: Google Gemini API (`@google/generative-ai`)
* **Media API**: Google YouTube Data API v3
* **Markdown Rendering**: `react-markdown`

---

## 📂 Directory Structure

```text
├── app/
│   ├── (auth)/                 # Clerk authentication pages (sign-in, sign-up)
│   ├── course/                 # Course viewer routes
│   │   └── [courseId]/
│   │       ├── page.jsx        # Landing info for generated course
│   │       └── start/          # Interactive course reader screen (video + markdown)
│   ├── create-course/          # 3-step course generator wizard
│   │   ├── [courseId]/         # Dynamic layout structure preview and generation triggers
│   │   └── page.jsx            # Multi-step options selector UI
│   ├── dashboard/              # User dashboard area
│   │   ├── admin/              # Admin-only manual UTR approvals screen
│   │   ├── explore/            # Explore publicly shared/generated courses
│   │   ├── upgrade/            # Premium pricing plans & payment checkout integrations
│   │   └── page.jsx            # Main user course list interface
│   ├── layout.js               # Root layout context wrappers (User & Theme Providers)
│   ├── globals.css             # Tailwind v4 globals
│   └── page.js                 # Landing marketing home page
├── components/
│   └── ui/                     # Reusable Shadcn UI blocks (alert-dialog, dialog, buttons, inputs, dropdowns)
├── configs/
│   ├── db.jsx                  # Neon PostgreSQL Serverless driver + Drizzle DB instance
│   ├── schema.jsx              # PostgreSQL tables definitions (Drizzle ORM schema)
│   ├── AiModel.jsx             # Gemini AI configurations & prompt formatting templates
│   ├── service.jsx             # YouTube Search API integration handler
│   ├── dbNormalize.js          # Helper utilities to format and normalize JSON results from AI
│   └── subscription.js         # Backend check helper for subscription verification
├── public/                     # Icons, vectors, illustrations, and logos
├── drizzle.config.js           # Drizzle migration and database push options
├── middleware.js               # Route protection middleware powered by Clerk
├── package.json                # Project dependencies and script runner configurations
└── check_db.js                 # Utility script to inspect database entries
```

---

## 🗄️ Database Schema (`configs/schema.jsx`)

The database consists of three PostgreSQL tables orchestrated via Drizzle ORM:

### 1. `CourseList` (Main Course Metadata)
| Column | Type | Description |
|---|---|---|
| `id` | Serial (PK) | Primary auto-incrementing key |
| `courseId` | Varchar | Unique course UUID |
| `name` | Varchar | Course name/topic |
| `category` | Varchar | Category (Programming, Health, etc.) |
| `level` | Varchar | Difficulty (Beginner, Intermediate, Advanced) |
| `includeVideo`| Varchar | Toggle to include video |
| `courseOutput`| JSON | Structured syllabus layout |
| `createdBy` | Varchar | Creator's email address |
| `userName` | Varchar | Creator's display name |
| `userProfileImage`| Varchar | Creator's Clerk avatar |
| `language` | Varchar | Target language for the course |

### 2. `Chapters` (Detailed Sub-chapter Lessons)
| Column | Type | Description |
|---|---|---|
| `id` | Serial (PK) | Primary auto-incrementing key |
| `courseId` | Varchar | Associated course UUID |
| `chapterId` | Integer | Chapter index (0-indexed integer) |
| `content` | JSON | AI-generated sub-chapters text & code blocks |
| `videoId` | Varchar | Sourced YouTube video key |

### 3. `Subscriptions` (P2P Transactions Review)
| Column | Type | Description |
|---|---|---|
| `id` | Serial (PK) | Primary auto-incrementing key |
| `email` | Varchar | Submitting user's email address |
| `utr` | Varchar | Unique 12-digit transaction reference number |
| `amount` | Varchar | Amount transferred |
| `plan` | Varchar | Selected membership plan tier |
| `status` | Varchar | Review status (`pending`, `approved`, `rejected`) |
| `createdAt` | Varchar | Timestamp |

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and add the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database Connection (Neon Serverless PostgreSQL)
NEXT_PUBLIC_DB_CONNECTION_STRING=postgresql://<user>:<password>@<neon-host>/ai-course-generator?sslmode=require

# Google Gemini AI Key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Google YouTube v3 Data API Key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

# Payment Gateways (Optional Sandbox keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Manual UPI Configuration
NEXT_PUBLIC_UPI_ID=payee@upi             # Your UPI ID for QR Code scanner
NEXT_PUBLIC_UPI_PAYEE_NAME=Payee Name     # Account name
NEXT_PUBLIC_UPI_PHONE=+919876543210       # UPI phone contact
NEXT_PUBLIC_HOST_NAME=http://localhost:3000
```

---

## 🛠️ Getting Started & Installation

Follow these steps to run the application locally:

### 1. Clone the repository
```bash
git clone https://github.com/Sithik19/ai-course-generator.git
cd ai-course-generator
```

### 2. Install dependencies
```bash
npm install
```

### 3. Push Database Schema to Neon DB
Synchronize the PostgreSQL schemas via Drizzle-Kit:
```bash
npm run db:push
```

### 4. Start Drizzle Studio (Optional)
To visualize and edit database records directly:
```bash
npm run db:studio
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 🏁 Conclusion

The **AI Course Generator** demonstrates how combining generative artificial intelligence with automated video search indexes can build highly flexible, personalized learning tools. By solving curriculum rigidity, high creation costs, language barriers, and billing overhead, the platform offers a secure, scalable, and responsive solution that improves the quality of online learning.

---

## 👨‍💻 Author

**Sithik Ranjan V R**
* B.Tech – Artificial Intelligence and Data Science
* Passionate about AI, Full-Stack Development, Generative AI Applications, and Educational Technology.

---

## 📜 License

This project is intended for educational, research, and portfolio purposes.

© 2026 AI Course Generator. All Rights Reserved.
```
