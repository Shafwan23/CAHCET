# Folder Structure

## `/frontend`
- **`/src/components/`**: Reusable UI blocks.
  - **`/ui/`**: Primitives (Buttons, Loaders, Layouts).
  - **`/layout/`**: `Navbar.jsx`, `Footer.jsx` (Global navigation).
  - **`/departments/`**: Specific components for the department sub-sites.
- **`/src/pages/`**: Public-facing route components (e.g., `Home.jsx`, `ResearchPage.jsx`).
- **`/src/admin/`**: The entire Enterprise CMS.
  - **`/components/editors/`**: The 30+ specific form modules for managing DB content.
  - **`/pages/`**: Admin portal wrappers (`AdminDashboard.jsx`, `AdminLoginPage.jsx`).
  - **`/utils/`**: `ProtectedRoute.jsx` (RBAC interceptors).
- **`/src/services/`**: API handlers (e.g., `cmsService.js`).
- **`App.jsx`**: The core React Router tree defining the 120+ active routes.

## `/backend`
- **`/src/controllers/`**: Business logic (`cmsController.js`, `authController.js`).
- **`/src/middleware/`**: `authMiddleware.js` (JWT and RBAC logic).
- **`/src/routes/`**: Express route definitions mapping URLs to controllers.
- **`/prisma/`**: `schema.prisma` (Database schema definitions).
- **`app.js`**: The Express server initialization and CORS config.
