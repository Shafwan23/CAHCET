# Complete Feature Catalogue

## Public Website Features
- **Dynamic SPA Routing:** Instant page changes with zero browser reloads.
- **Department Portals:** Dedicated sub-sites with specific sidebars for all engineering branches.
- **Mega Navigation:** Deeply categorized dropdown menus for quick global access.
- **Interactive Galleries:** Lightbox-enabled high-resolution campus and event galleries.

## Admin Portal Features
- **Secure Authentication:** JWT-secured login wall.
- **Dashboard Analytics:** High-level metrics showing active pages, recent edits, and system health.
- **Role-Based Routing:** Features are hidden or disabled depending on administrator clearance.

## Enterprise CMS Features
- **Draft → Publish Workflow:** Secure editing pipeline to prevent accidental live changes.
- **Live Preview:** Real-time visual feedback using the exact public frontend components.
- **JSON Payload Architecture:** Extremely flexible and schema-less content blocks stored in PostgreSQL.

## Performance Features
- **Route Code Splitting:** The browser only downloads the specific code required for the current page.
- **Asynchronous Media:** All images utilize `loading="lazy"` and videos `preload="metadata"`.
- **Concurrent API Fetching:** Backend services fetch aggregated data simultaneously via `Promise.all()`.
