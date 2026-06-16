const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Checking global faculty...");
  const page = await prisma.contentPage.findUnique({
    where: { slug: 'faculty' }
  });
  if (page) {
    const sec = await prisma.contentSection.findFirst({
      where: { sectionKey: 'faculty.list' }
    });
    if (sec) {
      console.log("Global faculty list found. Length of content:", sec.content.length);
      let list = JSON.parse(sec.content);
      let cseFacs = list.filter(f => f.department && f.department.toLowerCase() === 'cse');
      console.log("Global CSE faculties count:", cseFacs.length);
    } else {
      console.log("No global faculty list section.");
    }
  } else {
    console.log("No global faculty page.");
  }

  console.log("\nChecking dept_cse.faculties...");
  const deptSec = await prisma.contentSection.findFirst({
    where: { sectionKey: 'dept_cse.faculties' }
  });
  if (deptSec) {
    console.log("Dept CSE faculties found. Length:", deptSec.content.length);
  } else {
    console.log("No dept_cse.faculties section.");
  }
}
main().finally(() => prisma.$disconnect());
