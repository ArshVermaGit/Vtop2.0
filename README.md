<div align="center">
  <img src="public/logo.png" alt="VTOP 2.0" width="180" />
  
  # ⚡ VTOP 2.0
  
  **The University Portal That Doesn't Make You Cry**
  
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19-00D8FF?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" />
  <img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma" />
  
  *From cluttered 90s nightmare → Obsidian Glass elegance*
</div>

---

## 🎯 The Problem

Legacy university portals feel like archaeological artifacts. Finding your exam schedule shouldn't require a treasure map.

**VTOP 2.0** is the complete rewrite nobody asked for, but everyone desperately needed.

---

## ✨ What's Different?

<table>
<tr>
<td>❌ <strong>Before</strong></td>
<td>✅ <strong>After</strong></td>
</tr>
<tr>
<td>

```
Confusing navigation
Scattered information
1999 design language
Mobile? Never heard of it
```

</td>
<td>

```
Intuitive role-based dashboards
Everything unified
Obsidian Glass aesthetic
Mobile-first, buttery smooth
```

</td>
</tr>
</table>

---

## 🎭 Four Portals, One Ecosystem

### 🎓 Student Nexus
Your academic command center. Timetables, attendance, grades, research tracking, hostel management, and digital hall tickets—all in one place.

### 👨‍🏫 Faculty Cabin
Teaching made simple. Schedule management, one-tap attendance, grade uploads, and mentorship tools that actually work.

### 🛡️ Admin Oracle
God mode for administrators. System health monitoring, user management, analytics, and university-wide control.

### 👪 Parent Guardian
Peace of mind portal. Real-time ward monitoring, direct communication with proctors, and complete financial transparency.

---

## 🎨 The Aesthetic

**Obsidian Glass Design Language**

- 🌌 Frosted glass panels with backdrop blur
- ⚡ Fluid physics-based animations
- 🎯 Ambient mesh gradients that breathe
- 📱 Pixel-perfect on every screen size
- ♿ WCAG 2.1 AA accessible

---

## 🚀 Tech Stack

Built on bleeding-edge technology that actually scales:

```
Next.js 16 (App Router) → React 19 → TypeScript 5.9
                    ↓
              Prisma ORM
                    ↓
             PostgreSQL
                    ↓
        NextAuth.js + Tailwind CSS + Framer Motion
```

**Why?** Server Components for speed, type-safety for sanity, Prisma for elegant database queries, and Framer Motion for animations that don't tank performance.

---

## ⚡ Quick Start

```bash
# Clone
git clone https://github.com/ArshVermaGit/Vtop2.0.git
cd Vtop2.0

# Install
npm install

# Configure
cp .env.example .env
# Add your DATABASE_URL and NEXTAUTH_SECRET

# Database
npx prisma generate
npx prisma db push
npm run seed  # Optional: sample data

# Launch
npm run dev
```

Visit `http://localhost:3000` → Witness the magic ✨

---

## 📁 Structure

```
src/
├── app/
│   ├── (auth)/          # Login & registration
│   ├── (dashboard)/     # Student, Faculty, Admin, Parent portals
│   └── api/             # Server endpoints
├── components/
│   ├── ui/              # 30+ custom Obsidian components
│   └── widgets/         # Role-specific dashboard widgets
├── lib/
│   ├── actions.ts       # 100+ server actions
│   ├── auth.ts          # NextAuth config
│   └── prisma.ts        # Database client
└── prisma/
    └── schema.prisma    # 40+ models
```

---

## 🎯 Core Features

**🔐 Auth & Access** — Multi-role JWT system, RBAC, secure sessions  
**📊 Student Hub** — Attendance, grades, courses, research tracking  
**👨‍🏫 Faculty Tools** — Teaching schedules, grade management, proctee monitoring  
**🏫 Admin Control** — User management, system health, analytics  
**💰 Finance** — Fee tracking, payment history, receipt generation  
**🏠 Hostel** — Room allocation, mess menus, maintenance tickets  
**📚 Library** — Book management, due tracking, fine calculation  

---

## 🌟 Performance

```
Lighthouse Score: 98/100 ⚡
First Paint: <100ms
Time to Interactive: <1s
```

No compromises. Just speed.

---

## 🛣️ Roadmap

- [ ] 🤖 AI-powered course recommendations
- [ ] 📱 Native mobile apps
- [ ] 🌐 Multi-language support
- [ ] 🎓 Alumni portal
- [ ] 📊 Predictive analytics

---

## 🤝 Contributing

Found a bug? Want to add a feature? PRs welcome!

1. Fork it
2. Create your feature branch (`git checkout -b feature/CoolFeature`)
3. Commit changes (`git commit -m 'Add CoolFeature'`)
4. Push to branch (`git push origin feature/CoolFeature`)
5. Open a Pull Request

---

## 👨‍💻 Creator

**Arsh Verma**  
*Full Stack Architect | UI/UX Perfectionist*

Built with ❤️, TypeScript, and way too much coffee.

[GitHub](https://github.com/ArshVermaGit) • [LinkedIn](https://linkedin.com/in/arshverma) • [Portfolio](https://arshverma.dev)

---

## 📜 License

MIT — Use it, modify it, share it. Just don't sue me 😉

---

<div align="center">
  
  **⭐ Star this repo if it saved your sanity!**
  
  *© 2026 VTOP 2.0 — Engineering Better Campuses*
  
</div>
