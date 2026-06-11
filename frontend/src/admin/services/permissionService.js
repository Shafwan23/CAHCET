/**
 * permissionService.js — Granular Permission Engine
 * Future-ready module to check if a user is allowed to perform actions or view routes.
 */

// Available modules mapped to route prefixes
export const MODULES = {
  // Homepage
  homepage_navbar: '/admin/dashboard/homepage/navbar',
  homepage_hero: '/admin/dashboard/homepage/hero',
  homepage_stats: '/admin/dashboard/homepage/stats',
  homepage_academic: '/admin/dashboard/homepage/academic',
  homepage_placements: '/admin/dashboard/homepage/placement-excellence',
  homepage_contact: '/admin/dashboard/homepage/contact',
  homepage_footer: '/admin/dashboard/homepage/footer',

  // Updates
  updates_events: '/admin/dashboard/updates/events',
  updates_announcements: '/admin/dashboard/updates/announcements',
  updates_newsletters: '/admin/dashboard/updates/newsletters',
  updates_placements: '/admin/dashboard/updates/placements',

  // Placements
  placements_recruiters: '/admin/dashboard/placements/recruiters',
  placements_students: '/admin/dashboard/placements/students',

  // About
  about: '/admin/dashboard/about',

  // Academics
  academics: '/admin/dashboard/academics',

  // Admissions
  admissions: '/admin/dashboard/admissions',

  // Research & Contact
  research: '/admin/dashboard/research',
  contact: '/admin/dashboard/contact',

  // Admin
  admin_users: '/admin/dashboard/users',
  admin_profile: '/admin/dashboard/admin/profile',
  admin_activity: '/admin/dashboard/admin/activity',
  admin_settings: '/admin/dashboard/admin',

  // Departments (Wildcard base)
  departments: '/admin/dashboard/departments',
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
