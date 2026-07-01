# API Documentation

## Authentication Module

### `POST /api/auth/login`
- **Purpose:** Authenticate an admin user and return a JWT.
- **Auth Required:** No
- **Body:** `{ "email": "admin@cahcet.in", "password": "securepass" }`
- **Response (200):** `{ "token": "jwt_string", "user": { "role": "SUPER_ADMIN" } }`

## CMS Module

### `GET /api/cms/pages/:slug`
- **Purpose:** Retrieve published content for a specific page.
- **Auth Required:** No (Public endpoint returns only PUBLISHED data).
- **Response (200):** `{ "slug": "home", "content": { ... } }`

### `POST /api/cms/pages/:slug/draft`
- **Purpose:** Save a work-in-progress version of a page.
- **Auth Required:** Yes (EDITOR, ADMIN, SUPER_ADMIN)
- **Body:** `{ "content": { ... } }`
- **Response (200):** `{ "success": true, "message": "Draft saved" }`

### `POST /api/cms/pages/:slug/publish`
- **Purpose:** Push draft content to live production.
- **Auth Required:** Yes (ADMIN, SUPER_ADMIN)
- **Response (200):** `{ "success": true, "status": "PUBLISHED" }`

### `GET /api/cms/dashboard/stats`
- **Purpose:** Retrieve aggregated CMS statistics for the admin dashboard.
- **Auth Required:** Yes
- **Implementation Note:** Uses `Promise.all()` for parallelized, high-speed execution.
