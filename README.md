<div align="center">
  <img src="public/logo.png" alt="VTOP 2.0 Logo" width="180" />
  
  # ⚡ VTOP 2.0
  
  **The Next-Generation University Management Portal**
  
  <p align="center">
    <a href="https://nextjs.org"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" /></a>
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-19-00D8FF?style=for-the-badge&logo=react" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.9-007ACC?style=for-the-badge&logo=typescript" /></a>
    <a href="https://www.prisma.io"><img src="https://img.shields.io/badge/Prisma-5.15-2D3748?style=for-the-badge&logo=prisma" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css" /></a>
  </p>
  
  *Abandoning legacy clutter for Obsidian Glass elegance, speed, and usability.*
</div>

---

## 🎯 The Vision

University portals are historically clunky, slow, and confusing. **VTOP 2.0** completely reimagines the academic digital experience. It is not just an upgrade; it is a ground-up rewrite designed to be:

- **Unified**: One ecosystem for Students, Faculty, Parents, and Admins.
- **Beautiful**: A cohesive "Obsidian Glass" design language that makes academic monitoring a visual treat.
- **Fast**: Built on the bleeding edge of web technology for instant interactions.
- **Secure**: Role-Based Access Control (RBAC) ensuring data integrity and privacy.

---

## 🎭 The Four Pillars (Portals)

### 🎓 Student Nexus (`/student`)

The complete digital life of a student, unified.

- **Dashboard**: Real-time overview of classes, attendance, and GPA.
- **Time Table**: Dynamic schedule with venue and faculty details.
- **Attendance**: Detailed log tracking with percentage calculators.
- **Marks Hub**: Comprehensive assessment history (CAT, FAT, Assignments).
- **Course Plan**: Curriculum tracking and credit management.
- **V-Topia**: Campus communication and digital community hub.

### 👨‍🏫 Faculty Cabin (`/faculty`)

Tools that empower educators, not hinder them.

- **Academic Hub**: Overview of appointed courses and daily schedule.
- **Duty Chart**: Exam proctoring and administrative duty tracking.
- **Roll Call**: Fast, mobile-friendly attendance marking system.
- **Grade Center**: Streamlined marks entry and submission interface.
- **Log Registry**: Historical record of student interactions and leave management.

### � Parent Guardian (`/parent`)

Transparency and peace of mind for guardians.

- **Ward Status**: Real-time academic performance monitoring.
- **Ward Attendance**: Daily attendance updates and alerts.
- **Academic Report**: Detailed breakdown of grades and progress.
- **Fee Portal**: Payment history and outstanding due tracking.
- **Direct Connect**: Communication channel with faculty proctors.

### 🛡️ Admin Oracle (`/admin`)

God-mode control for university management.

- **Control Center**: System-wide health matrix and vital statistics.
- **Identity Hub**: User provisioning (Student, Faculty, Parent) and credential management.
- **Master Registry**: Global database explorer and editor.
- **Attendance Control**: Override and audit student attendance records.
- **Course Manager**: Curriculum design, course creation, and faculty allocation.
- **Financial Hub**: Global fee and payment tracking.

---

## 🎨 The Aesthetic: Obsidian Glass

VTOP 2.0 introduces a custom design system focused on depth, clarity, and motion.

- **Glassmorphism**: Layered translucency for hierarchical depth.
- **Ambient Lighting**: Dynamic gradients that breathe with the interface.
- **Motion Design**: Physics-based transitions using Framer Motion.
- **Responsive**: A mathematically consistent grid ensuring pixel perfection from 4k monitors to smartphones.

---

## 🚀 Technology Stack

Built on a modern, type-safe architecture designed for scale.

| Layer        | Technology                                        | Description                                   |
| ------------ | ------------------------------------------------- | --------------------------------------------- |
| **Core**     | [Next.js 16](https://nextjs.org/)                 | App Router, Server Components, Server Actions |
| **Logic**    | [React 19](https://react.dev/)                    | Concurrent features, Hooks                    |
| **Language** | [TypeScript 5.9](https://www.typescriptlang.org/) | Strict type safety across the entire stack    |
| **Database** | [PostgreSQL](https://www.postgresql.org/)         | Relational data integrity                     |
| **ORM**      | [Prisma](https://www.prisma.io/)                  | Type-safe database queries and migrations     |
| **Auth**     | [NextAuth.js](https://next-auth.js.org/)          | Secure, session-based authentication          |
| **Styling**  | [Tailwind CSS](https://tailwindcss.com/)          | Utility-first styling engine                  |
| **UI Lib**   | [Radix UI](https://www.radix-ui.com/)             | Accessible, unstyled component primitives     |
| **Motion**   | [Framer Motion](https://www.framer.com/motion/)   | Production-ready animation library            |

---

## ⚡ Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- PostgreSQL Database URL

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ArshVermaGit/Vtop2.0.git
   cd Vtop2.0
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env` file in the root directory:

   ```env
   # Database Connection
   DATABASE_URL="postgresql://user:password@localhost:5432/vtop2?schema=public"

   # Authentication
   NEXTAUTH_SECRET="your-super-secret-key-at-least-32-chars"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize Database**

   ```bash
   npx prisma generate
   npx prisma db push

   # Seed with initial admin/test data
   npm run seed
   ```

5. **Launch Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to access the portal.

---

## 📁 Project Structure

```bash
src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Authentication routes (Login)
│   ├── (dashboard)/      # Protected dashboard routes
│   │   ├── admin/        # Admin portal pages
│   │   ├── faculty/      # Faculty portal pages
│   │   ├── parent/       # Parent portal pages
│   │   ├── student/      # Student portal pages
│   │   └── settings/     # Global user settings
│   └── api/              # Server-side API endpoints
├── components/           # React Components
│   ├── admin/            # Admin-specific widgets
│   ├── faculty/          # Faculty-specific widgets
│   ├── parent/           # Parent-specific widgets
│   ├── student/          # Student-specific widgets
│   ├── ui/               # Reusable UI primitives (Buttons, Cards, etc.)
│   ├── Sidebar.tsx       # Dynamic role-based navigation
│   └── LoginBox.tsx      # Auth entry point
├── lib/                  # Utilities
│   ├── actions.ts        # Server Actions (Data mutations)
│   ├── admin-actions.ts  # Admin-specific server actions
│   ├── prisma.ts         # DB client singleton
│   └── utils.ts          # Helper functions
├── types/                # TypeScript definitions
└── prisma/               # Database Schema & Seeds
```

---

## 🤝 Contributing

We welcome contributions to make VTOP 2.0 even better.

1. **Fork** the repository.
2. Create a **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 👨‍💻 Creator

**Arsh Verma**  
_Full Stack Architect • UI/UX Perfectionist_

Built with passion and too much coffee.  
[GitHub](https://github.com/ArshVermaGit) • [LinkedIn](https://linkedin.com/in/arshverma)

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

<div align="center">
  <br />
  <strong>Built for the future of education.</strong>
</div>
