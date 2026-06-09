# 🎓 AI Course Generator

An intelligent SaaS-based learning platform that automatically generates complete, custom educational courses using Generative AI. Designed as a college final-year capstone project, this platform creates structured curricula, detailed chapter content, programming examples, and curated video resources, enabling users to learn any topic through a personalized learning experience.

## 🌐 Live Demo

**Deployment:** [https://ai-course-generator-seven-phi.vercel.app](https://ai-course-generator-seven-phi.vercel.app)

---

# 📖 Overview

AI Course Generator is a full-stack AI-powered learning platform that allows users to generate complete, personalized courses in seconds. 

The platform combines the power of **Google Gemini AI**, **YouTube Data API**, **Next.js 16**, **Neon PostgreSQL**, and **Clerk Authentication** to provide an end-to-end automated learning solution.

---

## 📝 Problem Statement

Traditional online education systems (Massive Open Online Courses - MOOCs) suffer from several systemic limitations:
1.  **Rigid Curriculum**: Existing platforms offer static, pre-recorded course outlines that fail to adjust to an individual student’s unique knowledge level or learning speed.
2.  **High Creation Overhead**: Designing complete course syllabi, compiling detailed topic lecture summaries, and sourcing relevant visual guides manually requires significant subject-matter expert hours.
3.  **Monolingual Bias**: High-quality educational content is predominantly authored in English, creating accessibility barriers for regional-language learners.
4.  **Inefficient Resource Synthesis**: Students often waste hours switching between search engines, textual blogs, and YouTube video lists to study a single topic in detail.
5.  **Payment Processing Barriers**: Small-scale educational creators face steep subscription fee cuts from payment gateways. They lack simple, self-governed manual bank verification systems (like direct UPI/UTR validation) that allow low-overhead transaction checking.

---

## 💡 Proposed System

The proposed **AI Course Generator** resolves these bottlenecks by introducing an on-demand, interactive learning ecosystem. 

*   **Dynamic Syllabus Construction**: Users specify a subject category, a refined topic focus, difficulty level (Beginner/Intermediate/Advanced), target duration, and preferred language. The system then invokes the Gemini AI model to design a comprehensive modular course layout in real-time.
*   **Automated Multi-Modal Compilation**: Instead of static files, the app starts parallel workers to compile chapter summaries, markdown textual assets, and code samples, alongside real-time video lectures fetched from the Google YouTube Search API.
*   **Self-Custodial payment clearance**: A hybrid billing dashboard implements automated card gateways alongside a manual UPI transaction reference (UTR) verification pipeline.
*   **Admin Audit Console**: Includes a secure administration review page allowing platform controllers to clear pending UPI transaction reference codes and instantly toggle premium access permissions on Clerk user accounts.

---

## 📐 System Architecture

The following diagram illustrates the flow of data across the client interface, authentication boundaries, AI generation engines, external APIs, and the serverless relational database:

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
        Gemini[Google Gemini API / gemini-flash-lite]
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

## ⚙️ Modules

The system is decomposed into six cohesive core modules:

1.  **User Input & Form Orchestrator**: A three-step user wizard (`SelectCategory`, `TopicDescription`, `SelectOption`) that collects course parameters and performs input validation.
2.  **AI Syllabus Synthesis Engine**: Calls the Gemini API to retrieve structured JSON templates representing the course syllabus layout. It features a rate-limit/retry strategy (`sendMessageWithRetry`) to handle transient endpoint overloads.
3.  **Multimodal Media Sync Engine**: Interacts with the YouTube v3 API via Axios. It searches for relevant instructional videos based on the course name and chapter title, selecting embeddable, medium-duration educational videos.
4.  **Security & Identity Boundary (Clerk)**: Secures routes via JWT middleware verification. It segments user dashboards and stores subscription access metadata (`isMember`) inside Clerk's user metadata properties.
5.  **Multi-Channel Payment Gateway**: Manages credit card simulators (via Stripe UI), online checkout APIs (via Razorpay SDK), and manual peer-to-peer UPI transfers via dynamic QR-code rendering.
6.  **Administrative Approval Module**: An admin-only interface designed to match submitted UPI UTR numbers with bank receipts. It updates database states and flags Clerk metadata profiles.

---

## 🌟 Advantages

*   **Tailored Microlearning**: Students get curriculum content customized to their specific topic choices and background knowledge.
*   **Low Operational Costs**: Sourcing course content dynamically on demand removes the cost of hosting thousands of hours of video files.
*   **Zero-Overhead Payments**: Enables manual UPI transaction approvals, meaning creators can process payments without paying gateway commissions.
*   **Improved Accessibility**: Support for localized course generation helps non-English-speaking students learn technical subjects.

---

## 🚀 Key Features

*   **✨ AI Course Outline generation**: Utilizes Gemini AI (`gemini-flash-lite-latest`) to output structured JSON course outlines containing descriptions, levels, estimated chapter durations, and detailed modules.
*   **📖 Detailed Chapter Content**: Generates full lesson plans per chapter with detailed explanations, markdown-rendered headings, and syntax-highlighted code block examples formatted as `<precode>`.
*   **📺 Educational Video Sync**: Automatically queries and fetches the most relevant and embeddable YouTube video for each chapter using the Google YouTube Data API v3.
*   **🌐 Multi-Lingual Generation**: Create courses in English, Hindi, French, Spanish, or any preferred language chosen during setup.
*   **🔒 Secure User Auth & Protected Routes**: Fully integrated with Clerk authentication and routing middleware for securing personal dashboards and courses.
*   **💳 Subscription & Premium Tier**:
    *   *Free Tier*: Limit of up to 5 created courses.
    *   *Premium Tier*: Unlimited course generation, stateless rendering, and advanced topic configurations.
    *   *Flexible Payments*: Multi-method billing dialog supporting India-focused **Razorpay Gateway**, simulated **Stripe Checkout**, and **Manual UPI Transfer** (with QR-code scanning).
*   **🛡️ Administrative Approval Dashboard**: Secure panel restricted to specific admin emails to verify manual UPI payment submissions by UTR (Unique Transaction Reference) codes, allowing instant approval or rejection of premium access.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 16 (React 19, App Router)
*   **Styling**: Tailwind CSS v4, Lucide React, React Icons, Radix UI Primitives (Shadcn UI templates)
*   **Database**: Serverless PostgreSQL hosted on [Neon](https://neon.tech/)
*   **ORM**: [Drizzle ORM](https://orm.drizzle.team/) & Drizzle Kit for schema migrations
*   **Authentication**: [Clerk Next.js SDK](https://clerk.com/)
*   **AI SDK**: Google Gemini 2.5 Flash (`@google/generative-ai`)
*   **Media APIs**: Google YouTube Data API v3 & Cloudinary for custom asset management
*   **Markdown Rendering**: `react-markdown`

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
└── check_db.js                 # Utility script to inspect courses & chapters table entries
```

---

## 🗄️ Database Schema (`configs/schema.jsx`)

The PostgreSQL database is organized into three tables defined via Drizzle:

### 1. CourseList
Stores generated course metadata and curriculum structure.

| Column | Type |
|----------|---------|
| id | Serial (PK) |
| courseId | Varchar |
| name | Varchar |
| category | Varchar |
| level | Varchar |
| includeVideo | Varchar |
| courseOutput | JSON |
| createdBy | Varchar |
| username | Varchar |
| userProfileImage | Varchar |
| language | Varchar |

### 2. Chapters
Stores detailed AI-generated chapter content and associated YouTube videos.

| Column | Type |
|----------|---------|
| id | Serial (PK) |
| courseId | Varchar |
| chapterId | Integer |
| content | JSON |
| videoId | Varchar |

### 3. Subscriptions
Stores subscription requests and payment verification details.

| Column | Type |
|----------|---------|
| id | Serial (PK) |
| email | Varchar |
| utr | Varchar |
| amount | Varchar |
| plan | Varchar |
| status | Varchar |
| createdAt | Varchar |

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory and add the following keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Database Connection (Neon Serverless URL)
NEXT_PUBLIC_DB_CONNECTION_STRING=postgresql://<user>:<password>@<neon-host>/ai-course-generator?sslmode=require

# Google Gemini AI Key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Google YouTube v3 Data API Key
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key

# Payment Gateways (Optional / Dev Sandbox keys)
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
git clone https://github.com/your-username/ai-course-generator.git
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

## 🛡️ Administrative Approvals Workflow

For manual UPI transfers, users submit their 12-digit transaction **UTR Number** via the checkout dialog. 

1.  A pending subscription record is saved to the database.
2.  Any user logged in with a designated admin email (configured in `ADMIN_EMAILS` inside `SideBar.jsx` and `admin/page.jsx`) will see the **Admin Panel** option in their sidebar.
3.  The admin matches the submitted UTR number with their bank account statement.
4.  Clicking **Approve** updates the record's status to `approved`, immediately enabling Premium access for that user. Clicking **Reject** marks the entry as `rejected`.

---

## 🔮 Future Scope

*   **Generative Knowledge Assessments**: Incorporating dynamic multiple-choice quizzes and programming tasks at the end of each chapter, graded in real-time by AI.
*   **Collaborative Classroom Portals**: Letting students share courses, start study groups, and leave comments on individual chapters.
*   **Blockchain-Verified Certificates**: Issuing decentralized, tamper-proof PDF completion credentials registered on smart contracts.
*   **Offline Document Export**: Supporting PDF, EPUB, and JSON conversions of generated courses for offline access.
*   **AI Mentor Chatbot**: Personalized chatbot interface to answer questions on course content.

---

## 📸 Screenshots

Add screenshots of:
- Home Page
- Dashboard
- Course Creation Wizard
- Generated Curriculum
- Course Viewer
- Upgrade Page
- Admin Panel

---

## 🏁 Conclusion

The **AI Course Generator** demonstrates how combining generative artificial intelligence with automated video search indexes can build highly flexible, personalized learning tools. By solving curriculum rigidity, high creation costs, language barriers, and billing overhead, the platform offers a secure, scalable, and responsive solution that improves the quality of online learning.

---

## 👨‍💻 Author

**Sithik Ranjan V R**
*   B.Tech – Artificial Intelligence and Data Science
*   Passionate about AI, Full-Stack Development, Generative AI Applications, and Educational Technology.

---

## 📜 License

This project is intended for educational, research, and portfolio purposes.

© 2026 AI Course Generator. All Rights Reserved.
