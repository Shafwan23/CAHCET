const PERMISSIONS = {
  SUPER_ADMIN: ['*'],
  
  DEPARTMENT_ADMIN: [
    'department:view',
    'department:edit',
    'faculty:view',
    'cms:view'
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
    'achievement:update'
  ],
  
  PLACEMENT_CELL: [
    'placement:view',
    'placement:create',
    'placement:update',
    'recruiter:view',
    'recruiter:create',
    'recruiter:update'
  ]
};

module.exports = {
  PERMISSIONS
};
