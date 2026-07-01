# Troubleshooting Guide

## Build Issues (Frontend)
- **Error:** `vite build fails with Rollup unresolved dependency.`
- **Cause:** A component is imported with the wrong path or case in `App.jsx`.
- **Solution:** Verify case-sensitivity in the file path. Windows is case-insensitive, but Linux (Render) is case-sensitive.

## Deployment Issues (Render)
- **Error:** `Database connection failed.`
- **Cause:** The `DATABASE_URL` environment variable is missing or formatted incorrectly in the Render Dashboard.
- **Solution:** Ensure you are using the "Internal Database URL" if both DB and Backend are on Render. Append `?sslmode=require` if using external.

## Routing Issues (SPA)
- **Error:** Refreshing a page on production yields a 404.
- **Cause:** The static file server is looking for a physical file instead of letting React Router handle it.
- **Solution:** On Render Static Sites, configure the "Redirect/Rewrite" rule. Set Source to `/*`, Destination to `/index.html`, and Action to `Rewrite`.

## Authentication Issues
- **Error:** Randomly getting logged out of the Admin portal.
- **Cause:** The JWT has expired or the `JWT_SECRET` rotated upon a backend restart.
- **Solution:** Increase the token lifespan in `authController.js` or ensure `JWT_SECRET` is static in environment variables.
