# Testing & Verification Guide

## 1. Automated Build Verification
Before deploying, always execute:
```bash
cd frontend && npm run build
```
This serves as the primary static analysis tool. A successful 0-error build guarantees that there are no broken imports, missing dependencies, or syntax errors.

## 2. Manual Routing & SPA Testing
1. Launch the frontend (`npm run dev`).
2. Navigate via the `Navbar` to Departments, About, Academics.
3. **Verification:** The browser tab's refresh icon should NOT spin. If it spins, a `<a href>` tag slipped in. It must be instantaneous.

## 3. CMS Workflow Regression Testing
1. Login as `ADMIN`.
2. Open **Homepage Editor**.
3. Modify a text field and click **Save Draft**.
4. Open an incognito window and visit the Homepage. Ensure the change is **NOT** visible.
5. Go back to Admin and click **Publish**.
6. Refresh the incognito window. Ensure the change **IS** visible.

## 4. RBAC (Role-Based Access) Testing
1. Login as a user with the `EDITOR` role.
2. Verify that the **Publish** button is either disabled or correctly blocked by the backend API with a 403 Forbidden message.

## 5. Mobile Responsiveness Testing
1. Use Chrome DevTools Device Toolbar (F12).
2. Validate the `Navbar` collapses into the mobile hamburger menu.
3. Validate the `DepartmentSidebar` collapses into the bottom floating pill trigger.
