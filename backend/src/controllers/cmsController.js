const prisma = require('../config/database');
const asyncHandler = require('../utils/asyncHandler');

// --- Pages ---
exports.getPages = asyncHandler(async (req, res) => {
  const pages = await prisma.contentPage.findMany({
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json({ success: true, data: pages });
});

exports.getPageBySlug = asyncHandler(async (req, res) => {
  const page = await prisma.contentPage.findUnique({
    where: { slug: req.params.slug },
    include: {
      sections: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  res.status(200).json({ success: true, data: page });
});

exports.createPage = asyncHandler(async (req, res) => {
  const { title, slug, description, status } = req.body;

  // Check if slug exists
  const existing = await prisma.contentPage.findUnique({ where: { slug } });
  if (existing) {
    res.status(400);
    throw new Error('A page with this slug already exists');
  }

  const page = await prisma.contentPage.create({
    data: {
      title,
      slug,
      description,
      status: status || 'DRAFT',
      createdBy: req.user.id,
    }
  });

  res.status(201).json({ success: true, data: page });
});

exports.updatePage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, slug, description, status } = req.body;

  // Verify exists
  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  // Check slug conflict
  if (slug && slug !== page.slug) {
    const existing = await prisma.contentPage.findUnique({ where: { slug } });
    if (existing) {
      res.status(400);
      throw new Error('A page with this slug already exists');
    }
  }

  const updatedPage = await prisma.contentPage.update({
    where: { id },
    data: {
      title,
      slug,
      description,
      status,
      updatedBy: req.user.id
    }
  });

  res.status(200).json({ success: true, data: updatedPage });
});

exports.deletePage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  await prisma.contentPage.delete({ where: { id } });

  res.status(200).json({ success: true, message: 'Page deleted successfully' });
});

exports.publishPage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const page = await prisma.contentPage.findUnique({ where: { id } });
  if (!page) {
    res.status(404);
    throw new Error('Page not found');
  }

  const updatedPage = await prisma.contentPage.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      updatedBy: req.user.id
    }
  });

  res.status(200).json({ success: true, data: updatedPage });
});

// --- Sections ---
exports.getSectionsByPageId = asyncHandler(async (req, res) => {
  const { pageId } = req.params;
  const sections = await prisma.contentSection.findMany({
    where: { pageId },
    orderBy: { sortOrder: 'asc' }
  });
  res.status(200).json({ success: true, data: sections });
});

exports.createSection = asyncHandler(async (req, res) => {
  const { pageId, sectionKey, title, content, sortOrder } = req.body;

  // Check if page exists
  const page = await prisma.contentPage.findUnique({ where: { id: pageId } });
  if (!page) {
    res.status(404);
    throw new Error('Parent page not found');
  }

  // Check unique section key for this page
  const existing = await prisma.contentSection.findUnique({
    where: { pageId_sectionKey: { pageId, sectionKey } }
  });
  if (existing) {
    res.status(400);
    throw new Error('A section with this key already exists on this page');
  }

  const section = await prisma.contentSection.create({
    data: {
      pageId,
      sectionKey,
      title,
      content,
      sortOrder: sortOrder || 0
    }
  });

  res.status(201).json({ success: true, data: section });
});

exports.updateSection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { sectionKey, title, draftContent, sortOrder, isVisible } = req.body;

  const section = await prisma.contentSection.findUnique({ where: { id } });
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  // Handle section key updates carefully (unique constraint)
  if (sectionKey && sectionKey !== section.sectionKey) {
    const existing = await prisma.contentSection.findUnique({
      where: { pageId_sectionKey: { pageId: section.pageId, sectionKey } }
    });
    if (existing) {
      res.status(400);
      throw new Error('A section with this key already exists on this page');
    }
  }

  const updatedSection = await prisma.contentSection.update({
    where: { id },
    data: {
      ...(sectionKey && { sectionKey }),
      ...(title !== undefined && { title }),
      ...(draftContent !== undefined && { draftContent }),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(isVisible !== undefined && { isVisible })
    }
  });

  res.status(200).json({ success: true, data: updatedSection });
});

exports.publishSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const section = await prisma.contentSection.findUnique({ where: { id } });
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  // Check if there is a draft to publish
  if (section.draftContent === null && section.content !== null) {
    return res.status(200).json({ success: true, data: section, message: 'Already published' });
  }

  const contentToPublish = section.draftContent || section.content; // If publishing without drafts, just re-publish current

  // Transaction: Update section content and log version history
  const [updatedSection, versionLog] = await prisma.$transaction([
    prisma.contentSection.update({
      where: { id },
      data: {
        content: contentToPublish, // move draft to live
        draftContent: null // clear draft
      }
    }),
    prisma.contentVersion.create({
      data: {
        contentSectionId: id,
        content: contentToPublish,
        publishedBy: req.user.username || 'Admin'
      }
    })
  ]);

  res.status(200).json({ success: true, data: updatedSection, version: versionLog });
});

exports.getSectionVersions = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const versions = await prisma.contentVersion.findMany({
    where: { contentSectionId: id },
    orderBy: { createdAt: 'desc' }
  });
  res.status(200).json({ success: true, data: versions });
});

exports.restoreSectionVersion = asyncHandler(async (req, res) => {
  const { id, versionId } = req.params;

  const version = await prisma.contentVersion.findUnique({ where: { id: versionId } });
  if (!version || version.contentSectionId !== id) {
    res.status(404);
    throw new Error('Version not found for this section');
  }

  // Restore pushes version content into draftContent, NOT live content, allowing preview before re-publishing
  const restoredSection = await prisma.contentSection.update({
    where: { id },
    data: { draftContent: version.content }
  });

  res.status(200).json({ success: true, data: restoredSection });
});

exports.deleteSection = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const section = await prisma.contentSection.findUnique({ where: { id } });
  if (!section) {
    res.status(404);
    throw new Error('Section not found');
  }

  await prisma.contentSection.delete({ where: { id } });

  res.status(200).json({ success: true, message: 'Section deleted successfully' });
});

// --- Aggregated Stats ---
exports.getAggregatedStats = asyncHandler(async (req, res) => {
  // 1. Faculty Count: Sum of all faculty objects across all dept_* pages
  const facultySections = await prisma.contentSection.findMany({
    where: {
      sectionKey: 'faculty',
      page: { slug: { startsWith: 'dept_' } }
    }
  });

  let totalFaculty = 0;
  facultySections.forEach(sec => {
    try {
      const parsed = JSON.parse(sec.content);
      if (Array.isArray(parsed)) {
        totalFaculty += parsed.length;
      }
    } catch (e) {}
  });

  // 2 & 3. Unique Companies & Highest Package from placements.students
  const placementStudentsSection = await prisma.contentSection.findFirst({
    where: {
      sectionKey: 'placements.students',
      page: { slug: 'placements' }
    }
  });

  let uniqueCompaniesCount = 0;
  let highestPackageNum = 0;
  let highestPackageStr = '0 LPA';

  if (placementStudentsSection && placementStudentsSection.content) {
    try {
      const students = JSON.parse(placementStudentsSection.content);
      if (Array.isArray(students)) {
        const companies = new Set();
        students.forEach(student => {
          if (student.company) companies.add(student.company.trim().toUpperCase());
          
          if (student.package) {
            // Extract numbers from strings like "24 LPA", "10.5 LPA"
            const packageStr = String(student.package);
            const numMatch = packageStr.match(/(\d+(\.\d+)?)/);
            if (numMatch && numMatch[1]) {
              const val = parseFloat(numMatch[1]);
              if (val > highestPackageNum) {
                highestPackageNum = val;
                highestPackageStr = student.package;
              }
            }
          }
        });
        uniqueCompaniesCount = companies.size;
      }
    } catch (e) {}
  }

  res.status(200).json({
    success: true,
    data: {
      facultyCount: totalFaculty,
      uniqueCompanies: uniqueCompaniesCount,
      highestPackage: highestPackageStr
    }
  });
});

// --- Admin Dashboard Stats (Role Aware) ---
exports.getAdminDashboardStats = asyncHandler(async (req, res) => {
  const role = req.user.role;
  const userDeptId = req.user.departmentId;

  // Helper to safely parse JSON arrays from CMS
  const getArrayLength = (content) => {
    if (!content) return 0;
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch(e) { return 0; }
  };

  // ---------------------------------------------------------
  // SUPER_ADMIN Logic (Global MIS)
  // ---------------------------------------------------------
  if (role === 'SUPER_ADMIN') {
    const totalApplications = await prisma.application.count();
    const activeCourses = await prisma.department.count();
    
    // Departments Intelligence
    const facultySections = await prisma.contentSection.findMany({
      where: { sectionKey: 'faculty', page: { slug: { startsWith: 'dept_' } } },
      include: { page: { select: { slug: true } } }
    });
    
    let totalFaculty = 0;
    const facultyByDept = {};
    facultySections.forEach(sec => {
      try {
        const parsed = JSON.parse(sec.content);
        if (Array.isArray(parsed)) {
          totalFaculty += parsed.length;
          const deptCode = sec.page.slug.replace('dept_', '').toUpperCase();
          facultyByDept[deptCode] = (facultyByDept[deptCode] || 0) + parsed.length;
        }
      } catch (e) {}
    });

    // Placements
    const placementStudents = await prisma.contentSection.findFirst({
      where: { sectionKey: 'placements.students', page: { slug: 'placements' } }
    });
    let placementCount = getArrayLength(placementStudents?.content);

    // Admissions Funnel (Real Data)
    const allApps = await prisma.application.findMany({ select: { applicationStatus: true, courseChoice: true, createdAt: true } });
    const studentsByDept = {};
    const funnelCounts = { REGISTERED: 0, PERSONAL_DONE: 0, ACADEMIC_DONE: 0, COURSE_SELECTED: 0, COMPLETED: 0 };
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendDataRaw = {};

    allApps.forEach(app => {
      // Dept Count
      if (app.courseChoice) {
        const code = app.courseChoice.replace('B.E. ', '').replace('B.Tech ', '').substring(0, 4).toUpperCase().trim();
        studentsByDept[code] = (studentsByDept[code] || 0) + 1;
      }
      // Funnel Count
      if (app.applicationStatus) {
        funnelCounts[app.applicationStatus] = (funnelCounts[app.applicationStatus] || 0) + 1;
      }
      // Trend Count
      const mIndex = app.createdAt.getMonth();
      const monthName = months[mIndex];
      trendDataRaw[monthName] = (trendDataRaw[monthName] || 0) + 1;
    });

    // Funnel Logic: A 'COMPLETED' app means it passed through all previous stages.
    const completed = funnelCounts['COMPLETED'] || 0;
    const confirmed = completed + (funnelCounts['COURSE_SELECTED'] || 0);
    const approved = confirmed + (funnelCounts['ACADEMIC_DONE'] || 0);
    const reviewed = approved + (funnelCounts['PERSONAL_DONE'] || 0);
    const received = reviewed + (funnelCounts['REGISTERED'] || 0);

    const admissionFunnel = [
      { stage: 'Applications Received', count: received, percentage: 100 },
      { stage: 'Reviewed', count: reviewed, percentage: received > 0 ? Math.round((reviewed/received)*100) : 0 },
      { stage: 'Approved', count: approved, percentage: received > 0 ? Math.round((approved/received)*100) : 0 },
      { stage: 'Confirmed', count: confirmed, percentage: received > 0 ? Math.round((confirmed/received)*100) : 0 },
      { stage: 'Admissions Completed', count: completed, percentage: received > 0 ? Math.round((completed/received)*100) : 0 }
    ];

    const trendData = Object.keys(trendDataRaw).map(m => ({ name: m, applications: trendDataRaw[m] }));

    // Department Intelligence Matrix
    const coreDepts = ['CSE', 'ECE', 'EEE', 'MECH', 'IT', 'AIDS', 'AIML', 'CIVIL', 'MBA'];
    const departmentIntelligence = coreDepts.map(dept => {
      const students = studentsByDept[dept] || 0;
      const faculty = facultyByDept[dept] || 0;
      const ratio = faculty > 0 ? Math.round((students / faculty) * 10) / 10 : 0;
      
      // Real performance score formula
      let score = 0;
      if (students > 0 && faculty > 0) {
        const capacityScore = Math.min((students / 120) * 40, 40); // Max 40 points for filling capacity
        const facultyScore = Math.min((faculty / 20) * 40, 40); // Max 40 points for faculty strength
        const balanceScore = ratio > 0 && ratio <= 15 ? 20 : (ratio > 15 && ratio < 25 ? 10 : 0); // Max 20 points for good ratio
        score = Math.round(capacityScore + facultyScore + balanceScore);
      }

      return { department: dept, students, faculty, ratio, score, growth: 0 };
    }).sort((a, b) => b.students - a.students);

    // Global Health Index
    const avgScore = departmentIntelligence.reduce((sum, d) => sum + d.score, 0) / (coreDepts.length || 1);
    const healthIndex = Math.round(avgScore);

    // System Status
    const unreadMessages = await prisma.contactMessage.count({ where: { status: 'UNREAD' } });
    const draftPages = await prisma.contentPage.count({ where: { status: 'DRAFT' } });
    
    const recentActivity = await prisma.contentSection.findMany({
      orderBy: { updatedAt: 'desc' }, take: 8, include: { page: { select: { slug: true } } }
    });

    return res.status(200).json({
      success: true,
      dashboardType: 'SUPER_ADMIN',
      data: {
        globalMetrics: { totalApplications, totalFaculty, activeCourses, placementCount },
        healthIndex,
        admissionFunnel,
        departmentIntelligence,
        trendData,
        systemStatus: { unreadMessages, draftPages, serverUptime: "99.9%" },
        activityLog: recentActivity.map(s => ({
          id: s.id, action: s.createdAt.getTime() === s.updatedAt.getTime() ? 'Published' : 'Edited',
          section: `${s.page.slug} / ${s.sectionKey}`, timestamp: s.updatedAt
        }))
      }
    });
  }

  // ---------------------------------------------------------
  // DEPARTMENT_ADMIN Logic
  // ---------------------------------------------------------
  if (role === 'DEPARTMENT_ADMIN') {
    let department = null;
    if (userDeptId) {
      department = await prisma.department.findUnique({ where: { id: userDeptId } });
    }
    
    // If we can't link to a department, just return empty state
    if (!department) {
      return res.status(200).json({ success: true, dashboardType: 'DEPARTMENT_ADMIN', data: { departmentName: 'Unassigned', noData: true } });
    }

    const deptCode = department.code.toUpperCase();
    
    // Get Applications for this department
    const deptApps = await prisma.application.findMany({
      where: { courseChoice: { contains: deptCode } }
    });

    const studentsCount = deptApps.length;
    
    // Get Faculty for this department
    const facultySec = await prisma.contentSection.findFirst({
      where: { sectionKey: 'faculty', page: { slug: `dept_${deptCode.toLowerCase()}` } }
    });
    const facultyCount = getArrayLength(facultySec?.content);
    
    const ratio = facultyCount > 0 ? Math.round((studentsCount / facultyCount) * 10) / 10 : 0;

    // Recent CMS updates for this dept
    const deptUpdates = await prisma.contentSection.findMany({
      where: { page: { slug: `dept_${deptCode.toLowerCase()}` } },
      orderBy: { updatedAt: 'desc' }, take: 5
    });

    return res.status(200).json({
      success: true,
      dashboardType: 'DEPARTMENT_ADMIN',
      data: {
        departmentName: department.name,
        departmentCode: deptCode,
        metrics: { studentsCount, facultyCount, ratio },
        activityLog: deptUpdates.map(s => ({ id: s.id, action: 'Edited', section: s.sectionKey, timestamp: s.updatedAt }))
      }
    });
  }

  // ---------------------------------------------------------
  // PLACEMENT_CELL Logic
  // ---------------------------------------------------------
  if (role === 'PLACEMENT_CELL') {
    const placementStudents = await prisma.contentSection.findFirst({
      where: { sectionKey: 'placements.students', page: { slug: 'placements' } }
    });
    const placementRecruiters = await prisma.contentSection.findFirst({
      where: { sectionKey: 'placements.recruiters', page: { slug: 'placements' } }
    });

    const totalPlaced = getArrayLength(placementStudents?.content);
    const totalRecruiters = getArrayLength(placementRecruiters?.content);

    // Calculate highest package accurately
    let highestPackageNum = 0;
    if (placementStudents && placementStudents.content) {
      try {
        const students = JSON.parse(placementStudents.content);
        if (Array.isArray(students)) {
          students.forEach(s => {
            if (s.package) {
              const numMatch = String(s.package).match(/(\d+(\.\d+)?)/);
              if (numMatch && numMatch[1]) {
                const val = parseFloat(numMatch[1]);
                if (val > highestPackageNum) highestPackageNum = val;
              }
            }
          });
        }
      } catch(e){}
    }

    return res.status(200).json({
      success: true,
      dashboardType: 'PLACEMENT_CELL',
      data: {
        metrics: { totalPlaced, totalRecruiters, highestPackage: highestPackageNum ? `${highestPackageNum} LPA` : '0 LPA' },
        recentPlacements: [] // Mocked for now, can extract top 5 from JSON
      }
    });
  }

  // ---------------------------------------------------------
  // FACULTY_EDITOR Logic
  // ---------------------------------------------------------
  if (role === 'FACULTY_EDITOR') {
    // Show only tasks/activity
    const userEdits = await prisma.contentSection.findMany({
      orderBy: { updatedAt: 'desc' }, take: 10 // Typically you'd filter by 'updatedBy' if schema tracks it
    });

    return res.status(200).json({
      success: true,
      dashboardType: 'FACULTY_EDITOR',
      data: {
        activityLog: userEdits.map(s => ({ id: s.id, action: 'Edited', timestamp: s.updatedAt }))
      }
    });
  }

  // Fallback
  return res.status(200).json({ success: true, dashboardType: 'UNKNOWN', data: {} });
});
