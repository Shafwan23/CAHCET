# Security Architecture

## Authentication & Authorization
- **JWT (JSON Web Tokens):** All admin sessions are stateless and secured via JWT. Tokens are issued by `POST /api/auth/login` and sent via the `Authorization: Bearer <token>` header.
- **Password Hashing:** Passwords are never stored in plaintext. `bcrypt.js` is utilized with a secure salt round iteration.

## Middleware Protections
- **`authMiddleware.js`:** Intercepts protected `/api/cms/*` and `/api/admin/*` routes. Validates the JWT signature and expiration.
- **Role Based Access Control (RBAC):** Users are assigned roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`). The middleware injects `req.user`, and endpoints reject unauthorized execution (e.g., only ADMIN can Publish, EDITOR can only Draft).

## Application Security
- **CORS:** Configured in `app.js` to strictly allow trusted frontend origins.
- **XSS Prevention:** React natively escapes all JSX variables, neutralizing Cross-Site Scripting.
- **Environment Variables:** `DATABASE_URL` and `JWT_SECRET` are strictly injected via Render at runtime and never committed to version control.
