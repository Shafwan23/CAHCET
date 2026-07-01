# CAHCET Project Technology Stack & Architecture Documentation

## Project Overview
* **What the project is:** A comprehensive institutional platform for CAHCET encompassing an informational website, a content management system (CMS), an administrative portal, and a dedicated admissions portal for prospective students.
* **Purpose of the platform:** To provide a seamless digital experience for students, faculty, and administrators. It streamlines content updates, handles student admissions securely, manages departmental data, and offers robust role-based access control for administrative tasks.
* **Major modules:** 
  - Public-facing Frontend Website
  - Admissions Portal (Applicant registration, application tracking)
  - Admin Portal (Dashboard, User Management, Department Management)
  - Content Management System (Pages, Sections, Version History)
  - Secure RESTful Backend API
  - PostgreSQL Database Layer

---

## Frontend Technology Stack

* **React**
  - **Version:** ^18.2.0
  - **Why it was selected:** Industry standard for building dynamic, interactive user interfaces with reusable components.
  - **What problem it solves:** Manages complex view states and allows efficient DOM updates using the virtual DOM.
  - **Where it is used:** Core framework for the entire frontend (public site, admissions, and admin portal).

* **Vite**
  - **Version:** ^4.4.5
  - **Why it was selected:** Ultra-fast development server and optimized build tool.
  - **What problem it solves:** Solves the slow compilation times of traditional bundlers like Webpack.
  - **Where it is used:** Build tooling and local development environment.

* **React Router DOM**
  - **Version:** ^7.15.1
  - **Why it was selected:** Standard routing library for React applications.
  - **What problem it solves:** Enables client-side routing for a Single Page Application (SPA) experience without page reloads.
  - **Where it is used:** Application-wide routing and navigation.

* **Framer Motion**
  - **Version:** ^11.11.1
  - **Why it was selected:** Powerful and declarative animation library for React.
  - **What problem it solves:** Simplifies complex UI animations and transitions.
  - **Where it is used:** Page transitions, micro-interactions, and complex UI animations across the platform.

* **Tailwind CSS**
  - **Version:** ^3.4.17
  - **Why it was selected:** Utility-first CSS framework for rapid UI development.
  - **What problem it solves:** Eliminates the need to write custom CSS files, ensuring consistent styling and smaller CSS bundles.
  - **Where it is used:** Styling across all frontend components.

* **Lucide React**
  - **Version:** ^0.428.0
  - **Why it was selected:** Clean, modern, and highly customizable icon set.
  - **What problem it solves:** Provides scalable SVG icons that easily integrate with Tailwind CSS.
  - **Where it is used:** UI icons throughout the application.

* **Axios**
  - **Version:** ^1.17.0
  - **Why it was selected:** Promise-based HTTP client for the browser.
  - **What problem it solves:** Simplifies making API requests, handling interceptors, and parsing JSON data compared to the native fetch API.
  - **Where it is used:** All API calls connecting the frontend to the backend services.

* **Swiper**
  - **Version:** ^12.1.4
  - **Why it was selected:** Modern touch slider with hardware-accelerated transitions.
  - **What problem it solves:** Provides a responsive and touch-friendly carousel for images and content.
  - **Where it is used:** Image galleries, testimonials, and banners on the public site.

* **React Helmet Async**
  - **Version:** ^3.0.0
  - **Why it was selected:** Asynchronous document head manager for React.
  - **What problem it solves:** Manages SEO meta tags, titles, and head elements dynamically per page.
  - **Where it is used:** SEO optimization for public-facing pages.

---

## Backend Technology Stack

* **Node.js & Express.js**
  - **Purpose:** Core runtime environment and web application framework. Express provides a minimalist and flexible routing and middleware system.
  - **Where used:** The entire backend API infrastructure.

* **Prisma (ORM)**
  - **Purpose:** Next-generation Node.js and TypeScript ORM for interacting with the database.
  - **Where used:** Database schema definition, migrations, and all database queries.

* **JSON Web Token (jsonwebtoken)**
  - **Purpose:** Stateless authentication mechanism.
  - **Where used:** Generating access tokens upon login and verifying them in protected API routes via middleware.

* **bcrypt**
  - **Purpose:** Cryptographic hash function for password hashing.
  - **Where used:** Hashing user and applicant passwords before storing them in the database, and verifying passwords during login.

* **Helmet**
  - **Purpose:** Security middleware to set various HTTP headers.
  - **Where used:** Global middleware in Express to protect against common web vulnerabilities (XSS, clickjacking).

* **CORS**
  - **Purpose:** Cross-Origin Resource Sharing middleware.
  - **Where used:** Global middleware to allow the frontend application to securely communicate with the backend API.

* **Nodemailer**
  - **Purpose:** Module for sending emails from Node.js.
  - **Where used:** Sending transactional emails (e.g., OTPs, application status updates, password resets).

* **Zod**
  - **Purpose:** TypeScript-first schema declaration and validation library.
  - **Where used:** Validating incoming request payloads (body, query, params) ensuring data integrity before processing.

---

## Database Layer

* **PostgreSQL:** A powerful, open-source object-relational database system known for reliability, feature robustness, and performance. Used as the primary data store for the entire platform.
* **Prisma ORM:** Acts as the bridge between the Node.js backend and the PostgreSQL database. It provides type-safe queries and manages database migrations via a declarative `schema.prisma` file.
* **Database Structure & Relationships:**
  - **Users & Departments:** `User` models belong to `Department` models (One-to-Many). Users have a specific `Role` enum (e.g., SUPER_ADMIN, DEPARTMENT_ADMIN).
  - **CMS Architecture:** `ContentPage` contains multiple `ContentSection` records (One-to-Many). Sections are version-controlled via `ContentVersion` for tracking history and rollbacks.
  - **Admissions:** `Applicant` models have multiple `Application` records (One-to-Many). Applications store dynamic structured data via `Json` fields (`personalDetails`, `academicInfo`).
  - **Communications:** `ContactMessage` model stores inquiries from the public site.

---

## Authentication Architecture

* **Login Flow:** Users/Applicants submit credentials to the login endpoint. The backend validates the input, queries the database, and compares the hashed password.
* **JWT Flow:** Upon successful authentication, a JWT is generated with the user's ID and role encoded in the payload. This token is returned to the client and sent in the `Authorization` header as a Bearer token for subsequent requests.
* **Password Hashing:** Passwords are never stored in plain text. They are hashed using `bcrypt` with a securely generated salt during registration or password reset.
* **Session Handling:** The system uses stateless JWTs instead of server-side sessions. Refresh tokens may be used to obtain new access tokens without re-authenticating.
* **Authorization:** Role-Based Access Control (RBAC) middleware intercepts requests to protected routes. It verifies the JWT, extracts the role, and ensures the user has permission to perform the requested action.

---

## CMS Architecture

* **Content Structure:** Content is organized hierarchically into Pages (`ContentPage`) and Sections (`ContentSection`). Pages map to public routes (using slugs), and Sections map to specific UI blocks on those pages.
* **Draft & Publish Flow:** Sections support `draftContent` and a `isVisible` flag, allowing editors to make changes without affecting the live site until published. Pages use a `ContentStatus` (DRAFT, PUBLISHED, ARCHIVED).
* **Version History:** (Phase 12 Integration) Revisions are stored in `ContentVersion`, providing an audit trail of changes (`publishedBy`, `createdAt`) and allowing restoration of previous content states.
* **Managers:** The architecture supports distributed management for Homepage, Departments, Updates, and SEO dynamically driven by the database schemas.

---

## Admin Portal Architecture

* **RBAC System:** Centralized Role-Based Access Control enforcing strict separation of duties.
* **User Roles:**
  - `SUPER_ADMIN`: Full system access, user management, global settings.
  - `DEPARTMENT_ADMIN`: Can manage content and users specific to their assigned department.
  - `FACULTY_EDITOR`: Restricted access to edit specific sections or department pages.
  - `PLACEMENT_CELL`: Access restricted to placement-related content and data.
* **Permissions:** UI elements and API routes are conditionally rendered/accessible based on the active user's role.

---

## File Upload Architecture

* **Upload Flow:** Client selects a file and uploads it via `multipart/form-data` to a secure backend endpoint.
* **Storage Mechanism:** Files are processed by the backend. While local storage is often used in development, production environments typically utilize cloud object storage (e.g., AWS S3, Cloudinary) to ensure scalability and decoupling of state from the application servers.
* **Validation:** Uploads are strictly validated for file type (MIME type checking) and file size constraints to prevent malicious uploads and DoS attacks.

---

## Deployment Stack

* **Render Static Site / Web Service:** The platform is designed to be easily deployed on modern PaaS providers like Render. The frontend is built into static files and served efficiently, while the backend runs as a Node web service.
* **PostgreSQL Database:** A managed PostgreSQL database instance hosted securely, independent of the application servers.
* **Environment Variables:** Configuration (Database URLs, JWT Secrets, SMTP credentials, API keys) is injected securely via `.env` files locally and environment variables in the deployment environment, ensuring secrets are never hardcoded.

---

## Development Tools

* **Git & GitHub:** Version control system for tracking changes, collaborating across teams, and managing code branches.
* **VS Code:** The primary Integrated Development Environment (IDE) tailored with extensions for React, Node, and Prisma.
* **npm:** Node Package Manager used for dependency resolution and executing build scripts.

---

## Libraries Audit

| Package Name | Purpose | Used In | Reason For Selection |
| :--- | :--- | :--- | :--- |
| `react` & `react-dom` | UI Library | Frontend | Industry standard for scalable, component-driven UI architecture. |
| `react-router-dom` | Routing | Frontend | Standard for managing client-side navigation in React SPAs. |
| `framer-motion` | Animations | Frontend | Best-in-class declarative animation library for complex React interactions. |
| `tailwindcss` | Styling | Frontend | Utility-first approach accelerates styling while maintaining a small CSS footprint. |
| `lucide-react` | Icons | Frontend | Lightweight, highly customizable, and visually consistent icon library. |
| `axios` | HTTP Client | Frontend | Robust interceptors and easier JSON handling compared to native fetch. |
| `swiper` | Carousels | Frontend | High-performance, mobile-friendly touch slider framework. |
| `react-helmet-async`| SEO Management| Frontend | Thread-safe way to manage `<head>` tags for SEO and social sharing. |
| `express` | Web Framework| Backend | Minimalist, fast, and unopinionated routing for Node.js. |
| `prisma` & `@prisma/client`| ORM | Backend | Type-safe database access, automated migrations, and excellent developer experience. |
| `jsonwebtoken` | Auth | Backend | Industry standard for stateless, secure user authentication. |
| `bcrypt` | Security | Backend | Proven cryptographic library for securely hashing passwords. |
| `zod` | Validation | Backend | Developer-friendly, type-safe schema validation for API payloads. |
| `nodemailer` | Email | Backend | Reliable, widely-used library for SMTP email dispatch from Node.js. |
| `helmet` | Security | Backend | Instantly hardens Express apps by setting secure HTTP headers. |
| `cors` | Security | Backend | Manages Cross-Origin Resource Sharing for secure frontend-backend communication. |

---

## Architectural Decisions

* **Why Prisma instead of raw SQL?**
  Prisma provides a strongly-typed, auto-generated query builder that perfectly integrates with modern JavaScript/TypeScript workflows. It drastically reduces runtime errors related to typos in SQL queries, simplifies schema migrations, and provides excellent IDE auto-completion.
* **Why React instead of plain HTML/JS?**
  A platform of this scale (involving a CMS, Admin Portal, and dynamic Admissions system) requires complex state management and reusable UI components. React's virtual DOM ensures performant updates, and its component ecosystem allows for rapid feature development and maintainability.
* **Why PostgreSQL instead of MongoDB?**
  The CAHCET platform deals with highly relational data—such as Users belonging to Departments, and Applicants having Applications with structured status flows. PostgreSQL excels at enforcing data integrity through foreign keys, ACID compliance, and structured schemas, which is critical for an educational institution's administrative and admissions data.

---
_Generated as a technical reference guide for developers and engineers working on the CAHCET platform._
