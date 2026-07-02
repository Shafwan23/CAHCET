const PERMISSIONS = {
  SUPER_ADMIN: ['*'],

  ADMIN: [
    'cms:view', 'cms:edit', 'cms:publish',
    'department:view', 'department:edit',
    'faculty:view', 'faculty:create', 'faculty:update',
    'placement:view', 'placement:create', 'placement:update',
    'recruiter:view', 'recruiter:create', 'recruiter:update',
    'user:read',
  ],
  
  DEPARTMENT_ADMIN: [
    'department:view',
    'department:edit',
    'faculty:view',
    'faculty:create',
    'faculty:update',
    'cms:view',
  ],

  PLACEMENT_ADMIN: [
    'placement:view',
    'placement:create',
    'placement:update',
    'recruiter:view',
    'recruiter:create',
    'recruiter:update',
  ],

  ADMISSION_ADMIN: [
    'admission:view',
    'admission:edit',
    'admission:publish',
    'cms:view',
  ],

  RESEARCH_ADMIN: [
    'research:view',
    'research:edit',
    'research:publish',
    'cms:view',
  ],
  
  FACULTY_EDITOR: [
    'faculty:view',
    'faculty:create',
    'faculty:update',
    'gallery:view',
    'gallery:create',
    'gallery:update',
    'achievement:view',
    'achievement:create',
    'achievement:update',
  ],
  
  PLACEMENT_CELL: [
    'placement:view',
    'placement:create',
    'placement:update',
    'recruiter:view',
    'recruiter:create',
    'recruiter:update',
  ],

  EDITOR: [
    'cms:view',
    'cms:edit',
    'cms:draft',
  ],

  CONTRIBUTOR: [
    'cms:view',
    'cms:draft',
  ],

  VIEWER: [
    'cms:view',
  ],
};

module.exports = {
  PERMISSIONS,
};
