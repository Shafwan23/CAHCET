/**
 * permissionService.js — Granular Permission Engine
 * Future-ready module to check if a user is allowed to perform actions or view routes.
 */

// Available modules mapped to route prefixes
export const MODULES = {
  // Homepage
  homepage_navbar: '/admin/homepage/navbar',
  homepage_hero: '/admin/homepage/hero',
  homepage_stats: '/admin/homepage/stats',
  homepage_academic: '/admin/homepage/academic',
  homepage_placements: '/admin/homepage/placement-excellence',
  homepage_contact: '/admin/homepage/contact',
  homepage_footer: '/admin/homepage/footer',
  homepage_gallery: '/admin/homepage/gallery',
  homepage_videos: '/admin/homepage/videos',
  homepage_facilities: '/admin/homepage/facilities',

  // Updates
  updates_events: '/admin/updates/events',
  updates_announcements: '/admin/updates/announcements',
  updates_newsletters: '/admin/updates/newsletters',
  updates_placements: '/admin/updates/placements',

  // Placements
  placements_recruiters: '/admin/placements/recruiters',
  placements_students: '/admin/placements/students',

  // About
  about: '/admin/about',

  // Academics
  academics: '/admin/academics',

  // Admissions
  admissions: '/admin/admissions',

  // Research & Contact
  research: '/admin/research',
  contact: '/admin/contact',

  // Admin
  admin_users: '/admin/users',
  admin_profile: '/admin/admin/profile',
  admin_activity: '/admin/admin/activity',
  admin_settings: '/admin/admin',

  // Departments (Wildcard base)
  departments: '/admin/departments',
};

export const permissionService = {
  /**
   * Checks if a user has access to a specific route.
   */
  canEditRoute(user, pathname) {
    if (!user || user.status !== 'ACTIVE') return false;
    
    // Super Admin has full access
    if (user.role === 'SUPER_ADMIN') return true;

    // Route matching logic based on role
    if (user.role === 'PLACEMENT_CELL') {
      return pathname.startsWith(MODULES.placements_recruiters) || 
             pathname.startsWith(MODULES.placements_students) || 
             pathname.startsWith(MODULES.updates_placements);
    }

    if (user.role === 'DEPARTMENT_ADMIN') {
      // Dept admins can ONLY access their specific department routes
      if (pathname.startsWith(`${MODULES.departments}/${user.deptKey}`)) {
        // If they have granular module restrictions enabled
        if (user.granularAccess && user.allowedModules && user.allowedModules.length > 0) {
          return user.allowedModules.some(mod => pathname.includes(mod));
        }
        return true; // Full dept access
      }
      return false;
    }

    if (user.role === 'FACULTY_EDITOR') {
      // Faculty editors require strict granular matching based on assigned modules
      if (!user.assignedModules || user.assignedModules.length === 0) return false;
      return user.assignedModules.some(assignment => {
        // assignment format: { deptKey: 'cse', module: 'faculties' }
        const expectedPath = `${MODULES.departments}/${assignment.deptKey}/${assignment.module}`;
        return pathname.startsWith(expectedPath);
      });
    }

    return false;
  }
};
