# G-One Media — Digital Ecosystems Engineered for Growth

G-One Media bridges the gap between sophisticated engineering and compelling visual narratives. We build high-performance digital ecosystems designed to capture attention, command authority, and accelerate business growth.

![G-One Media Preview](public/G-OneMedia.png)

---

## 🚀 Key Features & Capabilities

### 🌐 High-Performance Public Web Experience
- **Interactive Tech Aesthetics**: Fluid animations via Framer Motion, glassmorphic UI, responsive layouts, and curated dark themes.
- **Dynamic Two-Way Data Sync**: Live sync with Supabase PostgreSQL for Hero Copy, Pricing Packages, Individual Deliverables, Founders & Team Roster, and Client Reviews.
- **Interactive Discovery & Lead Funnel**: Built-in 1:1 Discovery Call scheduler, AI Consultation Chat Widget, Audit Wizard, and Resource Vault.
- **Dynamic Team Showcase**: Roster profiles (`/about/:slug`) with next/previous team member navigators and custom leadership highlight cards.

### 🛡️ Admin Portal & Role-Based Access Control (RBAC)
- **Direct `/admin` Auto-Routing**: Instant session check with automatic redirection to `/admin/dashboard` for logged-in administrators.
- **Granular Permission Settings (`admin_users`)**:
  - 🎯 **Hero Copy & Headlines** (`manage_hero`)
  - 💳 **Pricing Packages & Multi-Currency** (`manage_pricing`)
  - ⚙️ **Services & Deliverables** (`manage_services`)
  - 👥 **Founders & Team Management** (`manage_team`)
  - 🎨 **Portfolio & Case Studies** (`manage_portfolio`)
  - ⭐ **Client Reviews & Moderation** (`manage_reviews`)
  - 📥 **Inquiries & Discovery Calls Hub** (`manage_leads`)
  - 🛡️ **Administrators & Access Control** (`manage_admins`)
- **Role Presets**: Super Admin, Administrator, Content Editor, Support & Inquiries, and Custom Roles.
- **Automated Database Migrations**: One-command SQL schema migration and initial data seeding directly into Supabase PostgreSQL (`scripts/migrate_and_seed.js`).

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **Styling & Theme** | Tailwind CSS + Custom Design Tokens (`#06b6d4`, `#3b82f6`, `#8b5cf6`) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **SEO & Social Meta** | [React Helmet Async](https://github.com/staylor/react-helmet-async) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL with Row-Level Security) |
| **Backend API** | Node.js + Express + Helmet + CORS |

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **npm**: v9.0 or higher
- **Supabase Project**: (Free or Pro tier)

### 2. Installation
```bash
git clone https://github.com/Ani0811/G-OneMedia.git
cd G-OneMedia
npm install
```

### 3. Environment Variables
Create a `.env` file in the project root:

```env
# Frontend Supabase Credentials
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Direct Database Connection (for migrations and seeding)
SUPABASE_CONNECTION_URL=postgresql://postgres.your-ref:your-password@aws-0-region.pooler.supabase.com:6543/postgres

# Backend API Configuration (Optional / Express Server)
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173,https://ani0811.github.io
```

### 4. Database Setup & Migration
Apply database tables, RLS security policies, and seed default content:

```bash
# Run migration against Supabase PostgreSQL
node scripts/migrate_and_seed.js
```

### 5. Provision Admin Account
Create or confirm an administrative account:

```bash
# Interactive or direct CLI admin provisioning
npm run create-admin "anirudha.basuthakur@gmail.com" "your-secure-password"
```

### 6. Run Locally
```bash
# Start Vite Development Server
npm run dev

# (Optional) Start Express API Server
npm run server
```

Open [http://localhost:5173](http://localhost:5173) in your browser.
Visit [http://localhost:5173/admin](http://localhost:5173/admin) to log into the Admin Console.

---

## 📦 Build & Deployment

```bash
# Build production bundle with optimized chunking
npm run build

# Preview production build locally
npm run preview
```

---

## 📁 Project Structure

```
G-OneMedia/
├── database/
│   ├── schema.sql              # Unified database schema with RLS & RBAC
│   └── README.md               # Supabase database documentation
├── scripts/
│   ├── migrate_and_seed.js     # Direct PostgreSQL migration script
│   └── create_admin.js         # Secure CLI admin user creation tool
├── server/
│   └── routes/                 # Express backend API endpoints
├── src/
│   ├── components/
│   │   ├── common/             # Navbar, Footer, ProtectedRoute, Loaders
│   │   ├── features/           # AIChatWidget, Portfolio, Discovery, Calculator
│   │   ├── pages/              # FounderProfile, GetStarted, Reviews, Vault
│   │   │   └── admin/          # Overview, Team, Pricing, Services, RBAC Manager
│   │   └── sections/           # Hero, VisualProof, Process, Pricing, About, CTA
│   ├── context/
│   │   ├── AdminAuthContext.jsx # RBAC authentication & permissions state
│   │   └── ThemeContext.jsx    # Application theme provider
│   ├── lib/
│   │   └── supabaseClient.js   # Supabase client singleton
│   ├── App.jsx                 # Dynamic routing & layout isolation
│   └── main.jsx                # Application entry point
└── package.json
```

---

## 🛡️ License & Credits

Designed and engineered with precision by **G-One Media**.  
All rights reserved © 2026.
