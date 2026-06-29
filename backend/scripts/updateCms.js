const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const page = await prisma.contentPage.findUnique({ where: { slug: 'about' } });
    if (!page) {
      console.log('About page not found in CMS');
      return;
    }

    const historyContent = {
      sections: [
        {
          id: 1,
          title: 'About the Institution',
          text: 'A well-established and well-organized College of Engineering is the desired destination of vast majority of students. One such role model of a college is located at a distance of 100 kms from Anna International Airport, Chennai and at 4 kms from Arcot, the capital of Nawabs who ruled one-fourth of South India. Right from the year of its inception, the college is consistently producing scores of first class graduates, scores of graduates with high distinction and graduates with University Rank or other academic credentials.',
          image: '/images/Main_CAHCET.jpg',
          align: 'left'
        }
      ]
    };

    const parentOrgContent = {
      title: 'Melvisharam Muslim Educational Society (MMES) – Estd. in 1918',
      description: `The fabulous jewel of Madras Presidency, Nawab C. Abdul Hakeem Saheb, one of the best respected natives of Melvisharam, was Prince among traders and one time Sheriff of Madras. He cherished a golden dream of transforming his town into a splendid seat of great learning to cater to the educational needs of youth. Like the winds that have no barriers of caste or community, the Nawab’s munificence lighted the lamp of joy and contentment in several poverty-ridden families. His colorful dreams have all been realized by the Melvisharam Muslim Educational Society founded in 1918 that strove hard to metamorphose Primary, Secondary and Higher Education into splendid segments of prestine enlightenment irrespective of caste, creed, community or social status. The work continues even now with redoubled zeal and rejuvenating spirit, with student ́s progress and welfare as ultimate goals. The MMES manages and maintains the following prominent institutions.\n\nC. Abdul Hakeem College of Engineering and Technology\nC.Abdul Hakeem College of Arts and Science (Autonomous) (for Men) (Re-Accredited by NAAC with B++ Grade)\nM.M.E.S Women s Arts & Science College\nIslamiah Boys Higher Secondary School\nIslamiah Girls Higher Secondary School\nIslamiah Primary School for Boys\nIslamiah Primary School for Girls\nHakeem Matriculation School\nF.M. Primary School\nR.A. Primary School\nMadarasa -e- Umar\nMMES Public School(CBSE)`,
      shortName: 'MMES',
      since: 'Since 1918'
    };

    const aicteContent = {
      documents: [
        { id: 2, title: 'AICTE Corrigendum Report 2025-2026', desc: 'Corrigendum for EOA 2025-26', status: 'Approved', url: '/pdf/Corrigendum-Report-2025-2026.pdf' },
        { id: 1, title: 'AICTE EOA Report 2024-2025', desc: 'Extension of Approval for academic year 2024-25', status: 'Approved', url: '/pdf/EOA-Report-2024-2025.PDF.pdf' },
        { id: 3, title: 'AICTE EOA Report 2023-2024', desc: 'Extension of Approval for academic year 2023-24', status: 'Approved', url: '/pdf/EOA-Report-2023-24.pdf' },
        { id: 4, title: 'AICTE EOA Report 2022-2023', desc: 'Extension of Approval for academic year 2022-23', status: 'Approved', url: '/pdf/EOA-Report-22-23.PDF.pdf' },
        { id: 5, title: 'AICTE EOA Reports 1998-2022', desc: 'Consolidated EOA reports from 1998 to 2022', status: 'Approved', url: '/pdf/EOA-REPORT-1998-2022.pdf' }
      ]
    };

    const recognitionContent = {
      documents: [
        { id: 10, title: 'NAAC Accreditation', desc: 'National Assessment and Accreditation Council', status: 'Accredited', url: '/pdf/Naac.pdf' },
        { id: 11, title: 'NBA Accredited Programs', desc: 'National Board of Accreditation for specific programs', status: 'Accredited', url: '/pdf/INC-4-NBA-ACCREDITED-PROGRAM.pdf' },
        { id: 12, title: 'Minority Status', desc: 'Religious Minority Institution Status Certificate', status: 'Approved', url: '/pdf/MINORITY-STATUS.pdf' }
      ]
    };

    const affiliationContent = {
      documents: [
        { id: 20, title: 'Anna University Affiliation', desc: 'Permanent/Provisional Affiliation from Anna University', status: 'Affiliated', url: '/pdf/AU_affiliation.pdf' },
        { id: 21, title: 'DOTE Approval', desc: 'Directorate of Technical Education Approval', status: 'Approved', url: '/pdf/Dot-approval_merged.pdf' },
        { id: 22, title: 'Form 5A Extract', desc: 'Statutory compliance document', status: 'Approved', url: '/pdf/FORM-5A-EXTRACT.pdf' }
      ]
    };

    const updateSection = async (key, contentObj) => {
      const existing = await prisma.contentSection.findFirst({
        where: { pageId: page.id, sectionKey: key }
      });
      if (existing) {
        await prisma.contentSection.update({
          where: { id: existing.id },
          data: { content: JSON.stringify(contentObj) }
        });
      } else {
        await prisma.contentSection.create({
          data: {
            pageId: page.id,
            sectionKey: key,
            title: key.split('.')[1],
            type: 'json',
            content: JSON.stringify(contentObj)
          }
        });
      }
    };

    await updateSection('about.history', historyContent);
    await updateSection('about.parentOrganization', parentOrgContent);
    await updateSection('about.accreditation', aicteContent);
    await updateSection('about.recognition', recognitionContent);
    await updateSection('about.affiliation', affiliationContent);

    console.log('CMS data updated successfully with PDF URLs.');
  } catch (error) {
    console.error('Error updating CMS:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
