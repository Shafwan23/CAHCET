# Developer Guide

## Core Conventions
- **Component Architecture:** We use React functional components with Hooks.
- **Styling:** Tailwind CSS strictly. No generic inline CSS. Use `clsx` and `tailwind-merge` (`cn` utility) for conditional classes.
- **Routing:** Use `<Link>` from `react-router-dom` exclusively. Avoid `<a href>` to prevent page reloads.
- **Images:** All `<img />` tags MUST include `loading="lazy" decoding="async"`.

## CMS Architecture & Adding New Modules
If you need to add a new CMS Editor:
1. **Frontend Admin:** Create a new component in `src/admin/components/editors/`.
2. **Layout:** Wrap it in `<EditorPage>` and use `<TwoPanelLayout>`.
3. **Service Layer:** Use `cmsService.getPage('your-slug')` and `cmsService.saveDraft('your-slug', data)`.
4. **Routing:** Add the route inside `App.jsx` under the `ProtectedRoute` admin scope.

## How to add Database Models
1. Open `backend/prisma/schema.prisma`.
2. Add your `model NewModel { ... }`.
3. Run `npx prisma format` and `npx prisma db push`.
4. (Production) Use `npx prisma migrate dev --name init_new_model`.

## Best Practices
- **Performance:** Always wrap heavy, deep components in `React.memo()`.
- **API Fetching:** Parallelize independent backend queries using `Promise.all()`. Do not `await` them sequentially.
