# Deployment Guide

## Production Setup on Render

### 1. Database (Managed PostgreSQL)
1. In Render Dashboard, create a new "PostgreSQL" instance.
2. Note the "Internal Database URL".

### 2. Backend Deployment (Web Service)
1. Create a "Web Service" pointing to your GitHub repository.
2. **Root Directory:** `backend`
3. **Build Command:** `npm install && npx prisma generate && npx prisma migrate deploy`
4. **Start Command:** `npm start` (Make sure `package.json` points to `node src/app.js`)
5. **Environment Variables:**
   - `DATABASE_URL`: (Paste Internal DB URL)
   - `JWT_SECRET`: (Generate a secure random string)
   - `NODE_ENV`: `production`

### 3. Frontend Deployment (Static Site)
1. Create a "Static Site" pointing to the repository.
2. **Root Directory:** `frontend`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. **Environment Variables:**
   - `VITE_API_URL`: (Paste the URL of your backend web service, e.g., `https://cahcet-api.onrender.com/api`)
6. **Routing Rules:** Ensure SPA routing is enabled by setting rewriting rules (Catch-all `/*` redirects to `/index.html`).

### Rollback Strategy
If a deployment fails, use Render's "Manual Deploy -> Rollback" feature on both frontend and backend to immediately revert to the last stable hash.
