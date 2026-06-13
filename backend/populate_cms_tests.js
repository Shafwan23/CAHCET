const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function populateDB() {
  const homeGalleryData = {
    title: "Campus Gallery",
    description: "Explore our world-class campus.",
    images: [
      { url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80", caption: "Main Campus" },
      { url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80", caption: "Library" }
    ]
  };

  const homeVideosData = {
    title: "Video Showcase",
    videos: [
      { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Campus Tour" }
    ]
  };

  const deptOverviewData = {
    engineering: [
      {
        id: "cse",
        title: "Computer Science and Engineering",
        abbr: "CSE",
        description: "Pioneering the digital frontier.",
        highlights: ["NBA Accredited", "AI Labs"],
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        link: "/departments/cse"
      }
    ],
    standalone: []
  };

  const achievementsData = {
    items: [
      {
        id: "1",
        title: "National Hackathon Winner",
        description: "Students won 1st prize at Smart India Hackathon.",
        date: "2023-08-15",
        category: "Student",
        image: ""
      }
    ]
  };

  const records = [
    { key: 'home.gallery', pageSlug: 'home', content: JSON.stringify(homeGalleryData) },
    { key: 'home.videos', pageSlug: 'home', content: JSON.stringify(homeVideosData) },
    { key: 'departments.overview', pageSlug: 'departments', content: JSON.stringify(deptOverviewData) },
    { key: 'departments.cse.achievements', pageSlug: 'departments', content: JSON.stringify(achievementsData) }
  ];

  for (const record of records) {
    let page = await prisma.contentPage.findFirst({ where: { slug: record.pageSlug } });
    if (!page) {
      page = await prisma.contentPage.create({
        data: {
          title: record.pageSlug,
          slug: record.pageSlug
        }
      });
    }

    const existing = await prisma.contentSection.findFirst({ where: { sectionKey: record.key } });
    if (existing) {
      await prisma.contentSection.update({
        where: { id: existing.id },
        data: { content: record.content }
      });
    } else {
      await prisma.contentSection.create({
        data: {
          sectionKey: record.key,
          pageId: page.id,
          title: record.key,
          content: record.content
        }
      });
    }
  }
  
  console.log("Successfully seeded test data into the DB.");
}

populateDB().catch(console.error).finally(() => prisma.$disconnect());
