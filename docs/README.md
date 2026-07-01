# CAHCET - Full-Stack Enterprise Architecture

![CAHCET Overview](placeholder.png)

## 📌 Project Overview
CAHCET is an enterprise-grade full-stack web application for C. Abdul Hakeem College of Engineering and Technology. It serves as both a high-performance public-facing website and a secure, powerful internal Content Management System (CMS) for college administrators.

## 🎯 Objectives
- Provide blazing-fast page loads and zero-reload navigation via React SPA architecture.
- Empower non-technical staff to manage content through a Draft → Review → Publish workflow.
- Ensure strict security, RBAC (Role-Based Access Control), and API integrity.
- Deliver an aesthetically premium, highly responsive user interface.

## ✨ Complete Feature Overview
### 🌍 Public Website Features
- **Dynamic Routing:** True SPA navigation with React Router.
- **Lazy Loaded Modules:** Route-based code splitting for instant initial loads.
- **Mega Menu Navigation:** Advanced multi-column sticky navigation.
- **Department Portals:** Dedicated sub-sites for every engineering branch.
- **Interactive UI:** Framer Motion animations and glassmorphism design.

### 🛡️ Admin Portal & Enterprise CMS
- **Live Preview Engine:** See changes in real-time before publishing.
- **Draft/Review/Publish:** Secure content lifecycle management.
- **Modular Editors:** Over 30 specific CMS editor modules covering all college departments.
- **Activity Logging & Revisions:** Track who changed what and when.

### 🤖 AI & Automations
- **AI Counselor:** Intelligent chatbot for student admission inquiries.
- **Admissions Dashboard:** Application tracking and lead management.

## ⚙️ Tech Stack
- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion, React Router DOM.
- **Backend:** Node.js, Express.js, Prisma ORM.
- **Database:** PostgreSQL.
- **Authentication:** JWT, bcrypt.

## 🚀 Installation & Running Locally
```bash
# 1. Clone the repository
# 2. Setup Database
cd backend
npm install
npx prisma db push
npx prisma db seed

# 3. Start Backend
npm run dev

# 4. Start Frontend
cd ../frontend
npm install
npm run dev
```

## 🔐 Environment Variables
**Backend (`backend/.env`):**
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (For admin authentication)
- `PORT` (e.g., 5000)

**Frontend (`frontend/.env`):**
- `VITE_API_URL` (e.g., http://localhost:5000/api)

## ☁️ Deployment
- **Frontend:** Render Static Site (Build command: `npm run build`)
- **Backend:** Render Web Service (Build command: `npm install && npx prisma generate`)
- **Database:** Render Managed PostgreSQL.
