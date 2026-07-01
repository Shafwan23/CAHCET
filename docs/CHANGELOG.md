# Changelog

## Version 1.0.0 - Initial Production Release
*July 2026*

### Major Features
- **Public Website Redesign:** Completely overhauled frontend with Framer Motion, Glassmorphism, and Tailwind CSS.
- **Enterprise CMS Engine:** Centralized Admin Portal with real-time Live Preview, Draft/Review/Publish workflows.
- **Department Portals:** Standardized templates for all engineering and standalone departments.
- **Performance Optimization:** 
  - 100% Client-Side Routing via React Router (eliminated full page reloads).
  - Implemented Route-based code splitting (`React.lazy`).
  - Added global `loading="lazy"` and `decoding="async"` to all media.
  - Eliminated sequential `await` bottlenecks in backend Prisma queries using `Promise.all()`.
- **Security Validation:** Integrated JWT authentication and Role-Based Access Control (RBAC).
